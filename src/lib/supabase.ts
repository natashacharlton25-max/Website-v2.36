// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { getOrSet, setCache } from './edge-cache';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.PUBLIC_SUPABASE_URL && import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signInWithGoogle() {
  if (!isSupabaseConfigured) {
    alert('Supabase credentials not configured in environment (.env). Operating in browser App Data local storage mode.');
    return;
  }
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/account`,
    },
  });
  if (error) console.error('Google Auth Error:', error.message);
  return data;
}

export async function signOutUser() {
  if (!isSupabaseConfigured) return;
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

export interface GalleryItem {
  url: string;
  title: string | null;
  photographer: string | null;
  caption: string | null;
  provider: 'nasa' | 'unsplash' | 'wikimedia';
}

export interface CosmicProfile {
  id: string;
  views: number;
  bio: string | null;
  cover_url: string | null;
  caption: string | null;
  attribution: { title?: string; photographer?: string; provider?: 'nasa' | 'unsplash' } | null;
  gallery: GalleryItem[] | null;
  last_updated_at: string | null;
}

/**
 * Fetches profile metadata from Supabase with 24h edge cache
 */
export async function getCachedProfile(id: string): Promise<CosmicProfile | null> {
  if (!isSupabaseConfigured) return null;

  return await getOrSet(`profile-${id}`, async () => {
    try {
      const { data, error } = await supabase
        .from('cosmic_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 means row not found
          console.error(`[Supabase Cache] Error fetching ${id}:`, error.message);
        }
        return null;
      }

      return data as CosmicProfile;
    } catch (err) {
      console.error(`[Supabase Cache] Exception fetching ${id}:`, err);
      return null;
    }
  }, 86400);
}

/**
 * Saves/Upserts profile data to Supabase and updates edge cache
 */
export async function saveProfileToCache(profile: Partial<CosmicProfile> & { id: string }): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    const updated = {
      ...profile,
      last_updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('cosmic_profiles')
      .upsert(updated);

    if (error) {
      console.error(`[Supabase Cache] Error saving ${profile.id}:`, error.message);
    } else {
      console.log(`[Supabase Cache] Successfully saved profile: ${profile.id}`);
      await setCache(`profile-${profile.id}`, updated, 86400);
    }
  } catch (err) {
    console.error(`[Supabase Cache] Exception saving ${profile.id}:`, err);
  }
}

/**
 * Client-side friendly method to increment views
 */
export async function incrementProfileViews(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    const { error } = await supabase.rpc('increment_profile_views', { profile_id: id });
    
    if (error) {
      // Fallback: read-then-write
      const { data } = await supabase.from('cosmic_profiles').select('views').eq('id', id).single();
      const currentViews = data?.views || 0;
      await supabase.from('cosmic_profiles').upsert({ id, views: currentViews + 1 });
    }
  } catch (err) {
    console.error(`[Supabase Views] Failed to increment views for ${id}:`, err);
  }
}

// ── CUSTOM PROFILES ──────────────────────────────────────────

export async function getCustomProfile(id: string): Promise<any | null> {
  if (!isSupabaseConfigured) return null;
  return await getOrSet(`custom-profile-${id}`, async () => {
    try {
      const { data, error } = await supabase.from('custom_profiles').select('*').eq('id', id).single();
      if (error) {
        if (error.code !== 'PGRST116') console.error('[Supabase Cache] getCustomProfile Error:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.error('[Supabase Cache] getCustomProfile Exception:', err);
      return null;
    }
  }, 86400 * 30);
}

export async function saveCustomProfile(profile: any): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('custom_profiles').upsert(profile);
    if (error) {
      console.error('[Supabase Cache] saveCustomProfile Error:', error.message);
    } else if (profile?.id) {
      await setCache(`custom-profile-${profile.id}`, profile, 86400 * 30);
    }
  } catch (err) {
    console.error('[Supabase Cache] saveCustomProfile Exception:', err);
  }
}

// ── API STATS ────────────────────────────────────────────────

export async function incrementApiStat(key: string, amount: number = 1): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { data } = await supabase.from('api_stats').select('value').eq('key', key).single();
    const currentValue = data?.value || 0;
    const { error } = await supabase.from('api_stats').upsert({ key, value: currentValue + amount });
    if (error) console.error('[Supabase Cache] incrementApiStat Error:', error.message);
  } catch (err) {
    console.error('[Supabase Cache] incrementApiStat Exception:', err);
  }
}

export async function getApiStats(): Promise<Record<string, number>> {
  const stats: Record<string, number> = { 
    cache_hits: 0, ai_calls: 0, offline_calls: 0,
    gemini_req: 0, gemini_tokens: 0, openai_req: 0, openai_tokens: 0, groq_req: 0, groq_tokens: 0
  };
  if (!isSupabaseConfigured) return stats;
  try {
    const { data, error } = await supabase.from('api_stats').select('*');
    if (error) {
      console.error('[Supabase Cache] getApiStats Error:', error.message);
    } else if (data) {
      for (const row of data) {
        stats[row.key] = row.value;
      }
    }
  } catch (err) {
    console.error('[Supabase Cache] getApiStats Exception:', err);
  }
  return stats;
}

// ── TARGET INSIGHTS ──────────────────────────────────────────

export async function getCachedInsight(name: string): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  return await getOrSet(`insight-${name}`, async () => {
    try {
      const { data, error } = await supabase.from('target_insights').select('insight').eq('name', name).single();
      if (error && error.code !== 'PGRST116') {
        console.error('[Supabase Cache] getCachedInsight Error:', error.message);
      }
      return data?.insight || null;
    } catch (err) {
      console.error('[Supabase Cache] getCachedInsight Exception:', err);
      return null;
    }
  }, 86400 * 30);
}

export async function saveInsight(
  name: string, type: string, ra: string, dec: string, mag: string, insight: string
): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const record = { name, type, ra, dec, mag, insight };
    const { error } = await supabase.from('target_insights').upsert(record);
    if (error) {
      console.error('[Supabase Cache] saveInsight Error:', error.message);
    } else {
      await setCache(`insight-${name}`, insight, 86400 * 30);
    }
  } catch (err) {
    console.error('[Supabase Cache] saveInsight Exception:', err);
  }
}
