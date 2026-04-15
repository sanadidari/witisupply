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

  // Extract title — try OG first, then <title>
  const title =
    html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i)?.[1] ||
    html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.replace(/\s*[-|].*$/, '').trim() ||
    '';

  // Extract image — try OG first
  const image =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1] ||
    '';

  // Extract description
  const description =
    html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i)?.[1] ||
    '';

  // Extract product ID from URL query string
  const urlObj = new URL(url);
  const pid =
    urlObj.searchParams.get('id') ||
    urlObj.searchParams.get('pid') ||
    urlObj.pathname.split('/').filter(Boolean).pop() ||
    '';

  if (!title) {
    throw new Error(
      'Could not extract product title. Make sure the URL is a valid CJ product page.'
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
