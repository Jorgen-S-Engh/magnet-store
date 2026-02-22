import { createHmac, timingSafeEqual } from 'crypto';

const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 timer

function getSecret(): string | undefined {
  return process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET;
}

export function createAdminToken(): string {
  const secret = getSecret();
  if (!secret) throw new Error('ADMIN_PASSWORD må være satt');
  const payload = JSON.stringify({
    admin: true,
    exp: Date.now() + TOKEN_EXPIRY_MS,
  });
  const payloadBase64 = Buffer.from(payload).toString('base64url');
  const signature = createHmac('sha256', secret).update(payloadBase64).digest('base64url');
  return `${payloadBase64}.${signature}`;
}

export function verifyAdminToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') return false;
  const secret = getSecret();
  if (!secret) return false;

  try {
    const [payloadBase64, signature] = token.split('.');
    if (!payloadBase64 || !signature) return false;

    const expectedSig = createHmac('sha256', secret).update(payloadBase64).digest('base64url');
    if (signature.length !== expectedSig.length || !timingSafeEqual(Buffer.from(signature, 'base64url'), Buffer.from(expectedSig, 'base64url'))) {
      return false;
    }

    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString());
    if (!payload.admin || !payload.exp) return false;
    if (Date.now() > payload.exp) return false;

    return true;
  } catch {
    return false;
  }
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (password.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(password, 'utf8'), Buffer.from(expected, 'utf8'));
}
