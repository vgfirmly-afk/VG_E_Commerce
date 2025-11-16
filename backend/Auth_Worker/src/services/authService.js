// services/authService.js
import { hashPassword, verifyPassword, genSalt, genRandomToken, sha256, encryptAESGCM, decryptAESGCM } from '../utils/crypto.js';
import { signJWT, verifyJWT } from '../utils/jwt.js';
import { getUserByEmail, createUser, getUserByIddb, createRefreshTokenRow, findRefreshTokenRow, rotateRefreshTokenRow, revokeRefreshTokenRow, addRevokedToken } from '../db/db1.js';
import { logger, logError, logWarn, logInfo } from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_DAYS } from '../../config.js';


// register
export async function register({ name, email, password, phoneNumber, address, dateOfBirth, ssn, fullName }, env) {
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

    // Encrypt PII data if provided
    // SECURITY: PII data MUST be encrypted before storage. If encryption fails, registration is rejected.
    const encryptionKey = env.PII_ENCRYPTION_KEY;
    const hasPIIData = !!(phoneNumber || address || dateOfBirth || ssn || fullName);
    
    let phoneNumberEncrypted = null;
    let addressEncrypted = null;
    let dateOfBirthEncrypted = null;
    let ssnEncrypted = null;
    let fullNameEncrypted = null;

    if (hasPIIData) {
      if (!encryptionKey) {
        logError('authService.register: PII data provided but PII_ENCRYPTION_KEY not set. Registration rejected for security.', null, { hasPIIData: true });
        return { ok: false, error: 'encryption_key_missing', message: 'PII_ENCRYPTION_KEY must be set to store PII data' };
      }

      try {
        logInfo('authService.register: Encrypting PII data...', { hasPIIData: true });
        if (phoneNumber) {
          phoneNumberEncrypted = await encryptAESGCM(phoneNumber, encryptionKey);
          if (!phoneNumberEncrypted) {
            logError('authService.register: Failed to encrypt phoneNumber', null, { field: 'phoneNumber' });
            throw new Error('Encryption failed for phoneNumber');
          }
          logInfo('authService.register: phoneNumber encrypted successfully', { field: 'phoneNumber' });
        }
        if (address) {
          addressEncrypted = await encryptAESGCM(address, encryptionKey);
          if (!addressEncrypted) {
            logError('authService.register: Failed to encrypt address', null, { field: 'address' });
            throw new Error('Encryption failed for address');
          }
          logInfo('authService.register: address encrypted successfully', { field: 'address' });
        }
        if (dateOfBirth) {
          dateOfBirthEncrypted = await encryptAESGCM(dateOfBirth, encryptionKey);
          if (!dateOfBirthEncrypted) {
            logError('authService.register: Failed to encrypt dateOfBirth', null, { field: 'dateOfBirth' });
            throw new Error('Encryption failed for dateOfBirth');
          }
          logInfo('authService.register: dateOfBirth encrypted successfully', { field: 'dateOfBirth' });
        }
        if (ssn) {
          ssnEncrypted = await encryptAESGCM(ssn, encryptionKey);
          if (!ssnEncrypted) {
            logError('authService.register: Failed to encrypt ssn', null, { field: 'ssn' });
            throw new Error('Encryption failed for ssn');
          }
          logInfo('authService.register: ssn encrypted successfully', { field: 'ssn' });
        }
        if (fullName) {
          fullNameEncrypted = await encryptAESGCM(fullName, encryptionKey);
          if (!fullNameEncrypted) {
            logError('authService.register: Failed to encrypt fullName', null, { field: 'fullName' });
            throw new Error('Encryption failed for fullName');
          }
          logInfo('authService.register: fullName encrypted successfully', { field: 'fullName' });
        }
        const encryptedFields = [];
        if (phoneNumberEncrypted) encryptedFields.push('phoneNumber');
        if (addressEncrypted) encryptedFields.push('address');
        if (dateOfBirthEncrypted) encryptedFields.push('dateOfBirth');
        if (ssnEncrypted) encryptedFields.push('ssn');
        if (fullNameEncrypted) encryptedFields.push('fullName');
        logInfo('authService.register: All PII data encrypted successfully', { encryptedFields });
      } catch (encryptErr) {
        logError('authService.register: Encryption error', encryptErr, { hasPIIData: true });
        return { ok: false, error: 'encryption_failed', message: 'Failed to encrypt PII data. Registration rejected for security.' };
      }
    }

    await createUser({
      id: userId,
      name,
      email,
      pwd_hash: hashed,
      pwd_salt: salt,
      role: 'user',
      created_at: now,
      updated_at: now,
      phone_number_encrypted: phoneNumberEncrypted,
      address_encrypted: addressEncrypted,
      date_of_birth_encrypted: dateOfBirthEncrypted,
      ssn_encrypted: ssnEncrypted,
      full_name_encrypted: fullNameEncrypted,
    }, env);

    // don't return sensitive fields
    return { ok: true, userId };
  } catch (err) {
    logError('authService.register error', err, { function: 'register' });
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
    const accessToken = await signJWT(payload, { env, expiresIn: ACCESS_TOKEN_EXPIRY });
    // logInfo('ACCESS_TOKEN_EXPIRY', { expiry: ACCESS_TOKEN_EXPIRY });
    // create refresh token (opaque) and store hashed in DB
    const refreshToken = genRandomToken();
    const hashedRefresh = await sha256(refreshToken);
    const refreshId = uuidv4();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000).toISOString(); // 30 days

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
    logError('authService.login error', err, { function: 'login' });
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
    const accessToken = await signJWT({ sub: user.id, role: user.role }, { env, expiresIn: ACCESS_TOKEN_EXPIRY });

    return { ok: true, userId: user.id, accessToken, refreshToken: newToken };
  } catch (err) {
    logError('authService.rotateRefreshToken error', err, { function: 'rotateRefreshToken' });
    return { ok: false, error: 'internal_error' };
  }
}

export async function revokeRefreshToken({ refreshToken, accessToken }, env) {
  try {
    const hashed = await sha256(refreshToken);
    const row = await findRefreshTokenRow(hashed, env);
    if (!row) return { ok: false, error: 'not_found', status: 404 };
    await revokeRefreshTokenRow(row.id, env);
    
    // Also revoke the access token if provided
    if (accessToken) {
      try {
        const payload = await verifyJWT(accessToken, env);
        if (payload && payload.jti && payload.exp) {
          await addRevokedToken(payload.jti, row.user_id, payload.exp, env);
        }
      } catch (err) {
        // If access token is invalid, continue anyway (refresh token is revoked)
        logWarn('Could not revoke access token', { error: err.message });
      }
    }
    
    return { ok: true, userId: row.user_id };
  } catch (err) {
    logError('authService.revokeRefreshToken error', err, { function: 'revokeRefreshToken' });
    return { ok: false, error: 'internal_error' };
  }
}

export async function getUserById(id, env) {
  try {
    const user = await getUserByIddb(id, env);
    if (!user) return null;
    
    // Decrypt PII data if encryption key is available
    const encryptionKey = env.PII_ENCRYPTION_KEY;
    if (encryptionKey) {
      const decryptedUser = { ...user };
      
      if (user.phone_number_encrypted) {
        decryptedUser.phone_number = await decryptAESGCM(user.phone_number_encrypted, encryptionKey);
      }
      if (user.address_encrypted) {
        decryptedUser.address = await decryptAESGCM(user.address_encrypted, encryptionKey);
      }
      if (user.date_of_birth_encrypted) {
        decryptedUser.date_of_birth = await decryptAESGCM(user.date_of_birth_encrypted, encryptionKey);
      }
      if (user.ssn_encrypted) {
        decryptedUser.ssn = await decryptAESGCM(user.ssn_encrypted, encryptionKey);
      }
      if (user.full_name_encrypted) {
        decryptedUser.full_name = await decryptAESGCM(user.full_name_encrypted, encryptionKey);
      }
      
      // Remove encrypted fields from response
      delete decryptedUser.phone_number_encrypted;
      delete decryptedUser.address_encrypted;
      delete decryptedUser.date_of_birth_encrypted;
      delete decryptedUser.ssn_encrypted;
      delete decryptedUser.full_name_encrypted;
      
      return decryptedUser;
    }
    
    return user;
  } catch (err) {
    logError('authService.getUserById error', err, { function: 'getUserById' });
    return null;
  }
}
