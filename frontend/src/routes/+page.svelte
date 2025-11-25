<script>
	import { onMount } from 'svelte';
	import { getProducts, getProductsByCategory, searchProducts } from '$lib/api/catalog.js';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import Paginator from '$lib/components/Paginator.svelte';

	let allProducts = [];
	let categories = {};
	let availableCategories = [];
	let loading = true;
	let error = null;
	let searchQuery = '';
	let selectedCategory = 'All';
	let searchLoading = false;
	let currentPage = 1;
	let pageLimit = 20;
	let pagination = null;

	onMount(async () => {
		await loadInitialData();
	});

	async function loadInitialData() {
		loading = true;
		error = null;
		try {
			// Load all products initially
			const data = await getProducts(currentPage, pageLimit);
			if (data && data.products) {
				allProducts = data.products;
				// Always create a new object reference to ensure reactivity
				if (data.pagination) {
					pagination = { ...data.pagination };
				} else if (data.total !== undefined) {
					// Fallback: create pagination object if backend returns total but not pagination
					const totalPages = Math.ceil((data.total || data.products.length) / pageLimit);
					pagination = {
						total: data.total || data.products.length,
						totalPages: totalPages,
						currentPage: currentPage,
						limit: pageLimit,
						hasNext: currentPage < totalPages,
						hasPrevious: currentPage > 1,
						nextPage: currentPage < totalPages ? currentPage + 1 : null,
						previousPage: currentPage > 1 ? currentPage - 1 : null,
					};
				} else {
					pagination = null;
				}
				
				// Extract unique categories
				const categorySet = new Set();
				data.products.forEach(product => {
					if (product.categories && Array.isArray(product.categories)) {
						product.categories.forEach(cat => categorySet.add(cat));
					}
				});
				availableCategories = Array.from(categorySet).sort();
				
				// Group products by category
				groupProductsByCategory(data.products);
			}
		} catch (err) {
			error = err.message;
			console.error('Failed to load products:', err);
		} finally {
			loading = false;
		}
	}

	function groupProductsByCategory(products) {
		categories = {};
		products.forEach(product => {
			if (product.categories && Array.isArray(product.categories)) {
				product.categories.forEach(category => {
					if (!categories[category]) {
						categories[category] = [];
					}
					categories[category].push(product);
				});
			}
		});
	}

	async function handleSearch(resetPage = true) {
		if (!searchQuery.trim()) {
			currentPage = 1;
			await loadInitialData();
			selectedCategory = 'All';
			return;
		}

		searchLoading = true;
		error = null;
		// Reset to page 1 only when starting a new search, not when paginating
		if (resetPage && currentPage !== 1) {
			currentPage = 1;
		}
		try {
			const category = selectedCategory !== 'All' ? selectedCategory : '';
			const data = await searchProducts(searchQuery, currentPage, pageLimit, category);
			if (data && data.products) {
				allProducts = data.products;
				// Always create a new object reference to ensure reactivity
				if (data.pagination) {
					pagination = { ...data.pagination };
				} else if (data.total !== undefined) {
					// Fallback: create pagination object if backend returns total but not pagination
					const totalPages = Math.ceil((data.total || data.products.length) / pageLimit);
					pagination = {
						total: data.total || data.products.length,
						totalPages: totalPages,
						currentPage: currentPage,
						limit: pageLimit,
						hasNext: currentPage < totalPages,
						hasPrevious: currentPage > 1,
						nextPage: currentPage < totalPages ? currentPage + 1 : null,
						previousPage: currentPage > 1 ? currentPage - 1 : null,
					};
				} else {
					pagination = null;
				}
				groupProductsByCategory(data.products);
			}
		} catch (err) {
			error = err.message;
			console.error('Search failed:', err);
		} finally {
			searchLoading = false;
		}
	}

	async function handleCategorySelect(category, resetPage = true) {
		selectedCategory = category;
		// Only clear search query when selecting a new category (not when paginating)
		if (resetPage) {
			searchQuery = '';
		}
		
		if (category === 'All') {
			if (resetPage) {
				currentPage = 1;
			}
			await loadInitialData();
			return;
		}

		loading = true;
		error = null;
		// Reset to page 1 only when selecting a new category, not when paginating
		if (resetPage) {
			currentPage = 1;
		}
		try {
			const data = await getProductsByCategory(category, currentPage, pageLimit);
			if (data && data.products) {
				allProducts = data.products;
				// Always create a new object reference to ensure reactivity
				if (data.pagination) {
					pagination = { ...data.pagination };
				} else if (data.total !== undefined) {
					// Fallback: create pagination object if backend returns total but not pagination
					const totalPages = Math.ceil((data.total || data.products.length) / pageLimit);
					pagination = {
						total: data.total || data.products.length,
						totalPages: totalPages,
						currentPage: currentPage,
						limit: pageLimit,
						hasNext: currentPage < totalPages,
						hasPrevious: currentPage > 1,
						nextPage: currentPage < totalPages ? currentPage + 1 : null,
						previousPage: currentPage > 1 ? currentPage - 1 : null,
					};
				} else {
					pagination = null;
				}
				groupProductsByCategory(data.products);
			}
		} catch (err) {
			error = err.message;
			console.error('Failed to load products by category:', err);
		} finally {
			loading = false;
		}
	}

	async function handlePageChange(newPage) {
		if (!pagination) return;
		if (newPage < 1 || newPage > pagination.totalPages) return;
		
		currentPage = newPage;
		
		if (searchQuery.trim()) {
			// Don't reset page when paginating through search results
			await handleSearch(false);
		} else if (selectedCategory === 'All') {
			await loadInitialData();
		} else {
			// Don't reset page when paginating through category results
			await handleCategorySelect(selectedCategory, false);
		}
	}

	async function handleLimitChange(newLimit) {
		pageLimit = newLimit;
		currentPage = 1;
		
		if (searchQuery.trim()) {
			await handleSearch();
		} else if (selectedCategory === 'All') {
			await loadInitialData();
		} else {
			await handleCategorySelect(selectedCategory);
		}
	}

	function handleKeyPress(event) {
		if (event.key === 'Enter') {
			handleSearch();
		}
	}
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

	<!-- Search Bar -->
	<div class="max-w-2xl mx-auto mb-8">
		<div class="flex gap-2">
			<input
				type="text"
				bind:value={searchQuery}
				on:keypress={handleKeyPress}
				placeholder="Search products..."
				class="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
			/>
			<button
				on:click={handleSearch}
				disabled={searchLoading}
				class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200"
			>
				{#if searchLoading}
					<span class="flex items-center gap-2">
						<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
						Searching...
					</span>
				{:else}
					Search
				{/if}
			</button>
		</div>
	</div>

	<!-- Category Filter -->
	{#if availableCategories.length > 0}
		<div class="mb-8">
			<div class="flex flex-wrap gap-2 justify-center">
				<button
					on:click={() => handleCategorySelect('All')}
					class="px-4 py-2 rounded-lg font-medium transition-all duration-200 {selectedCategory === 'All'
						? 'bg-blue-600 text-white shadow-md'
						: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
				>
					All
				</button>
				{#each availableCategories as category}
					<button
						on:click={() => handleCategorySelect(category)}
						class="px-4 py-2 rounded-lg font-medium transition-all duration-200 {selectedCategory === category
							? 'bg-blue-600 text-white shadow-md'
							: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
					>
						{category}
					</button>
				{/each}
			</div>
		</div>
	{/if}

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
		<!-- Show all products or filtered products with pagination -->
		{#if allProducts.length > 0}
			<div class="mb-8">
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-3xl font-bold text-gray-800">
						{#if searchQuery.trim()}
							Search Results
						{:else if selectedCategory !== 'All'}
							{selectedCategory}
						{:else}
							All Products
						{/if}
					</h2>
					<div class="flex items-center gap-4">
						<div class="flex items-center gap-2">
							<label for="page-limit" class="text-sm text-gray-700">Items per page:</label>
							<select
								id="page-limit"
								bind:value={pageLimit}
								on:change={(e) => handleLimitChange(Number(e.target.value))}
								class="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="10">10</option>
								<option value="20">20</option>
								<option value="30">30</option>
								<option value="50">50</option>
							</select>
						</div>
					</div>
				</div>
				<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
					{#each allProducts as product, j}
						<div class="animate-slide-up" style="animation-delay: {j * 0.05}s">
							<ProductCard {product} />
						</div>
					{/each}
				</div>
				
				<!-- Pagination -->
				{#if pagination}
					<div class="mt-8">
						<Paginator {pagination} onPageChange={handlePageChange} />
					</div>
				{/if}
			</div>
		{:else}
			<div class="text-center py-20">
				<p class="text-gray-600 text-lg">No products found</p>
			</div>
		{/if}
	{/if}
</div>
