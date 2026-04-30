import sql from '@/lib/db/client';

const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';

async function ensureTokenTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS cj_token_cache (
      id INTEGER PRIMARY KEY DEFAULT 1,
      access_token TEXT NOT NULL,
      refresh_token TEXT NOT NULL,
      expires_at BIGINT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

async function getAccessToken(): Promise<string> {
  await ensureTokenTable();

  // Check DB for a valid cached token (5-min buffer before expiry)
  const rows = await sql`SELECT * FROM cj_token_cache WHERE id = 1`;
  if (rows.length > 0) {
    const cached = rows[0];
    if (Number(cached.expires_at) > Date.now() + 5 * 60 * 1000) {
      return cached.access_token as string;
    }
  }

  // Fetch a fresh token from CJ API
  const apiKey = process.env.CJ_API_KEY;
  if (!apiKey) throw new Error('CJ_API_KEY env var is not set');

  const res = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey }),
    cache: 'no-store',
  });

  const data = await res.json();
  if (!data.result) throw new Error(`CJ Auth failed: ${data.message}`);

  const expiresAt = Date.now() + Number(data.data.accessTokenExpiryDate);

  // Upsert into DB so it persists across cold starts
  await sql`
    INSERT INTO cj_token_cache (id, access_token, refresh_token, expires_at, updated_at)
    VALUES (1, ${data.data.accessToken}, ${data.data.refreshToken}, ${expiresAt}, NOW())
    ON CONFLICT (id) DO UPDATE
      SET access_token = EXCLUDED.access_token,
          refresh_token = EXCLUDED.refresh_token,
          expires_at = EXCLUDED.expires_at,
          updated_at = NOW()
  `;

  return data.data.accessToken as string;
}

export async function cjFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`${CJ_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'CJ-Access-Token': token,
      ...options?.headers,
    },
    cache: 'no-store',
  });
  const data = await res.json();
  if (!data.result) throw new Error(`CJ API error: ${data.message}`);
  return data.data as T;
}
