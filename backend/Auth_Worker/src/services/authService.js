// services/authService.js
import { hashPassword, verifyPassword, genSalt, genRandomToken, sha256 } from '../utils/crypto.js';
import { signJWT, verifyJWT } from '../utils/jwt.js';
import { getUserByEmail, createUser, getUserByIddb, createRefreshTokenRow, findRefreshTokenRow, rotateRefreshTokenRow, revokeRefreshTokenRow } from '../db/db1.js';
import { logger } from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

// register
export async function register({ name, email, password }, env) {
  try {
    // check unique
    const existing = await getUserByEmail(email, env);
    if (existing) {
      return { ok: false, error: 'email_exists', status: 409 };
    }

    const salt = genSalt();
    const hashed = await hashPassword(password, salt, env.PEPPER || env.PEPPER_SECRET); // pass pepper from env binding
    const userId = uuidv4();
    const now = new Date().toISOString();

    await createUser({
      id: userId,
      name,
      email,
      pwd_hash: hashed,
      pwd_salt: salt,
      role: 'user',
      created_at: now,
      updated_at: now,
    }, env);

    // don't return sensitive fields
    return { ok: true, userId };
  } catch (err) {
    console.error('authService.register error', err);
    return { ok: false, error: 'internal_error' };
  }
}

// login
export async function login({ email, password }, env) {
  try {
    const user = await getUserByEmail(email, env);
    if (!user) {
      // defensive: don't reveal whether user exists
      return { ok: false, error: 'invalid_credentials', status: 401, emailHash: await sha256(email) };
    }
    const ok = await verifyPassword(password, user.pwd_salt, user.pwd_hash, env.PEPPER || env.PEPPER_SECRET);
    if (!ok) {
      return { ok: false, error: 'invalid_credentials', status: 401, emailHash: await sha256(email) };
    }

    // create access token
    const payload = { sub: user.id, role: user.role };
    const accessToken = await signJWT(payload, { env, expiresIn: '15m' });

    // create refresh token (opaque) and store hashed in DB
    const refreshToken = genRandomToken();
    const hashedRefresh = await sha256(refreshToken);
    const refreshId = uuidv4();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

    await createRefreshTokenRow({
      id: refreshId,
      user_id: user.id,
      token_hash: hashedRefresh,
      device_info: null,
      expires_at: expiresAt,
      revoked: 0,
      created_at: new Date().toISOString(),
      rotated_from: null,
    }, env);

    return { ok: true, userId: user.id, accessToken, refreshToken };
  } catch (err) {
    console.error('authService.login error', err);
    return { ok: false, error: 'internal_error' };
  }
}

export async function rotateRefreshToken({ refreshToken }, env) {
  try {
    const hashed = await sha256(refreshToken);
    const row = await findRefreshTokenRow(hashed, env);
    if (!row || row.revoked) return { ok: false, error: 'invalid_refresh_token', status: 401 };
    if (new Date(row.expires_at) < new Date()) return { ok: false, error: 'expired_refresh_token', status: 401 };

    // rotate: create new token, mark old revoked (store rotated_from)
    const newToken = genRandomToken();
    const newHash = await sha256(newToken);
    const newId = uuidv4();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    await rotateRefreshTokenRow({
      oldId: row.id,
      newRow: {
        id: newId,
        user_id: row.user_id,
        token_hash: newHash,
        device_info: row.device_info,
        expires_at: expiresAt,
        revoked: 0,
        created_at: new Date().toISOString(),
        rotated_from: row.id,
      }
    }, env);

    const user = await getUserByIddb(row.user_id, env);
    const accessToken = await signJWT({ sub: user.id, role: user.role }, { env, expiresIn: '15m' });

    return { ok: true, userId: user.id, accessToken, refreshToken: newToken };
  } catch (err) {
    console.error('authService.rotateRefreshToken error', err);
    return { ok: false, error: 'internal_error' };
  }
}

export async function revokeRefreshToken({ refreshToken }, env) {
  try {
    const hashed = await sha256(refreshToken);
    const row = await findRefreshTokenRow(hashed, env);
    if (!row) return { ok: false, error: 'not_found', status: 404 };
    await revokeRefreshTokenRow(row.id, env);
    return { ok: true, userId: row.user_id };
  } catch (err) {
    console.error('authService.revokeRefreshToken error', err);
    return { ok: false, error: 'internal_error' };
  }
}

export async function getUserById(id, env) {
  try {
    return await getUserByIddb(id, env);
  } catch (err) {
    console.error('authService.getUserById error', err);
    return null;
  }
}
