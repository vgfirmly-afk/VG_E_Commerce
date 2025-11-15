// utils/crypto.js
// Worker-compatible SubtleCrypto helpers (PBKDF2 + SHA-256)
// Exports: genSalt, hashPassword, verifyPassword, genRandomToken, sha256

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/** Helpers for base64 <-> Uint8Array without spreading large arrays */
function uint8ToBase64(u8) {
  // build binary string in a loop (safe)
  let bin = '';
  for (let i = 0; i < u8.length; i++) bin += String.fromCharCode(u8[i]);
  return btoa(bin);
}

function base64ToUint8(b64) {
  const bin = atob(b64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8;
}

function randomBytes(len = 32) {
  const b = new Uint8Array(len);
  crypto.getRandomValues(b);
  return b;
}

export function genSalt(len = 16) {
  // returns base64-encoded salt
  return uint8ToBase64(randomBytes(len));
}

/**
 * Hash password with PBKDF2-HMAC-SHA256.
 * - password: string (required)
 * - saltB64: base64 salt string (required)
 * - pepper: optional string (default '')
 * - options: { iterations, keyLen }  // iterations defaults to 100000, keyLen in bytes defaults to 32
 *
 * Returns base64 of derived key.
 */
export async function hashPassword(password, saltB64, pepper = '', options = {}) {
  if (!password || typeof password !== 'string') {
    throw new Error('hashPassword: password must be a non-empty string');
  }
  if (!saltB64 || typeof saltB64 !== 'string') {
    throw new Error('hashPassword: salt (base64) required');
  }

  const iterations = Number(options.iterations ?? 100000);
  if (!Number.isFinite(iterations) || iterations < 1) {
    throw new Error('hashPassword: invalid iterations');
  }
  const keyLen = Number(options.keyLen ?? 32);
  if (!Number.isFinite(keyLen) || keyLen < 1) {
    throw new Error('hashPassword: invalid keyLen');
  }

  const pwBytes = encoder.encode(password + (pepper || ''));

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    pwBytes,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const saltBytes = base64ToUint8(saltB64);

  const params = { name: 'PBKDF2', salt: saltBytes, iterations, hash: 'SHA-256' };

  const derivedBits = await crypto.subtle.deriveBits(params, keyMaterial, keyLen * 8);
  const derived = new Uint8Array(derivedBits);

  return uint8ToBase64(derived);
}

export async function verifyPassword(password, saltB64, storedHashB64, pepper = '', options = {}) {
  if (!storedHashB64) return false;
  try {
    const computed = await hashPassword(password, saltB64, pepper, options);
    // constant-time compare
    if (computed.length !== storedHashB64.length) return false;
    let diff = 0;
    for (let i = 0; i < computed.length; i++) {
      diff |= computed.charCodeAt(i) ^ storedHashB64.charCodeAt(i);
    }
    return diff === 0;
  } catch (err) {
    // on error, return false (don't leak details)
    return false;
  }
}

export function genRandomToken(len = 32) {
  // return url-safe base64 token (len bytes of entropy)
  const bytes = randomBytes(len);
  const b64 = uint8ToBase64(bytes);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function sha256(input) {
  const data = encoder.encode(typeof input === 'string' ? input : JSON.stringify(input));
  const digest = await crypto.subtle.digest('SHA-256', data);
  return uint8ToBase64(new Uint8Array(digest));
}
