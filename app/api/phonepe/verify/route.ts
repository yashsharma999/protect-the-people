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

      // 2. Send notification email to admin
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

          console.log('✅ Admin notification email sent');
        } catch (emailError) {
          console.error('❌ Admin email error:', emailError);
        }
      }

      // 3. Send thank you email to donor
      if (process.env.RESEND_API_KEY && body.donorInfo.email) {
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'Protect The People Foundation <onboarding@resend.dev>',
            to: body.donorInfo.email,
            subject: `Thank you for your donation of ₹${amountInRupees.toLocaleString('en-IN')} 💚`,
            html: `
              <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #1a2e35 0%, #2d4a54 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Thank You! 🙏</h1>
                  <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 16px;">Your generosity makes a difference</p>
                </div>
                
                <!-- Amount Card -->
                <div style="background: linear-gradient(135deg, #ccff00 0%, #a8e600 100%); padding: 30px; text-align: center; margin: -1px 0;">
                  <p style="margin: 0; font-size: 14px; color: #1a2e35; opacity: 0.8;">Donation Amount</p>
                  <p style="margin: 8px 0; font-size: 48px; font-weight: bold; color: #1a2e35;">₹${amountInRupees.toLocaleString('en-IN')}</p>
                  <p style="margin: 0; font-size: 13px; color: #1a2e35; opacity: 0.7;">One-time donation</p>
                </div>
                
                <!-- Message -->
                <div style="padding: 30px;">
                  <p style="color: #333; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                    Dear <strong>${body.donorInfo.fullName}</strong>,
                  </p>
                  <p style="color: #555; font-size: 15px; line-height: 1.7; margin: 0 0 20px 0;">
                    On behalf of everyone at <strong>Protect The People Foundation</strong>, we want to express our heartfelt gratitude for your generous donation. Your support helps us continue our mission of empowering communities through education, food security, and human rights advocacy.
                  </p>
                  <p style="color: #555; font-size: 15px; line-height: 1.7; margin: 0 0 25px 0;">
                    Every contribution, no matter the size, brings us one step closer to creating lasting change in the lives of those who need it most.
                  </p>
                  
                  <!-- Receipt Box -->
                  <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin: 25px 0;">
                    <h3 style="margin: 0 0 15px 0; color: #1a2e35; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Payment Receipt</h3>
                    <table style="width: 100%; font-size: 14px;">
                      <tr>
                        <td style="padding: 8px 0; color: #666;">Transaction ID</td>
                        <td style="padding: 8px 0; color: #1a2e35; font-family: monospace; text-align: right;">${transactionId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666;">Payment Method</td>
                        <td style="padding: 8px 0; color: #1a2e35; text-align: right;">${paymentMode}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666;">Date</td>
                        <td style="padding: 8px 0; color: #1a2e35; text-align: right;">${timestamp}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666;">Order Reference</td>
                        <td style="padding: 8px 0; color: #1a2e35; font-family: monospace; text-align: right; font-size: 12px;">${body.merchantOrderId}</td>
                      </tr>
                    </table>
                  </div>
                  
                  <p style="color: #555; font-size: 15px; line-height: 1.7; margin: 25px 0 0 0;">
                    With gratitude,<br>
                    <strong style="color: #1a2e35;">The Protect The People Foundation Team</strong>
                  </p>
                </div>
                
                <!-- Footer -->
                <div style="background: #f8f9fa; padding: 25px 30px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #eee;">
                  <p style="margin: 0 0 10px 0; color: #888; font-size: 13px;">
                    Questions about your donation? Reply to this email or contact us.
                  </p>
                  <p style="margin: 0; color: #aaa; font-size: 12px;">
                    © ${new Date().getFullYear()} Protect The People Foundation. All rights reserved.
                  </p>
                </div>
              </div>
            `,
          });

          console.log('✅ Donor thank you email sent to:', body.donorInfo.email);
        } catch (emailError) {
          console.error('❌ Donor email error:', emailError);
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

