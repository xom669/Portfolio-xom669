export function safeSetItem(key: string, value: string): void {
  try {
    // If it's projects cache, prune extra-large fields like inline base64 images to avoid quota issues
    let processedValue = value;
    if (key === 'projects_cache') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          const pruned = parsed.map((project: any) => {
            // Replace long data URLs or huge strings with a simple placeholder in local cache
            if (project.image_url && project.image_url.length > 20000) {
              return {
                ...project,
                image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
              };
            }
            return project;
          });
          processedValue = JSON.stringify(pruned);
        }
      } catch (e) {
        console.warn('[Cache] Could not parse value to prune.', e);
      }
    }

    localStorage.setItem(key, processedValue);
  } catch (error: any) {
    console.warn(`[Cache Warning] Failed to save key "${key}" to localStorage:`, error);
    
    // Check for Quota Exceeded Exception across different browser engines
    if (
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      error.code === 22 ||
      error.code === 1014 ||
      error.message?.toLowerCase().includes('quota') ||
      error.message?.toLowerCase().includes('exceeded')
    ) {
      console.log('[Cache] Storage quota exceeded. Pruning older caches to recover...');
      try {
        // Clear other entries to free up space
        if (key !== 'projects_cache') localStorage.removeItem('projects_cache');
        if (key !== 'skills_cache') localStorage.removeItem('skills_cache');
        if (key !== 'profile_cache') localStorage.removeItem('profile_cache');
        
        // Attempt retry
        localStorage.setItem(key, value);
      } catch (retryError) {
        console.error('[Cache Error] Failed to persist cache even after cleanup:', retryError);
      }
    }
  }
}

export function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`[Cache Error] Failed to retrieve key "${key}" from localStorage:`, error);
    return null;
  }
}
