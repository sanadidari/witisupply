import { shopifyFetch } from './client';

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
      handle: string;
      images: { edges: { node: { url: string; altText: string | null } }[] };
    };
    price: { amount: string; currencyCode: string };
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: { amount: string; currencyCode: string };
  };
  lines: { edges: { node: CartLine }[] };
}

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount { amount currencyCode }
    }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price { amount currencyCode }
              product {
                title
                handle
                images(first: 1) {
                  edges { node { url altText } }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const CREATE_CART_MUTATION = `
  ${CART_FRAGMENT}
  mutation cartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFragment }
    }
  }
`;

const ADD_LINES_MUTATION = `
  ${CART_FRAGMENT}
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFragment }
    }
  }
`;

const UPDATE_LINES_MUTATION = `
  ${CART_FRAGMENT}
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFragment }
    }
  }
`;

const REMOVE_LINES_MUTATION = `
  ${CART_FRAGMENT}
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFragment }
    }
  }
`;

const GET_CART_QUERY = `
  ${CART_FRAGMENT}
  query getCart($cartId: ID!) {
    cart(id: $cartId) { ...CartFragment }
  }
`;

export async function createCart(variantId: string, quantity = 1): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: { cart: Cart } }>(CREATE_CART_MUTATION, {
    lines: [{ merchandiseId: variantId, quantity }],
  });
  return data.cartCreate.cart;
}

export async function addToCart(cartId: string, variantId: string, quantity = 1): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: Cart } }>(ADD_LINES_MUTATION, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  });
  return data.cartLinesAdd.cart;
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: Cart } }>(UPDATE_LINES_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });
  return data.cartLinesUpdate.cart;
}

export async function removeCartLine(cartId: string, lineId: string): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: Cart } }>(REMOVE_LINES_MUTATION, {
    cartId,
    lineIds: [lineId],
  });
  return data.cartLinesRemove.cart;
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: Cart | null }>(GET_CART_QUERY, { cartId });
  return data.cart;
}
