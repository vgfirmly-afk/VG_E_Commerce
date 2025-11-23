import { API_BASE_URLS } from '../config.js';

const API_BASE = API_BASE_URLS.CART;

async function fetchWithCredentials(url, options = {}) {
	return fetch(url, {
		...options,
		credentials: 'include',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			...options.headers
		}
	});
}

export async function getCart(userId, sessionId) {
	const headers = {};
	
	if (userId) {
		headers['X-User-Id'] = userId;
	} else if (sessionId) {
		headers['X-Session-Id'] = sessionId;
	}

	const response = await fetchWithCredentials(`${API_BASE}/api/v1/cart`, {
		method: 'GET',
		headers
	});

	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message || 'Failed to get cart');
	}
	return data;
}

export async function getCartById(cartId) {
	const response = await fetchWithCredentials(`${API_BASE}/api/v1/cart/${cartId}`, {
		method: 'GET'
	});

	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message || 'Failed to get cart');
	}
	return data;
}

export async function addItemToCart(cartId, skuId, quantity) {
	const response = await fetchWithCredentials(`${API_BASE}/api/v1/cart/${cartId}/items`, {
		method: 'POST',
		body: JSON.stringify({
			sku_id: skuId,
			quantity
		})
	});

	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message || 'Failed to add item to cart');
	}
	return data;
}

export async function updateItemQuantity(cartId, itemId, delta) {
	const response = await fetchWithCredentials(`${API_BASE}/api/v1/cart/${cartId}/items/${itemId}`, {
		method: 'PUT',
		body: JSON.stringify({ delta })
	});

	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message || 'Failed to update item quantity');
	}
	return data;
}

export async function removeItemFromCart(cartId, itemId) {
	const response = await fetchWithCredentials(`${API_BASE}/api/v1/cart/${cartId}/items/${itemId}`, {
		method: 'DELETE'
	});

	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message || 'Failed to remove item from cart');
	}
	return data;
}

export async function getCartTotal(cartId) {
	const response = await fetchWithCredentials(`${API_BASE}/api/v1/cart/${cartId}/total`, {
		method: 'GET'
	});

	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message || 'Failed to get cart total');
	}
	return data;
}

export async function clearCart(cartId) {
	const response = await fetchWithCredentials(`${API_BASE}/api/v1/cart/${cartId}`, {
		method: 'DELETE'
	});

	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message || 'Failed to clear cart');
	}
	return data;
}
