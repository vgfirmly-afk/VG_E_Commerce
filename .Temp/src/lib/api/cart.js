import { API_CONFIG } from "../config.js";
import { fetchClient, fetchJSON } from "./fetchClient.js";

const CART_URL = API_CONFIG.CART_WORKER_URL;

function getHeaders() {
  const headers = {
    "Content-Type": "application/json",
  };

  // Get user ID from localStorage (not tokens - those are in httpOnly cookies)
  const userId = localStorage.getItem("userId");
  const sessionId = localStorage.getItem("sessionId");

  if (userId) {
    headers["X-User-Id"] = userId;
  } else if (sessionId) {
    headers["X-Session-Id"] = sessionId;
  }

  return headers;
}

export async function getCart() {
  return await fetchJSON(`${CART_URL}/api/v1/cart`, {
    method: "GET",
    headers: getHeaders(),
  });
}

export async function getCartById(cartId) {
  return await fetchJSON(`${CART_URL}/api/v1/cart/${cartId}`, {
    method: "GET",
    headers: getHeaders(),
  });
}

export async function addItemToCart(
  cartId,
  { sku_id, quantity, product_id, sku_code },
) {
  return await fetchJSON(`${CART_URL}/api/v1/cart/${cartId}/items`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ sku_id, quantity, product_id, sku_code }),
  });
}

export async function updateCartItem(cartId, itemId, quantity) {
  return await fetchJSON(`${CART_URL}/api/v1/cart/${cartId}/items/${itemId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(cartId, itemId) {
  return await fetchJSON(`${CART_URL}/api/v1/cart/${cartId}/items/${itemId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
}

export async function clearCart(cartId) {
  return await fetchJSON(`${CART_URL}/api/v1/cart/${cartId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
}

export async function getCartTotal(cartId) {
  return await fetchJSON(`${CART_URL}/api/v1/cart/${cartId}/total`, {
    method: "GET",
    headers: getHeaders(),
  });
}
