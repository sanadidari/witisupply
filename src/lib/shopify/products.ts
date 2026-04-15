import { shopifyFetch } from './client';

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  images: {
    edges: { node: { url: string; altText: string | null } }[];
  };
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: { amount: string; currencyCode: string };
        compareAtPrice: { amount: string; currencyCode: string } | null;
      };
    }[];
  };
}

const PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getProducts(first = 50): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{ products: { edges: { node: ShopifyProduct }[] } }>(
    PRODUCTS_QUERY,
    { first }
  );
  return data.products.edges.map((e) => e.node);
}

const PRODUCTS_SORTED_QUERY = `
  query getProductsSorted($first: Int!, $sortKey: ProductSortKeys!, $reverse: Boolean!) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          images(first: 1) {
            edges { node { url altText } }
          }
          variants(first: 1) {
            edges {
              node {
                id title availableForSale
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
              }
            }
          }
        }
      }
    }
  }
`;

export type SortKey = 'MANUAL' | 'BEST_SELLING' | 'TITLE' | 'PRICE' | 'CREATED_AT';

export async function getProductsSorted(
  sortKey: SortKey = 'MANUAL',
  reverse = false,
  first = 100
): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{ products: { edges: { node: ShopifyProduct }[] } }>(
    PRODUCTS_SORTED_QUERY,
    { first, sortKey, reverse }
  );
  return data.products.edges.map((e) => e.node);
}

export interface ShopifyProductDetail extends ShopifyProduct {
  descriptionHtml: string;
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: { amount: string; currencyCode: string };
        compareAtPrice: { amount: string; currencyCode: string } | null;
      };
    }[];
  };
}

const PRODUCT_BY_HANDLE_QUERY = `
  query getProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export async function getProduct(handle: string): Promise<ShopifyProductDetail | null> {
  const data = await shopifyFetch<{ productByHandle: ShopifyProductDetail | null }>(
    PRODUCT_BY_HANDLE_QUERY,
    { handle }
  );
  return data.productByHandle;
}
