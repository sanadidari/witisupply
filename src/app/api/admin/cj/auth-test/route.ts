import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = process.env.CJ_EMAIL;
  const password = process.env.CJ_PASSWORD;

  if (!email || !password) {
    return NextResponse.json({
      error: 'Missing env vars',
      hasEmail: !!email,
      hasPassword: !!password,
    });
  }

  const body = { email, password };

  try {
    const res = await fetch(
      'https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
      sentEmail: email,
      sentPasswordLength: password.length,
    });
  } catch (e) {
    return NextResponse.json({ fetchError: String(e) });
  }
}
