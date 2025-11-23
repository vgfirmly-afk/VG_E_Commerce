<script>
	import { onMount } from 'svelte';
	import { cart } from '$lib/stores/cart.js';
	import { auth, guestSession } from '$lib/stores/auth.js';
	import {
		getCart,
		updateItemQuantity,
		removeItemFromCart,
		getCartTotal
	} from '$lib/api/cart.js';
	import { getPrice } from '$lib/api/pricing.js';
	import { goto } from '$app/navigation';

	let cartItems = [];
	let cartTotal = null;
	let loading = true;
	let updating = {};
	let error = null;
	let currentCartId = null;
	let loadingCart = false; // Flag to prevent concurrent loads

	async function loadCart() {
		// Wait for auth to finish loading before trying to get cart
		if ($auth.loading) {
			return;
		}

		// Prevent multiple simultaneous loads
		if (loadingCart) {
			return;
		}
		loadingCart = true;

		loading = true;
		error = null;
		
		try {
			// Always fetch fresh cart data from API
			// Backend returns user.id, not user.userId
			const userId = $auth.user?.id || null;
			const sessionId = $guestSession || null;
			
			// Both userId and sessionId can be null if not authenticated and no guest session
			if (!userId && !sessionId) {
				cartItems = [];
				cartTotal = null;
				cart.clear();
				loading = false;
				loadingCart = false;
				return;
			}
			
			const cartData = await getCart(userId, sessionId);
			
			if (!cartData || !cartData.cart_id) {
				cartItems = [];
				cartTotal = null;
				cart.clear();
				loading = false;
				loadingCart = false;
				return;
			}

			// Update cart store with fresh data
			cart.setCart(cartData);
			currentCartId = cartData.cart_id;
			
			const items = cartData.items || [];
			
			if (items.length === 0) {
				cartItems = [];
				cartTotal = null;
				loading = false;
				loadingCart = false;
				return;
			}

			// Get cart items with product details from pricing endpoint only
			const itemsWithDetails = await Promise.all(
				items.map(async (item) => {
					try {
						const priceData = await getPrice(item.sku_id);
						// Calculate discount percentage if there's a sale price
						let discountPercent = 0;
						if (priceData.original_price && priceData.effective_price && priceData.effective_price < priceData.original_price) {
							discountPercent = Math.round(((priceData.original_price - priceData.effective_price) / priceData.original_price) * 100);
						}
						
						// Extract attributes from pricing data if available
						let attributes = [];
						if (priceData.attributes) {
							// Convert attributes object to array format if needed
							if (typeof priceData.attributes === 'object' && !Array.isArray(priceData.attributes)) {
								attributes = Object.entries(priceData.attributes).map(([key, value]) => ({
									key: key,
									value: value
								}));
							} else if (Array.isArray(priceData.attributes)) {
								attributes = priceData.attributes;
							}
						}
						
						return {
							...item,
							// Pricing data
							price: priceData.effective_price || priceData.price || 0,
							originalPrice: priceData.original_price || priceData.price || 0,
							salePrice: priceData.sale_price || priceData.effective_price || null,
							currency: priceData.currency || 'USD',
							discountPercent: discountPercent,
							// Product data from pricing endpoint
							productName: priceData.product_name || 'Product',
							skuCode: priceData.sku_code || item.sku_id,
							stock: priceData.stock || 0,
							// Attributes from pricing endpoint
							attributes: attributes
						};
					} catch (err) {
						console.error('Failed to load item details:', err);
						return {
							...item,
							price: 0,
							originalPrice: 0,
							salePrice: null,
							currency: 'USD',
							discountPercent: 0,
							productName: 'Product',
							skuCode: item.sku_id,
							stock: 0,
							attributes: []
						};
					}
				})
			);

			cartItems = itemsWithDetails;

			// Get cart total
			try {
				const totalData = await getCartTotal(cartData.cart_id);
				cartTotal = totalData;
			} catch (err) {
				console.error('Failed to load cart total:', err);
			}
		} catch (err) {
			error = err.message;
			console.error('Failed to load cart:', err);
			cartItems = [];
			cartTotal = null;
		} finally {
			loading = false;
			loadingCart = false;
		}
	}

	async function handleUpdateQuantity(itemId, delta) {
		if (updating[itemId] || !currentCartId) return;
		updating[itemId] = true;

		try {
			await updateItemQuantity(currentCartId, itemId, delta);
			// Reload cart
			await loadCart();
		} catch (err) {
			alert(err.message || 'Failed to update quantity');
		} finally {
			updating[itemId] = false;
		}
	}

	async function handleRemoveItem(itemId) {
		if (!confirm('Are you sure you want to remove this item?') || !currentCartId) return;

		try {
			await removeItemFromCart(currentCartId, itemId);
			// Reload cart
			await loadCart();
		} catch (err) {
			alert(err.message || 'Failed to remove item');
		}
	}

	function handleGuestCheckout() {
		if (cartItems.length === 0) {
			alert('Your cart is empty');
			return;
		}
		// Guest checkout - continue with X-Session-Id
		// The checkout page will use guestSession automatically
		goto('/checkout');
	}

	function handleMemberCheckout() {
		if (cartItems.length === 0) {
			alert('Your cart is empty');
			return;
		}
		// Member checkout - force login first
		if (!$auth.isAuthenticated) {
			// Store return URL and redirect to home to trigger login
			if (typeof window !== 'undefined') {
				sessionStorage.setItem('returnUrl', '/checkout');
			}
			// Redirect to home page - Header will show login modal
			goto('/?login=true');
		} else {
			// Already logged in, proceed to checkout with X-User-Id
			goto('/checkout');
		}
	}

	onMount(() => {
		// Wait for auth to finish loading, then load cart
		if ($auth.loading) {
			// Subscribe to auth store and load cart when auth is ready
			const unsubscribe = auth.subscribe((authState) => {
				if (!authState.loading && !loadingCart) {
					unsubscribe();
					loadCart();
				}
			});
		} else {
			// Auth is already loaded, load cart immediately
			loadCart();
		}
	});
</script>

<svelte:head>
	<title>Shopping Cart - VG E-Com</title>
</svelte:head>

<div class="container mx-auto px-4 py-12">
	<h1 class="text-4xl font-bold mb-8 text-gray-800">Shopping Cart</h1>

	{#if loading}
		<div class="text-center py-20">
			<div class="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
			<p class="mt-6 text-gray-600 text-lg">Loading your cart...</p>
		</div>
	{:else if error}
		<div class="max-w-md mx-auto bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded shadow-lg animate-slide-up">
			<p class="font-medium">{error}</p>
		</div>
	{:else if cartItems.length === 0}
		<div class="text-center py-20 animate-fade-in">
			<svg class="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
			</svg>
			<p class="text-gray-600 text-xl mb-4">Your cart is empty</p>
			<a href="/" class="btn-primary inline-block">Continue Shopping</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Cart Items -->
			<div class="lg:col-span-2 space-y-4">
				{#each cartItems as item, i}
					<div class="card p-6 animate-slide-up" style="animation-delay: {i * 0.1}s">
						<!-- Top Section: Product Details (Left) and Pricing (Right Top) -->
						<div class="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
							<!-- Product Details -->
							<div class="flex-1">
								<!-- Product Name -->
								<h3 class="text-xl font-bold text-gray-800 mb-2">{item.productName || 'Product'}</h3>
								
								<!-- SKU Code -->
								<p class="text-sm text-gray-600 mb-2">
									<span class="font-medium">SKU Code:</span> {item.skuCode}
								</p>
								
								<!-- Attributes (if available) -->
								{#if item.attributes && item.attributes.length > 0}
									<div class="text-sm text-gray-600 mb-2">
										<span class="font-medium">Variant:</span>
										<span class="ml-2">
											{#each item.attributes as attr, idx}
												{attr.key}: {attr.value}{idx < item.attributes.length - 1 ? ' • ' : ''}
											{/each}
										</span>
									</div>
								{/if}
								
								<!-- Stock Status -->
								<div>
									<span class="text-sm font-medium text-gray-700">Stock Status:</span>
									<span class="ml-2 text-sm {item.stock > 0 ? 'text-green-600' : 'text-red-600'} font-semibold">
										{item.stock > 0 ? `${item.stock} available` : 'Out of stock'}
									</span>
								</div>
							</div>

							<!-- Pricing Details - Top Right Corner -->
							<div class="flex flex-col items-end md:items-start md:ml-auto">
								{#if item.discountPercent > 0}
									<div class="flex flex-col items-end gap-1">
										<div class="flex items-center gap-2">
											<span class="text-2xl font-bold text-blue-600">
												${item.salePrice?.toFixed(2) || item.price?.toFixed(2)}
											</span>
											<span class="text-sm text-gray-500">{item.currency || 'USD'}</span>
										</div>
										<div class="flex items-center gap-2">
											<span class="text-sm text-gray-500 line-through">
												${item.originalPrice?.toFixed(2)}
											</span>
											<span class="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded">
												{item.discountPercent}% OFF
											</span>
										</div>
									</div>
								{:else}
									<div class="flex items-center gap-2">
										<span class="text-2xl font-bold text-blue-600">
											${item.price?.toFixed(2) || '0.00'}
										</span>
										<span class="text-sm text-gray-500">{item.currency || 'USD'}</span>
									</div>
								{/if}
							</div>
						</div>

						<!-- Bottom Section: Quantity Controls & Delete (Left) and Line Total (Right) -->
						<div class="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200">
							<!-- Quantity Controls and Delete Button -->
							<div class="flex items-center gap-4">
								<!-- Quantity Controls -->
								<div class="flex items-center gap-2">
									<button
										on:click={() => handleUpdateQuantity(item.item_id, -1)}
										disabled={updating[item.item_id] || item.quantity <= 1}
										class="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-colors duration-200 active:scale-95"
									>
										−
									</button>
									<span class="w-12 text-center font-semibold text-lg">{item.quantity}</span>
									<button
										on:click={() => handleUpdateQuantity(item.item_id, 1)}
										disabled={updating[item.item_id] || (item.stock > 0 && item.quantity >= item.stock)}
										class="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-colors duration-200 active:scale-95"
									>
										+
									</button>
								</div>

								<!-- Remove Button -->
								<button
									on:click={() => handleRemoveItem(item.item_id)}
									class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 active:scale-95 transform transition-all duration-200 font-medium"
								>
									Remove
								</button>
							</div>

							<!-- Line Total - Bottom Right -->
							<div class="text-right">
								<p class="text-lg font-bold text-gray-800">
									Total: ${((item.price || 0) * item.quantity).toFixed(2)} {item.currency || 'USD'}
								</p>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Cart Summary -->
			<div class="lg:col-span-1">
				<div class="card p-6 sticky top-24 animate-slide-up">
					<h2 class="text-2xl font-semibold mb-6 text-gray-800">Cart Summary</h2>
					
					{#if cartTotal}
						<div class="space-y-3 mb-6">
							<div class="flex justify-between text-gray-700">
								<span>Subtotal:</span>
								<span class="font-semibold">${cartTotal.subtotal?.toFixed(2) || '0.00'}</span>
							</div>
							<div class="flex justify-between font-bold text-2xl pt-4 border-t-2 border-gray-200">
								<span class="text-gray-800">Total:</span>
								<span class="text-blue-600">
									${cartTotal.subtotal?.toFixed(2) || '0.00'} {cartTotal.currency || 'USD'}
								</span>
							</div>
						</div>
					{/if}

					{#if $auth.isAuthenticated}
						<!-- Logged in user - single button -->
						<button
							on:click={handleMemberCheckout}
							class="w-full btn-primary py-4 text-lg"
						>
							Proceed to Checkout
						</button>
					{:else}
						<!-- Guest user - two buttons -->
						<div class="space-y-3">
							<button
								on:click={handleGuestCheckout}
								class="w-full bg-gray-600 text-white py-4 text-lg rounded-lg hover:bg-gray-700 active:scale-95 transform transition-all duration-200 font-medium shadow-md hover:shadow-lg"
							>
								Guest Checkout
							</button>
							<button
								on:click={handleMemberCheckout}
								class="w-full btn-primary py-4 text-lg"
							>
								Member Checkout
							</button>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
