import { NextRequest, NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Google Sheets authentication
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

interface DonationData {
  fullName: string;
  email: string;
  phone?: string;
  amount: string;
  customAmount?: string;
  donationType: 'one-time' | 'monthly';
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: DonationData = await request.json();

    // Validate required fields
    if (!data.fullName || !data.email || !data.amount || !data.donationType) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // Calculate final amount
    const finalAmount = data.amount === 'custom' ? (data.customAmount || '0') : data.amount;
    const now = new Date();
    const timestamp = now.toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // 1. Save to Google Sheets
    if (process.env.GOOGLE_SHEET_ID && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      try {
        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
        await doc.loadInfo();
        
        // Get or create the Donations sheet
        let sheet = doc.sheetsByTitle['Donations'];
        if (!sheet) {
          sheet = await doc.addSheet({ 
            title: 'Donations',
            headerValues: ['Timestamp', 'Full Name', 'Email', 'Phone', 'Amount (₹)', 'Type', 'Message']
          });
        }

        // Add the row
        await sheet.addRow({
          'Timestamp': timestamp,
          'Full Name': data.fullName,
          'Email': data.email,
          'Phone': data.phone || '',
          'Amount (₹)': finalAmount,
          'Type': data.donationType,
          'Message': data.message || '',
        });

        console.log('✅ Donation data saved to Google Sheets');
      } catch (sheetError) {
        console.error('❌ Google Sheets error:', sheetError instanceof Error ? sheetError.message : sheetError);
      }
    } else {
      console.warn('⚠️ Google Sheets not configured - skipping');
    }

    // 2. Send email notification via Resend
    if (process.env.RESEND_API_KEY && process.env.NOTIFICATION_EMAIL) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Donation Form <onboarding@resend.dev>',
          to: process.env.NOTIFICATION_EMAIL,
          subject: `💝 New Donation Intent: ₹${finalAmount} from ${data.fullName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1a2e35; border-bottom: 2px solid #ccff00; padding-bottom: 10px;">
                New Donation Intent
              </h2>
              
              <div style="background: linear-gradient(135deg, #1a2e35 0%, #2d4a54 100%); color: white; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center;">
                <p style="margin: 0; font-size: 14px; opacity: 0.8;">Amount</p>
                <p style="margin: 5px 0; font-size: 36px; font-weight: bold;">₹${parseInt(finalAmount || '0').toLocaleString('en-IN')}</p>
                <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                  ${data.donationType === 'monthly' ? '📅 Monthly' : '⚡ One-time'}
                </p>
              </div>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr style="background: #f9f9f9;">
                  <td style="padding: 12px; border: 1px solid #eee; font-weight: bold; width: 120px;">Full Name</td>
                  <td style="padding: 12px; border: 1px solid #eee;">${data.fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #eee; font-weight: bold;">Email</td>
                  <td style="padding: 12px; border: 1px solid #eee;">
                    <a href="mailto:${data.email}" style="color: #1a2e35;">${data.email}</a>
                  </td>
                </tr>
                ${data.phone ? `
                <tr style="background: #f9f9f9;">
                  <td style="padding: 12px; border: 1px solid #eee; font-weight: bold;">Phone</td>
                  <td style="padding: 12px; border: 1px solid #eee;">
                    <a href="tel:${data.phone}" style="color: #1a2e35;">${data.phone}</a>
                  </td>
                </tr>
                ` : ''}
              </table>
              
              ${data.message ? `
              <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px;">
                <h3 style="margin: 0 0 10px 0; color: #1a2e35;">Message:</h3>
                <p style="margin: 0; color: #444; line-height: 1.6;">${data.message}</p>
              </div>
              ` : ''}
              
              <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  <strong>Note:</strong> This is a donation intent. Please follow up with the donor to complete the payment process.
                </p>
              </div>
              
              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
                Submitted on ${timestamp} IST
              </p>
            </div>
          `,
        });

        console.log('✅ Email notification sent');
      } catch (emailError) {
        console.error('Resend email error:', emailError);
      }
    } else {
      console.warn('⚠️ Resend not configured - skipping email notification');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Donation intent recorded successfully' 
    });

  } catch (error) {
    console.error('Donation submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit donation. Please try again.' },
      { status: 500 }
    );
  }
}

