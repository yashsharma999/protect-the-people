# Form Submission Setup Guide

This guide explains how to set up Google Sheets + Email notifications for form submissions.

## Required Environment Variables

Add these to your `.env.local` file:

```env
# Google Sheets
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Resend Email
RESEND_API_KEY=re_xxxxxxxxxxxx
NOTIFICATION_EMAIL=protectthepeopleindia@gmail.com
RESEND_FROM_EMAIL=onboarding@resend.dev
```

---

## Step 1: Google Sheets Setup (~10 minutes)

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Note down your project ID

### 1.2 Enable Google Sheets API
1. Go to **APIs & Services > Library**
2. Search for "Google Sheets API"
3. Click **Enable**

### 1.3 Create a Service Account
1. Go to **IAM & Admin > Service Accounts**
2. Click **Create Service Account**
3. Name it (e.g., "G")
4. Click **Create and Continue**
5. Skip the optional steps, click **Done**

### 1.4 Create JSON Key
1. Click on your new service account
2. Go to **Keys** tab
3. Click **Add Key > Create new key**
4. Select **JSON** format
5. Download the file (keep it secure!)

### 1.5 Get Your Credentials
From the JSON file, copy:
- `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` → `GOOGLE_PRIVATE_KEY`

### 1.6 Create & Share the Google Sheet
1. Create a new Google Sheet
2. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[THIS_IS_YOUR_SHEET_ID]/edit
   ```
3. Click **Share** and add the service account email with **Editor** access

---

## Step 2: Resend Email Setup (~5 minutes)

### 2.1 Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day)

### 2.2 Get API Key
1. Go to **API Keys**
2. Click **Create API Key**
3. Copy the key → `RESEND_API_KEY`

### 2.3 Configure Email
For testing, use:
```env
RESEND_FROM_EMAIL=onboarding@resend.dev
```

For production, verify your domain in Resend and use:
```env
RESEND_FROM_EMAIL=notifications@yourdomain.com
```

---

## Step 3: Add to Your Environment

Create `.env.local` in your project root with all the values:

```env
# Google Sheets
GOOGLE_SHEET_ID=1ABC123xyz...
GOOGLE_SERVICE_ACCOUNT_EMAIL=sheets-writer@myproject.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADA...\n-----END PRIVATE KEY-----\n"

# Resend
RESEND_API_KEY=re_123abc...
NOTIFICATION_EMAIL=protectthepeopleindia@gmail.com
RESEND_FROM_EMAIL=onboarding@resend.dev
```

---

## Testing

1. Restart your dev server: `npm run dev`
2. Submit a volunteer or donation form
3. Check your Google Sheet for new rows
4. Check your email for notifications

---

## Data Storage Structure

### Volunteers Sheet
| Timestamp | Full Name | Email | Phone | Skills/Background | Availability | Message |
|-----------|-----------|-------|-------|-------------------|--------------|---------|

### Donations Sheet
| Timestamp | Full Name | Email | Phone | Amount (₹) | Type | Message |
|-----------|-----------|-------|-------|------------|------|---------|

---

## Troubleshooting

**"Google Sheets error"**
- Verify the service account email has Editor access to the sheet
- Check that GOOGLE_PRIVATE_KEY has `\n` characters preserved

**"Email not sending"**
- Verify RESEND_API_KEY is correct
- Check Resend dashboard for errors
- Ensure NOTIFICATION_EMAIL is a valid address

**Forms work but no data saved**
- Check browser console and server logs
- Environment variables may not be loaded (restart server)

