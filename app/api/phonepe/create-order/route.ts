import { NextRequest, NextResponse } from 'next/server';
import {
  getPhonePeConfig,
  getAuthToken,
  createPaymentOrder,
  generateOrderId,
  rupeesToPaise,
} from '@/lib/phonepe';

interface CreateOrderRequestBody {
  amount: number; // Amount in rupees
  fullName: string;
  email: string;
  phone?: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequestBody = await request.json();

    // Validate required fields
    if (!body.amount || body.amount < 1) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum donation is ₹1' },
        { status: 400 }
      );
    }

    if (!body.fullName || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Get PhonePe config
    const config = getPhonePeConfig();

    // Get auth token
    const accessToken = await getAuthToken(config);

    // Generate unique order ID
    const merchantOrderId = generateOrderId();

    // Get base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const redirectUrl = `${baseUrl}/contribution?payment=callback&orderId=${merchantOrderId}`;
    const callbackUrl = `${baseUrl}/api/phonepe/webhook`;

    // Create payment order
    const order = await createPaymentOrder(config, accessToken, {
      merchantOrderId,
      amount: rupeesToPaise(body.amount),
      redirectUrl,
      callbackUrl,
      email: body.email,
      shortName: body.fullName,
      mobileNumber: body.phone,
    });

    console.log('✅ PhonePe order created:', {
      merchantOrderId,
      orderId: order.orderId,
      amount: body.amount,
      donor: body.fullName,
    });

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      merchantOrderId,
      redirectUrl: order.redirectUrl,
      expireAt: order.expireAt,
    });

  } catch (error) {
    console.error('❌ PhonePe create order error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to create payment order';
    
    // Check if it's a configuration error
    if (errorMessage.includes('credentials not configured')) {
      return NextResponse.json(
        { error: 'Payment gateway not configured. Please contact support.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

