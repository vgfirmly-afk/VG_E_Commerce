// utils/logger.js
export function logger(event, meta = {}) {
  // redact emails if present
  if (meta.email) meta.email = redactEmail(meta.email);
  // don't log tokens or passwords. If present, remove them
  delete meta.password;
  delete meta.refreshToken;
  delete meta.accessToken;
  console.log(JSON.stringify({ ts: new Date().toISOString(), event, meta }));
}

function redactEmail(e) {
  try {
    const [local, domain] = e.split('@');
    if (!local || !domain) return 'redacted';
    const visible = local.slice(0, Math.min(2, local.length));
    return `${visible}***@${domain}`;
  } catch {
    return 'redacted';
  }
}
