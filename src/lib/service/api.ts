// Enhanced fetch API with error handling and caching
export const enhancedFetcher = async (url: string) => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
};

// Create a cache for API responses
const apiCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL

// Fetcher with cache support
export const cachedFetcher = async (url: string) => {
  const now = Date.now();
  const cached = apiCache.get(url);
  
  // Return from cache if valid
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  // Otherwise fetch fresh data
  const data = await enhancedFetcher(url);
  apiCache.set(url, { data, timestamp: now });
  return data;
};

export const swrNoAutoUpdateSettings = {
  revalidateOnFocus: false,
  revalidateOnMount: true,
  revalidateOnReconnect: false,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  refreshInterval: 0,
  initialSize: 100,
  dedupingInterval: 60000, // 1 minute deduping interval for reduced API calls
};
