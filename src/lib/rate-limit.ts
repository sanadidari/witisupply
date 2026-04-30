import sql from '@/lib/db/client';

export async function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMinutes: number,
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const windowSeconds = windowMinutes * 60;

    const [{ count }] = await sql`
      SELECT COUNT(*)::int AS count FROM rate_limits
      WHERE key = ${key}
        AND attempted_at > NOW() - (${windowSeconds} * INTERVAL '1 second')
    `;

    if (count >= maxAttempts) {
      return { allowed: false, remaining: 0 };
    }

    await sql`INSERT INTO rate_limits (key) VALUES (${key})`;
    await sql`DELETE FROM rate_limits WHERE attempted_at < NOW() - INTERVAL '24 hours'`;

    return { allowed: true, remaining: maxAttempts - count - 1 };
  } catch {
    // Table may not exist yet — allow the request
    return { allowed: true, remaining: maxAttempts };
  }
}
