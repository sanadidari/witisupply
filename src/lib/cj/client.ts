const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';

let cachedToken: { token: string; refreshToken: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (5 min buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 5 * 60 * 1000) {
    return cachedToken.token;
  }

  const res = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.CJ_EMAIL!,
      password: process.env.CJ_PASSWORD!,
    }),
    cache: 'no-store',
  });

  const data = await res.json();
  if (!data.result) throw new Error(`CJ Auth failed: ${data.message}`);

  cachedToken = {
    token: data.data.accessToken,
    refreshToken: data.data.refreshToken,
    expiresAt: Date.now() + data.data.accessTokenExpiryDate,
  };

  return cachedToken.token;
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
