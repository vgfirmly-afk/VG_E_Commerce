import { API_BASE_URLS } from "../config.js";

const API_BASE = API_BASE_URLS.INVENTORY;

async function fetchWithCredentials(url, options = {}) {
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  });
}

export async function getSkuStock(skuId) {
  const response = await fetchWithCredentials(
    `${API_BASE}/api/v1/inventory/sku/${skuId}`,
    {
      method: "GET",
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to get SKU stock");
  }
  return data;
}

export async function getProductStock(productId) {
  const response = await fetchWithCredentials(
    `${API_BASE}/api/v1/inventory/product/${productId}`,
    {
      method: "GET",
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to get product stock");
  }
  return data;
}
