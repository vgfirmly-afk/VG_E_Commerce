// utils/jwt.js
// Note: expects JWT_PRIVATE_KEY secret to be PEM PKCS8. No key rotation / JWKS in this implementation.
import { logError } from './logger.js';

function pemToArrayBuffer(pem) {
  const b64 = pem.replace(/-----(BEGIN|END)[\w\s]+-----/g, '').replace(/\s+/g, '');
  const binStr = atob(b64);
  const len = binStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binStr.charCodeAt(i);
  return bytes.buffer;
}

function base64UrlEncode(buf) {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return Uint8Array.from(atob(str), c => c.charCodeAt(0));
}

async function importPrivateKey(pem) {
  const keyData = pemToArrayBuffer(pem);
  return crypto.subtle.importKey('pkcs8', keyData, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
}

async function importPublicKeyFromPrivate(pem) {
  // simple approach: derive public key by using private key export is not available.
  // Instead, if you want verify in-worker, provide PUBLIC key via secret too or derive differently.
  throw new Error('verifyJWT requires PUBLIC_KEY secret; set PUBLIC_KEY secret to PEM public key.');
}

export async function signJWT(payload = {}, { env, expiresIn = '15m' } = {}) {
  try {
    const now = Math.floor(Date.now() / 1000);
    let exp = now + 60 * 15; // default 15m
    if (typeof expiresIn === 'string' && expiresIn.endsWith('m')) {
      const mins = parseInt(expiresIn.slice(0, -1), 10);
      exp = now + mins * 60;
    } else if (typeof expiresIn === 'number') {
      exp = now + expiresIn;
    }

    // Generate unique JTI (JWT ID) for token revocation
    const jtiBytes = new Uint8Array(16);
    crypto.getRandomValues(jtiBytes);
    const jti = base64UrlEncode(jtiBytes.buffer);

    const header = { alg: 'RS256', typ: 'JWT' };
    const fullPayload = { 
      ...payload, 
      iat: now, 
      exp, 
      jti, // Add JTI for revocation tracking
      iss: env.JWT_ISSUER || env.JWT_ISSUER, 
      aud: env.JWT_AUDIENCE || env.JWT_AUDIENCE 
    };

    const encHeader = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
    const encPayload = base64UrlEncode(new TextEncoder().encode(JSON.stringify(fullPayload)));
    const signingInput = `${encHeader}.${encPayload}`;

    const pem = env.JWT_PRIVATE_KEY;
    if (!pem) throw new Error('JWT_PRIVATE_KEY secret not set');
    const key = await importPrivateKey(pem);
    const sigBuffer = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(signingInput));
    const signature = base64UrlEncode(sigBuffer);
    return `${signingInput}.${signature}`;
  } catch (err) {
    logError('signJWT error', err, { function: 'signJWT' });
    throw err;
  }
}

export async function verifyJWT(token, env) {
  // verify against PUBLIC_KEY secret if available
  try {
    const publicPem = env.JWT_PUBLIC_KEY;
    if (!publicPem) {
      logError('verifyJWT: PUBLIC key not set in secrets (JWT_PUBLIC_KEY). Cannot verify token.', null, { function: 'verifyJWT' });
      return null;
    }
    
    if (!token || typeof token !== 'string') {
      logError('verifyJWT: Invalid token format (not a string)', null, { function: 'verifyJWT', hasToken: !!token });
      return null;
    }
    
    const parts = token.split('.');
    if (parts.length !== 3) {
      logError('verifyJWT: Invalid token format', null, { function: 'verifyJWT', partsCount: parts.length, expected: 3 });
      return null;
    }
    
    const [h, p, s] = parts;
    const signingInput = `${h}.${p}`;
    
    let sig;
    try {
      sig = base64UrlDecode(s);
    } catch (err) {
      logError('verifyJWT: Error decoding signature', err, { function: 'verifyJWT' });
      return null;
    }

    // import public key
    let key;
    try {
    const pubKeyBuf = pemToArrayBuffer(publicPem);
      key = await crypto.subtle.importKey('spki', pubKeyBuf, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    } catch (err) {
      logError('verifyJWT: Error importing public key', err, { function: 'verifyJWT' });
      return null;
    }
    
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, sig, new TextEncoder().encode(signingInput));
    if (!ok) {
      logError('verifyJWT: Signature verification failed', null, { function: 'verifyJWT' });
      return null;
    }

    let payload;
    try {
    const payloadJson = new TextDecoder().decode(base64UrlDecode(p));
      payload = JSON.parse(payloadJson);
    } catch (err) {
      logError('verifyJWT: Error decoding/parsing payload', err, { function: 'verifyJWT' });
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) {
      logError('verifyJWT: Token expired', null, { function: 'verifyJWT', exp: payload.exp, now });
      return null;
    }
    
    return payload;
  } catch (err) {
    logError('verifyJWT error', err, { function: 'verifyJWT' });
    return null;
  }
}
