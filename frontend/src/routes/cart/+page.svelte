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

	$: cartId = $cart.cartId;

	async function loadCart() {
		if (!cartId) {
			loading = false;
			return;
		}

		try {
			// Get cart items with product details
			const items = $cart.items || [];
			const itemsWithDetails = await Promise.all(
				items.map(async (item) => {
					try {
						const priceData = await getPrice(item.sku_id);
						return {
							...item,
							price: priceData.price || 0,
							product: null
						};
					} catch (err) {
						console.error('Failed to load item details:', err);
						return {
							...item,
							price: 0,
							product: null
						};
					}
				})
			);

			cartItems = itemsWithDetails;

			// Get cart total
			try {
				const totalData = await getCartTotal(cartId);
				cartTotal = totalData;
			} catch (err) {
				console.error('Failed to load cart total:', err);
			}
		} catch (err) {
			error = err.message;
			console.error('Failed to load cart:', err);
		} finally {
			loading = false;
		}
	}

	async function handleUpdateQuantity(itemId, delta) {
		if (updating[itemId]) return;
		updating[itemId] = true;

		try {
			await updateItemQuantity(cartId, itemId, delta);
			// Reload cart
			const userId = $auth.user?.userId || null;
			const sessionId = $guestSession || null;
			const cartData = await getCart(userId, sessionId);
			cart.setCart(cartData);
			await loadCart();
		} catch (err) {
			alert(err.message || 'Failed to update quantity');
		} finally {
			updating[itemId] = false;
		}
	}

	async function handleRemoveItem(itemId) {
		if (!confirm('Are you sure you want to remove this item?')) return;

		try {
			await removeItemFromCart(cartId, itemId);
			// Reload cart
			const userId = $auth.user?.userId || null;
			const sessionId = $guestSession || null;
			const cartData = await getCart(userId, sessionId);
			cart.setCart(cartData);
			await loadCart();
		} catch (err) {
			alert(err.message || 'Failed to remove item');
		}
	}

	function handleCheckout() {
		if (cartItems.length === 0) {
			alert('Your cart is empty');
			return;
		}
		goto('/checkout');
	}

	onMount(() => {
		loadCart();
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
						<div class="flex items-center justify-between gap-4">
							<div class="flex-1">
								<p class="font-semibold text-lg text-gray-800 mb-1">SKU: {item.sku_id}</p>
								<p class="text-gray-600 mb-2">Quantity: {item.quantity}</p>
								{#if item.price}
									<p class="text-2xl font-bold text-blue-600">
										${(item.price * item.quantity).toFixed(2)}
									</p>
								{/if}
							</div>

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
										disabled={updating[item.item_id]}
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
						</div>
					</div>
				{/each}
			</div>

			<!-- Cart Summary -->
			<div class="lg:col-span-1">
				<div class="card p-6 sticky top-24 animate-slide-up">
					<h2 class="text-2xl font-semibold mb-6 text-gray-800">Order Summary</h2>
					
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

					<button
						on:click={handleCheckout}
						class="w-full btn-primary py-4 text-lg"
					>
						Proceed to Checkout
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
