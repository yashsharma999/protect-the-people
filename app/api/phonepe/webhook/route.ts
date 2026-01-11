import { NextRequest, NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { WebhookPayload, paiseToRupees } from '@/lib/phonepe';

// Google Sheets authentication
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

/**
 * PhonePe Webhook Handler
 * Receives server-to-server notifications about payment status changes
 * 
 * Events handled:
 * - checkout.order.completed
 * - checkout.order.failed
 * - pg.refund.completed
 * - pg.refund.failed
 */
export async function POST(request: NextRequest) {
  try {
    const payload: WebhookPayload = await request.json();

    console.log('📩 PhonePe Webhook received:', {
      event: payload.event,
      merchantOrderId: payload.payload.merchantOrderId,
      orderId: payload.payload.orderId,
      state: payload.payload.state,
    });

    const { event, payload: data } = payload;

    // Handle payment completion
    if (event === 'checkout.order.completed' && data.state === 'COMPLETED') {
      const amountInRupees = paiseToRupees(data.amount);
      const now = new Date();
      const timestamp = now.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      // Log to webhook log sheet (separate from main donations sheet)
      if (process.env.GOOGLE_SHEET_ID && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
        try {
          const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
          await doc.loadInfo();

          // Get or create webhook log sheet
          let webhookSheet = doc.sheetsByTitle['Payment Webhooks'];
          if (!webhookSheet) {
            webhookSheet = await doc.addSheet({
              title: 'Payment Webhooks',
              headerValues: ['Timestamp', 'Event', 'Order ID', 'Merchant Order ID', 'Amount (₹)', 'State', 'Transaction ID', 'Payment Mode'],
            });
          }

          const transactionId = data.paymentDetails?.[0]?.transactionId || data.orderId;
          const paymentMode = data.paymentDetails?.[0]?.paymentMode || 'N/A';

          await webhookSheet.addRow({
            'Timestamp': timestamp,
            'Event': event,
            'Order ID': data.orderId,
            'Merchant Order ID': data.merchantOrderId,
            'Amount (₹)': amountInRupees.toString(),
            'State': data.state,
            'Transaction ID': transactionId,
            'Payment Mode': paymentMode,
          });

          console.log('✅ Webhook logged to Google Sheets');
        } catch (sheetError) {
          console.error('❌ Google Sheets webhook log error:', sheetError);
        }
      }

      console.log('✅ Payment completed via webhook:', {
        merchantOrderId: data.merchantOrderId,
        amount: amountInRupees,
      });
    }

    // Handle payment failure
    if (event === 'checkout.order.failed') {
      console.log('❌ Payment failed via webhook:', {
        merchantOrderId: data.merchantOrderId,
        orderId: data.orderId,
      });
    }

    // Handle refund events
    if (event === 'pg.refund.completed') {
      console.log('💰 Refund completed:', {
        merchantOrderId: data.merchantOrderId,
        amount: paiseToRupees(data.amount),
      });
    }

    if (event === 'pg.refund.failed') {
      console.log('❌ Refund failed:', {
        merchantOrderId: data.merchantOrderId,
      });
    }

    // Always respond with 200 to acknowledge receipt
    return NextResponse.json({ 
      received: true,
      event: event,
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    
    // Still return 200 to prevent retries for parsing errors
    return NextResponse.json({ 
      received: true, 
      error: 'Processing error',
    });
  }
}

// PhonePe may send GET requests to verify endpoint availability
export async function GET() {
  return NextResponse.json({ 
    status: 'Webhook endpoint active',
    timestamp: new Date().toISOString(),
  });
}

