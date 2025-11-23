<script>
	import { onMount } from 'svelte';
	import { getHomePage } from '$lib/api/catalog.js';
	import ProductCard from '$lib/components/ProductCard.svelte';

	let categories = {};
	let loading = true;
	let error = null;

	onMount(async () => {
		try {
			const data = await getHomePage('Electronics,Toys,Dress,Books,Sports', 10);
			// Group products by category
			if (data && typeof data === 'object') {
				Object.keys(data).forEach((category) => {
					if (Array.isArray(data[category])) {
						categories[category] = data[category];
					}
				});
			}
		} catch (err) {
			error = err.message;
			console.error('Failed to load home page:', err);
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>VG E-Com - Home</title>
</svelte:head>

<div class="container mx-auto px-4 py-12">
	<div class="text-center mb-12 animate-fade-in">
		<h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
			Welcome to VG E-Com
		</h1>
		<p class="text-xl text-gray-600">Discover amazing products at great prices</p>
	</div>

	{#if loading}
		<div class="text-center py-20">
			<div class="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
			<p class="mt-6 text-gray-600 text-lg">Loading amazing products...</p>
		</div>
	{:else if error}
		<div class="max-w-md mx-auto bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded shadow-lg animate-slide-up">
			<p class="font-medium">{error}</p>
		</div>
	{:else}
		<div class="space-y-16">
			{#each Object.entries(categories) as [category, products], i}
				{#if products && products.length > 0}
					<section class="animate-fade-in" style="animation-delay: {i * 0.1}s">
						<div class="flex items-center gap-4 mb-6">
							<h2 class="text-3xl font-bold text-gray-800">{category}</h2>
							<div class="flex-1 h-0.5 bg-gradient-to-r from-blue-600 to-transparent"></div>
						</div>
						<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
							{#each products as product, j}
								<div class="animate-slide-up" style="animation-delay: {j * 0.05}s">
									<ProductCard {product} />
								</div>
							{/each}
						</div>
					</section>
				{/if}
			{/each}
		</div>
	{/if}
</div>
