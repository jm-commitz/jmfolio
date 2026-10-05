import { NextResponse } from 'next/server';
import { getRecentlyPlayed } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function GET() {
  const tracks = await getRecentlyPlayed(5);
  return NextResponse.json(tracks, {
    headers: {
      // History changes slowly — cache a few minutes at the edge.
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
