export interface ScrapedProduct {
  title: string;
  image: string;
  description: string;
  pid: string;
  sourceUrl: string;
}

export async function scrapeProductFromURL(url: string): Promise<ScrapedProduct> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Failed to fetch URL (HTTP ${res.status})`);

  const html = await res.text();

  let title = '';
  let image = '';
  let description = '';

  // 1. Try JSON-LD structured data (most reliable for product pages)
  const jsonLdBlocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const block of jsonLdBlocks) {
    try {
      const data = JSON.parse(block[1]);
      const products = Array.isArray(data) ? data : [data];
      for (const item of products) {
        if (item['@type'] === 'Product') {
          title = title || item.name || '';
          const img = Array.isArray(item.image) ? item.image[0] : item.image;
          image = image || img || '';
          description = description || item.description || '';
        }
      }
    } catch { /* ignore */ }
  }

  // 2. Try CJ-specific patterns in Nuxt/Vue page state
  if (!title) {
    // CJ uses productNameEn as the English name field
    title =
      html.match(/"productNameEn"\s*:\s*"([^"]+)"/)?.[1] ||
      html.match(/"productName"\s*:\s*"([^"]+)"/)?.[1] ||
      html.match(/"name"\s*:\s*"([^"]{10,200})"/)?.[1] ||
      '';
  }

  if (!image) {
    // CJ images are on their CDN — look for the first product image URL
    image =
      html.match(/"productImage"\s*:\s*"(https?:[^"]+)"/)?.[1] ||
      html.match(/"imageUrl"\s*:\s*"(https?:[^"]+)"/)?.[1] ||
      html.match(/"image"\s*:\s*"(https?:[^"]+cj[^"]+)"/i)?.[1] ||
      '';
  }

  // 3. Extract product ID from URL
  const urlObj = new URL(url);
  const pid =
    urlObj.searchParams.get('id') ||
    urlObj.searchParams.get('pid') ||
    urlObj.pathname.split('/').filter(Boolean).pop() ||
    '';

  // 4. Fall back to page <title> (strip site name suffix)
  if (!title) {
    const rawTitle = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '';
    // Remove common site name suffixes
    title = rawTitle
      .replace(/\s*[|\-–]\s*CJ.*$/i, '')
      .replace(/\s*[|\-–]\s*Dropshipping.*$/i, '')
      .trim();
  }

  if (!title) {
    throw new Error(
      'Could not extract product title from this page. Make sure the URL is a direct CJ product page.'
    );
  }

  return {
    title: title.trim(),
    image: image.trim(),
    description: description.trim(),
    pid,
    sourceUrl: url,
  };
}
