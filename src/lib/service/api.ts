/**
 * Enhanced fetch API with error handling, retries, and timeout
 * @param url The URL to fetch
 * @param retries Number of retry attempts (default: 2)
 * @param retryDelay Delay between retries in ms (default: 1000)
 * @param timeout Timeout in ms (default: 8000)
 */
export const enhancedFetcher = async (
  url: string,
  retries = 2,
  retryDelay = 1000,
  timeout = 8000
): Promise<any> => {
  // Create an abort controller for timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    let lastError;
    
    // Attempt fetching with retries
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'max-age=300', // Cache for 5 minutes
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error;
        
        // Don't retry on last attempt or if aborted
        if (attempt === retries || error instanceof DOMException && error.name === 'AbortError') {
          throw error;
        }
        
        // Wait before next retry
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
    
    throw lastError;
  } finally {
    clearTimeout(timeoutId);
  }
};

// Simplified fetcher with built-in caching for SWR
export const cachedFetcher = async (url: string) => {
  const cache = new Map();
  
  if (cache.has(url)) {
    return cache.get(url);
  }
  
  const data = await enhancedFetcher(url);
  cache.set(url, data);
  return data;
};

// SWR configuration for items that don't need frequent updates
export const swrNoAutoUpdateSettings = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 0,
  dedupingInterval: 600000, // 10 minutes
};