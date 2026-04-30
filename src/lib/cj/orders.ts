import { cjFetch } from './client';
import { getCJProduct } from './products';

interface ShippingAddress {
  first_name: string;
  last_name: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country_code: string;
  zip: string;
  phone?: string;
}

export interface CJOrderResult {
  cjOrderId: string;
  status: string;
}

export async function placeCJOrder(params: {
  pid: string;
  quantity: number;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  shopifyOrderNumber: string;
}): Promise<CJOrderResult> {
  const { pid, quantity, customerEmail, shippingAddress, shopifyOrderNumber } = params;

  const product = await getCJProduct(pid);
  if (!product.variants || product.variants.length === 0) {
    throw new Error(`No variants found for CJ product ${pid}`);
  }

  const vid = product.variants[0].vid;
  const consignee = `${shippingAddress.first_name} ${shippingAddress.last_name}`.trim();
  const address = [shippingAddress.address1, shippingAddress.address2].filter(Boolean).join(', ');

  const result = await cjFetch<{ orderId: string; status: string }>(
    '/shopping/order/createOrderV2',
    {
      method: 'POST',
      body: JSON.stringify({
        commodities: [{ vid, quantity }],
        consigneeAddress: {
          consignee,
          email: customerEmail,
          phone: shippingAddress.phone || '',
          country: shippingAddress.country_code,
          province: shippingAddress.province,
          city: shippingAddress.city,
          address,
          zip: shippingAddress.zip,
        },
        remark: `Shopify ${shopifyOrderNumber}`,
        shippingNameEN: 'CJPacket Ordinary',
      }),
    }
  );

  return { cjOrderId: result.orderId, status: result.status };
}

export interface CJOrderTracking {
  orderId: string;
  status: string;
  trackingNumber: string | null;
  trackingCompany: string | null;
}

export async function getCJOrderTracking(cjOrderId: string): Promise<CJOrderTracking> {
  const result = await cjFetch<{
    orderId: string;
    orderStatus: string;
    trackingNumber: string;
    logisticsName: string;
  }>(`/shopping/order/getOrderDetail?orderId=${cjOrderId}`);

  return {
    orderId: result.orderId,
    status: result.orderStatus,
    trackingNumber: result.trackingNumber || null,
    trackingCompany: result.logisticsName || null,
  };
}
