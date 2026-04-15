import { cjFetch } from './client';

export interface CJProduct {
  pid: string;
  productNameEn: string;
  productImage: string;
  productWeight: string;
  sellPrice: number;
  categoryId: string;
  categoryName: string;
  variants: CJVariant[];
}

export interface CJVariant {
  vid: string;
  variantNameEn: string;
  variantImage: string;
  variantSellPrice: number;
  variantKey: string;
}

export interface CJSearchResult {
  list: CJProduct[];
  total: number;
  pageNum: number;
  pageSize: number;
}

export async function searchCJProducts(params: {
  keyword?: string;
  categoryId?: string;
  pageNum?: number;
  pageSize?: number;
}): Promise<CJSearchResult> {
  const query = new URLSearchParams({
    pageNum: String(params.pageNum ?? 1),
    pageSize: String(params.pageSize ?? 20),
    ...(params.keyword && { productNameEn: params.keyword }),
    ...(params.categoryId && { categoryId: params.categoryId }),
  });

  return cjFetch<CJSearchResult>(`/product/list?${query}`);
}

export async function getCJProduct(pid: string): Promise<CJProduct> {
  return cjFetch<CJProduct>(`/product/query?pid=${pid}`);
}

export async function getCJCategories() {
  return cjFetch<{ categoryId: string; categoryName: string }[]>('/product/getCategory');
}
