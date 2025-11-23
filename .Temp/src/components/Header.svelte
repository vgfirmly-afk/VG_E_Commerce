<script>
  import { authStore } from '../lib/stores/auth.js';
  import { router } from '../lib/router.js';
  import { cartStore } from '../lib/stores/cart.js';
  import { onMount } from 'svelte';

  let cartItemCount = 0;

  $: isAuthenticated = $authStore.isAuthenticated;
  $: user = $authStore.user;
  $: authLoading = $authStore.loading;

  onMount(() => {
    cartStore.loadCart();
    const unsubscribe = cartStore.subscribe((state) => {
      cartItemCount = state.items?.length || 0;
    });
    return unsubscribe;
  });

  function handleLogout() {
    authStore.logout();
    router.navigate('home');
  }
</script>

<header class="bg-white shadow-md">
  <div class="container mx-auto px-4 py-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-8">
        <h1 class="text-2xl font-bold text-blue-600 cursor-pointer" on:click={() => router.navigate('home')}>
          E-Commerce Store
        </h1>
      </div>
      
      <div class="flex items-center space-x-4">
        {#if authLoading}
          <span class="text-gray-500">Loading...</span>
        {:else if isAuthenticated && user}
          <span class="text-gray-700">Hello, {user.name || user.email}</span>
          <button
            on:click={handleLogout}
            class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        {:else}
          <button
            on:click={() => router.navigate('login')}
            class="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
          >
            Login
          </button>
          <button
            on:click={() => router.navigate('signup')}
            class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Sign Up
          </button>
        {/if}
        
        <button
          on:click={() => router.navigate('cart')}
          class="relative px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
        >
          Cart
          {#if cartItemCount > 0}
            <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          {/if}
        </button>
      </div>
    </div>
  </div>
</header>

