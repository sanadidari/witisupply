import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import { scrapeProductFromURL } from '@/lib/scraper';

export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

  try {
    const product = await scrapeProductFromURL(url);
    return NextResponse.json(product);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch product' },
      { status: 400 }
    );
  }
}
