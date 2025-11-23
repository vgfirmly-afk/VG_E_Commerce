<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { cart } from '$lib/stores/cart.js';
	import { auth, guestSession } from '$lib/stores/auth.js';
	import {
		createCheckoutSession,
		getCheckoutSession,
		setDeliveryAddress,
		setBillingAddress,
		getShippingMethods,
		selectShippingMethod,
		getCheckoutSummary
	} from '$lib/api/checkout.js';
	import { createPayment } from '$lib/api/payment.js';
	import { FRONTEND_BASE_URL } from '$lib/config.js';

	let step = 1; // 1: address, 1.5: billing, 2: shipping, 3: summary, 4: payment
	let sessionId = null;
	let checkoutSession = null;
	let loading = false;
	let error = null;
	let paymentError = null; // For payment cancellation/failure messages

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
	let paymentUrl = null;

	onMount(async () => {
		// Check for payment cancellation/failure in URL
		const urlParams = $page.url.searchParams;
		if (urlParams.get('cancelled') || urlParams.get('failure')) {
			paymentError = urlParams.get('cancelled') 
				? 'Payment was cancelled. Please try again when ready.'
				: 'Payment failed. Please try again or use a different payment method.';
			// Remove query params from URL
			const newUrl = new URL($page.url);
			newUrl.searchParams.delete('cancelled');
			newUrl.searchParams.delete('failure');
			window.history.replaceState({}, '', newUrl);
		}

		// Get session ID from URL params
		const urlSessionId = $page.params.id;
		
		if (urlSessionId) {
			// Restore existing session
			sessionId = urlSessionId;
			await restoreSession();
		} else {
			// No session ID - need to create new session
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
		}
	});

	async function restoreSession() {
		try {
			loading = true;
			error = null;
			
			const session = await getCheckoutSession(sessionId);
			checkoutSession = session;
			
			// Restore state based on session status
			if (session.status === 'pending') {
				step = 1;
			} else if (session.status === 'address_set') {
				// Addresses are set, load shipping methods
				if (session.delivery_address) {
					deliveryAddress = {
						full_name: session.delivery_address.full_name || '',
						phone: session.delivery_address.phone || '',
						email: session.delivery_address.email || '',
						address_line1: session.delivery_address.address_line1 || '',
						address_line2: session.delivery_address.address_line2 || '',
						city: session.delivery_address.city || '',
						state: session.delivery_address.state || '',
						postal_code: session.delivery_address.postal_code || '',
						country: session.delivery_address.country || 'IN'
					};
				}
				if (session.billing_address) {
					billingAddress = {
						full_name: session.billing_address.full_name || '',
						phone: session.billing_address.phone || '',
						email: session.billing_address.email || '',
						address_line1: session.billing_address.address_line1 || '',
						address_line2: session.billing_address.address_line2 || '',
						city: session.billing_address.city || '',
						state: session.billing_address.state || '',
						postal_code: session.billing_address.postal_code || '',
						country: session.billing_address.country || 'IN'
					};
					useSameBilling = false;
				} else {
					useSameBilling = true;
				}
				
				await loadShippingMethods();
				step = 2;
				
				// If shipping method already selected, go to summary
				if (session.shipping_method_id) {
					selectedShippingMethod = session.shipping_method_id;
					await loadSummary();
					step = 3;
				}
			} else if (session.status === 'summary_ready' || session.status === 'shipping_selected') {
				// Load all data and show summary
				await loadSummary();
				step = 3;
			} else {
				// Unknown status, start from beginning
				step = 1;
			}
		} catch (err) {
			error = err.message;
			console.error('Failed to restore session:', err);
			// If session not found, redirect to cart
			if (err.message.includes('not found')) {
				goto('/cart');
			}
		} finally {
			loading = false;
		}
	}

	async function initializeCheckout() {
		try {
			loading = true;
			const userId = $auth.user?.id || null;
			const guestSessionId = $guestSession || null;
			const session = await createCheckoutSession($cart.cartId, userId, guestSessionId);
			sessionId = session.session_id;
			checkoutSession = session;
			
			// Redirect to the new URL with session ID
			goto(`/checkout/${sessionId}`);
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
			// Include use_for_billing flag in the address data
			const addressData = {
				...deliveryAddress,
				use_for_billing: useSameBilling
			};
			await setDeliveryAddress(sessionId, addressData, userId, guestSessionId);

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
			const returnUrl = `${FRONTEND_BASE_URL}/orders?checkout_id=${sessionId}&success=true`;
			const cancelUrl = `${FRONTEND_BASE_URL}/cart?cancelled=true`;

			const payment = await createPayment(
				sessionId,
				summary.pricing.total,
				summary.pricing.currency || 'USD',
				returnUrl,
				cancelUrl
			);

			paymentData = payment;
			
			// Get payment URL from response
			if (payment.approval_url) {
				paymentUrl = payment.approval_url;
			} else if (payment.payment_url) {
				paymentUrl = payment.payment_url;
			} else if (payment.links) {
				// PayPal returns links array
				const approveLink = payment.links.find(link => link.rel === 'approve');
				if (approveLink) {
					paymentUrl = approveLink.href;
				}
			}
		} catch (err) {
			error = err.message;
			console.error('Failed to create payment:', err);
		}
	}
</script>

<svelte:head>
	<title>Checkout - VG E-Com</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<h1 class="text-3xl font-bold mb-8">Checkout</h1>

	<!-- Payment Error/Cancellation Message -->
	{#if paymentError}
		<div class="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
			<div class="flex items-center">
				<svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
						clip-rule="evenodd"
					/>
				</svg>
				<div>
					<p class="font-semibold">Payment Issue</p>
					<p>{paymentError}</p>
				</div>
				<button
					on:click={() => (paymentError = null)}
					class="ml-auto text-red-700 hover:text-red-900"
					aria-label="Close"
				>
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</div>
		</div>
	{/if}

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
					<div class="space-y-6">
						<!-- Delivery Address -->
						<div>
							<h3 class="font-semibold mb-2 text-lg">Delivery Address</h3>
							{#if summary.delivery_address}
								<div class="bg-gray-50 p-4 rounded-lg">
									<p class="text-gray-700">
										<strong>{summary.delivery_address.full_name}</strong><br />
										{summary.delivery_address.address_line1},
										{#if summary.delivery_address.address_line2}
											{summary.delivery_address.address_line2}, 
										{/if}
										{summary.delivery_address.city}, {summary.delivery_address.state}{' '}
										{summary.delivery_address.postal_code},
										{summary.delivery_address.country}
										{#if summary.delivery_address.phone}
											<br />Phone: {summary.delivery_address.phone}
										{/if}
										{#if summary.delivery_address.email}
											<pre></pre>Email: {summary.delivery_address.email}
										{/if}
									</p>
								</div>
							{:else}
								<p class="text-gray-500">Not set</p>
							{/if}
						</div>

						<!-- Billing Address -->
						<!-- <div>
							<h3 class="font-semibold mb-2 text-lg">Billing Address</h3>
							{#if summary.billing_address}
								<div class="bg-gray-50 p-4 rounded-lg">
									<p class="text-gray-700">
										<strong>{summary.billing_address.full_name}</strong><br />
										{summary.billing_address.address_line1}<br />
										{#if summary.billing_address.address_line2}
											{summary.billing_address.address_line2}<br />
										{/if}
										{summary.billing_address.city}, {summary.billing_address.state}{' '}
										{summary.billing_address.postal_code}<br />
										{summary.billing_address.country}<br />
										{#if summary.billing_address.phone}
											Phone: {summary.billing_address.phone}<br />
										{/if}
										{#if summary.billing_address.email}
											Email: {summary.billing_address.email}
										{/if}
									</p>
								</div>
							{:else}
								<p class="text-gray-500">Same as delivery address</p>
							{/if}
						</div> -->

						<!-- Shipping Method -->
						<div>
							<h3 class="font-semibold mb-2 text-lg">Shipping Method</h3>
							{#if summary.shipping_method}
								<div class="bg-gray-50 p-4 rounded-lg">
									<p class="text-gray-700">
										<strong>{summary.shipping_method.name}</strong><br />
										<span class="text-sm text-gray-600">{summary.shipping_method.description}</span><br />
										<span class="text-lg font-bold text-blue-600">
											${summary.shipping_method.base_cost?.toFixed(2) || '0.00'}
										</span>
									</p>
									{#if summary.estimated_delivery_date}
										<p class="text-sm text-gray-600 mt-2">
											Estimated delivery: {summary.estimated_delivery_date}
										</p>
									{/if}
								</div>
							{:else}
								<p class="text-gray-500">Not selected</p>
							{/if}
						</div>

						<!-- Items -->
						<div>
							<h3 class="font-semibold mb-2 text-lg">Items</h3>
							<div class="space-y-2">
								{#each summary.items || [] as item}
									<div class="flex justify-between items-center bg-gray-50 p-3 rounded">
										<div>
											<p class="font-medium">SKU: {item.sku_id}</p>
											<p class="text-sm text-gray-600">Quantity: {item.quantity}</p>
										</div>
										<div class="text-right">
											<p class="font-medium">${item.unit_price?.toFixed(2) || '0.00'}</p>
											<p class="text-sm text-gray-600">Subtotal: ${item.subtotal?.toFixed(2) || '0.00'}</p>
										</div>
									</div>
								{/each}
							</div>
						</div>

						<!-- Pricing -->
						<div>
							<h3 class="font-semibold mb-2 text-lg">Pricing</h3>
							<div class="bg-gray-50 p-4 rounded-lg space-y-2">
								<div class="flex justify-between">
									<span>Subtotal:</span>
									<span>${summary.pricing?.subtotal?.toFixed(2) || '0.00'}</span>
								</div>
								<div class="flex justify-between">
									<span>Shipping:</span>
									<span>${summary.pricing?.shipping_cost?.toFixed(2) || '0.00'}</span>
								</div>
								<div class="flex justify-between">
									<span>Tax:</span>
									<span>${summary.pricing?.tax?.toFixed(2) || '0.00'}</span>
								</div>
								<div class="flex justify-between font-bold text-lg pt-2 border-t border-gray-300">
									<span>Total:</span>
									<span class="text-blue-600">
										${summary.pricing?.total?.toFixed(2) || '0.00'} {summary.pricing?.currency || 'USD'}
									</span>
								</div>
							</div>
						</div>

						<!-- Payment Button -->
						{#if !paymentUrl}
							<button
								on:click={handleProceedToPayment}
								disabled={loading}
								class="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 text-center font-semibold"
							>
								{loading ? 'Processing...' : 'Proceed to Payment'}
							</button>
						{:else if paymentUrl}
							<div class="mt-6 space-y-3">
								<a
									href={paymentUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="block w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 text-center font-semibold"
								>
									Pay with PayPal
								</a>
							</div>
						{/if}
					</div>
				{:else}
					<p class="text-gray-600">Loading summary...</p>
				{/if}
			</div>
		{/if}
	{/if}
</div>

