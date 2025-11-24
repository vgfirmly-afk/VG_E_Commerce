// utils/helpers.js
// Utility functions for slug generation, SKU code generation, etc.

/**
 * Generate a URL-friendly slug from a string
 * @param {string} text - The text to convert to a slug
 * @returns {string} - The generated slug
 */
export function generateSlug(text) {
  if (!text) return "";

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars except hyphens
    .replace(/\-\-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+/, "") // Trim hyphens from start
    .replace(/-+$/, ""); // Trim hyphens from end
}

/**
 * Generate a unique slug that doesn't exist in the database
 * @param {string} baseSlug - The base slug to make unique
 * @param {Function} slugExistsFn - Function to check if slug exists: (slug, excludeProductId) => Promise<boolean>
 * @param {string} excludeProductId - Optional product ID to exclude from check (for updates)
 * @returns {Promise<string>} - A unique slug
 */
export async function generateUniqueSlug(
  baseSlug,
  slugExistsFn,
  excludeProductId = null,
) {
  if (!baseSlug) return null;

  let slug = baseSlug;
  let counter = 1;
  const maxAttempts = 100; // Prevent infinite loops

  // Check if base slug is unique
  const exists = await slugExistsFn(slug, excludeProductId);
  if (!exists) {
    return slug;
  }

  // If not unique, append a number until we find a unique one
  while (counter < maxAttempts) {
    const candidateSlug = `${baseSlug}-${counter}`;
    const candidateExists = await slugExistsFn(candidateSlug, excludeProductId);

    if (!candidateExists) {
      return candidateSlug;
    }

    counter++;
  }

  // If we've exhausted attempts, append a random string
  const random = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${random}`;
}

/**
 * Generate a unique SKU code
 * Format: SKU-{timestamp}-{random}
 * @returns {string} - The generated SKU code
 */
export function generateSkuCode() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `SKU-${timestamp}-${random}`;
}
