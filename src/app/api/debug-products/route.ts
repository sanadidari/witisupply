import { getProducts } from '@/lib/shopify/products';
import { NextResponse } from 'next/server';

export async function GET() {
  const products = await getProducts(3);
  return NextResponse.json(
    products.map((p) => ({
      title: p.title,
      imageUrl: p.images.edges[0]?.node.url ?? null,
    }))
  );
}
