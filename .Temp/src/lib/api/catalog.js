import { API_CONFIG } from "../config.js";
import { fetchJSON } from "./fetchClient.js";

const CATALOG_URL = API_CONFIG.CATALOG_WORKER_URL;

export async function getProducts({
  q = "",
  category = "",
  page = 1,
  limit = 20,
} = {}) {
  const params = new URLSearchParams();
  if (q) params.append("q", q);
  if (category) params.append("category", category);
  params.append("page", page);
  params.append("limit", limit);

  return await fetchJSON(`${CATALOG_URL}/api/v1/products?${params}`);
}

export async function getProduct(productId) {
  return await fetchJSON(`${CATALOG_URL}/api/v1/products/${productId}`);
}

export async function getHomePage(categories = [], limit = 10) {
  const params = new URLSearchParams();
  if (categories.length > 0) {
    params.append("categories", categories.join(","));
  }
  params.append("limit", limit);

  return await fetchJSON(`${CATALOG_URL}/api/v1/home?${params}`);
}

export async function searchProducts({
  q = "",
  category = "",
  page = 1,
  limit = 20,
} = {}) {
  const params = new URLSearchParams();
  params.append("q", q);
  if (category) params.append("category", category);
  params.append("page", page);
  params.append("limit", limit);

  return await fetchJSON(`${CATALOG_URL}/api/v1/search?${params}`);
}

export function getProductImageUrl(productId, imageId) {
  return `${CATALOG_URL}/api/v1/products/${productId}/images/${imageId}`;
}
