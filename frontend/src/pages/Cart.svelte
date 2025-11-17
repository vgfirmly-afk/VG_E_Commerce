<script>
  import { onMount } from 'svelte';
  import { router } from '../lib/router.js';
  import { cartStore } from '../lib/stores/cart.js';
  import { authStore } from '../lib/stores/auth.js';
  import * as catalogAPI from '../lib/api/catalog.js';
  import * as pricingAPI from '../lib/api/pricing.js';

  let loading = true;
  let error = null;
  let cartItems = [];
  let cart = null;
  let total = 0;
  let updating = {};

  $: isAuthenticated = $authStore.isAuthenticated;

  onMount(async () => {
    if (!isAuthenticated) {
      router.navigate('login');
      return;
    }
    await loadCart();
  });

  async function loadCart() {
    try {
      loading = true;
      error = null;
      await cartStore.loadCart();
      
      cart = $cartStore.cart;
      cartItems = $cartStore.items || [];
      total = $cartStore.total || 0;
      
      // Load product details for each item
      for (const item of cartItems) {
        try {
          if (item.product_id) {
            const product = await catalogAPI.getProduct(item.product_id);
            item.product = product;
          }
          if (item.sku_id) {
            const priceData = await pricingAPI.getPrice(item.sku_id).catch(() => ({ price: 0 }));
            item.price = priceData.price || 0;
          }
        } catch (err) {
          console.error(`Failed to load details for item ${item.item_id}:`, err);
        }
      }
    } catch (err) {
      error = err.message;
      console.error('Failed to load cart:', err);
    } finally {
      loading = false;
    }
  }

  async function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) {
      await removeItem(itemId);
      return;
    }

    updating[itemId] = true;
    try {
      const result = await cartStore.updateItem(cart.cart_id, itemId, newQuantity);
      if (result.success) {
        await loadCart();
      } else {
        alert(result.error || 'Failed to update quantity');
      }
    } catch (err) {
      alert(err.message || 'Failed to update quantity');
    } finally {
      updating[itemId] = false;
    }
  }

  async function removeItem(itemId) {
    if (!confirm('Remove this item from cart?')) {
      return;
    }

    updating[itemId] = true;
    try {
      const result = await cartStore.removeItem(cart.cart_id, itemId);
      if (result.success) {
        await loadCart();
      } else {
        alert(result.error || 'Failed to remove item');
      }
    } catch (err) {
      alert(err.message || 'Failed to remove item');
    } finally {
      updating[itemId] = false;
    }
  }

  async function clearCart() {
    if (!confirm('Clear all items from cart?')) {
      return;
    }

    try {
      const result = await cartStore.clearCart(cart.cart_id);
      if (result.success) {
        await loadCart();
      } else {
        alert(result.error || 'Failed to clear cart');
      }
    } catch (err) {
      alert(err.message || 'Failed to clear cart');
    }
  }

  function viewProduct(productId) {
    router.navigate(`product/${productId}`);
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Shopping Cart</h1>

  {#if loading}
    <div class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Loading cart...</p>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      Error: {error}
    </div>
  {:else if !cart || cartItems.length === 0}
    <div class="bg-white rounded-lg shadow-lg p-12 text-center">
      <p class="text-xl text-gray-600 mb-4">Your cart is empty</p>
      <button
        on:click={() => router.navigate('home')}
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Continue Shopping
      </button>
    </div>
  {:else}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2 space-y-4">
        {#each cartItems as item}
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex gap-4">
              <!-- Product Image -->
              <div class="w-24 h-24 flex-shrink-0">
                {#if item.product?.images && item.product.images.length > 0}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title || 'Product'}
                    class="w-full h-full object-cover rounded"
                    on:error={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                    }}
                  />
                {:else}
                  <div class="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                    No Image
                  </div>
                {/if}
              </div>

              <!-- Product Info -->
              <div class="flex-1">
                <h3
                  class="font-semibold text-lg mb-2 cursor-pointer hover:text-blue-600"
                  on:click={() => item.product_id && viewProduct(item.product_id)}
                >
                  {item.product?.title || `Item ${item.item_id}`}
                </h3>
                {#if item.sku_code}
                  <p class="text-sm text-gray-600 mb-2">SKU: {item.sku_code}</p>
                {/if}
                <p class="text-lg font-bold text-green-600 mb-4">
                  ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </p>

                <!-- Quantity Controls -->
                <div class="flex items-center gap-4">
                  <label class="text-sm font-semibold">Quantity:</label>
                  <div class="flex items-center gap-2">
                    <button
                      on:click={() => updateQuantity(item.item_id, (item.quantity || 1) - 1)}
                      disabled={updating[item.item_id]}
                      class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span class="px-4 py-1 border rounded min-w-[3rem] text-center">
                      {item.quantity || 1}
                    </span>
                    <button
                      on:click={() => updateQuantity(item.item_id, (item.quantity || 1) + 1)}
                      disabled={updating[item.item_id]}
                      class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  <button
                    on:click={() => removeItem(item.item_id)}
                    disabled={updating[item.item_id]}
                    class="ml-auto text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        {/each}

        <button
          on:click={clearCart}
          class="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50"
        >
          Clear Cart
        </button>
      </div>

      <!-- Cart Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-lg p-6 sticky top-4">
          <h2 class="text-xl font-bold mb-4">Order Summary</h2>
          <div class="space-y-2 mb-4">
            <div class="flex justify-between">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
              <span>Shipping:</span>
              <span>Calculated at checkout</span>
            </div>
            <div class="border-t pt-2 mt-2">
              <div class="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <button
            class="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            Proceed to Checkout
          </button>
          <button
            on:click={() => router.navigate('home')}
            class="w-full mt-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

