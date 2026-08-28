/**
 * Utility service to fetch images from the NASA Image and Video Library API.
 */

export interface NasaImage {
  url: string;
  title: string;
  photographer: string;
  description: string;
}

/**
 * Fetches a stunning image from NASA's archive based on a specific visual query.
 */
export async function getNasaImage(query: string): Promise<NasaImage | null> {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://images-api.nasa.gov/search?q=${encodedQuery}&media_type=image`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`NASA API error: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    const items = data.collection?.items;
    
    if (items && items.length > 0) {
      const validItems = items.filter((item: any) => 
        item.links && item.links.length > 0 && item.data && item.data.length > 0
      );

      if (validItems.length > 0) {
        const randomItem = validItems[Math.floor(Math.random() * Math.min(validItems.length, 10))];
        const meta = randomItem.data[0];
        const imgUrl = randomItem.links[0].href;
        
        return {
          url: imgUrl,
          title: meta.title || 'Cosmic View',
          photographer: meta.photographer || meta.secondary_creator || meta.center || 'NASA',
          description: meta.description || ''
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch from NASA:', error);
    return null;
  }
}

/**
 * Fetches multiple images from NASA's archive for the gallery.
 */
export async function getNasaImages(query: string, limit: number = 4): Promise<NasaImage[]> {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://images-api.nasa.gov/search?q=${encodedQuery}&media_type=image`;

  try {
    const response = await fetch(url);
    if (!response.ok) return [];

    const data = await response.json();
    const items = data.collection?.items;
    
    if (items && items.length > 0) {
      const validItems = items.filter((item: any) => 
        item.links && item.links.length > 0 && item.data && item.data.length > 0
      );

      const shuffled = validItems.sort(() => 0.5 - Math.random());
      
      return shuffled.slice(0, limit).map((item: any) => {
        const meta = item.data[0];
        return {
          url: item.links[0].href,
          title: meta.title || 'Cosmic View',
          photographer: meta.photographer || meta.secondary_creator || meta.center || 'NASA',
          description: meta.description || ''
        };
      });
    }
  } catch (err) {
    console.error('Failed to fetch multiple images from NASA:', err);
  }
  return [];
}
