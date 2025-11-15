// db/db1.js
// D1 helpers for users & refresh_tokens
// Make sure your D1 DB has the following tables:
// 

export async function getUserByEmail(email, env) {
  const res = await env.D1.prepare('SELECT * FROM users WHERE email = ?').bind(email).all();
  if (!res || !res.results || res.results.length === 0) return null;
  return res.results[0];
}

export async function createUser(user, env) {
  const sql = `INSERT INTO users (id, email, name, pwd_hash, pwd_salt, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  await env.D1.prepare(sql).bind(user.id, user.email, user.name, user.pwd_hash, user.pwd_salt, user.role, user.created_at, user.updated_at).run();
}

export async function getUserById(id, env) {
  const res = await env.D1.prepare('SELECT * FROM users WHERE id = ?').bind(id).all();
  if (!res || !res.results || res.results.length === 0) return null;
  return res.results[0];
}

export async function createRefreshTokenRow(row, env) {
  const sql = `INSERT INTO refresh_tokens (id, user_id, token_hash, device_info, expires_at, revoked, created_at, rotated_from) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  await env.D1.prepare(sql).bind(row.id, row.user_id, row.token_hash, row.device_info, row.expires_at, row.revoked, row.created_at, row.rotated_from).run();
}

export async function findRefreshTokenRow(tokenHash, env) {
  const res = await env.D1.prepare('SELECT * FROM refresh_tokens WHERE token_hash = ?').bind(tokenHash).all();
  if (!res || !res.results || res.results.length === 0) return null;
  return res.results[0];
}

export async function rotateRefreshTokenRow({ oldId, newRow }, env) {
  // mark old revoked and insert new
  await env.D1.prepare('UPDATE refresh_tokens SET revoked = 1 WHERE id = ?').bind(oldId).run();
  await createRefreshTokenRow(newRow, env);
}

export async function revokeRefreshTokenRow(id, env) {
  await env.D1.prepare('UPDATE refresh_tokens SET revoked = 1 WHERE id = ?').bind(id).run();
}
