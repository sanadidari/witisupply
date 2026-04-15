export interface ScrapedProduct {
  title: string;
  image: string;
  description: string;
  pid: string;
  sourceUrl: string;
}

// Attempts to call CJ's internal (unauthenticated) product API using the URL slug.
// CJ's website is fully client-side rendered so HTML scraping yields no product data.
async function fetchCJBySlug(slug: string): Promise<Partial<ScrapedProduct>> {
  const keyword = slug.replace(/-/g, ' ').replace(/\d+(\.\d+)?/g, (m) => m); // keep numbers

  const endpoints = [
    // CJ internal search — try to find the product by keyword
    {
      url: `https://cjdropshipping.com/api/sku/productList/searchProductList?keyword=${encodeURIComponent(keyword)}&pageNum=1&pageSize=1`,
      parse: (d: Record<string, unknown>) => {
        const list = (d?.data as Record<string, unknown>)?.list as Record<string, unknown>[] | undefined;
        const p = list?.[0] as Record<string, unknown> | undefined;
        if (!p) return null;
        return {
          title: (p.productNameEn ?? p.productName ?? '') as string,
          image: (p.productImage ?? p.imageUrl ?? '') as string,
          pid: (p.pid ?? '') as string,
        };
      },
    },
    {
      url: `https://cjdropshipping.com/api/v1/product/search?keyword=${encodeURIComponent(keyword)}&pageNum=1&pageSize=1`,
      parse: (d: Record<string, unknown>) => {
        const list = (d?.data as Record<string, unknown>)?.list as Record<string, unknown>[] | undefined;
        const p = list?.[0] as Record<string, unknown> | undefined;
        if (!p) return null;
        return {
          title: (p.productNameEn ?? p.name ?? '') as string,
          image: (p.productImage ?? p.image ?? '') as string,
          pid: (p.pid ?? p.id ?? '') as string,
        };
      },
    },
    {
      url: `https://cjdropshipping.com/mapi/product/list?keyword=${encodeURIComponent(keyword)}&pageNum=1&pageSize=1`,
      parse: (d: Record<string, unknown>) => {
        const list = (d?.data as Record<string, unknown>)?.list as Record<string, unknown>[] | undefined;
        const p = list?.[0] as Record<string, unknown> | undefined;
        if (!p) return null;
        return {
          title: (p.productNameEn ?? p.name ?? '') as string,
          image: (p.productImage ?? p.image ?? '') as string,
          pid: (p.pid ?? '') as string,
        };
      },
    },
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': 'https://cjdropshipping.com/',
        },
        cache: 'no-store',
      });
      if (!res.ok) continue;
      const data = await res.json() as Record<string, unknown>;
      const parsed = ep.parse(data);
      if (parsed?.title) return parsed;
    } catch { /* try next */ }
  }

  return {};
}

// Converts a URL slug to a human-readable title as a best-effort fallback
function slugToTitle(slug: string): string {
  return slug
    .replace(/-+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export async function scrapeProductFromURL(url: string): Promise<ScrapedProduct> {
  const urlObj = new URL(url);

  // Extract slug / pid from URL
  const pid =
    urlObj.searchParams.get('id') ||
    urlObj.searchParams.get('pid') ||
    '';

  const slug =
    urlObj.pathname.split('/').filter(Boolean).pop() || '';

  // Detect CJ URLs and use their internal API
  const isCJ =
    urlObj.hostname.includes('cjdropshipping.com') ||
    urlObj.hostname.includes('cjdrop');

  if (isCJ && slug) {
    const cjData = await fetchCJBySlug(slug);
    if (cjData.title) {
      return {
        title: cjData.title,
        image: cjData.image || '',
        description: '',
        pid: cjData.pid || pid || slug,
        sourceUrl: url,
      };
    }
  }

  // Generic HTML fallback — fetch page and try meta/OG/JSON-LD
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

  // JSON-LD
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

  // Nuxt field patterns
  if (!title) title = html.match(/"productNameEn"\s*:\s*"([^"]+)"/)?.[1] || '';
  if (!image) image = html.match(/"productImage"\s*:\s*"(https?:[^"]+)"/)?.[1] || '';

  // Strip site-name suffix from generic <title>
  if (!title) {
    const raw = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '';
    title = raw.replace(/\s*[|\-–]\s*(CJ|Dropshipping).*/i, '').trim();
  }

  // Last resort: derive from slug
  if (!title && slug) title = slugToTitle(slug);

  if (!title) throw new Error('Could not extract product title. Try a different URL.');

  return { title, image, description, pid: pid || slug, sourceUrl: url };
}
