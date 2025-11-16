// db/db1.js
// AUTH_DB helpers for users & refresh_tokens
// Make sure your AUTH_DB DB has the following tables:
// 
import { logWarn } from '../utils/logger.js';

export async function getUserByEmail(email, env) {
  const res = await env.AUTH_DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).all();
  if (!res || !res.results || res.results.length === 0) return null;
  return res.results[0];
}

export async function createUser(user, env) {
  // Check if PII fields exist in the schema (for backward compatibility)
  // If PII fields are provided, include them; otherwise use basic schema
  const hasPIIFields = user.phone_number_encrypted !== undefined || 
                       user.address_encrypted !== undefined ||
                       user.date_of_birth_encrypted !== undefined ||
                       user.ssn_encrypted !== undefined ||
                       user.full_name_encrypted !== undefined;
  
  if (hasPIIFields) {
    const sql = `INSERT INTO users (
      id, email, name, pwd_hash, pwd_salt, role, created_at, updated_at,
      phone_number_encrypted, address_encrypted, date_of_birth_encrypted, 
      ssn_encrypted, full_name_encrypted
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await env.AUTH_DB.prepare(sql).bind(
      user.id, user.email, user.name, user.pwd_hash, user.pwd_salt, user.role, 
      user.created_at, user.updated_at,
      user.phone_number_encrypted || null,
      user.address_encrypted || null,
      user.date_of_birth_encrypted || null,
      user.ssn_encrypted || null,
      user.full_name_encrypted || null
    ).run();
  } else {
    // Basic schema without PII fields
    const sql = `INSERT INTO users (
      id, email, name, pwd_hash, pwd_salt, role, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    await env.AUTH_DB.prepare(sql).bind(
      user.id, user.email, user.name, user.pwd_hash, user.pwd_salt, user.role, 
      user.created_at, user.updated_at
    ).run();
  }
}

export async function getUserByIddb(id, env) {
  const res = await env.AUTH_DB.prepare('SELECT * FROM users WHERE id = ?').bind(id).all();
  if (!res || !res.results || res.results.length === 0) return null;
  return res.results[0];
}

export async function createRefreshTokenRow(row, env) {
  const sql = `INSERT INTO refresh_tokens (id, user_id, token_hash, device_info, expires_at, revoked, created_at, rotated_from) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  await env.AUTH_DB.prepare(sql).bind(row.id, row.user_id, row.token_hash, row.device_info, row.expires_at, row.revoked, row.created_at, row.rotated_from).run();
}

export async function findRefreshTokenRow(tokenHash, env) {
  const res = await env.AUTH_DB.prepare('SELECT * FROM refresh_tokens WHERE token_hash = ?').bind(tokenHash).all();
  if (!res || !res.results || res.results.length === 0) return null;
  return res.results[0];
}

export async function rotateRefreshTokenRow({ oldId, newRow }, env) {
  // mark old revoked and insert new
  await env.AUTH_DB.prepare('UPDATE refresh_tokens SET revoked = 1 WHERE id = ?').bind(oldId).run();
  await createRefreshTokenRow(newRow, env);
}

export async function revokeRefreshTokenRow(id, env) {
  await env.AUTH_DB.prepare('UPDATE refresh_tokens SET revoked = 1 WHERE id = ?').bind(id).run();
}

// Revoked access tokens (JWT blacklist)
export async function addRevokedToken(jti, userId, expiresAt, env) {
  const sql = `INSERT INTO revoked_tokens (jti, user_id, expires_at, revoked_at) VALUES (?, ?, ?, ?)`;
  await env.AUTH_DB.prepare(sql).bind(jti, userId, expiresAt, new Date().toISOString()).run();
}

export async function isTokenRevoked(jti, env) {
  try {
    if (!jti) return false;
    const res = await env.AUTH_DB.prepare('SELECT * FROM revoked_tokens WHERE jti = ?').bind(jti).all();
    return res && res.results && res.results.length > 0;
  } catch (err) {
    // If table doesn't exist or query fails, assume token is not revoked
    // This allows graceful degradation if migration hasn't been run yet
    logWarn('isTokenRevoked: Error checking revocation, assuming not revoked', { error: err.message, jti });
    return false;
  }
}

// Cleanup expired revoked tokens (can be called periodically)
export async function cleanupExpiredRevokedTokens(env) {
  const now = Math.floor(Date.now() / 1000);
  await env.AUTH_DB.prepare('DELETE FROM revoked_tokens WHERE expires_at < ?').bind(now).run();
}
