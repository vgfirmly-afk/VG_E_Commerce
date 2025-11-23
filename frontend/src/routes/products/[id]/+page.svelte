<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getProduct } from '$lib/api/catalog.js';
	import { addItemToCart } from '$lib/api/cart.js';
	import { cart } from '$lib/stores/cart.js';
	import { auth, guestSession } from '$lib/stores/auth.js';
	import { getCart } from '$lib/api/cart.js';
	import { goto } from '$app/navigation';

	let product = null;
	let selectedSku = null;
	let quantity = 1;
	let loading = true;
	let addingToCart = false;
	let error = null;

	$: productId = $page.params.id;

	onMount(async () => {
		try {
			product = await getProduct(productId);
			
			// Select first available SKU by default
			if (product.skus && product.skus.length > 0) {
				const availableSku = product.skus.find(sku => {
					const stockStatus = sku.stock?.status || 'inactive';
					const quantity = sku.stock?.quantity || 0;
					return (stockStatus === 'active' || stockStatus === 'in_stock') && quantity > 0;
				}) || product.skus[0];
				selectedSku = availableSku;
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
				const userId = $auth.user?.id || null;
				const sessionId = $guestSession || null;
				const cartData = await getCart(userId, sessionId);
				cart.setCart(cartData);
				cartId = cartData.cart_id;
			}

			await addItemToCart(cartId, selectedSku.sku_id, quantity);
			
			// Refresh cart
			const userId = $auth.user?.id || null;
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
			}, 3000);
		} catch (err) {
			alert(err.message || 'Failed to add product to cart');
		} finally {
			addingToCart = false;
		}
	}

	$: imageUrl = product?.media?.image_url 
		|| (product?.media?.product_images && product.media.product_images.length > 0 
			? product.media.product_images[0].url 
			: null)
		|| (product?.images && product.images.length > 0 
			? product.images[0] 
			: 'https://via.placeholder.com/600x600?text=No+Image');
	
	$: selectedPrice = selectedSku?.price?.effective_price 
		|| selectedSku?.price?.sale_price 
		|| selectedSku?.price?.price 
		|| null;
	
	$: originalPrice = selectedSku?.price?.original_price || selectedSku?.price?.price || null;
	$: salePrice = selectedSku?.price?.sale_price || null;
	$: hasDiscount = salePrice && originalPrice && salePrice < originalPrice;
	$: discountPercent = hasDiscount 
		? Math.round(((originalPrice - salePrice) / originalPrice) * 100) 
		: 0;
	
	$: selectedStock = selectedSku?.stock || null;
	$: stockQuantity = selectedStock?.quantity || 0;
	$: stockStatus = selectedStock?.status || 'inactive';
	$: isInStock = (stockStatus === 'active' || stockStatus === 'in_stock') && stockQuantity > 0;
	$: canAddToCart = selectedSku && isInStock && !addingToCart;
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
						<h2 class="text-xl font-semibold mb-3 text-gray-800">Select Variant</h2>
						<div class="grid grid-cols-1 gap-2">
							{#each product.skus as sku}
								{@const skuPrice = sku.price?.effective_price || sku.price?.sale_price || sku.price?.price}
								{@const skuStock = sku.stock}
								{@const stockQty = skuStock?.quantity || 0}
								{@const stockStat = skuStock?.status || 'inactive'}
								{@const isAvailable = (stockStat === 'active' || stockStat === 'in_stock') && stockQty > 0}
								<label
									class="flex items-center p-2.5 border-2 rounded-lg transition-all duration-200 {selectedSku?.sku_id === sku.sku_id
										? 'border-blue-500 bg-blue-50 shadow-sm'
										: isAvailable
											? 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 cursor-pointer'
											: 'border-gray-200 opacity-50 cursor-not-allowed pointer-events-none'}"
								>
									<input
										type="radio"
										name="sku"
										value={sku.sku_id}
										checked={selectedSku?.sku_id === sku.sku_id}
										on:change={() => isAvailable && (selectedSku = sku)}
										disabled={!isAvailable}
										class="mr-3 w-4 h-4 text-blue-600"
									/>
									<div class="flex-1 flex items-center justify-between gap-3">
										<div class="flex-1 min-w-0">
											<div class="font-medium text-sm text-gray-800 mb-1">
												{#if sku.attributes}
													{Object.entries(sku.attributes)
														.map(([key, value]) => `${key}: ${value}`)
														.join(' • ')}
												{:else}
													{sku.sku_code || 'Default'}
												{/if}
											</div>
											<div class="flex items-center gap-3 text-xs">
												{#if skuPrice}
													<span class="font-bold text-blue-600">
														${skuPrice.toFixed(2)}
													</span>
												{/if}
												<span class="px-2 py-0.5 rounded text-xs font-medium {isAvailable 
													? 'bg-green-100 text-green-700' 
													: 'bg-red-100 text-red-700'}">
													{isAvailable ? `${stockQty} in stock` : 'Out of stock'}
												</span>
											</div>
										</div>
									</div>
								</label>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Selected SKU Details -->
				{#if selectedSku}
					<div class="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
						<div class="space-y-3">
							<!-- Price Section -->
							<div>
								<div class="text-xs text-gray-600 mb-2 font-medium">Selected Variant Price</div>
								<div class="flex items-baseline gap-3">
									{#if hasDiscount && originalPrice}
										<div class="flex items-baseline gap-2">
											<span class="text-xl text-gray-400 line-through">
												${originalPrice.toFixed(2)}
											</span>
											<span class="text-3xl font-bold text-blue-600">
												${salePrice.toFixed(2)}
											</span>
										</div>
										<span class="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
											{discountPercent}% OFF
										</span>
									{:else if selectedPrice}
										<div class="text-3xl font-bold text-blue-600">
											${selectedPrice.toFixed(2)}
										</div>
									{:else}
										<div class="text-sm text-gray-500">Price not available</div>
									{/if}
									{#if selectedSku?.price?.currency}
										<span class="text-sm text-gray-600">{selectedSku.price.currency}</span>
									{/if}
								</div>
							</div>
							
							<!-- Stock Section -->
							<div class="flex items-center justify-between pt-2 border-t border-gray-200">
								<div>
									<div class="text-xs text-gray-600 mb-1">Stock Status</div>
									<span class="inline-block px-3 py-1 rounded-full text-sm font-semibold {isInStock 
										? 'bg-green-100 text-green-700' 
										: 'bg-red-100 text-red-700'}">
										{isInStock ? `${stockQuantity} available` : 'Out of stock'}
									</span>
								</div>
								{#if selectedSku.sku_code}
									<div class="text-right">
										<div class="text-xs text-gray-600 mb-1">SKU Code</div>
										<div class="text-sm font-mono text-gray-700">{selectedSku.sku_code}</div>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/if}

				<!-- Quantity and Add to Cart -->
				<div class="space-y-4 pt-6 border-t border-gray-200">
					<div>
						<label for="quantity" class="block text-sm font-medium text-gray-700 mb-2">
							Quantity
						</label>
						<div class="flex items-center gap-2">
							<button
								on:click={() => quantity > 1 && quantity--}
								disabled={quantity <= 1 || !isInStock}
								class="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-colors duration-200"
							>
								−
							</button>
							<input
								id="quantity"
								type="number"
								min="1"
								max={stockQuantity || 1}
								bind:value={quantity}
								disabled={!isInStock}
								class="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
							/>
							<button
								on:click={() => {
									if (quantity < stockQuantity) quantity++;
								}}
								disabled={!isInStock || quantity >= stockQuantity}
								class="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-colors duration-200"
							>
								+
							</button>
						</div>
					</div>

					<button
						on:click={handleAddToCart}
						disabled={!canAddToCart}
						class="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if addingToCart}
							<span class="flex items-center justify-center gap-2">
								<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								Adding to cart...
							</span>
						{:else if !isInStock}
							Out of Stock
						{:else}
							Add to Cart
						{/if}
					</button>
				</div>
			</div>
		</div>
	{:else}
		<div class="text-center py-20">
			<p class="text-gray-600 text-lg">Product not found</p>
			<a href="/" class="text-blue-600 hover:text-blue-700 mt-4 inline-block">Return to Home</a>
		</div>
	{/if}
</div>
