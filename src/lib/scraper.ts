export interface ScrapedProduct {
  title: string;
  image: string;
  description: string;
  pid: string;
  sourceUrl: string;
}

// Convert URL slug to a readable title
function slugToTitle(slug: string): string {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b([a-z])/g, (c) => c.toUpperCase())
    .trim();
}

export async function scrapeProductFromURL(url: string): Promise<ScrapedProduct> {
  const urlObj = new URL(url);

  const pid =
    urlObj.searchParams.get('id') ||
    urlObj.searchParams.get('pid') ||
    '';

  const slug =
    urlObj.pathname.split('/').filter(Boolean).pop() || '';

  // CJ blocks all server-side requests with CAPTCHA.
  // Return slug-derived title so the user only needs to paste the image URL.
  const isCJ =
    urlObj.hostname.includes('cjdropshipping') ||
    urlObj.hostname.includes('cjdrop');

  if (isCJ) {
    if (!slug && !pid) {
      throw new Error('Invalid CJ URL — make sure you copy the full product page URL.');
    }
    return {
      title: slugToTitle(slug),
      image: '',
      description: '',
      pid: pid || slug,
      sourceUrl: url,
    };
  }

  // Generic HTML scraper for non-CJ URLs
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} — could not fetch URL`);
  const html = await res.text();

  let title = '';
  let image = '';
  let description = '';

  // JSON-LD structured data
  const jsonLdBlocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const block of jsonLdBlocks) {
    try {
      const d = JSON.parse(block[1]);
      const items = Array.isArray(d) ? d : [d];
      for (const item of items) {
        if (item['@type'] === 'Product') {
          title = title || item.name || '';
          const img = Array.isArray(item.image) ? item.image[0] : item.image;
          image = image || img || '';
          description = description || item.description || '';
        }
      }
    } catch { /* ignore */ }
  }

  // OG tags
  if (!title) title = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1] || '';
  if (!image) image = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] || '';
  if (!description) description = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)?.[1] || '';

  // Strip site-name suffix from <title>
  if (!title) {
    const raw = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '';
    title = raw.replace(/\s*[|\-–]\s*.{0,40}$/, '').trim();
  }

  // Last resort: slug
  if (!title && slug) title = slugToTitle(slug);

  if (!title) throw new Error('Could not extract product title. Try a different URL.');

  return { title, image, description, pid: pid || slug, sourceUrl: url };
}
