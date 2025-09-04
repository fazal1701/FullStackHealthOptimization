import 'server-only';
import { unstable_cache as cache } from 'next/cache';

export function sign(): string {
  return 'dev-signature'; // replace with HMAC
}

export const getJSON = cache(async (url: string, init?: RequestInit) => {
  const res = await fetch(url, { ...init, next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`GET ${url} failed`);
  return res.json();
}, ['getJSON'], { revalidate: 60 }); 