import { NextRequest, NextResponse } from 'next/server';
import { createCart, addToCart, updateCartLine, removeCartLine, getCart } from '@/lib/shopify/cart';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'create': {
        const cart = await createCart(body.variantId, body.quantity ?? 1);
        return NextResponse.json(cart);
      }
      case 'add': {
        const cart = await addToCart(body.cartId, body.variantId, body.quantity ?? 1);
        return NextResponse.json(cart);
      }
      case 'update': {
        const cart = await updateCartLine(body.cartId, body.lineId, body.quantity);
        return NextResponse.json(cart);
      }
      case 'remove': {
        const cart = await removeCartLine(body.cartId, body.lineId);
        return NextResponse.json(cart);
      }
      case 'get': {
        const cart = await getCart(body.cartId);
        return NextResponse.json(cart);
      }
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Cart error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
