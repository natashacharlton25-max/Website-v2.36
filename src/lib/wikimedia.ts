/**
 * Utility service to fetch optimized thumbnails from the Wikimedia Commons API.
 * Uses the MediaWiki Action API with `generator=search` and `iiurlwidth` to fetch
 * CORS-safe, perfectly sized CDN thumbnails.
 */

interface WikimediaImageResult {
  cover?: string;
  avatar?: string;
  gallery: string[];
}

/**
 * Fetches an optimized thumbnail URL for a given search query.
 */
async function fetchWikimediaThumbnail(
  searchQuery: string,
  width: number,
  limit: number = 1
): Promise<string[]> {
  const query = encodeURIComponent(searchQuery);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${query}&gsrnamespace=6&gsrlimit=${limit}&prop=imageinfo&iiprop=url&iiurlwidth=${width}&format=json&origin=*`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'StelladoreApp/1.0 (contact@stelladore.uk)'
      }
    });
    const data = await response.json();
    
    const pages = data.query?.pages;
    if (!pages) return [];

    const thumbnails = Object.values(pages)
      .map((page: any) => page?.imageinfo?.[0]?.thumburl)
      .filter((url) => !!url);

    return thumbnails as string[];
  } catch (error) {
    console.error(`Wikimedia fetch failed for query: ${searchQuery}`, error);
    return [];
  }
}

/**
 * Retrieves the full suite of images (cover, avatar, gallery) for a celestial object.
 */
export async function getCelestialImages(objectName: string): Promise<WikimediaImageResult> {
  const results: WikimediaImageResult = {
    gallery: []
  };

  try {
    // 1. Fetch Cover (Wide, high quality, 1000px)
    const covers = await fetchWikimediaThumbnail(`${objectName} planet surface or astronomy`, 1000, 1);
    if (covers.length > 0) results.cover = covers[0];

    // 2. Fetch Avatar (Square-ish, 400px)
    const avatars = await fetchWikimediaThumbnail(`${objectName} planet globe or true color`, 400, 1);
    if (avatars.length > 0) results.avatar = avatars[0];

    // 3. Fetch Gallery (600px, 4 items)
    const galleryItems = await fetchWikimediaThumbnail(`${objectName} planet space exploration`, 600, 4);
    results.gallery = galleryItems;

  } catch (err) {
    console.error('Failed to hydrate celestial images from Wikimedia:', err);
  }

  return results;
}
