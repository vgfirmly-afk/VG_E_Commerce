<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getCheckoutSession } from '$lib/api/checkout.js';
	import { getPayment } from '$lib/api/payment.js';

	let checkoutId = null;
	let checkoutSession = null;
	let payment = null;
	let loading = true;
	let error = null;

	$: checkoutIdFromUrl = $page.url.searchParams.get('checkout_id') || $page.url.searchParams.get('session_id');

	onMount(async () => {
		checkoutId = checkoutIdFromUrl;
		if (!checkoutId) {
			error = 'No checkout session ID provided';
			loading = false;
			return;
		}

		try {
			// Get checkout session
			checkoutSession = await getCheckoutSession(checkoutId);

			// Get payment if payment_id exists
			if (checkoutSession.payment_id) {
				try {
					payment = await getPayment(checkoutSession.payment_id);
				} catch (err) {
					console.error('Failed to load payment:', err);
				}
			}
		} catch (err) {
			error = err.message;
			console.error('Failed to load order:', err);
		} finally {
			loading = false;
		}
	});

	$: paymentStatus = payment?.status || checkoutSession?.payment_status || 'unknown';
	$: isSuccess = paymentStatus === 'captured' || paymentStatus === 'approved';
	$: isPending = paymentStatus === 'pending' || paymentStatus === 'created';
	$: isFailed = paymentStatus === 'failed' || paymentStatus === 'cancelled';
</script>

<svelte:head>
	<title>Order Status - VG E-Com</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<h1 class="text-3xl font-bold mb-8">Order Status</h1>

	{#if loading}
		<div class="text-center py-12">
			<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
			<p class="mt-4 text-gray-600">Loading order details...</p>
		</div>
	{:else if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
			{error}
		</div>
	{:else if checkoutSession}
		<div class="bg-white rounded-lg shadow-md p-6">
			<!-- Payment Status -->
			<div class="mb-6">
				<h2 class="text-2xl font-semibold mb-4">Payment Status</h2>
				<div class="flex items-center gap-4">
					{#if isSuccess}
						<div class="flex items-center gap-2 text-green-600">
							<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="text-xl font-bold">Payment Successful</span>
						</div>
					{:else if isPending}
						<div class="flex items-center gap-2 text-yellow-600">
							<svg class="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							<span class="text-xl font-bold">Payment Pending</span>
						</div>
					{:else if isFailed}
						<div class="flex items-center gap-2 text-red-600">
							<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="text-xl font-bold">Payment Failed</span>
						</div>
					{:else}
						<div class="text-gray-600">
							<span class="text-xl font-bold">Status: {paymentStatus}</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- Order Details -->
			<div class="mb-6">
				<h2 class="text-2xl font-semibold mb-4">Order Details</h2>
				<div class="space-y-4">
					<div>
						<span class="font-semibold">Checkout Session ID:</span>
						<span class="ml-2 text-gray-700">{checkoutSession.session_id}</span>
					</div>
					{#if checkoutSession.cart_id}
						<div>
							<span class="font-semibold">Cart ID:</span>
							<span class="ml-2 text-gray-700">{checkoutSession.cart_id}</span>
						</div>
					{/if}
					{#if payment?.payment_id}
						<div>
							<span class="font-semibold">Payment ID:</span>
							<span class="ml-2 text-gray-700">{payment.payment_id}</span>
						</div>
					{/if}
					{#if payment?.paypal_order_id}
						<div>
							<span class="font-semibold">PayPal Order ID:</span>
							<span class="ml-2 text-gray-700">{payment.paypal_order_id}</span>
						</div>
					{/if}
					{#if payment?.paypal_transaction_id}
						<div>
							<span class="font-semibold">PayPal Transaction ID:</span>
							<span class="ml-2 text-gray-700">{payment.paypal_transaction_id}</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- Delivery Address -->
			{#if checkoutSession.delivery_address}
				<div class="mb-6">
					<h2 class="text-2xl font-semibold mb-4">Delivery Address</h2>
					<div class="text-gray-700">
						<p>{checkoutSession.delivery_address.full_name}</p>
						<p>{checkoutSession.delivery_address.address_line1}</p>
						{#if checkoutSession.delivery_address.address_line2}
							<p>{checkoutSession.delivery_address.address_line2}</p>
						{/if}
						<p>
							{checkoutSession.delivery_address.city}, {checkoutSession.delivery_address.state}{' '}
							{checkoutSession.delivery_address.postal_code}
						</p>
						<p>{checkoutSession.delivery_address.country}</p>
					</div>
				</div>
			{/if}

			<!-- Shipping Method -->
			{#if checkoutSession.shipping_method}
				<div class="mb-6">
					<h2 class="text-2xl font-semibold mb-4">Shipping Method</h2>
					<div class="text-gray-700">
						<p class="font-semibold">{checkoutSession.shipping_method.name}</p>
						<p>{checkoutSession.shipping_method.description}</p>
					</div>
				</div>
			{/if}

			<!-- Items -->
			{#if checkoutSession.items && checkoutSession.items.length > 0}
				<div class="mb-6">
					<h2 class="text-2xl font-semibold mb-4">Order Items</h2>
					<div class="space-y-2">
						{#each checkoutSession.items as item}
							<div class="flex justify-between p-4 bg-gray-50 rounded">
								<div>
									<p class="font-semibold">SKU: {item.sku_id}</p>
									<p class="text-gray-600">Quantity: {item.quantity}</p>
								</div>
								{#if item.price}
									<div class="text-lg font-bold">
										${(item.price * item.quantity).toFixed(2)}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Actions -->
			<div class="mt-8">
				<a
					href="/"
					class="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
				>
					Continue Shopping
				</a>
			</div>
		</div>
	{:else}
		<div class="text-center py-12">
			<p class="text-gray-600">Order not found</p>
		</div>
	{/if}
</div>

