 CREATE TABLE IF NOT EXISTS users (
   id TEXT PRIMARY KEY,
   email TEXT UNIQUE NOT NULL,
   name TEXT,
   pwd_hash TEXT NOT NULL,
   pwd_salt TEXT NOT NULL,
   role TEXT DEFAULT 'user',
   created_at TEXT,
   updated_at TEXT,
   email_verified INTEGER DEFAULT 0,
   last_login TEXT
 );
 
 CREATE TABLE IF NOT EXISTS refresh_tokens (
   id TEXT PRIMARY KEY,
   user_id TEXT NOT NULL,
   token_hash TEXT NOT NULL,
   device_info TEXT,
   expires_at TEXT,
   revoked INTEGER DEFAULT 0,
   created_at TEXT,
   rotated_from TEXT
 );
