// Playlist visitors can play from the Spotify button in the floating rail.
// Paste a PUBLIC playlist link (Spotify → Share → Copy link to playlist); share
// links with "?si=…" work too. Leave empty to disable the mini player.
//
// Spotify's embed plays full songs for visitors logged in to Spotify in that
// browser, and 30-second previews for everyone else (a Spotify rule).
export const PLAYLIST_URL =
  'https://open.spotify.com/playlist/5SoSQBCRwoNioWJxi4Q3WY?si=qD8KaCmuRzys80TDmhpVOQ&utm_source=copy-link&pi=GOrC3JIpRx-E9';

function playlistId(url = PLAYLIST_URL): string | null {
  return url.match(/playlist[/:]([A-Za-z0-9]{10,})/)?.[1] ?? null;
}

/** Spotify URI for PLAYLIST_URL (for the embed IFrame API), or null if unset. */
export function playlistUri(url = PLAYLIST_URL): string | null {
  const id = playlistId(url);
  return id ? `spotify:playlist:${id}` : null;
}
