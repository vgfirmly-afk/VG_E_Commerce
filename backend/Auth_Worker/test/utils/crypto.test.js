// test/utils/crypto.test.js
import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import * as crypto from '../../src/utils/crypto.js';

describe('Crypto Utils', () => {
  describe('genSalt', () => {
    it('should generate a base64-encoded salt', () => {
      const salt = crypto.genSalt();
      expect(salt).to.be.a('string');
      expect(salt.length).to.be.greaterThan(0);
    });

    it('should generate different salts each time', () => {
      const salt1 = crypto.genSalt();
      const salt2 = crypto.genSalt();
      expect(salt1).to.not.equal(salt2);
    });

    it('should generate salt with custom length', () => {
      const salt = crypto.genSalt(32);
      expect(salt).to.be.a('string');
    });
  });

  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      const password = 'testPassword123';
      const salt = crypto.genSalt();
      const hash = await crypto.hashPassword(password, salt);
      
      expect(hash).to.be.a('string');
      expect(hash.length).to.be.greaterThan(0);
    });

    it('should throw error for empty password', async () => {
      const salt = crypto.genSalt();
      try {
        await crypto.hashPassword('', salt);
        expect.fail('Should have thrown error');
      } catch (err) {
        expect(err.message).to.include('password must be a non-empty string');
      }
    });

    it('should throw error for missing salt', async () => {
      try {
        await crypto.hashPassword('password', '');
        expect.fail('Should have thrown error');
      } catch (err) {
        expect(err.message).to.include('salt (base64) required');
      }
    });

    it('should produce different hashes with different salts', async () => {
      const password = 'testPassword123';
      const salt1 = crypto.genSalt();
      const salt2 = crypto.genSalt();
      
      const hash1 = await crypto.hashPassword(password, salt1);
      const hash2 = await crypto.hashPassword(password, salt2);
      
      expect(hash1).to.not.equal(hash2);
    });

    it('should use pepper when provided', async () => {
      const password = 'testPassword123';
      const salt = crypto.genSalt();
      const pepper = 'test-pepper';
      
      const hash1 = await crypto.hashPassword(password, salt, pepper);
      const hash2 = await crypto.hashPassword(password, salt, 'different-pepper');
      
      expect(hash1).to.not.equal(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'testPassword123';
      const salt = crypto.genSalt();
      const hash = await crypto.hashPassword(password, salt);
      
      const isValid = await crypto.verifyPassword(password, salt, hash);
      expect(isValid).to.be.true;
    });

    it('should reject incorrect password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword';
      const salt = crypto.genSalt();
      const hash = await crypto.hashPassword(password, salt);
      
      const isValid = await crypto.verifyPassword(wrongPassword, salt, hash);
      expect(isValid).to.be.false;
    });

    it('should return false for empty hash', async () => {
      const isValid = await crypto.verifyPassword('password', 'salt', '');
      expect(isValid).to.be.false;
    });
  });

  describe('genRandomToken', () => {
    it('should generate a random token', () => {
      const token = crypto.genRandomToken();
      expect(token).to.be.a('string');
      expect(token.length).to.be.greaterThan(0);
    });

    it('should generate different tokens each time', () => {
      const token1 = crypto.genRandomToken();
      const token2 = crypto.genRandomToken();
      expect(token1).to.not.equal(token2);
    });

    it('should generate token with custom length', () => {
      const token = crypto.genRandomToken(64);
      expect(token).to.be.a('string');
    });
  });

  describe('sha256', () => {
    it('should hash a string', async () => {
      const input = 'test string';
      const hash = await crypto.sha256(input);
      
      expect(hash).to.be.a('string');
      expect(hash.length).to.be.greaterThan(0);
    });

    it('should produce same hash for same input', async () => {
      const input = 'test string';
      const hash1 = await crypto.sha256(input);
      const hash2 = await crypto.sha256(input);
      
      expect(hash1).to.equal(hash2);
    });

    it('should produce different hashes for different inputs', async () => {
      const hash1 = await crypto.sha256('input1');
      const hash2 = await crypto.sha256('input2');
      
      expect(hash1).to.not.equal(hash2);
    });
  });

  describe('encryptAESGCM', () => {
    const validKey = '8CjUgdcnn2YG4sxY7aX/q9vyyx4eHRyIzZ+vLgVmKYg='; // 32 bytes base64 from setup

    it('should encrypt plaintext successfully', async () => {
      const plaintext = 'sensitive data';
      const encrypted = await crypto.encryptAESGCM(plaintext, validKey);
      
      expect(encrypted).to.be.a('string');
      expect(encrypted).to.not.equal(plaintext);
      expect(encrypted.length).to.be.greaterThan(0);
    });

    it('should return null for empty plaintext', async () => {
      const encrypted = await crypto.encryptAESGCM('', validKey);
      expect(encrypted).to.be.null;
    });

    it('should throw error for missing key', async () => {
      try {
        await crypto.encryptAESGCM('data', '');
        expect.fail('Should have thrown error');
      } catch (err) {
        expect(err.message).to.include('Encryption key is required');
      }
    });

    it('should throw error for invalid key length', async () => {
      const invalidKey = 'dGVzdA=='; // too short
      try {
        await crypto.encryptAESGCM('data', invalidKey);
        expect.fail('Should have thrown error');
      } catch (err) {
        expect(err.message).to.include('32 bytes');
      }
    });

    it('should produce different ciphertexts for same plaintext', async () => {
      const plaintext = 'same data';
      const encrypted1 = await crypto.encryptAESGCM(plaintext, validKey);
      const encrypted2 = await crypto.encryptAESGCM(plaintext, validKey);
      
      // Should be different due to random IV
      expect(encrypted1).to.not.equal(encrypted2);
    });
  });

  describe('decryptAESGCM', () => {
    const validKey = '8CjUgdcnn2YG4sxY7aX/q9vyyx4eHRyIzZ+vLgVmKYg='; // 32 bytes base64 from setup

    it('should decrypt encrypted data successfully', async () => {
      const plaintext = 'sensitive data';
      const encrypted = await crypto.encryptAESGCM(plaintext, validKey);
      const decrypted = await crypto.decryptAESGCM(encrypted, validKey);
      
      expect(decrypted).to.equal(plaintext);
    });

    it('should return null for empty encrypted data', async () => {
      const decrypted = await crypto.decryptAESGCM('', validKey);
      expect(decrypted).to.be.null;
    });

    it('should return null for missing key', async () => {
      const encrypted = await crypto.encryptAESGCM('data', validKey);
      const decrypted = await crypto.decryptAESGCM(encrypted, '');
      expect(decrypted).to.be.null;
    });

    it('should return null for invalid encrypted data', async () => {
      const decrypted = await crypto.decryptAESGCM('invalid-data', validKey);
      expect(decrypted).to.be.null;
    });

    it('should return null for wrong key', async () => {
      const plaintext = 'sensitive data';
      const encrypted = await crypto.encryptAESGCM(plaintext, validKey);
      // Generate a different 32-byte key for testing wrong key
      const wrongKey = Buffer.from('wrong-encryption-key-32-bytes-long!!').toString('base64');
      const decrypted = await crypto.decryptAESGCM(encrypted, wrongKey);
      
      expect(decrypted).to.be.null;
    });
  });
});

