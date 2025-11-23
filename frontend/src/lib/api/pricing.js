import { API_BASE_URLS } from '../config.js';

const API_BASE = API_BASE_URLS.PRICING;

async function fetchWithCredentials(url, options = {}) {
	return fetch(url, {
		...options,
		credentials: 'include',
		headers: {
			'Accept': 'application/json',
			...options.headers
		}
	});
}

export async function getPrice(skuId) {
	const response = await fetchWithCredentials(`${API_BASE}/api/v1/prices/${skuId}`, {
		method: 'GET'
	});

	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message || 'Failed to get price');
	}
	return data;
}

export async function getProductPrices(productId) {
	const response = await fetchWithCredentials(`${API_BASE}/api/v1/prices/product/${productId}`, {
		method: 'GET'
	});

	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message || 'Failed to get product prices');
	}
	return data;
}
