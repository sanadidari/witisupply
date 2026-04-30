import { NextRequest, NextResponse } from 'next/server';
import { signAdminToken, ADMIN_COOKIE } from '@/lib/admin/auth';
import sql from '@/lib/db/client';

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS login_attempts (
      id SERIAL PRIMARY KEY,
      ip TEXT NOT NULL,
      attempted_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

async function getRecentAttempts(ip: string): Promise<number> {
  const rows = await sql`
    SELECT COUNT(*) AS count FROM login_attempts
    WHERE ip = ${ip}
      AND attempted_at > NOW() - INTERVAL '${sql.unsafe(String(WINDOW_MINUTES))} minutes'
  `;
  return Number(rows[0]?.count ?? 0);
}

async function recordFailedAttempt(ip: string) {
  await sql`INSERT INTO login_attempts (ip) VALUES (${ip})`;
  // Prune attempts older than the window to keep the table small
  await sql`DELETE FROM login_attempts WHERE attempted_at < NOW() - INTERVAL '${sql.unsafe(String(WINDOW_MINUTES))} minutes'`;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

export async function POST(req: NextRequest) {
  await ensureTable();

  const ip = getClientIp(req);
  const attempts = await getRecentAttempts(ip);

  if (attempts >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: `Too many failed attempts. Try again in ${WINDOW_MINUTES} minutes.` },
      { status: 429 }
    );
  }

  const { username, password } = await req.json();

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    await recordFailedAttempt(ip);
    const remaining = MAX_ATTEMPTS - attempts - 1;
    return NextResponse.json(
      { error: `Invalid credentials. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.` },
      { status: 401 }
    );
  }

  const token = await signAdminToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return res;
}
