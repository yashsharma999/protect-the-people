// PhonePe Payment Gateway Integration
// Standard Checkout API - Sandbox & Production

// ==================== Types ====================

export interface PhonePeConfig {
  clientId: string;
  clientSecret: string;
  merchantId: string;
  environment: 'sandbox' | 'production';
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface CreateOrderRequest {
  merchantOrderId: string;
  amount: number; // Amount in paise (100 = ₹1)
  redirectUrl: string;
  callbackUrl?: string;
  merchantUserId?: string;
  mobileNumber?: string;
  email?: string;
  shortName?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  state: string;
  redirectUrl: string;
  expireAt: number;
}

export interface OrderStatusResponse {
  orderId: string;
  merchantOrderId: string;
  state: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  amount: number;
  expireAt: number;
  metaInfo?: {
    udf1?: string;
    udf2?: string;
    udf3?: string;
    udf4?: string;
    udf5?: string;
  };
  paymentDetails?: Array<{
    transactionId: string;
    paymentMode: string;
    timestamp: number;
    amount: number;
    state: string;
  }>;
}

export interface WebhookPayload {
  event: 'checkout.order.completed' | 'checkout.order.failed' | 'pg.refund.completed' | 'pg.refund.failed';
  payload: {
    merchantId: string;
    merchantOrderId: string;
    orderId: string;
    state: string;
    amount: number;
    expireAt: number;
    paymentDetails?: Array<{
      transactionId: string;
      paymentMode: string;
      timestamp: number;
      amount: number;
      state: string;
    }>;
  };
}

// ==================== Environment URLs ====================

const PHONEPE_URLS = {
  sandbox: {
    auth: 'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token',
    createOrder: 'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay',
    orderStatus: 'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order',
  },
  production: {
    auth: 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token',
    createOrder: 'https://api.phonepe.com/apis/pg/checkout/v2/pay',
    orderStatus: 'https://api.phonepe.com/apis/pg/checkout/v2/order',
  },
};

// ==================== Helper Functions ====================

export function getPhonePeConfig(): PhonePeConfig {
  const clientId = process.env.PHONEPE_CLIENT_ID;
  const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
  const merchantId = process.env.PHONEPE_MERCHANT_ID;
  const environment = (process.env.PHONEPE_ENV || 'sandbox') as 'sandbox' | 'production';

  if (!clientId || !clientSecret || !merchantId) {
    throw new Error('PhonePe credentials not configured. Please set PHONEPE_CLIENT_ID, PHONEPE_CLIENT_SECRET, and PHONEPE_MERCHANT_ID environment variables.');
  }

  return { clientId, clientSecret, merchantId, environment };
}

export function getUrls(environment: 'sandbox' | 'production') {
  return PHONEPE_URLS[environment];
}

export function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PTPF_${timestamp}_${random}`;
}

// ==================== API Functions ====================

/**
 * Get OAuth access token from PhonePe
 */
export async function getAuthToken(config: PhonePeConfig): Promise<string> {
  const urls = getUrls(config.environment);
  
  const response = await fetch(urls.auth, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      client_version: '1',
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('PhonePe Auth Error:', errorText);
    throw new Error(`Failed to get PhonePe auth token: ${response.status}`);
  }

  const data: AuthTokenResponse = await response.json();
  return data.access_token;
}

/**
 * Create a payment order on PhonePe
 */
export async function createPaymentOrder(
  config: PhonePeConfig,
  accessToken: string,
  order: CreateOrderRequest
): Promise<CreateOrderResponse> {
  const urls = getUrls(config.environment);

  const payload = {
    merchantOrderId: order.merchantOrderId,
    amount: order.amount,
    expireAfter: 1200, // 20 minutes
    metaInfo: {
      udf1: order.email || '',
      udf2: order.shortName || '',
      udf3: order.mobileNumber || '',
    },
    paymentFlow: {
      type: 'PG_CHECKOUT',
      message: `Donation to Protect The People Foundation`,
      merchantUrls: {
        redirectUrl: order.redirectUrl,
        callbackUrl: order.callbackUrl || order.redirectUrl,
      },
    },
  };

  const response = await fetch(urls.createOrder, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `O-Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('PhonePe Create Order Error:', errorText);
    throw new Error(`Failed to create PhonePe order: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Check order status on PhonePe
 */
export async function getOrderStatus(
  config: PhonePeConfig,
  accessToken: string,
  merchantOrderId: string
): Promise<OrderStatusResponse> {
  const urls = getUrls(config.environment);

  const response = await fetch(`${urls.orderStatus}/${merchantOrderId}/status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `O-Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('PhonePe Order Status Error:', errorText);
    throw new Error(`Failed to get order status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Convert rupees to paise
 */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Convert paise to rupees
 */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

