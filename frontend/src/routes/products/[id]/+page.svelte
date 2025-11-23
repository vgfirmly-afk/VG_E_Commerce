<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getProduct } from '$lib/api/catalog.js';
	import { getProductPrices } from '$lib/api/pricing.js';
	import { addItemToCart } from '$lib/api/cart.js';
	import { cart } from '$lib/stores/cart.js';
	import { auth, guestSession } from '$lib/stores/auth.js';
	import { getCart } from '$lib/api/cart.js';
	import { goto } from '$app/navigation';

	let product = null;
	let prices = {};
	let selectedSku = null;
	let quantity = 1;
	let loading = true;
	let addingToCart = false;
	let error = null;

	$: productId = $page.params.id;

	onMount(async () => {
		try {
			product = await getProduct(productId);
			
			// Get prices for all SKUs
			try {
				const pricesData = await getProductPrices(productId);
				if (pricesData && pricesData.skus) {
					pricesData.skus.forEach((sku) => {
						if (sku.sku_id && sku.price) {
							prices[sku.sku_id] = sku.price;
						}
					});
				}
			} catch (err) {
				console.error('Failed to load prices:', err);
			}

			// Select first SKU by default
			if (product.skus && product.skus.length > 0) {
				selectedSku = product.skus[0];
			}
		} catch (err) {
			error = err.message;
			console.error('Failed to load product:', err);
		} finally {
			loading = false;
		}
	});

	async function handleAddToCart() {
		if (!selectedSku) {
			alert('Please select a product variant');
			return;
		}

		addingToCart = true;
		try {
			// Ensure we have a cart
			let cartId = $cart.cartId;
			if (!cartId) {
				const userId = $auth.user?.userId || null;
				const sessionId = $guestSession || null;
				const cartData = await getCart(userId, sessionId);
				cart.setCart(cartData);
				cartId = cartData.cart_id;
			}

			await addItemToCart(cartId, selectedSku.sku_id, quantity);
			
			// Refresh cart
			const userId = $auth.user?.userId || null;
			const sessionId = $guestSession || null;
			const cartData = await getCart(userId, sessionId);
			cart.setCart(cartData);

			// Show success message
			const successMsg = document.createElement('div');
			successMsg.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up';
			successMsg.textContent = 'Product added to cart!';
			document.body.appendChild(successMsg);
			setTimeout(() => {
				successMsg.remove();
				goto('/cart');
			}, 1500);
		} catch (err) {
			alert(err.message || 'Failed to add product to cart');
		} finally {
			addingToCart = false;
		}
	}

	$: imageUrl = product?.images && product.images.length > 0 
		? product.images[0] 
		: 'https://via.placeholder.com/600x600?text=No+Image';
	$: selectedPrice = selectedSku && prices[selectedSku.sku_id] 
		? prices[selectedSku.sku_id] 
		: null;
</script>

<svelte:head>
	<title>{product?.title || 'Product'} - VG E-Com</title>
</svelte:head>

<div class="container mx-auto px-4 py-12">
	{#if loading}
		<div class="text-center py-20">
			<div class="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
			<p class="mt-6 text-gray-600 text-lg">Loading product details...</p>
		</div>
	{:else if error}
		<div class="max-w-md mx-auto bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded shadow-lg animate-slide-up">
			<p class="font-medium">{error}</p>
		</div>
	{:else if product}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fade-in">
			<!-- Product Image -->
			<div class="card overflow-hidden">
				<img
					src={imageUrl}
					alt={product.title}
					class="w-full h-auto object-cover"
				/>
			</div>

			<!-- Product Details -->
			<div class="space-y-6">
				<div>
					<h1 class="text-4xl font-bold mb-4 text-gray-800">{product.title}</h1>
					{#if selectedPrice}
						<div class="text-4xl font-bold text-blue-600 mb-6">
							${selectedPrice.toFixed(2)}
						</div>
					{/if}
				</div>
				
				{#if product.description}
					<div class="prose max-w-none">
						<h2 class="text-2xl font-semibold mb-3 text-gray-800">Description</h2>
						<p class="text-gray-700 whitespace-pre-line leading-relaxed">{product.description}</p>
					</div>
				{/if}

				<!-- SKU Selection -->
				{#if product.skus && product.skus.length > 0}
					<div>
						<h2 class="text-2xl font-semibold mb-4 text-gray-800">Select Variant</h2>
						<div class="space-y-3">
							{#each product.skus as sku}
								<label
									class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 {selectedSku?.sku_id === sku.sku_id
										? 'border-blue-500 bg-blue-50 shadow-md'
										: 'border-gray-200'}"
								>
									<input
										type="radio"
										name="sku"
										value={sku.sku_id}
										checked={selectedSku?.sku_id === sku.sku_id}
										on:change={() => (selectedSku = sku)}
										class="mr-4 w-5 h-5 text-blue-600"
									/>
									<div class="flex-1">
										<div class="font-medium text-gray-800">
											{#if sku.attributes}
												{Object.entries(sku.attributes)
													.map(([key, value]) => `${key}: ${value}`)
													.join(', ')}
											{:else}
												{sku.sku_code || sku.sku_id}
											{/if}
										</div>
										{#if prices[sku.sku_id]}
											<div class="text-xl font-bold text-blue-600 mt-1">
												${prices[sku.sku_id].toFixed(2)}
											</div>
										{/if}
									</div>
								</label>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Quantity and Add to Cart -->
				<div class="flex items-center gap-6 pt-6 border-t border-gray-200">
					<div>
						<label for="quantity" class="block text-sm font-medium text-gray-700 mb-2">
							Quantity
						</label>
						<div class="flex items-center gap-2">
							<button
								on:click={() => quantity > 1 && quantity--}
								disabled={quantity <= 1}
								class="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-colors duration-200"
							>
								−
							</button>
							<input
								id="quantity"
								type="number"
								min="1"
								bind:value={quantity}
								class="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<button
								on:click={() => quantity++}
								class="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 font-bold transition-colors duration-200"
							>
								+
							</button>
						</div>
					</div>
				</div>

				<button
					on:click={handleAddToCart}
					disabled={addingToCart || !selectedSku}
					class="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{addingToCart ? (
						<span class="flex items-center justify-center gap-2">
							<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
							Adding to cart...
						</span>
					) : (
						'Add to Cart'
					)}
				</button>
			</div>
		</div>
	{:else}
		<div class="text-center py-20">
			<p class="text-gray-600 text-lg">Product not found</p>
			<a href="/" class="text-blue-600 hover:text-blue-700 mt-4 inline-block">Return to Home</a>
		</div>
	{/if}
</div>
