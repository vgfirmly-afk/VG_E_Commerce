// middleware/authRequired.js
import { verifyJWT } from '../utils/jwt.js';

export async function requireAuth(request, env) {
  try {
    const header = request.headers.get('Authorization') || '';
    if (!header.startsWith('Bearer ')) {
      return { ok: false, status: 401, message: 'missing_token' };
    }
    const token = header.slice(7);
    const payload = await verifyJWT(token, env);
    if (!payload) return { ok: false, status: 401, message: 'invalid_token' };
    return { ok: true, payload };
  } catch (err) {
    console.error('requireAuth error', err);
    return { ok: false, status: 401, message: 'invalid_token' };
  }
}
