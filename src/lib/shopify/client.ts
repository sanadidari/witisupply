const domain = process.env.SHOPIFY_STORE_DOMAIN!;
const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const apiVersion = process.env.SHOPIFY_API_VERSION || '2025-01';

const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { cache?: RequestCache; revalidate?: number }
): Promise<T> {
  const fetchOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
  };

  if (options?.cache) {
    fetchOptions.cache = options.cache;
  } else {
    (fetchOptions as RequestInit & { next: unknown }).next = { revalidate: options?.revalidate ?? 60 };
  }

  const res = await fetch(endpoint, fetchOptions);

  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);

  const { data, errors } = await res.json();
  if (errors) throw new Error(errors[0].message);

  return data as T;
}
