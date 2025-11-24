/**
 * Cookie utility functions
 * Note: Frontend JavaScript can set cookies, but they cannot be httpOnly
 * httpOnly cookies can only be set by the server
 */

/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Expiration in days (default: 30)
 * @param {object} options - Additional options (path, domain, secure, sameSite)
 */
export function setCookie(name, value, days = 30, options = {}) {
  const {
    path = "/",
    domain = "",
    secure = window.location.protocol === "https:",
    sameSite = "Strict",
  } = options;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  let cookieString = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=${path}`;

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += `; secure`;
  }

  if (sameSite) {
    cookieString += `; samesite=${sameSite}`;
  }

  document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} - Cookie value or null if not found
 */
export function getCookie(name) {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }
  return null;
}

/**
 * Delete a cookie
 * @param {string} name - Cookie name
 * @param {object} options - Options (path, domain)
 */
export function deleteCookie(name, options = {}) {
  const { path = "/", domain = "" } = options;

  let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  document.cookie = cookieString;
}

/**
 * Get all cookies as an object
 * @returns {object} - Object with cookie names as keys
 */
export function getAllCookies() {
  const cookies = {};
  if (document.cookie && document.cookie !== "") {
    const split = document.cookie.split(";");
    for (let i = 0; i < split.length; i++) {
      const nameValue = split[i].split("=");
      const name = nameValue[0].trim();
      const value = decodeURIComponent(nameValue[1] || "");
      cookies[name] = value;
    }
  }
  return cookies;
}
