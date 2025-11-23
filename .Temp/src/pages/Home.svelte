<script>
  import { onMount } from 'svelte';
  import { router } from '../lib/router.js';
  import * as catalogAPI from '../lib/api/catalog.js';

  let categories = [];
  let productsByCategory = {};
  let allProducts = [];
  let loading = true;
  let error = null;
  let searchQuery = '';
  let currentCategory = 'All';
  let currentPage = 1;
  let pageInput = '1';
  let totalPages = 1;
  let totalCount = 0;
  let products = [];
  let showSearchResults = false;
  let limit = 20;

  onMount(async () => {
    await loadDefaultProducts();
  });

  // Load top 20 products by default and group by category
  async function loadDefaultProducts() {
    try {
      loading = true;
      error = null;
      showSearchResults = false;
      currentCategory = 'All';
      currentPage = 1;
      pageInput = '1';
      
      // Get top 20 products (no category filter)
      const data = await catalogAPI.getProducts({
        page: 1,
        limit: 20,
      });
      
      allProducts = data.products || [];
      totalCount = data.count || 0;
      totalPages = Math.ceil(totalCount / limit);
      
      // Group products by category
      productsByCategory = {};
      allProducts.forEach(product => {
        const productCategories = product.categories || [];
        if (productCategories.length === 0) {
          // If no category, put in "Uncategorized"
          if (!productsByCategory['Uncategorized']) {
            productsByCategory['Uncategorized'] = [];
          }
          productsByCategory['Uncategorized'].push(product);
        } else {
          productCategories.forEach(cat => {
            if (!productsByCategory[cat]) {
              productsByCategory[cat] = [];
            }
            productsByCategory[cat].push(product);
          });
        }
      });
      
      categories = Object.keys(productsByCategory).sort();
      products = allProducts;
    } catch (err) {
      error = err.message;
      console.error('Failed to load default products:', err);
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
      pageInput = String(page);
      showSearchResults = false;
      
      if (category === 'All') {
        // Load all products with pagination
        const data = await catalogAPI.getProducts({
          page,
          limit: limit,
        });
        
        products = data.products || [];
        totalCount = data.count || 0;
        totalPages = Math.ceil(totalCount / limit);
      } else {
        // Load products for specific category
        const data = await catalogAPI.getProducts({
          category,
          page,
          limit: limit,
        });
        
        products = data.products || [];
        totalCount = data.count || 0;
        totalPages = Math.ceil(totalCount / limit);
      }
    } catch (err) {
      error = err.message;
      console.error('Failed to load category products:', err);
    } finally {
      loading = false;
    }
  }

  async function handleSearch(page = currentPage) {
    if (!searchQuery.trim()) {
      await loadDefaultProducts();
      return;
    }

    try {
      loading = true;
      error = null;
      showSearchResults = true;
      currentCategory = '';
      currentPage = page;
      pageInput = String(page);
      
      const data = await catalogAPI.searchProducts({
        q: searchQuery,
        page: page,
        limit: limit,
      });
      
      products = data.products || [];
      totalCount = data.count || 0;
      totalPages = Math.ceil(totalCount / limit);
    } catch (err) {
      error = err.message;
      console.error('Search failed:', err);
    } finally {
      loading = false;
    }
  }

  function goToPage() {
    const page = parseInt(pageInput, 10);
    if (isNaN(page) || page < 1 || page > totalPages) {
      pageInput = String(currentPage);
      if (!isNaN(page) && page > 0) {
        alert(`Please enter a page number between 1 and ${totalPages}`);
      }
      return;
    }
    
    if (showSearchResults) {
      handleSearch(page);
    } else {
      loadCategoryProducts(currentCategory, page);
    }
  }
  
  // Sync pageInput with currentPage
  $: if (currentPage && pageInput !== String(currentPage)) {
    pageInput = String(currentPage);
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
          <button
            on:click={() => loadCategoryProducts('All', 1)}
            class="px-4 py-2 rounded-lg {currentCategory === 'All' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
          >
            All
          </button>
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
      
      <!-- Products by Category View (Default - First Load) -->
      {#if currentCategory === 'All' && currentPage === 1 && Object.keys(productsByCategory).length > 0 && !showSearchResults}
        <div class="space-y-8 mb-8">
          {#each Object.entries(productsByCategory) as [category, categoryProducts]}
            <div>
              <h2 class="text-2xl font-bold mb-4">{category}</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {#each categoryProducts as product}
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
            </div>
          {/each}
        </div>
      {:else}
        <!-- Single Category or All Products List View -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold mb-4">
            {currentCategory || 'All Products'} ({totalCount} items)
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
      {/if}
    {:else}
      <!-- Search Results -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">
          Search Results for "{searchQuery}" ({totalCount} items)
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
    {/if}

    <!-- Pagination -->
    {#if totalPages > 1 && (showSearchResults || currentCategory !== 'All' || currentPage > 1)}
      <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
        <div class="flex items-center gap-2">
          <button
            on:click={() => {
              if (currentPage > 1) {
                const newPage = currentPage - 1;
                if (showSearchResults) {
                  handleSearch(newPage);
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
          
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">Page</span>
            <input
              type="number"
              bind:value={pageInput}
              min="1"
              max={totalPages}
              class="w-16 px-2 py-2 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              on:keydown={(e) => e.key === 'Enter' && goToPage()}
              on:blur={goToPage}
            />
            <span class="text-sm text-gray-600">of {totalPages}</span>
          </div>
          
          <button
            on:click={() => {
              if (currentPage < totalPages) {
                const newPage = currentPage + 1;
                if (showSearchResults) {
                  handleSearch(newPage);
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
        
        <div class="text-sm text-gray-600">
          Showing {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, totalCount)} of {totalCount} products
        </div>
      </div>
    {/if}
  {/if}
</div>

