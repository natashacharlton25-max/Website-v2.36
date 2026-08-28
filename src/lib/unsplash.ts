/**
 * Utility service to fetch images from the Unsplash API.
 * Includes attribution and tracking endpoints as required by Unsplash API terms.
 */

export interface UnsplashImage {
  url: string;
  photographerName: string;
  photographerUsername: string;
  downloadLocation: string;
}

function getEnvValue(key: string): string | undefined {
  if (typeof process !== 'undefined' && process.env[key]) return process.env[key];
  if (import.meta.env && import.meta.env[key]) return import.meta.env[key];
  return undefined;
}

/**
 * Fetches a single high-quality image from Unsplash based on a search query.
 */
export async function getUnsplashImage(query: string, orientation: 'landscape' | 'portrait' | 'squarish' = 'landscape'): Promise<UnsplashImage | null> {
  const accessKey = getEnvValue('UNSPLASH_ACCESS_KEY');
  
  if (!accessKey) {
    console.warn('Unsplash API key is missing. Skipping Unsplash fetch.');
    return null;
  }

  const encodedQuery = encodeURIComponent(query);
  const url = `https://api.unsplash.com/search/photos?query=${encodedQuery}&orientation=${orientation}&per_page=1&client_id=${accessKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Unsplash API error: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const photo = data.results[0];
      return {
        url: photo.urls.regular,
        photographerName: photo.user.name,
        photographerUsername: photo.user.username,
        downloadLocation: photo.links.download_location
      };
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch from Unsplash:', error);
    return null;
  }
}
