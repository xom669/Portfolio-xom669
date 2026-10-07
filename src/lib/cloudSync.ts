/**
 * Real-time Supabase Cloud Synchronization Engine
 * Bridges PC, Mobile, and all visitors to ensure instant global portfolio updates.
 * Powered by Dipanjan's Supabase instance: https://uvfttvbsbakwbvtnlzsd.supabase.co
 */

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase';

export interface CloudPortfolioPayload {
  profile?: any;
  projects?: any[];
  materials?: any[];
  skills?: string[];
  journey?: any[];
  milestones?: any[];
  headerConfig?: any;
  footerConfig?: any;
  youtubeVideos?: string[];
  adminPasscode?: string;
  updatedAt?: number;
}

export const SUPABASE_SETUP_SQL = `-- Run this in your Supabase SQL Editor (optional, for dedicated single-row storage):
CREATE TABLE IF NOT EXISTS public.portfolio_config (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.portfolio_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public access to portfolio_config" ON public.portfolio_config;
CREATE POLICY "Public access to portfolio_config"
    ON public.portfolio_config
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);
`;

const getHeaders = () => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json'
});

/**
 * Fetch the latest live portfolio data from Supabase.
 * Checks dedicated portfolio_config table first, then falls back to projects state record.
 */
export async function fetchFromCloud(): Promise<CloudPortfolioPayload | null> {
  try {
    // Strategy 1: Check dedicated portfolio_config table
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/portfolio_config?id=eq.global&select=data`,
        {
          method: 'GET',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            Accept: 'application/json'
          },
          cache: 'no-store'
        }
      );

      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0 && rows[0]?.data) {
          return rows[0].data as CloudPortfolioPayload;
        }
      }
    } catch (e) {
      console.warn('[CloudSync] portfolio_config fetch failed, checking fallback:', e);
    }

    // Strategy 2: Check fallback record in projects table
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/projects?category=eq.__portfolio_cloud_sync__&order=created_at.desc&limit=1`,
        {
          method: 'GET',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            Accept: 'application/json'
          },
          cache: 'no-store'
        }
      );

      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0 && rows[0]?.description) {
          const parsed = JSON.parse(rows[0].description);
          if (parsed && typeof parsed === 'object') {
            return parsed as CloudPortfolioPayload;
          }
        }
      }
    } catch (e) {
      console.warn('[CloudSync] Fallback record fetch failed:', e);
    }

    // Strategy 3: Check old profiles table for existing avatar or details
    try {
      const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*&limit=1`, {
        method: 'GET',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Accept: 'application/json'
        },
        cache: 'no-store'
      });

      if (profileRes.ok) {
        const rows = await profileRes.json();
        if (Array.isArray(rows) && rows.length > 0 && rows[0]?.pfp_url) {
          return {
            profile: {
              avatarImage: rows[0].pfp_url
            },
            updatedAt: Date.now()
          };
        }
      }
    } catch (e) {
      console.warn('[CloudSync] Old profile table inspection skipped:', e);
    }

    return null;
  } catch (error) {
    console.warn('[CloudSync] Error fetching remote cloud state:', error);
    return null;
  }
}

/**
 * Push updated portfolio state to Supabase so PC, Mobile, and live visitors stay in 100% sync.
 */
export async function pushToCloud(data: CloudPortfolioPayload): Promise<boolean> {
  const payload: CloudPortfolioPayload = {
    ...data,
    updatedAt: Date.now()
  };

  try {
    // Strategy 1: Upsert to dedicated portfolio_config table
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/portfolio_config`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          Prefer: 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          id: 'global',
          data: payload,
          updated_at: new Date().toISOString()
        })
      });

      if (res.ok) {
        return true;
      }
    } catch (e) {
      console.warn('[CloudSync] portfolio_config push failed, falling back:', e);
    }

    // Strategy 2: Insert state snapshot to projects table with category __portfolio_cloud_sync__
    const fallbackRes = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        title: '__PORTFOLIO_STATE_RECORD__',
        description: JSON.stringify(payload),
        category: '__portfolio_cloud_sync__',
        status: 'draft'
      })
    });

    if (fallbackRes.ok || fallbackRes.status === 201) {
      return true;
    }

    console.warn(`[CloudSync] Remote push failed with status ${fallbackRes.status}`);
    return false;
  } catch (error) {
    console.warn('[CloudSync] Error pushing to cloud:', error);
    return false;
  }
}
