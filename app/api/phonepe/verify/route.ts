import { NextRequest, NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { Resend } from 'resend';
import {
  getPhonePeConfig,
  getAuthToken,
  getOrderStatus,
  paiseToRupees,
} from '@/lib/phonepe';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Google Sheets authentication
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

interface VerifyRequestBody {
  merchantOrderId: string;
  donorInfo: {
    fullName: string;
    email: string;
    phone?: string;
    message?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyRequestBody = await request.json();

    if (!body.merchantOrderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get PhonePe config and auth token
    const config = getPhonePeConfig();
    const accessToken = await getAuthToken(config);

    // Check order status
    const orderStatus = await getOrderStatus(config, accessToken, body.merchantOrderId);

    console.log('📋 PhonePe order status:', {
      merchantOrderId: body.merchantOrderId,
      state: orderStatus.state,
    });

    // If payment is successful, save to Google Sheets and send email
    if (orderStatus.state === 'COMPLETED') {
      const amountInRupees = paiseToRupees(orderStatus.amount);
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

      // Get transaction details
      const transactionId = orderStatus.paymentDetails?.[0]?.transactionId || orderStatus.orderId;
      const paymentMode = orderStatus.paymentDetails?.[0]?.paymentMode || 'PhonePe';

      // 1. Save to Google Sheets
      if (process.env.GOOGLE_SHEET_ID && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
        try {
          const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
          await doc.loadInfo();

          let sheet = doc.sheetsByTitle['Donations'];
          if (!sheet) {
            sheet = await doc.addSheet({
              title: 'Donations',
              headerValues: ['Timestamp', 'Full Name', 'Email', 'Phone', 'Amount (₹)', 'Type', 'Message', 'Transaction ID', 'Payment Mode', 'Status'],
            });
          }

          await sheet.addRow({
            'Timestamp': timestamp,
            'Full Name': body.donorInfo.fullName,
            'Email': body.donorInfo.email,
            'Phone': body.donorInfo.phone || '',
            'Amount (₹)': amountInRupees.toString(),
            'Type': 'one-time',
            'Message': body.donorInfo.message || '',
            'Transaction ID': transactionId,
            'Payment Mode': paymentMode,
            'Status': 'COMPLETED',
          });

          console.log('✅ Donation saved to Google Sheets');
        } catch (sheetError) {
          console.error('❌ Google Sheets error:', sheetError instanceof Error ? sheetError.message : sheetError);
        }
      }

      // 2. Send confirmation email
      if (process.env.RESEND_API_KEY && process.env.NOTIFICATION_EMAIL) {
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'Donation Received <onboarding@resend.dev>',
            to: process.env.NOTIFICATION_EMAIL,
            subject: `💚 Payment Received: ₹${amountInRupees.toLocaleString('en-IN')} from ${body.donorInfo.fullName}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1a2e35; border-bottom: 2px solid #ccff00; padding-bottom: 10px;">
                  ✅ Payment Successfully Received
                </h2>
                
                <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center;">
                  <p style="margin: 0; font-size: 14px; opacity: 0.9;">Amount Received</p>
                  <p style="margin: 5px 0; font-size: 36px; font-weight: bold;">₹${amountInRupees.toLocaleString('en-IN')}</p>
                  <p style="margin: 0; font-size: 12px; opacity: 0.8;">via ${paymentMode}</p>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                  <tr style="background: #f9f9f9;">
                    <td style="padding: 12px; border: 1px solid #eee; font-weight: bold; width: 140px;">Donor Name</td>
                    <td style="padding: 12px; border: 1px solid #eee;">${body.donorInfo.fullName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; border: 1px solid #eee; font-weight: bold;">Email</td>
                    <td style="padding: 12px; border: 1px solid #eee;">
                      <a href="mailto:${body.donorInfo.email}" style="color: #1a2e35;">${body.donorInfo.email}</a>
                    </td>
                  </tr>
                  ${body.donorInfo.phone ? `
                  <tr style="background: #f9f9f9;">
                    <td style="padding: 12px; border: 1px solid #eee; font-weight: bold;">Phone</td>
                    <td style="padding: 12px; border: 1px solid #eee;">
                      <a href="tel:${body.donorInfo.phone}" style="color: #1a2e35;">${body.donorInfo.phone}</a>
                    </td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 12px; border: 1px solid #eee; font-weight: bold;">Transaction ID</td>
                    <td style="padding: 12px; border: 1px solid #eee; font-family: monospace;">${transactionId}</td>
                  </tr>
                  <tr style="background: #f9f9f9;">
                    <td style="padding: 12px; border: 1px solid #eee; font-weight: bold;">Order ID</td>
                    <td style="padding: 12px; border: 1px solid #eee; font-family: monospace;">${body.merchantOrderId}</td>
                  </tr>
                </table>
                
                ${body.donorInfo.message ? `
                <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px;">
                  <h3 style="margin: 0 0 10px 0; color: #1a2e35;">Donor's Message:</h3>
                  <p style="margin: 0; color: #444; line-height: 1.6;">${body.donorInfo.message}</p>
                </div>
                ` : ''}
                
                <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
                  Payment received on ${timestamp} IST
                </p>
              </div>
            `,
          });

          console.log('✅ Confirmation email sent');
        } catch (emailError) {
          console.error('❌ Email error:', emailError);
        }
      }

      return NextResponse.json({
        success: true,
        status: 'COMPLETED',
        amount: amountInRupees,
        transactionId,
        message: 'Payment successful! Thank you for your donation.',
      });
    }

    // Payment not completed
    return NextResponse.json({
      success: false,
      status: orderStatus.state,
      message: orderStatus.state === 'PENDING' 
        ? 'Payment is still being processed. Please wait.'
        : 'Payment was not successful. Please try again.',
    });

  } catch (error) {
    console.error('❌ Verify payment error:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to verify payment' },
      { status: 500 }
    );
  }
}

