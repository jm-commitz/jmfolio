import type { SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * False when the project isn't configured — local dev without Supabase, or a
 * deploy missing its env vars. Callers hide their UI instead of crashing.
 */
export const presenceEnabled = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

/**
 * Lazily imports supabase-js so its ~35 kB never lands in the first-paint
 * bundle — the presence badge is decorative and can arrive a beat late.
 */
export async function getSupabase(): Promise<SupabaseClient | null> {
  if (!url || !anonKey) return null;
  if (!client) {
    const { createClient } = await import('@supabase/supabase-js');
    client = createClient(url, anonKey, {
      auth: { persistSession: false },
      // Presence only needs the occasional sync, not a firehose.
      realtime: { params: { eventsPerSecond: 2 } },
    });
  }
  return client;
}
