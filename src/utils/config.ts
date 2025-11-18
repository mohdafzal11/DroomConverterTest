import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const config = {
  basePath: publicRuntimeConfig.basePath as string,
  apiPath: publicRuntimeConfig.apiPath as string,
  cmcImageUrl: publicRuntimeConfig.cmcImageUrl as string,
} as const;


const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

export const getApiUrl = memoize((path: string) => {
  let uri = path.startsWith('/') ? path.slice(1) : path;
  
  let finalUri = `${process.env.NEXT_PUBLIC_API_URL}/api/${uri}`;
  
  if (finalUri.includes("/undefined")) {
    finalUri = finalUri.replace(/\/undefined|undefined/g, "");
  }
  
  return finalUri;
});

export const getCmcImageUrl = memoize((cmcId: string | number) => 
  `${config.cmcImageUrl}/${cmcId}.png`
);

export const getPageUrl = memoize((path: string) => 
  !path || path === undefined ? `${config.basePath}` : `${config.basePath}${path}`
);

export const getHostPageUrl = memoize((path: string) => {
  if (!process.env.NEXT_PUBLIC_URL) {
    return path.startsWith('/') ? path : `/${path}`;
  }
  
  const url = new URL(process.env.NEXT_PUBLIC_URL);
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${url.protocol}//${url.host}${normalizedPath}`;
});

export function getCacheControlHeaders(duration = 3600) {
  return `public, max-age=${duration}, s-maxage=${duration * 2}, stale-while-revalidate=${duration * 4}`;
}

export function getStaticAssetHeaders() {
  return 'public, max-age=31536000, immutable';
}

type CacheItem = {
  data: any;
  timestamp: number;
  ttl: number;
};

export class ApiCache {
  private static cache: Record<string, CacheItem> = {};
  
  static async getOrFetch<T>(key: string, fetchFn: () => Promise<T>, ttl = 300): Promise<T> {
    const now = Date.now();
    const cached = this.cache[key];
    
    if (cached && now - cached.timestamp < cached.ttl * 1000) {
      return cached.data;
    }
    
    try {
      const data = await fetchFn();
      
      this.cache[key] = {
        data,
        timestamp: now,
        ttl
      };
      
      return data;
    } catch (error) {
      if (cached) {
        return cached.data;
      }
      throw error;
    }
  }
  
  static clear(key?: string): void {
    if (key) {
      delete this.cache[key];
    } else {
      this.cache = {};
    }
  }
}

export const createOptimizedFetch = (baseUrl: string, defaultOptions: RequestInit = {}) => {
  return async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const url = `${baseUrl}${endpoint}`;
    const fetchOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...defaultOptions.headers,
        ...options?.headers,
      },
    };
    
    const cacheKey = `${url}:${JSON.stringify(fetchOptions)}`;
    
    return ApiCache.getOrFetch<T>(
      cacheKey,
      async () => {
        const response = await fetch(url, fetchOptions);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        return response.json();
      },
      60 
    );
  };
};

export const apiClient = createOptimizedFetch(process.env.NEXT_PUBLIC_API_URL || '');