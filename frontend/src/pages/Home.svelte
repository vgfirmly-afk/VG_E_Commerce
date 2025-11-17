<script>
  import { onMount } from 'svelte';
  import { router } from '../lib/router.js';
  import * as catalogAPI from '../lib/api/catalog.js';
  import * as inventoryAPI from '../lib/api/inventory.js';
  import * as pricingAPI from '../lib/api/pricing.js';

  let categories = [];
  let productsByCategory = {};
  let loading = true;
  let error = null;
  let searchQuery = '';
  let currentCategory = '';
  let currentPage = 1;
  let totalPages = 1;
  let products = [];
  let showSearchResults = false;

  onMount(async () => {
    await loadHomePage();
  });

  async function loadHomePage() {
    try {
      loading = true;
      error = null;
      const data = await catalogAPI.getHomePage();
      
      categories = Object.keys(data);
      productsByCategory = data;
      
      // Load first category products by default
      if (categories.length > 0) {
        await loadCategoryProducts(categories[0]);
      }
    } catch (err) {
      error = err.message;
      console.error('Failed to load home page:', err);
    } finally {
      loading = false;
    }
  }

  async function loadCategoryProducts(category, page = 1) {
    try {
      loading = true;
      error = null;
      currentCategory = category;
      currentPage = page;
      
      const data = await catalogAPI.getProducts({
        category,
        page,
        limit: 20,
      });
      
      products = data.products || [];
      totalPages = Math.ceil((data.count || 0) / 20);
      showSearchResults = false;
    } catch (err) {
      error = err.message;
      console.error('Failed to load category products:', err);
    } finally {
      loading = false;
    }
  }

  async function handleSearch() {
    if (!searchQuery.trim()) {
      await loadHomePage();
      return;
    }

    try {
      loading = true;
      error = null;
      showSearchResults = true;
      
      const data = await catalogAPI.searchProducts({
        q: searchQuery,
        page: currentPage,
        limit: 20,
      });
      
      products = data.products || [];
      totalPages = Math.ceil((data.count || 0) / 20);
    } catch (err) {
      error = err.message;
      console.error('Search failed:', err);
    } finally {
      loading = false;
    }
  }

  function viewProduct(productId) {
    router.navigate(`product/${productId}`);
  }
</script>

<div class="container mx-auto px-4 py-8">
  <!-- Search Bar -->
  <div class="mb-8">
    <div class="flex gap-2">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search products..."
        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        on:keydown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button
        on:click={handleSearch}
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  </div>

  {#if loading}
    <div class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Loading...</p>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      Error: {error}
    </div>
  {:else}
    <!-- Categories -->
    {#if !showSearchResults}
      <div class="mb-8">
        <h2 class="text-xl font-bold mb-4">Categories</h2>
        <div class="flex flex-wrap gap-2">
          {#each categories as category}
            <button
              on:click={() => loadCategoryProducts(category, 1)}
              class="px-4 py-2 rounded-lg {currentCategory === category 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
            >
              {category}
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Products Grid -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">
        {#if showSearchResults}
          Search Results
        {:else}
          {currentCategory || 'All Products'}
        {/if}
      </h2>
      
      {#if products.length === 0}
        <p class="text-gray-600 text-center py-12">No products found.</p>
      {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {#each products as product}
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div class="aspect-w-1 aspect-h-1 bg-gray-200">
                {#if product.images && product.images.length > 0}
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    class="w-full h-48 object-cover"
                    on:error={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                    }}
                  />
                {:else}
                  <div class="w-full h-48 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                {/if}
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">{product.description || ''}</p>
                <button
                  on:click={() => viewProduct(product.product_id)}
                  class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View Details
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="flex justify-center items-center gap-2">
        <button
          on:click={() => {
            if (currentPage > 1) {
              const newPage = currentPage - 1;
              if (showSearchResults) {
                currentPage = newPage;
                handleSearch();
              } else {
                loadCategoryProducts(currentCategory, newPage);
              }
            }
          }}
          disabled={currentPage === 1}
          class="px-4 py-2 border rounded {currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}"
        >
          Previous
        </button>
        
        <span class="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        
        <button
          on:click={() => {
            if (currentPage < totalPages) {
              const newPage = currentPage + 1;
              if (showSearchResults) {
                currentPage = newPage;
                handleSearch();
              } else {
                loadCategoryProducts(currentCategory, newPage);
              }
            }
          }}
          disabled={currentPage === totalPages}
          class="px-4 py-2 border rounded {currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}"
        >
          Next
        </button>
      </div>
    {/if}
  {/if}
</div>

