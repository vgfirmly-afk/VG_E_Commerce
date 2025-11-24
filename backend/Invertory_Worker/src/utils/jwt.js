// utils/jwt.js
// JWT verification utility for Inventory Worker
import { logError } from "./logger.js";

function pemToArrayBuffer(pem) {
  const b64 = pem
    .replace(/-----(BEGIN|END)[\w\s]+-----/g, "")
    .replace(/\s+/g, "");
  const binStr = atob(b64);
  const len = binStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binStr.charCodeAt(i);
  return bytes.buffer;
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}

/**
 * Verify JWT token using public key
 */
export async function verifyJWT(token, env) {
  try {
    const publicPem = env.JWT_PUBLIC_KEY;
    if (!publicPem) {
      logError(
        "verifyJWT: PUBLIC key not set in secrets (JWT_PUBLIC_KEY). Cannot verify token.",
        null,
        { function: "verifyJWT" },
      );
      return null;
    }

    if (!token || typeof token !== "string") {
      logError("verifyJWT: Invalid token format (not a string)", null, {
        function: "verifyJWT",
        hasToken: !!token,
      });
      return null;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      logError("verifyJWT: Invalid token format", null, {
        function: "verifyJWT",
        partsCount: parts.length,
        expected: 3,
      });
      return null;
    }

    const [h, p, s] = parts;
    const signingInput = `${h}.${p}`;

    let sig;
    try {
      sig = base64UrlDecode(s);
    } catch (err) {
      logError("verifyJWT: Error decoding signature", err, {
        function: "verifyJWT",
      });
      return null;
    }

    // Import public key
    let key;
    try {
      const pubKeyBuf = pemToArrayBuffer(publicPem);
      key = await crypto.subtle.importKey(
        "spki",
        pubKeyBuf,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["verify"],
      );
    } catch (err) {
      logError("verifyJWT: Error importing public key", err, {
        function: "verifyJWT",
      });
      return null;
    }

    const ok = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      key,
      sig,
      new TextEncoder().encode(signingInput),
    );
    if (!ok) {
      logError("verifyJWT: Signature verification failed", null, {
        function: "verifyJWT",
      });
      return null;
    }

    let payload;
    try {
      const payloadJson = new TextDecoder().decode(base64UrlDecode(p));
      payload = JSON.parse(payloadJson);
    } catch (err) {
      logError("verifyJWT: Error decoding/parsing payload", err, {
        function: "verifyJWT",
      });
      return null;
    }

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) {
      logError("verifyJWT: Token expired", null, {
        function: "verifyJWT",
        exp: payload.exp,
        now,
      });
      return null;
    }

    return payload;
  } catch (err) {
    logError("verifyJWT error", err, { function: "verifyJWT" });
    return null;
  }
}
