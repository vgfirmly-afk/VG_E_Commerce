import { API_BASE_URLS } from '../config.js';

const API_BASE = API_BASE_URLS.AUTH;

// Helper function for API calls with credentials
async function fetchWithCredentials(url, options = {}) {
	return fetch(url, {
		...options,
		credentials: 'include', // Include cookies in requests
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			...options.headers
		}
	});
}

export async function register(name, email, password, phoneNumber, address, fullName) {
	const response = await fetchWithCredentials(`${API_BASE}/api/v1/auth/register`, {
		method: 'POST',
		body: JSON.stringify({
			name,
			email,
			password,
			phoneNumber,
			address,
			fullName
		})
	});

	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message || 'Registration failed');
	}
	return data;
}

export async function login(email, password) {
	const response = await fetchWithCredentials(`${API_BASE}/api/v1/auth/login`, {
		method: 'POST',
		body: JSON.stringify({ email, password })
	});

	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message || 'Login failed');
	}
	// Tokens are in httpOnly cookies, just return user data
	return data;
}

export async function refreshToken() {
	// Refresh token is in httpOnly cookie, no need to pass it
	const response = await fetchWithCredentials(`${API_BASE}/api/v1/auth/token/refresh`, {
		method: 'POST',
		body: JSON.stringify({}) // Backend will read from cookie
	});

	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message || 'Token refresh failed');
	}
	return data;
}

export async function logout() {
	// Logout - backend will clear cookies
	const response = await fetchWithCredentials(`${API_BASE}/api/v1/auth/logout`, {
		method: 'POST',
		body: JSON.stringify({}) // Backend will read refresh token from cookie
	});

	const data = await response.json();
	return data;
}

export async function getMe() {
	// Get current user - uses httpOnly cookie for auth
	const response = await fetchWithCredentials(`${API_BASE}/api/v1/auth/me`, {
		method: 'GET'
	});

	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message || 'Failed to get user info');
	}
	return data;
}
