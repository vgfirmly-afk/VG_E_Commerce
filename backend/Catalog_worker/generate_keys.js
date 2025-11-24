import { generateKeyPairSync, randomBytes } from "crypto";
// Generate RSA key pair for JWT signing
const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

// Generate AES-256-GCM key for PII encryption (32 bytes = 256 bits)
const piiEncryptionKey = randomBytes(32);
const piiEncryptionKeyB64 = piiEncryptionKey.toString("base64");

console.log("=== JWT Keys ===");
console.log("Private Key (JWT_PRIVATE_KEY):\n", privateKey);
console.log("\nPublic Key (JWT_PUBLIC_KEY):\n", publicKey);

console.log("\n=== PII Encryption Key ===");
console.log("PII_ENCRYPTION_KEY (Base64, 32 bytes):\n", piiEncryptionKeyB64);
console.log(
  "\n⚠️  IMPORTANT: Store this key securely! It is required to decrypt existing PII data.",
);
console.log(
  "⚠️  If you lose this key, encrypted PII data cannot be recovered.",
);
