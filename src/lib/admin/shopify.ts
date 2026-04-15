const domain = process.env.SHOPIFY_STORE_DOMAIN!;
const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
const version = process.env.SHOPIFY_API_VERSION || '2025-01';
const base = `https://${domain}/admin/api/${version}`;

async function adminFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
      ...options?.headers,
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Shopify Admin API ${res.status}: ${await res.text()}`);
  return res.json();
}

export interface AdminProduct {
  id: number;
  title: string;
  handle: string;
  status: 'active' | 'draft' | 'archived';
  published_at: string | null;
  variants: { id: number; price: string; compare_at_price: string | null }[];
  images: { src: string }[];
  tags: string;
}

export async function listProducts(limit = 250): Promise<AdminProduct[]> {
  const data = await adminFetch<{ products: AdminProduct[] }>(
    `/products.json?limit=${limit}&fields=id,title,handle,status,published_at,variants,images,tags`
  );
  return data.products;
}

export async function setProductStatus(
  productId: number,
  active: boolean
): Promise<AdminProduct> {
  const data = await adminFetch<{ product: AdminProduct }>(
    `/products/${productId}.json`,
    {
      method: 'PUT',
      body: JSON.stringify({
        product: {
          id: productId,
          status: active ? 'active' : 'draft',
        },
      }),
    }
  );
  return data.product;
}

export async function updateProductPrices(
  productId: number,
  variantId: number,
  price: string,
  compareAtPrice: string | null
): Promise<void> {
  await adminFetch(`/variants/${variantId}.json`, {
    method: 'PUT',
    body: JSON.stringify({
      variant: {
        id: variantId,
        price,
        compare_at_price: compareAtPrice,
      },
    }),
  });
}
