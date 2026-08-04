import { Avatar, Style } from '@dicebear/core';
import micah from '@dicebear/styles/micah.json';

// Built once per instance and reused: the style definition is a few hundred kB
// of JSON, and DiceBear validates it on construction.
const style = new Style(micah);

// The seed arrives as a URL path segment, so keep it to characters that can't
// be used to probe paths or blow up the CDN cache with arbitrary keys.
const SAFE_SEED = /^[A-Za-z0-9_-]{1,64}$/;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ seed: string }> }
) {
  const { seed } = await params;

  if (!SAFE_SEED.test(seed)) {
    return new Response('Invalid seed', { status: 400 });
  }

  const svg = new Avatar(style, { seed }).toString();

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      // seed → avatar is deterministic, so this can be cached forever.
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
