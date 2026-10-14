/**
 * Video Storage & Upload Engine for xom669 Studio CMS
 * Supports:
 * 1. Supabase Storage CDN upload (via 'videos' bucket)
 * 2. Supabase Database payload fallback (via projects table)
 * 3. Local IndexedDB persistent caching for instantaneous zero-latency local playback
 */

import { supabase, SUPABASE_URL } from './supabase';

const DB_NAME = 'xom669_media_db';
const STORE_NAME = 'videos';
const DB_VERSION = 1;

export const SUPABASE_VIDEOS_BUCKET_SQL = `-- Run this in your Supabase SQL Editor to enable unlimited CDN video streaming:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('videos', 'videos', true, 52428800, ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg'])
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Videos Select" ON storage.objects;
CREATE POLICY "Public Videos Select" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'videos');

DROP POLICY IF EXISTS "Public Videos Insert" ON storage.objects;
CREATE POLICY "Public Videos Insert" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'videos');

DROP POLICY IF EXISTS "Public Videos Update" ON storage.objects;
CREATE POLICY "Public Videos Update" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'videos');
`;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveVideoToIndexedDB(id: string, dataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(dataUrl, id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to cache video to IndexedDB:', err);
  }
}

export async function getVideoFromIndexedDB(id: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

/**
 * Upload a local video file from CMS.
 * Tries Supabase Storage bucket 'videos' first.
 * If bucket is not present, falls back to Supabase database & IndexedDB seamlessly.
 */
export async function uploadVideoFile(
  file: File,
  onStatus?: (status: string) => void
): Promise<{ url: string; mode: 'storage' | 'database' }> {
  const ext = file.name.split('.').pop() || 'mp4';
  const cleanName = `ambient_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.${ext}`;

  // 1. Try Supabase Storage CDN upload
  try {
    onStatus?.('⚡ Uploading to Supabase Cloud Storage...');
    const { data, error } = await supabase.storage.from('videos').upload(cleanName, file, {
      contentType: file.type || 'video/mp4',
      upsert: true
    });

    if (!error && data) {
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/videos/${cleanName}`;
      onStatus?.('✓ Video uploaded to Supabase Storage CDN!');
      return { url: publicUrl, mode: 'storage' };
    }
  } catch (err) {
    console.warn('Supabase storage upload skipped or bucket missing:', err);
  }

  // 2. Fallback: Convert to Base64 and save to cloud database & local IndexedDB
  onStatus?.('Processing video data & caching locally...');
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;

        // Cache in local IndexedDB
        await saveVideoToIndexedDB(cleanName, dataUrl);

        // Upload to Supabase projects table as fallback cloud record
        try {
          onStatus?.('⚡ Syncing video with Supabase database...');
          await supabase.from('projects').insert({
            title: cleanName,
            category: '__portfolio_uploaded_video__',
            description: dataUrl,
            status: 'published'
          });
          onStatus?.('✓ Video saved and synced!');
        } catch (dbErr) {
          console.warn('Could not insert to projects table:', dbErr);
        }

        resolve({ url: dataUrl, mode: 'database' });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}
