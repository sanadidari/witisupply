import { NextResponse } from 'next/server';
import { runMigrations } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/admin/auth';

export async function POST() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const result = await runMigrations();
  return NextResponse.json(result);
}
