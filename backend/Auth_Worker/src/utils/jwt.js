// utils/jwt.js
// Note: expects JWT_PRIVATE_KEY secret to be PEM PKCS8. No key rotation / JWKS in this implementation.

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

    const header = { alg: 'RS256', typ: 'JWT' };
    const fullPayload = { ...payload, iat: now, exp, iss: env.JWT_ISSUER || env.JWT_ISSUER, aud: env.JWT_AUDIENCE || env.JWT_AUDIENCE };

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
    console.error('signJWT error', err);
    throw err;
  }
}

export async function verifyJWT(token, env) {
  // verify against PUBLIC_KEY secret if available
  try {
    const publicPem = env.JWT_PUBLIC_KEY;
    if (!publicPem) {
      console.error('verifyJWT: PUBLIC key not set in secrets (JWT_PUBLIC_KEY). Cannot verify token.');
      return null;
    }
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [h, p, s] = parts;
    const signingInput = `${h}.${p}`;
    const sig = base64UrlDecode(s);

    // import public key
    const pubKeyBuf = pemToArrayBuffer(publicPem);
    const key = await crypto.subtle.importKey('spki', pubKeyBuf, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, sig, new TextEncoder().encode(signingInput));
    if (!ok) return null;

    const payloadJson = new TextDecoder().decode(base64UrlDecode(p));
    const payload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) return null;
    return payload;
  } catch (err) {
    console.error('verifyJWT error', err);
    return null;
  }
}
