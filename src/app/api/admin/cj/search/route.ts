import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import { searchCJProducts } from '@/lib/cj/products';

export async function GET(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('keyword') ?? '';
  const pageNum = parseInt(searchParams.get('page') ?? '1');

  try {
    const results = await searchCJProducts({ keyword, pageNum, pageSize: 20 });
    return NextResponse.json(results);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'CJ search failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
