<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { cart } from '$lib/stores/cart.js';
	import { auth, guestSession } from '$lib/stores/auth.js';
	import {
		createCheckoutSession,
		setDeliveryAddress,
		setBillingAddress,
		getShippingMethods,
		selectShippingMethod,
		getCheckoutSummary
	} from '$lib/api/checkout.js';
	import { createPayment } from '$lib/api/payment.js';
	import { FRONTEND_BASE_URL } from '$lib/config.js';

	let step = 1; // 1: address, 2: shipping, 3: summary, 4: payment
	let sessionId = null;
	let checkoutSession = null;
	let loading = false;
	let error = null;

	// Address form
	let deliveryAddress = {
		full_name: '',
		phone: '',
		email: '',
		address_line1: '',
		address_line2: '',
		city: '',
		state: '',
		postal_code: '',
		country: 'IN',
		use_for_billing: true
	};

	let billingAddress = {
		full_name: '',
		phone: '',
		email: '',
		address_line1: '',
		address_line2: '',
		city: '',
		state: '',
		postal_code: '',
		country: 'IN'
	};

	let useSameBilling = true;

	// Shipping
	let shippingMethods = [];
	let selectedShippingMethod = null;

	// Summary
	let summary = null;

	// Payment
	let paymentData = null;
	let paypalButtonId = 'paypal-button-container';

	onMount(async () => {
		if (!$cart.cartId) {
			goto('/cart');
			return;
		}

		// Wait for auth to finish loading
		if ($auth.loading) {
			const unsubscribe = auth.subscribe((authState) => {
				if (!authState.loading) {
					unsubscribe();
					initializeCheckout();
				}
			});
			return;
		}

		await initializeCheckout();
	});

	async function initializeCheckout() {
		try {
			loading = true;
			const userId = $auth.user?.id || null;
			const guestSessionId = $guestSession || null;
			const session = await createCheckoutSession($cart.cartId, userId, guestSessionId);
			sessionId = session.session_id;
			checkoutSession = session;
		} catch (err) {
			error = err.message;
			console.error('Failed to create checkout session:', err);
		} finally {
			loading = false;
		}
	}

	async function handleDeliveryAddress() {
		if (!sessionId) return;

		loading = true;
		error = null;
		try {
			const userId = $auth.user?.id || null;
			const guestSessionId = $guestSession || null;
			await setDeliveryAddress(sessionId, deliveryAddress, userId, guestSessionId);

			if (useSameBilling) {
				// Skip to shipping methods
				await loadShippingMethods();
				step = 2;
			} else {
				step = 1.5; // Show billing address form
			}
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	async function handleBillingAddress() {
		if (!sessionId) return;

		loading = true;
		error = null;
		try {
			const userId = $auth.user?.id || null;
			const guestSessionId = $guestSession || null;
			await setBillingAddress(sessionId, billingAddress, userId, guestSessionId);
			await loadShippingMethods();
			step = 2;
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	async function loadShippingMethods() {
		if (!sessionId) return;

		try {
			const methods = await getShippingMethods(sessionId);
			shippingMethods = methods.shipping_methods || [];
		} catch (err) {
			error = err.message;
			console.error('Failed to load shipping methods:', err);
		}
	}

	async function handleSelectShipping() {
		if (!selectedShippingMethod) {
			alert('Please select a shipping method');
			return;
		}

		loading = true;
		error = null;
		try {
			await selectShippingMethod(sessionId, selectedShippingMethod);
			await loadSummary();
			step = 3;
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	async function loadSummary() {
		if (!sessionId) return;

		try {
			const summaryData = await getCheckoutSummary(sessionId);
			summary = summaryData;

			// Check if stock is available
			if (!summary.stock_status?.all_available) {
				error = 'Some items are out of stock. Please update your cart.';
				return;
			}
		} catch (err) {
			error = err.message;
			console.error('Failed to load summary:', err);
		}
	}

	async function handleProceedToPayment() {
		if (!sessionId || !summary) return;

		loading = true;
		error = null;
		try {
			await createPaymentIntent();
		} catch (err) {
			error = err.message;
			console.error('Failed to create payment:', err);
		} finally {
			loading = false;
		}
	}

	async function createPaymentIntent() {
		if (!sessionId || !summary) return;

		try {
			const returnUrl = `${FRONTEND_BASE_URL}/orders?checkout_id=${sessionId}`;
			const cancelUrl = `${FRONTEND_BASE_URL}/checkout?session_id=${sessionId}`;

			const payment = await createPayment(
				sessionId,
				summary.pricing.total,
				summary.pricing.currency || 'USD',
				returnUrl,
				cancelUrl
			);

			paymentData = payment;
			step = 4;

			// Load PayPal button
			await loadPayPalButton();
		} catch (err) {
			error = err.message;
			console.error('Failed to create payment:', err);
		}
	}

	async function loadPayPalButton() {
		if (!paymentData?.approval_url) return;

		// PayPal button will be loaded via PayPal SDK
		// Don't auto-redirect - let user click the button
	}
</script>

<svelte:head>
	<title>Checkout - VG E-Com</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<h1 class="text-3xl font-bold mb-8">Checkout</h1>

	{#if loading && !sessionId}
		<div class="text-center py-12">
			<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
			<p class="mt-4 text-gray-600">Initializing checkout...</p>
		</div>
	{:else if error && !sessionId}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
			{error}
		</div>
	{:else if sessionId}
		<!-- Step 1: Delivery Address -->
		{#if step === 1}
			<div class="bg-white rounded-lg shadow-md p-6">
				<h2 class="text-2xl font-semibold mb-4">Delivery Address</h2>
				{#if error}
					<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						{error}
					</div>
				{/if}
				<form on:submit|preventDefault={handleDeliveryAddress}>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label for="full_name" class="block text-sm font-medium text-gray-700 mb-1">
								Full Name *
							</label>
							<input
								id="full_name"
								type="text"
								bind:value={deliveryAddress.full_name}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
						</div>
						<div>
							<label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
								Phone *
							</label>
							<input
								id="phone"
								type="tel"
								bind:value={deliveryAddress.phone}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
						</div>
						<div>
							<label for="email" class="block text-sm font-medium text-gray-700 mb-1">
								Email *
							</label>
							<input
								id="email"
								type="email"
								bind:value={deliveryAddress.email}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
						</div>
						<div>
							<label for="address_line1" class="block text-sm font-medium text-gray-700 mb-1">
								Address Line 1 *
							</label>
							<input
								id="address_line1"
								type="text"
								bind:value={deliveryAddress.address_line1}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
						</div>
						<div>
							<label for="address_line2" class="block text-sm font-medium text-gray-700 mb-1">
								Address Line 2
							</label>
							<input
								id="address_line2"
								type="text"
								bind:value={deliveryAddress.address_line2}
								class="w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
						</div>
						<div>
							<label for="city" class="block text-sm font-medium text-gray-700 mb-1">
								City *
							</label>
							<input
								id="city"
								type="text"
								bind:value={deliveryAddress.city}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
						</div>
						<div>
							<label for="state" class="block text-sm font-medium text-gray-700 mb-1">
								State *
							</label>
							<input
								id="state"
								type="text"
								bind:value={deliveryAddress.state}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
						</div>
						<div>
							<label for="postal_code" class="block text-sm font-medium text-gray-700 mb-1">
								Postal Code *
							</label>
							<input
								id="postal_code"
								type="text"
								bind:value={deliveryAddress.postal_code}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
						</div>
						<div>
							<label for="country" class="block text-sm font-medium text-gray-700 mb-1">
								Country *
							</label>
							<input
								id="country"
								type="text"
								bind:value={deliveryAddress.country}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
						</div>
					</div>
					<div class="mt-4">
						<label class="flex items-center">
							<input
								type="checkbox"
								bind:checked={useSameBilling}
								class="mr-2"
							/>
							<span>Billing address is same as delivery address</span>
						</label>
					</div>
					<button
						type="submit"
						disabled={loading}
						class="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
					>
						{loading ? 'Saving...' : 'Continue'}
					</button>
				</form>
			</div>
		{/if}

		<!-- Step 1.5: Billing Address -->
		{#if step === 1.5}
			<div class="bg-white rounded-lg shadow-md p-6">
				<h2 class="text-2xl font-semibold mb-4">Billing Address</h2>
				{#if error}
					<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						{error}
					</div>
				{/if}
				<form on:submit|preventDefault={handleBillingAddress}>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label for="billing_full_name" class="block text-sm font-medium text-gray-700 mb-1">
								Full Name *
							</label>
							<input
								id="billing_full_name"
								type="text"
								bind:value={billingAddress.full_name}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
						</div>
						<div>
							<label for="billing_phone" class="block text-sm font-medium text-gray-700 mb-1">
								Phone *
							</label>
							<input
								id="billing_phone"
								type="tel"
								bind:value={billingAddress.phone}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
						</div>
						<div>
							<label for="billing_email" class="block text-sm font-medium text-gray-700 mb-1">
								Email *
							</label>
							<input
								id="billing_email"
								type="email"
								bind:value={billingAddress.email}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
						</div>
						<div>
							<label for="billing_address_line1" class="block text-sm font-medium text-gray-700 mb-1">
								Address Line 1 *
							</label>
							<input
								id="billing_address_line1"
								type="text"
								bind:value={billingAddress.address_line1}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
						</div>
						<div>
							<label for="billing_address_line2" class="block text-sm font-medium text-gray-700 mb-1">
								Address Line 2
							</label>
							<input
								id="billing_address_line2"
								type="text"
								bind:value={billingAddress.address_line2}
								class="w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
						</div>
						<div>
							<label for="billing_city" class="block text-sm font-medium text-gray-700 mb-1">
								City *
							</label>
							<input
								id="billing_city"
								type="text"
								bind:value={billingAddress.city}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
						</div>
						<div>
							<label for="billing_state" class="block text-sm font-medium text-gray-700 mb-1">
								State *
							</label>
							<input
								id="billing_state"
								type="text"
								bind:value={billingAddress.state}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
						</div>
						<div>
							<label for="billing_postal_code" class="block text-sm font-medium text-gray-700 mb-1">
								Postal Code *
							</label>
							<input
								id="billing_postal_code"
								type="text"
								bind:value={billingAddress.postal_code}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
						</div>
						<div>
							<label for="billing_country" class="block text-sm font-medium text-gray-700 mb-1">
								Country *
							</label>
							<input
								id="billing_country"
								type="text"
								bind:value={billingAddress.country}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
						</div>
					</div>
					<button
						type="submit"
						disabled={loading}
						class="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
					>
						{loading ? 'Saving...' : 'Continue'}
					</button>
				</form>
			</div>
		{/if}

		<!-- Step 2: Shipping Methods -->
		{#if step === 2}
			<div class="bg-white rounded-lg shadow-md p-6">
				<h2 class="text-2xl font-semibold mb-4">Select Shipping Method</h2>
				{#if error}
					<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						{error}
					</div>
				{/if}
				{#if shippingMethods.length === 0}
					<p class="text-gray-600">Loading shipping methods...</p>
				{:else}
					<div class="space-y-4">
						{#each shippingMethods as method}
							<label
								class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 {selectedShippingMethod === method.method_id
									? 'border-blue-500 bg-blue-50'
									: 'border-gray-200'}"
							>
								<input
									type="radio"
									name="shipping"
									value={method.method_id}
									checked={selectedShippingMethod === method.method_id}
									on:change={() => (selectedShippingMethod = method.method_id)}
									class="mr-3"
								/>
								<div class="flex-1">
									<div class="font-medium">{method.name}</div>
									<div class="text-sm text-gray-600">{method.description}</div>
									<div class="text-lg font-bold text-blue-600">
										${method.base_cost?.toFixed(2) || '0.00'}
									</div>
								</div>
							</label>
						{/each}
					</div>
					<button
						on:click={handleSelectShipping}
						disabled={loading || !selectedShippingMethod}
						class="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
					>
						{loading ? 'Loading...' : 'Continue'}
					</button>
				{/if}
			</div>
		{/if}

		<!-- Step 3: Summary -->
		{#if step === 3}
			<div class="bg-white rounded-lg shadow-md p-6">
				<h2 class="text-2xl font-semibold mb-4">Order Summary</h2>
				{#if error}
					<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						{error}
					</div>
				{:else if summary}
					<div class="space-y-4">
						<div>
							<h3 class="font-semibold mb-2">Delivery Address</h3>
							{#if summary.delivery_address}
								<p class="text-gray-700">
									{summary.delivery_address.full_name}<br />
									{summary.delivery_address.address_line1}<br />
									{#if summary.delivery_address.address_line2}
										{summary.delivery_address.address_line2}<br />
									{/if}
									{summary.delivery_address.city}, {summary.delivery_address.state}{' '}
									{summary.delivery_address.postal_code}<br />
									{summary.delivery_address.country}
								</p>
							{/if}
						</div>

						<div>
							<h3 class="font-semibold mb-2">Shipping Method</h3>
							{#if summary.shipping_method}
								<p class="text-gray-700">
									{summary.shipping_method.name} - ${summary.shipping_method.base_cost?.toFixed(2) || '0.00'}
								</p>
							{/if}
						</div>

						<div>
							<h3 class="font-semibold mb-2">Pricing</h3>
							<div class="space-y-1">
								<div class="flex justify-between">
									<span>Subtotal:</span>
									<span>${summary.pricing.subtotal?.toFixed(2) || '0.00'}</span>
								</div>
								<div class="flex justify-between">
									<span>Shipping:</span>
									<span>${summary.pricing.shipping?.toFixed(2) || '0.00'}</span>
								</div>
								<div class="flex justify-between font-bold text-lg pt-2 border-t">
									<span>Total:</span>
									<span class="text-blue-600">
										${summary.pricing.total?.toFixed(2) || '0.00'} {summary.pricing.currency || 'USD'}
									</span>
								</div>
							</div>
						</div>

						{#if !paymentData}
							<button
								on:click={handleProceedToPayment}
								disabled={loading}
								class="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 text-center font-semibold"
							>
								{loading ? 'Processing...' : 'Proceed to Payment'}
							</button>
						{:else if paymentData?.approval_url}
							<div class="mt-6 space-y-3">
								<a
									href={paymentData.approval_url}
									class="block w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 text-center font-semibold"
								>
									Pay with PayPal
								</a>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	{/if}
</div>

