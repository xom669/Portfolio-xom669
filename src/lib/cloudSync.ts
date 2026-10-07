/**
 * Real-time Cloud Synchronization Engine
 * Bridges PC, Mobile, and all visitors to ensure instant global portfolio updates.
 */

export const CLOUD_RECORD_ID = 'ff808181a09d98f701a1176b5fae18f7';
const CLOUD_API_ENDPOINT = `https://api.restful-api.dev/objects/${CLOUD_RECORD_ID}`;

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

/**
 * Fetch the latest live portfolio data from the cloud.
 */
export async function fetchFromCloud(): Promise<CloudPortfolioPayload | null> {
  try {
    const res = await fetch(CLOUD_API_ENDPOINT, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });

    if (!res.ok) {
      console.warn(`[CloudSync] Remote responded with status ${res.status}`);
      return null;
    }

    const json = await res.json();
    if (json && json.data && typeof json.data === 'object') {
      return json.data as CloudPortfolioPayload;
    }
    return null;
  } catch (error) {
    console.warn('[CloudSync] Error fetching remote cloud state:', error);
    return null;
  }
}

/**
 * Push updated portfolio state to the cloud so PC and Mobile stay in 100% sync.
 */
export async function pushToCloud(data: CloudPortfolioPayload): Promise<boolean> {
  try {
    const payload = {
      name: 'xom669_portfolio_cloud',
      data: {
        ...data,
        updatedAt: Date.now()
      }
    };

    const res = await fetch(CLOUD_API_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      console.warn(`[CloudSync] Remote push failed with status ${res.status}`);
      return false;
    }

    return true;
  } catch (error) {
    console.warn('[CloudSync] Error pushing to cloud:', error);
    return false;
  }
}
