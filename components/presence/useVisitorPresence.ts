'use client';

import { useEffect, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { getSupabase, presenceEnabled } from '@/lib/supabase';

const STORAGE_KEY = 'folio:visitor-id';
const CHANNEL = 'visitors';

/**
 * Per-tab id, so two tabs honestly read as two viewers. sessionStorage means
 * nothing outlives the tab. Hex only — it doubles as the avatar route's seed,
 * which rejects anything outside [A-Za-z0-9_-].
 */
function getVisitorId(): string {
  const existing = sessionStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const id =
    typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 16)
      : Math.random().toString(16).slice(2, 18);

  sessionStorage.setItem(STORAGE_KEY, id);
  return id;
}

export function useVisitorPresence() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    if (!presenceEnabled) return;

    let channel: RealtimeChannel | null = null;
    let cancelled = false;

    (async () => {
      const supabase = await getSupabase();
      if (!supabase || cancelled) return;

      const id = getVisitorId();
      // Optimistic: you're definitely here, so the badge never flashes empty.
      setIds([id]);

      channel = supabase.channel(CHANNEL, {
        config: { presence: { key: id } },
      });

      channel
        .on('presence', { event: 'sync' }, () => {
          if (!channel) return;
          setIds(Object.keys(channel.presenceState()));
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') void channel?.track({ at: Date.now() });
        });
    })();

    // Strict-mode double mounts and route changes must not leak sockets.
    return () => {
      cancelled = true;
      if (channel) {
        void channel.untrack();
        void getSupabase().then((supabase) => {
          if (channel) supabase?.removeChannel(channel);
        });
      }
    };
  }, []);

  return { enabled: presenceEnabled, ids, count: ids.length };
}
