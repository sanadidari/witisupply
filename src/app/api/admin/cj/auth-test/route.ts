import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.CJ_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      error: 'CJ_API_KEY env var is missing',
      hasApiKey: false,
    });
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

    const text = await res.text();
    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }

    return NextResponse.json({
      httpStatus: res.status,
      rawText: text,
      parsed: json,
      apiKeyLength: apiKey.length,
      apiKeyPreview: apiKey.slice(0, 8) + '...',
    });
  } catch (e) {
    return NextResponse.json({ fetchError: String(e) });
  }
}
