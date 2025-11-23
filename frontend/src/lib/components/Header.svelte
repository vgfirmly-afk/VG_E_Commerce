<script>
	import { onMount } from 'svelte';
	import { auth, guestSession } from '$lib/stores/auth.js';
	import { cart } from '$lib/stores/cart.js';
	import { getCart } from '$lib/api/cart.js';
	import { logout } from '$lib/api/auth.js';
	import { goto } from '$app/navigation';

	let showAuthModal = false;
	let authMode = 'login';
	let loginEmail = '';
	let loginPassword = '';
	let registerData = {
		name: '',
		email: '',
		password: '',
		phoneNumber: '',
		address: '',
		fullName: ''
	};
	let error = '';
	let loading = false;

	$: isAuthenticated = $auth.isAuthenticated;
	$: user = $auth.user;
	$: cartItemCount = $cart.itemCount;
	$: authLoading = $auth.loading;

	async function handleLogin() {
		loading = true;
		error = '';
		try {
			const { login } = await import('$lib/api/auth.js');
			const response = await login(loginEmail, loginPassword);
			// User data is in response, tokens are in httpOnly cookies
			auth.login(response.user || response);
			showAuthModal = false;
			loginEmail = '';
			loginPassword = '';
			await loadCart();
			
			// Check for return URL after successful login
			if (typeof window !== 'undefined') {
				const returnUrl = sessionStorage.getItem('returnUrl');
				if (returnUrl) {
					sessionStorage.removeItem('returnUrl');
					goto(returnUrl);
					return;
				}
			}
		} catch (err) {
			error = err.message || 'Login failed';
		} finally {
			loading = false;
		}
	}

	async function handleRegister() {
		loading = true;
		error = '';
		try {
			const { register, login } = await import('$lib/api/auth.js');
			await register(
				registerData.name,
				registerData.email,
				registerData.password,
				registerData.phoneNumber,
				registerData.address,
				registerData.fullName
			);
			// Auto login after registration
			const loginResponse = await login(registerData.email, registerData.password);
			auth.login(loginResponse.user || loginResponse);
			showAuthModal = false;
			registerData = {
				name: '',
				email: '',
				password: '',
				phoneNumber: '',
				address: '',
				fullName: ''
			};
			await loadCart();
			
			// Check for return URL after successful registration/login
			if (typeof window !== 'undefined') {
				const returnUrl = sessionStorage.getItem('returnUrl');
				if (returnUrl) {
					sessionStorage.removeItem('returnUrl');
					goto(returnUrl);
					return;
				}
			}
		} catch (err) {
			error = err.message || 'Registration failed';
		} finally {
			loading = false;
		}
	}

	async function handleLogout() {
		try {
			await logout();
			auth.logout();
			cart.clear();
			goto('/');
		} catch (err) {
			console.error('Logout error:', err);
			// Still clear local state even if API call fails
			auth.logout();
			cart.clear();
			goto('/');
		}
	}

	async function loadCart() {
		try {
			// Wait for auth to finish loading
			if ($auth.loading) {
				return;
			}
			const userId = $auth.user?.id || null;
			const sessionId = $guestSession || null;
			if (userId || sessionId) {
				const cartData = await getCart(userId, sessionId);
				cart.setCart(cartData);
			}
		} catch (err) {
			console.error('Failed to load cart:', err);
		}
	}

	onMount(() => {
		loadCart();
		
		// Check for login query parameter
		if (typeof window !== 'undefined') {
			const urlParams = new URLSearchParams(window.location.search);
			if (urlParams.get('login') === 'true') {
				authMode = 'login';
				showAuthModal = true;
				error = '';
			}
		}
	});
</script>

<header class="bg-white shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
	<div class="container mx-auto px-4 py-4">
		<div class="flex items-center justify-between">
			<!-- Logo -->
			<a href="/" class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transform transition-transform duration-200">
				VG E-Com
			</a>

			<!-- Navigation -->
			<nav class="flex items-center gap-6">
				<a href="/" class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group">
					Home
					<span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
				</a>
				
				{#if authLoading}
					<div class="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
				{:else if isAuthenticated}
					<a href="/orders" class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group">
						My Orders
						<span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
					</a>
					<div class="flex items-center gap-3">
						<span class="text-gray-700 font-medium">Hello, {user?.name || user?.email || 'User'}</span>
						<button
							on:click={handleLogout}
							class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 active:scale-95 transform transition-all duration-200 font-medium shadow-md hover:shadow-lg"
						>
							Logout
						</button>
					</div>
				{:else}
					<button
						on:click={() => {
							authMode = 'login';
							showAuthModal = true;
							error = '';
						}}
						class="btn-primary"
					>
						Login
					</button>
					<button
						on:click={() => {
							authMode = 'register';
							showAuthModal = true;
							error = '';
						}}
						class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 active:scale-95 transform transition-all duration-200 font-medium shadow-md hover:shadow-lg"
					>
						Sign Up
					</button>
				{/if}

				<!-- Cart -->
				<a href="/cart" class="relative group">
					<svg
						class="w-7 h-7 text-gray-700 group-hover:text-blue-600 transition-colors duration-200"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
						/>
					</svg>
					{#if cartItemCount > 0}
						<span
							class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce shadow-lg"
						>
							{cartItemCount}
						</span>
					{/if}
				</a>
			</nav>
		</div>
	</div>
</header>

<!-- Auth Modal -->
{#if showAuthModal}
	<div
		class="modal-overlay"
		on:click={() => {
			showAuthModal = false;
			error = '';
		}}
		role="button"
		tabindex="0"
		on:keydown={(e) => e.key === 'Escape' && (showAuthModal = false)}
	>
		<div
			class="modal-content"
			on:click|stopPropagation
			role="dialog"
			aria-modal="true"
		>
			<div class="flex justify-between items-center mb-6">
				<h2 class="text-3xl font-bold text-gray-800">
					{authMode === 'login' ? 'Welcome Back' : 'Create Account'}
				</h2>
				<button
					on:click={() => {
						showAuthModal = false;
						error = '';
					}}
					class="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
				>
					×
				</button>
			</div>

			{#if error}
				<div class="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 animate-fade-in">
					<p class="font-medium">{error}</p>
				</div>
			{/if}

			{#if authMode === 'login'}
				<form on:submit|preventDefault={handleLogin} class="space-y-4">
					<div>
						<label for="login-email" class="block text-sm font-medium text-gray-700 mb-2">
							Email
						</label>
						<input
							id="login-email"
							type="email"
							bind:value={loginEmail}
							required
							class="input-field"
							placeholder="your@email.com"
						/>
					</div>
					<div>
						<label
							for="login-password"
							class="block text-sm font-medium text-gray-700 mb-2"
						>
							Password
						</label>
						<input
							id="login-password"
							type="password"
							bind:value={loginPassword}
							required
							class="input-field"
							placeholder="••••••••"
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						class="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if loading}
							<span class="flex items-center justify-center gap-2">
								<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								Logging in...
							</span>
						{:else}
							Login
						{/if}
					</button>
				</form>
				<p class="mt-6 text-center text-sm text-gray-600">
					Don't have an account?
					<button
						on:click={() => {
							authMode = 'register';
							error = '';
						}}
						class="text-blue-600 hover:text-blue-700 font-medium ml-1 transition-colors duration-200"
					>
						Sign Up
					</button>
				</p>
			{:else}
				<form on:submit|preventDefault={handleRegister} class="space-y-4">
					<div>
						<label for="reg-name" class="block text-sm font-medium text-gray-700 mb-2">
							Name *
						</label>
						<input
							id="reg-name"
							type="text"
							bind:value={registerData.name}
							required
							class="input-field"
							placeholder="John Doe"
						/>
					</div>
					<div>
						<label for="reg-email" class="block text-sm font-medium text-gray-700 mb-2">
							Email *
						</label>
						<input
							id="reg-email"
							type="email"
							bind:value={registerData.email}
							required
							class="input-field"
							placeholder="your@email.com"
						/>
					</div>
					<div>
						<label
							for="reg-password"
							class="block text-sm font-medium text-gray-700 mb-2"
						>
							Password *
						</label>
						<input
							id="reg-password"
							type="password"
							bind:value={registerData.password}
							required
							class="input-field"
							placeholder="••••••••"
						/>
					</div>
					<div>
						<label
							for="reg-phone"
							class="block text-sm font-medium text-gray-700 mb-2"
						>
							Phone Number
						</label>
						<input
							id="reg-phone"
							type="tel"
							bind:value={registerData.phoneNumber}
							class="input-field"
							placeholder="+1234567890"
						/>
					</div>
					<div>
						<label
							for="reg-address"
							class="block text-sm font-medium text-gray-700 mb-2"
						>
							Address
						</label>
						<input
							id="reg-address"
							type="text"
							bind:value={registerData.address}
							class="input-field"
							placeholder="123 Main St"
						/>
					</div>
					<div>
						<label
							for="reg-fullname"
							class="block text-sm font-medium text-gray-700 mb-2"
						>
							Full Name
						</label>
						<input
							id="reg-fullname"
							type="text"
							bind:value={registerData.fullName}
							class="input-field"
							placeholder="John Doe"
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						class="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 active:scale-95 transform transition-all duration-200 font-medium shadow-md hover:shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if loading}
							<span class="flex items-center justify-center gap-2">
								<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								Creating account...
							</span>
						{:else}
							Sign Up
						{/if}
					</button>
				</form>
				<p class="mt-6 text-center text-sm text-gray-600">
					Already have an account?
					<button
						on:click={() => {
							authMode = 'login';
							error = '';
						}}
						class="text-blue-600 hover:text-blue-700 font-medium ml-1 transition-colors duration-200"
					>
						Login
					</button>
				</p>
			{/if}
		</div>
	</div>
{/if}
