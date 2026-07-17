import { NextResponse } from 'next/server';
import { getNowPlaying } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getNowPlaying();
  return NextResponse.json(data, {
    headers: {
      // Cache briefly at the edge, allow stale while revalidating.
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=30',
    },
  });
}
