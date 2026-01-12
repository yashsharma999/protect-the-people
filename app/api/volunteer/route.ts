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

    // 2. Send email notification to admin via Resend
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

        console.log('✅ Admin notification sent');
      } catch (emailError) {
        console.error('❌ Admin email error:', emailError);
      }
    } else {
      console.warn('⚠️ Resend not configured - skipping email notification');
    }

    // 3. Send confirmation email to volunteer
    if (process.env.RESEND_API_KEY && data.email) {
      try {
        // Format skills for display
        const skillsMap: Record<string, string> = {
          'legal': 'Legal',
          'public-sector': 'Public Sector',
          'education': 'Education',
          'healthcare': 'Healthcare',
          'technology': 'Technology',
          'marketing': 'Marketing & Communications',
          'other': 'Other',
        };
        const formattedSkills = skillsMap[data.skills] || data.skills;

        // Format availability for display
        const availabilityMap: Record<string, string> = {
          'weekdays': 'Weekdays',
          'weekends': 'Weekends',
          'flexible': 'Flexible',
          'few-hours-week': 'A few hours per week',
          'few-hours-month': 'A few hours per month',
          'project-based': 'Project-based',
        };
        const formattedAvailability = availabilityMap[data.availability] || data.availability;

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Protect The People Foundation <onboarding@resend.dev>',
          to: data.email,
          subject: `Application Received - Welcome to Our Volunteer Community! 🤝`,
          html: `
            <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #1a2e35 0%, #2d4a54 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Application Received! 🎉</h1>
                <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 16px;">Thank you for wanting to make a difference</p>
              </div>
              
              <!-- Welcome Badge -->
              <div style="background: linear-gradient(135deg, #ccff00 0%, #a8e600 100%); padding: 20px; text-align: center; margin: -1px 0;">
                <p style="margin: 0; font-size: 16px; color: #1a2e35; font-weight: 600;">🤝 Welcome to our volunteer community</p>
              </div>
              
              <!-- Message -->
              <div style="padding: 30px;">
                <p style="color: #333; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                  Dear <strong>${data.fullName}</strong>,
                </p>
                <p style="color: #555; font-size: 15px; line-height: 1.7; margin: 0 0 20px 0;">
                  Thank you for your interest in volunteering with <strong>Protect The People Foundation</strong>! We're thrilled that you want to be part of our mission to empower communities through education, food security, and human rights advocacy.
                </p>
                <p style="color: #555; font-size: 15px; line-height: 1.7; margin: 0 0 25px 0;">
                  We've received your application and our team will review it carefully. You can expect to hear back from us within <strong>1-2 business days</strong>.
                </p>
                
                <!-- Application Summary -->
                <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin: 25px 0;">
                  <h3 style="margin: 0 0 15px 0; color: #1a2e35; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Application Summary</h3>
                  <table style="width: 100%; font-size: 14px;">
                    <tr>
                      <td style="padding: 8px 0; color: #666;">Background</td>
                      <td style="padding: 8px 0; color: #1a2e35; text-align: right; font-weight: 500;">${formattedSkills}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666;">Availability</td>
                      <td style="padding: 8px 0; color: #1a2e35; text-align: right; font-weight: 500;">${formattedAvailability}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666;">Submitted</td>
                      <td style="padding: 8px 0; color: #1a2e35; text-align: right;">${timestamp}</td>
                    </tr>
                  </table>
                </div>
                
                <!-- What's Next -->
                <div style="background: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                  <h4 style="margin: 0 0 10px 0; color: #2e7d32; font-size: 14px;">What happens next?</h4>
                  <ol style="margin: 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 1.8;">
                    <li>Our team reviews your application</li>
                    <li>We'll reach out to schedule a brief call</li>
                    <li>We'll match you with opportunities that fit your skills</li>
                  </ol>
                </div>
                
                <p style="color: #555; font-size: 15px; line-height: 1.7; margin: 25px 0 0 0;">
                  In the meantime, feel free to explore our website to learn more about our initiatives and the communities we serve.
                </p>
                
                <p style="color: #555; font-size: 15px; line-height: 1.7; margin: 25px 0 0 0;">
                  With gratitude,<br>
                  <strong style="color: #1a2e35;">The Protect The People Foundation Team</strong>
                </p>
              </div>
              
              <!-- Footer -->
              <div style="background: #f8f9fa; padding: 25px 30px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #eee;">
                <p style="margin: 0 0 10px 0; color: #888; font-size: 13px;">
                  Questions? Simply reply to this email - we're happy to help!
                </p>
                <p style="margin: 0; color: #aaa; font-size: 12px;">
                  © ${new Date().getFullYear()} Protect The People Foundation. All rights reserved.
                </p>
              </div>
            </div>
          `,
        });

        console.log('✅ Volunteer confirmation email sent to:', data.email);
      } catch (emailError) {
        console.error('❌ Volunteer email error:', emailError);
      }
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

