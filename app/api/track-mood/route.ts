import { NextResponse } from 'next/server';
import { getTrackInfo } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

// GET /api/track-mood?id=<spotify track id> → { mood, title, artist, album, albumImageUrl, songUrl }
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id') ?? '';
  if (!/^[A-Za-z0-9]{10,40}$/.test(id)) {
    return NextResponse.json({ mood: 'normal' }, { status: 400 });
  }
  const info = await getTrackInfo(id);
  return NextResponse.json(
    info,
    // A track's details and mood never change — cache hard at the edge.
    { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } },
  );
}
