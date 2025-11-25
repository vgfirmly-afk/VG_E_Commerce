import { browser } from "$app/environment";

/**
 * Get a cookie value by name
 */
export function getCookie(name) {
  if (!browser) return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return null;
}

/**
 * Set a cookie
 */
export function setCookie(name, value, days = 30) {
  if (!browser) return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Delete a cookie
 */
export function deleteCookie(name) {
  if (!browser) return;

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

/**
 * Check if accessToken or refreshToken cookies exist
 * Since httpOnly cookies can't be read by JavaScript,
 * we use userId cookie as a proxy indicator
 */
export function hasAuthCookies() {
  if (!browser) return false;

  // Check if userId cookie exists as a proxy for auth cookies
  // If userId exists, it means user was authenticated and tokens might exist
  const userId = getCookie("userId");
  return !!userId;
}

/**
 * Set userId cookie (non-httpOnly, for client-side access)
 */
export function setUserIdCookie(userId, days = 30) {
  setCookie("userId", userId, days);
}

/**
 * Get userId from cookie
 */
export function getUserIdCookie() {
  return getCookie("userId");
}

/**
 * Clear userId cookie
 */
export function clearUserIdCookie() {
  deleteCookie("userId");
}
