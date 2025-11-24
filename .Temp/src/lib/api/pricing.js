import { API_CONFIG } from "../config.js";
import { fetchJSON } from "./fetchClient.js";

const PRICING_URL = API_CONFIG.PRICING_WORKER_URL;

export async function getPrice(skuId) {
  return await fetchJSON(`${PRICING_URL}/api/v1/prices/${skuId}`);
}

export async function getProductPrices(productId) {
  return await fetchJSON(`${PRICING_URL}/api/v1/prices/product/${productId}`);
}

export async function calculateTotal(items) {
  return await fetchJSON(`${PRICING_URL}/api/v1/calculate-total`, {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}
