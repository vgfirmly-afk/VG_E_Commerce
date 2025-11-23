<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { auth, guestSession } from '$lib/stores/auth.js';
	import Header from '$lib/components/Header.svelte';

	onMount(() => {
		auth.init();
		guestSession.init();
	});
</script>

<Header />

<main class="min-h-screen animate-fade-in">
	<slot />
</main>

<footer class="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12 mt-16">
	<div class="container mx-auto px-4">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
			<div>
				<h3 class="text-xl font-bold mb-4">VG E-Com</h3>
				<p class="text-gray-400">Your trusted online shopping destination</p>
			</div>
			<div>
				<h3 class="text-xl font-bold mb-4">Quick Links</h3>
				<ul class="space-y-2 text-gray-400">
					<li><a href="/" class="hover:text-white transition-colors duration-200">Home</a></li>
					<li><a href="/cart" class="hover:text-white transition-colors duration-200">Cart</a></li>
					<li><a href="/orders" class="hover:text-white transition-colors duration-200">Orders</a></li>
				</ul>
			</div>
			<div>
				<h3 class="text-xl font-bold mb-4">Contact</h3>
				<p class="text-gray-400">support@vgecom.com</p>
			</div>
		</div>
		<div class="border-t border-gray-700 pt-8 text-center text-gray-400">
			<p>&copy; 2024 VG E-Com. All rights reserved.</p>
		</div>
	</div>
</footer>
