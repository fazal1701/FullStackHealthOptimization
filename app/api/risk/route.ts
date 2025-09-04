import { NextResponse } from 'next/server';
import { sign } from '@/lib/fetch';

export async function GET(req: Request) {
  const u = new URL(req.url);
  const userId = u.searchParams.get('userId');
  const model = u.searchParams.get('model') ?? 'cvd10y';
  const res = await fetch(`${process.env.PY_API}/v1/risk/${userId}?model=${model}`, {
    headers: { 'x-sig': sign() }
  });
  return NextResponse.json(await res.json(), { status: res.status });
} 