import { NextResponse } from 'next/server';

// Diagnostic endpoint disabled in production.
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { getAdminSession } = await import('@/lib/admin/auth');
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.CJ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'CJ_API_KEY env var is missing', hasApiKey: false });
  }

  try {
    const res = await fetch(
      'https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
        cache: 'no-store',
      }
    );
    const data = await res.json();
    // Return only whether auth succeeded — no key details exposed
    return NextResponse.json({ httpStatus: res.status, result: data.result, message: data.message });
  } catch (e) {
    return NextResponse.json({ fetchError: String(e) });
  }
}
