// utils/crypto.js
// Worker-compatible SubtleCrypto helpers (PBKDF2 + SHA-256)
// Exports: genSalt, hashPassword, verifyPassword, genRandomToken, sha256
import { logError, logWarn, logInfo } from './logger.js';

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

/**
 * AES-GCM encryption for PII data
 * @param {string} plaintext - Data to encrypt
 * @param {string} keyB64 - Base64-encoded encryption key (32 bytes for AES-256)
 * @returns {Promise<string>} Base64-encoded encrypted data (iv + ciphertext)
 */
export async function encryptAESGCM(plaintext, keyB64) {
  if (!plaintext) {
    logWarn('encryptAESGCM: plaintext is empty or null');
    return null;
  }
  
  if (!keyB64) {
    logError('encryptAESGCM: encryption key is missing', null, { function: 'encryptAESGCM' });
    throw new Error('Encryption key is required');
  }

  try {
    const keyBytes = base64ToUint8(keyB64);
    
    if (keyBytes.length !== 32) {
      logError('encryptAESGCM: Invalid key length. Expected 32 bytes, got', null, { keyLength: keyBytes.length, expected: 32 });
      throw new Error('Encryption key must be 32 bytes (256 bits)');
    }
    
    const key = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    // Generate 12-byte IV (96 bits for GCM) - MUST be unique for each encryption
    const iv = randomBytes(12);
    // logInfo('encryptAESGCM: Generated IV', { ivLength: 12, iv: uint8ToBase64(iv) });
    
    const plaintextBytes = encoder.encode(plaintext);
    // logInfo('encryptAESGCM: Plaintext encoded', { plaintextLength: plaintextBytes.length });

    // Encrypt with AES-GCM (returns ciphertext + 16-byte authentication tag)
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      plaintextBytes
    );
    
    // logInfo('encryptAESGCM: Ciphertext generated', { ciphertextLength: ciphertext.byteLength });

    // Combine IV and ciphertext: IV (12 bytes) + ciphertext (includes 16-byte auth tag)
    // Format: [IV (12 bytes)][Ciphertext + Auth Tag (variable + 16 bytes)]
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv, 0);  // Set IV at the beginning
    combined.set(new Uint8Array(ciphertext), iv.length);  // Set ciphertext + auth tag after IV

    const encrypted = uint8ToBase64(combined);
    // logInfo('encryptAESGCM: Encryption complete', { combinedLength: combined.length, hasIV: true });
    return encrypted;
  } catch (err) {
    // logError('encryptAESGCM: Encryption failed', err, { function: 'encryptAESGCM' });
    throw err;
  }
}

/**
 * AES-GCM decryption for PII data
 * @param {string} encryptedB64 - Base64-encoded encrypted data (iv + ciphertext)
 * @param {string} keyB64 - Base64-encoded encryption key (32 bytes for AES-256)
 * @returns {Promise<string|null>} Decrypted plaintext or null if decryption fails
 */
export async function decryptAESGCM(encryptedB64, keyB64) {
  if (!encryptedB64 || !keyB64) return null;

  try {
    const keyBytes = base64ToUint8(keyB64);
    const key = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    const combined = base64ToUint8(encryptedB64);
    
    if (combined.length < 12) {
      // logError('decryptAESGCM: Encrypted data too short to contain IV', null, { dataLength: combined.length, minRequired: 12 });
      return null;
    }
    
    // Extract IV (first 12 bytes) and ciphertext (rest includes 16-byte auth tag)
    // Format: [IV (12 bytes)][Ciphertext + Auth Tag (variable + 16 bytes)]
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    
    // logInfo('decryptAESGCM: Extracted IV and ciphertext', { ivLength: 12, iv: uint8ToBase64(iv), ciphertextLength: ciphertext.length });

    if (ciphertext.length < 16) {
      logError('decryptAESGCM: Ciphertext too short (missing auth tag)', null, { ciphertextLength: ciphertext.length, minRequired: 16 });
      return null;
    }

    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    const decrypted = decoder.decode(plaintext);
    logInfo('decryptAESGCM: Successfully decrypted data', { decryptedLength: decrypted.length });
    return decrypted;
  } catch (err) {
    logError('decryptAESGCM error', err, { function: 'decryptAESGCM' });
    return null;
  }
}
