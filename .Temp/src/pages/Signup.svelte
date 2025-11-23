<script>
  import { authStore } from '../lib/stores/auth.js';
  import { router } from '../lib/router.js';

  let name = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let phoneNumber = '';
  let address = '';
  let fullName = '';
  let error = '';
  let loading = false;

  async function handleSignup() {
    if (!name || !email || !password || !confirmPassword) {
      error = 'Please fill in all required fields';
      return;
    }

    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }

    if (password.length < 6) {
      error = 'Password must be at least 6 characters';
      return;
    }

    loading = true;
    error = '';

    const result = await authStore.register({
      name,
      email,
      password,
      phoneNumber: phoneNumber || undefined,
      address: address || undefined,
      fullName: fullName || name, // Use name as fallback if fullName not provided
    });
    
    if (result.success) {
      router.navigate('home');
    } else {
      error = result.error || 'Registration failed';
    }
    
    loading = false;
  }
</script>

<div class="container mx-auto px-4 py-12 max-w-md">
  <div class="bg-white rounded-lg shadow-lg p-8">
    <h1 class="text-3xl font-bold mb-6 text-center">Sign Up</h1>
    
    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    {/if}

    <form on:submit|preventDefault={handleSignup}>
      <div class="mb-4">
        <label for="name" class="block text-gray-700 text-sm font-bold mb-2">
          Name <span class="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          bind:value={name}
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your name"
        />
      </div>

      <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2">
          Email <span class="text-red-500">*</span>
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

      <div class="mb-4">
        <label for="phoneNumber" class="block text-gray-700 text-sm font-bold mb-2">
          Phone Number
        </label>
        <input
          id="phoneNumber"
          type="tel"
          bind:value={phoneNumber}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="+1234567890"
        />
      </div>

      <div class="mb-4">
        <label for="address" class="block text-gray-700 text-sm font-bold mb-2">
          Address
        </label>
        <input
          id="address"
          type="text"
          bind:value={address}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="123 Main St"
        />
      </div>

      <div class="mb-4">
        <label for="fullName" class="block text-gray-700 text-sm font-bold mb-2">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          bind:value={fullName}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Admin User"
        />
      </div>

      <div class="mb-4">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2">
          Password <span class="text-red-500">*</span>
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

      <div class="mb-6">
        <label for="confirmPassword" class="block text-gray-700 text-sm font-bold mb-2">
          Confirm Password <span class="text-red-500">*</span>
        </label>
        <input
          id="confirmPassword"
          type="password"
          bind:value={confirmPassword}
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Confirm your password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {#if loading}
          Creating account...
        {:else}
          Sign Up
        {/if}
      </button>
    </form>

    <p class="mt-4 text-center text-gray-600">
      Already have an account? 
      <a
        href="#login"
        on:click={() => router.navigate('login')}
        class="text-blue-600 hover:underline"
      >
        Login
      </a>
    </p>
  </div>
</div>

