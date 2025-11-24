import { API_BASE_URLS } from "../config.js";

const API_BASE = API_BASE_URLS.PAYMENT;

async function fetchWithCredentials(url, options = {}) {
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });
}

export async function createPayment(
  checkoutSessionId,
  amount,
  currency,
  returnUrl,
  cancelUrl,
) {
  const response = await fetchWithCredentials(`${API_BASE}/api/v1/payments`, {
    method: "POST",
    body: JSON.stringify({
      checkout_session_id: checkoutSessionId,
      amount,
      currency,
      intent: "CAPTURE",
      return_url: returnUrl,
      cancel_url: cancelUrl,
      description: "Order payment",
      metadata: {},
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create payment");
  }
  return data;
}

export async function getPayment(paymentId) {
  const response = await fetchWithCredentials(
    `${API_BASE}/api/v1/payments/${paymentId}`,
    {
      method: "GET",
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to get payment");
  }
  return data;
}

export async function capturePayment(paymentId, orderId) {
  const response = await fetchWithCredentials(
    `${API_BASE}/api/v1/payments/${paymentId}/capture`,
    {
      method: "POST",
      body: JSON.stringify({ order_id: orderId }),
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to capture payment");
  }
  return data;
}
