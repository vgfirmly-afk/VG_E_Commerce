import { API_BASE_URLS } from "../config.js";

const API_BASE = API_BASE_URLS.CHECKOUT;

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

export async function createCheckoutSession(cartId, userId, sessionId) {
  const headers = {};

  if (userId) {
    headers["X-User-Id"] = userId;
  } else if (sessionId) {
    headers["X-Session-Id"] = sessionId;
  }

  const response = await fetchWithCredentials(
    `${API_BASE}/api/v1/checkout/sessions`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ cart_id: cartId }),
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create checkout session");
  }
  return data;
}

export async function getCheckoutSession(sessionId) {
  const response = await fetchWithCredentials(
    `${API_BASE}/api/v1/checkout/sessions/${sessionId}`,
    {
      method: "GET",
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to get checkout session");
  }
  return data;
}

export async function setDeliveryAddress(
  sessionId,
  address,
  userId,
  guestSessionId,
) {
  const headers = {};

  if (userId) {
    headers["X-User-Id"] = userId;
  } else if (guestSessionId) {
    headers["X-Session-Id"] = guestSessionId;
  }

  const response = await fetchWithCredentials(
    `${API_BASE}/api/v1/checkout/sessions/${sessionId}/delivery-address`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(address),
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to set delivery address");
  }
  return data;
}

export async function setBillingAddress(
  sessionId,
  address,
  userId,
  guestSessionId,
) {
  const headers = {};

  if (userId) {
    headers["X-User-Id"] = userId;
  } else if (guestSessionId) {
    headers["X-Session-Id"] = guestSessionId;
  }

  const response = await fetchWithCredentials(
    `${API_BASE}/api/v1/checkout/sessions/${sessionId}/billing-address`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(address),
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to set billing address");
  }
  return data;
}

export async function getShippingMethods(sessionId) {
  const response = await fetchWithCredentials(
    `${API_BASE}/api/v1/checkout/sessions/${sessionId}/shipping-methods`,
    {
      method: "GET",
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to get shipping methods");
  }
  return data;
}

export async function selectShippingMethod(sessionId, shippingMethodId) {
  const response = await fetchWithCredentials(
    `${API_BASE}/api/v1/checkout/sessions/${sessionId}/shipping-method`,
    {
      method: "POST",
      body: JSON.stringify({ shipping_method_id: shippingMethodId }),
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to select shipping method");
  }
  return data;
}

export async function getCheckoutSummary(sessionId) {
  const response = await fetchWithCredentials(
    `${API_BASE}/api/v1/checkout/sessions/${sessionId}/summary`,
    {
      method: "GET",
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to get checkout summary");
  }
  return data;
}
