<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { cart } from '$lib/stores/cart.js';
	import { auth, guestSession } from '$lib/stores/auth.js';
	import { createCheckoutSession } from '$lib/api/checkout.js';

	let loading = false;
	let error = null;

	onMount(async () => {
		// Check if there's a session_id query parameter (for backward compatibility)
		const urlParams = new URLSearchParams(window.location.search);
		const sessionIdFromQuery = urlParams.get('session_id');
		
		if (sessionIdFromQuery) {
			// Redirect to new route format
			goto(`/checkout/${sessionIdFromQuery}`);
			return;
		}

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
			
			// Redirect to new route format with session ID
			goto(`/checkout/${session.session_id}`);
		} catch (err) {
			error = err.message;
			console.error('Failed to create checkout session:', err);
		} finally {
			loading = false;
		}
	}

</script>

<svelte:head>
	<title>Checkout - VG E-Com</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	{#if loading}
		<div class="text-center py-12">
			<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
			<p class="mt-4 text-gray-600">Initializing checkout...</p>
		</div>
	{:else if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
			{error}
		</div>
	{/if}
</div>

