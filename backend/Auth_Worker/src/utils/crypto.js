// utils/crypto.js
// Uses SubtleCrypto (available in Workers)

function randomBytes(len = 32) {
  const b = new Uint8Array(len);
  crypto.getRandomValues(b);
  return b;
}

export function genSalt() {
  // 16 bytes salt base64
  const s = randomBytes(16);
  return btoa(String.fromCharCode(...s));
}

export async function hashPassword(password, saltB64, pepper) {
  // PBKDF2-HMAC-SHA256, iterations 200000, keylen 32
  const enc = new TextEncoder();
  const pw = enc.encode(password + (pepper || ''));
  const saltBytes = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0));
  const keyMaterial = await crypto.subtle.importKey('raw', pw, { name: 'PBKDF2' }, false, ['deriveBits', 'deriveKey']);
  const params = { name: 'PBKDF2', salt: saltBytes, iterations: 200000, hash: 'SHA-256' };
  const derived = await crypto.subtle.deriveBits(params, keyMaterial, 32 * 8);
  // return base64 of derived
  return btoa(String.fromCharCode(...new Uint8Array(derived)));
}

export async function verifyPassword(password, saltB64, storedHashB64, pepper) {
  const calc = await hashPassword(password, saltB64, pepper);
  // constant-time comparison
  return subtleConstantTimeCompare(calc, storedHashB64);
}

function subtleConstantTimeCompare(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

export function genRandomToken(len = 48) {
  // url-safe base64 with length approx len bytes
  const r = randomBytes(len);
  return btoa(String.fromCharCode(...r)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function sha256(input) {
  const enc = new TextEncoder();
  const data = enc.encode(typeof input === 'string' ? input : JSON.stringify(input));
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)));
}
