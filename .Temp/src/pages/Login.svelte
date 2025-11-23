<script>
  import { authStore } from '../lib/stores/auth.js';
  import { router } from '../lib/router.js';

  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleLogin() {
    if (!email || !password) {
      error = 'Please fill in all fields';
      return;
    }

    loading = true;
    error = '';

    const result = await authStore.login(email, password);
    
    if (result.success) {
      router.navigate('home');
    } else {
      error = result.error || 'Login failed';
    }
    
    loading = false;
  }
</script>

<div class="container mx-auto px-4 py-12 max-w-md">
  <div class="bg-white rounded-lg shadow-lg p-8">
    <h1 class="text-3xl font-bold mb-6 text-center">Login</h1>
    
    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    {/if}

    <form on:submit|preventDefault={handleLogin}>
      <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          bind:value={email}
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
        />
      </div>

      <div class="mb-6">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          bind:value={password}
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {#if loading}
          Logging in...
        {:else}
          Login
        {/if}
      </button>
    </form>

    <p class="mt-4 text-center text-gray-600">
      Don't have an account? 
      <a
        href="#signup"
        on:click={() => router.navigate('signup')}
        class="text-blue-600 hover:underline"
      >
        Sign up
      </a>
    </p>
  </div>
</div>

