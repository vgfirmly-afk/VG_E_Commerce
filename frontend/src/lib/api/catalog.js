import { API_BASE_URLS } from "../config.js";

const API_BASE = API_BASE_URLS.CATALOG;

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

export async function getHomePage(
  categories = "Electronics,Toys,Dress",
  limit = 10,
) {
  const params = new URLSearchParams({ categories, limit: limit.toString() });
  const response = await fetchWithCredentials(
    `${API_BASE}/api/v1/home?${params}`,
    {
      method: "GET",
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch home page");
  }
  return data;
}

export async function getProduct(productId) {
  const response = await fetchWithCredentials(
    `${API_BASE}/api/v1/products/${productId}`,
    {
      method: "GET",
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch product");
  }
  return data;
}

export async function getProductImage(productId, imageId) {
  const response = await fetch(
    `${API_BASE}/api/v1/products/${productId}/images/${imageId}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch product image");
  }
  return response.blob();
}

export async function searchProducts(
  query,
  page = 1,
  limit = 20,
  category = "",
) {
  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    limit: limit.toString(),
  });
  if (category) {
    params.append("category", category);
  }
  const response = await fetchWithCredentials(
    `${API_BASE}/api/v1/search?${params}`,
    {
      method: "GET",
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Search failed");
  }
  return data;
}

export async function getProducts(page = 1, limit = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  const response = await fetchWithCredentials(
    `${API_BASE}/api/v1/products?${params}`,
    {
      method: "GET",
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch products");
  }
  return data;
}

export async function getProductsByCategory(category, page = 1, limit = 20) {
  const params = new URLSearchParams({
    category: category,
    page: page.toString(),
    limit: limit.toString(),
  });
  const response = await fetchWithCredentials(
    `${API_BASE}/api/v1/products?${params}`,
    {
      method: "GET",
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch products by category");
  }
  return data;
}
