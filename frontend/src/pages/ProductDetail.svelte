<script>
  import { onMount } from 'svelte';
  import { router } from '../lib/router.js';
  import { cartStore } from '../lib/stores/cart.js';
  import { authStore } from '../lib/stores/auth.js';
  import * as catalogAPI from '../lib/api/catalog.js';
  import * as inventoryAPI from '../lib/api/inventory.js';
  import * as pricingAPI from '../lib/api/pricing.js';

  export let productId;

  let product = null;
  let skus = [];
  let skuData = {}; // Store stock and price for each SKU
  let loading = true;
  let error = null;
  let selectedSku = null;
  let quantity = 1;
  let addingToCart = false;

  $: isAuthenticated = $authStore.isAuthenticated;

  onMount(async () => {
    await loadProduct();
  });

  async function loadProduct() {
    try {
      loading = true;
      error = null;
      
      product = await catalogAPI.getProduct(productId);
      skus = product.skus || [];
      
      // Load stock and price for each SKU
      for (const sku of skus) {
        try {
          const [stockData, priceData] = await Promise.all([
            inventoryAPI.getStock(sku.sku_id).catch(() => ({ available: 0 })),
            pricingAPI.getPrice(sku.sku_id).catch(() => ({ price: 0 })),
          ]);
          
          skuData[sku.sku_id] = {
            stock: stockData.available || stockData.quantity || 0,
            price: priceData.price || 0,
          };
        } catch (err) {
          console.error(`Failed to load data for SKU ${sku.sku_id}:`, err);
          skuData[sku.sku_id] = { stock: 0, price: 0 };
        }
      }
      
      // Select first SKU by default
      if (skus.length > 0) {
        selectedSku = skus[0];
      }
    } catch (err) {
      error = err.message;
      console.error('Failed to load product:', err);
    } finally {
      loading = false;
    }
  }

  function selectSku(sku) {
    selectedSku = sku;
    quantity = 1;
  }

  async function addToCart() {
    if (!selectedSku) {
      alert('Please select a SKU');
      return;
    }

    if (!isAuthenticated) {
      router.navigate('login');
      return;
    }

    const skuInfo = skuData[selectedSku.sku_id];
    if (skuInfo.stock < quantity) {
      alert('Insufficient stock');
      return;
    }

    addingToCart = true;
    try {
      // Load cart first
      await cartStore.loadCart();
      const cart = $cartStore.cart;
      
      if (!cart || !cart.cart_id) {
        // Create cart by getting it
        await cartStore.loadCart();
        const newCart = $cartStore.cart;
        if (!newCart || !newCart.cart_id) {
          throw new Error('Failed to get cart');
        }
      }

      const result = await cartStore.addItem($cartStore.cart.cart_id, {
        sku_id: selectedSku.sku_id,
        quantity: quantity,
        product_id: productId,
        sku_code: selectedSku.sku_code,
      });

      if (result.success) {
        alert('Item added to cart!');
        router.navigate('cart');
      } else {
        alert(result.error || 'Failed to add item to cart');
      }
    } catch (err) {
      alert(err.message || 'Failed to add item to cart');
      console.error('Add to cart error:', err);
    } finally {
      addingToCart = false;
    }
  }

  function getSkuPrice(skuId) {
    return skuData[skuId]?.price || 0;
  }

  function getSkuStock(skuId) {
    return skuData[skuId]?.stock || 0;
  }
</script>

<div class="container mx-auto px-4 py-8">
  {#if loading}
    <div class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Loading product...</p>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      Error: {error}
    </div>
    <button
      on:click={() => router.navigate('home')}
      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Back to Home
    </button>
  {:else if product}
    <button
      on:click={() => router.navigate('home')}
      class="mb-4 text-blue-600 hover:underline"
    >
      ← Back to Home
    </button>

    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="md:flex">
        <!-- Product Images -->
        <div class="md:w-1/2 p-8">
          {#if product.media}
            {@const media = typeof product.media === 'string' ? JSON.parse(product.media) : product.media}
            {#if media.product_images && media.product_images.length > 0}
              <img
                src={media.product_images[0].url || media.product_images[0]}
                alt={product.title}
                class="w-full h-auto rounded-lg"
                on:error={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                }}
              />
            {:else if media.image_url}
              <img
                src={media.image_url}
                alt={product.title}
                class="w-full h-auto rounded-lg"
                on:error={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                }}
              />
            {:else}
              <div class="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-400 rounded-lg">
                No Image Available
              </div>
            {/if}
          {:else if product.images && product.images.length > 0}
            <img
              src={product.images[0]}
              alt={product.title}
              class="w-full h-auto rounded-lg"
              on:error={(e) => {
                e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
              }}
            />
          {:else}
            <div class="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-400 rounded-lg">
              No Image Available
            </div>
          {/if}
        </div>

        <!-- Product Info -->
        <div class="md:w-1/2 p-8">
          <h1 class="text-3xl font-bold mb-4">{product.title}</h1>
          <p class="text-gray-600 mb-6">{product.description || 'No description available'}</p>

          {#if selectedSku}
            <div class="mb-6">
              <p class="text-2xl font-bold text-green-600 mb-2">
                ${getSkuPrice(selectedSku.sku_id).toFixed(2)}
              </p>
              <p class="text-sm text-gray-600">
                Stock: {getSkuStock(selectedSku.sku_id)} available
              </p>
            </div>
          {/if}

          <!-- SKU Selection -->
          {#if skus.length > 0}
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-3">Available Options:</h3>
              <div class="space-y-2">
                {#each skus as sku}
                  {@const skuInfo = skuData[sku.sku_id] || { stock: 0, price: 0 }}
                  <button
                    on:click={() => selectSku(sku)}
                    class="w-full text-left p-4 border-2 rounded-lg transition-all {selectedSku?.sku_id === sku.sku_id 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'}"
                  >
                    <div class="flex justify-between items-center">
                      <div>
                        <p class="font-semibold">
                          {sku.sku_code || `SKU ${sku.sku_id}`}
                        </p>
                        {#if sku.attributes}
                          <p class="text-sm text-gray-600">
                            {Object.entries(sku.attributes).map(([key, value]) => `${key}: ${value}`).join(', ')}
                          </p>
                        {/if}
                      </div>
                      <div class="text-right">
                        <p class="font-bold text-green-600">${skuInfo.price.toFixed(2)}</p>
                        <p class="text-xs text-gray-500">
                          {skuInfo.stock > 0 ? `${skuInfo.stock} in stock` : 'Out of stock'}
                        </p>
                      </div>
                    </div>
                  </button>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Quantity and Add to Cart -->
          {#if selectedSku}
            {@const skuInfo = skuData[selectedSku.sku_id] || { stock: 0, price: 0 }}
            <div class="mb-6">
              <label for="quantity" class="block text-sm font-semibold mb-2">
                Quantity:
              </label>
              <input
                id="quantity"
                type="number"
                bind:value={quantity}
                min="1"
                max={skuInfo.stock}
                class="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              on:click={addToCart}
              disabled={addingToCart || skuInfo.stock === 0 || quantity > skuInfo.stock}
              class="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {#if addingToCart}
                Adding to Cart...
              {:else if skuInfo.stock === 0}
                Out of Stock
              {:else}
                Add to Cart
              {/if}
            </button>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

