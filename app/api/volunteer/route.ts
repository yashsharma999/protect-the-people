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

interface VolunteerData {
  fullName: string;
  email: string;
  phone: string;
  skills: string;
  availability: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: VolunteerData = await request.json();

    // Validate required fields
    if (!data.fullName || !data.email || !data.phone || !data.skills || !data.availability || !data.message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

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
        
        // Get or create the Volunteers sheet
        let sheet = doc.sheetsByTitle['Volunteers'];
        if (!sheet) {
          sheet = await doc.addSheet({ 
            title: 'Volunteers',
            headerValues: ['Timestamp', 'Full Name', 'Email', 'Phone', 'Skills/Background', 'Availability', 'Message']
          });
        }

        // Add the row
        await sheet.addRow({
          'Timestamp': timestamp,
          'Full Name': data.fullName,
          'Email': data.email,
          'Phone': data.phone,
          'Skills/Background': data.skills,
          'Availability': data.availability,
          'Message': data.message,
        });

        console.log('✅ Volunteer data saved to Google Sheets');
      } catch (sheetError) {
        console.error('❌ Google Sheets error:', sheetError instanceof Error ? sheetError.message : sheetError);
        // Continue even if Sheets fails - we'll still try to send email
      }
    } else {
      console.warn('⚠️ Google Sheets not configured - skipping');
    }

    // 2. Send email notification via Resend
    if (process.env.RESEND_API_KEY && process.env.NOTIFICATION_EMAIL) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Volunteer Form <onboarding@resend.dev>',
          to: process.env.NOTIFICATION_EMAIL,
          subject: `🙋 New Volunteer Application: ${data.fullName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1a2e35; border-bottom: 2px solid #ccff00; padding-bottom: 10px;">
                New Volunteer Application
              </h2>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr style="background: #f9f9f9;">
                  <td style="padding: 12px; border: 1px solid #eee; font-weight: bold; width: 140px;">Full Name</td>
                  <td style="padding: 12px; border: 1px solid #eee;">${data.fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #eee; font-weight: bold;">Email</td>
                  <td style="padding: 12px; border: 1px solid #eee;">
                    <a href="mailto:${data.email}" style="color: #1a2e35;">${data.email}</a>
                  </td>
                </tr>
                <tr style="background: #f9f9f9;">
                  <td style="padding: 12px; border: 1px solid #eee; font-weight: bold;">Phone</td>
                  <td style="padding: 12px; border: 1px solid #eee;">
                    <a href="tel:${data.phone}" style="color: #1a2e35;">${data.phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #eee; font-weight: bold;">Skills/Background</td>
                  <td style="padding: 12px; border: 1px solid #eee;">${data.skills}</td>
                </tr>
                <tr style="background: #f9f9f9;">
                  <td style="padding: 12px; border: 1px solid #eee; font-weight: bold;">Availability</td>
                  <td style="padding: 12px; border: 1px solid #eee;">${data.availability}</td>
                </tr>
              </table>
              
              <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px;">
                <h3 style="margin: 0 0 10px 0; color: #1a2e35;">Why they want to volunteer:</h3>
                <p style="margin: 0; color: #444; line-height: 1.6;">${data.message}</p>
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
        // Continue even if email fails
      }
    } else {
      console.warn('⚠️ Resend not configured - skipping email notification');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Volunteer application submitted successfully' 
    });

  } catch (error) {
    console.error('Volunteer submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}

