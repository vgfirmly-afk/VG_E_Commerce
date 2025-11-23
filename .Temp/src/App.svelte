<script>
  import { onMount } from 'svelte';
  import { router } from './lib/router.js';
  import Header from './components/Header.svelte';
  import Home from './pages/Home.svelte';
  import ProductDetail from './pages/ProductDetail.svelte';
  import Cart from './pages/Cart.svelte';
  import Login from './pages/Login.svelte';
  import Signup from './pages/Signup.svelte';

  let currentRoute = 'home';

  onMount(() => {
    router.init();
    currentRoute = router.getCurrentRoute();
    const unsubscribe = router.subscribe((route) => {
      currentRoute = route;
    });
    return unsubscribe;
  });

  $: route = currentRoute || 'home';
</script>

<div class="min-h-screen bg-gray-50">
  <Header />
  <main>
    {#if route === 'home' || route === ''}
      <Home />
    {:else if route.startsWith('product/')}
      <ProductDetail productId={route.split('/')[1]} />
    {:else if route === 'cart'}
      <Cart />
    {:else if route === 'login'}
      <Login />
    {:else if route === 'signup'}
      <Signup />
    {:else}
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold">Page not found</h1>
      </div>
    {/if}
  </main>
</div>

