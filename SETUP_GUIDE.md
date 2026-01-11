# Form Submission & Payment Setup Guide

This guide explains how to set up Google Sheets, Email notifications, and PhonePe payment gateway.

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

# PhonePe Payment Gateway (Sandbox)
PHONEPE_CLIENT_ID=your_sandbox_client_id
PHONEPE_CLIENT_SECRET=your_sandbox_client_secret
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_ENV=sandbox
NEXT_PUBLIC_BASE_URL=http://localhost:3000
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

## Step 3: PhonePe Payment Gateway Setup (~15 minutes)

### 3.1 Register as PhonePe Merchant
1. Go to [PhonePe Business](https://business.phonepe.com/)
2. Sign up as a merchant
3. Complete KYC verification

### 3.2 Access Developer Portal
1. Go to [PhonePe Developer Portal](https://developer.phonepe.com/)
2. Login with your merchant credentials
3. Navigate to **Credentials**

### 3.3 Get Sandbox Credentials
For testing, use the Sandbox environment:

1. In the developer portal, select **Sandbox** environment
2. Copy your credentials:
   - `Client ID` → `PHONEPE_CLIENT_ID`
   - `Client Secret` → `PHONEPE_CLIENT_SECRET`
   - `Merchant ID` → `PHONEPE_MERCHANT_ID`

### 3.4 Configure Environment
```env
# For testing (Sandbox)
PHONEPE_ENV=sandbox

# For production (after going live)
PHONEPE_ENV=production
```

### 3.5 Set Base URL
```env
# For local development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# For production
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

---

## Step 4: Add to Your Environment

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

# PhonePe (Sandbox)
PHONEPE_CLIENT_ID=TEST-xxx-xxx-xxx
PHONEPE_CLIENT_SECRET=xxx-xxx-xxx-xxx
PHONEPE_MERCHANT_ID=MERCHANTUAT
PHONEPE_ENV=sandbox
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## Testing

1. Restart your dev server: `npm run dev`
2. Submit a volunteer or donation form
3. Check your Google Sheet for new rows
4. Check your email for notifications

### Testing PhonePe Payments (Sandbox)

1. Go to `/contribution` page
2. Fill in the donation form
3. Click "Proceed to Pay"
4. Use PhonePe test credentials:
   - Any UPI ID ending with `@ybl` works in sandbox
   - Test card: `4111 1111 1111 1111` (any expiry, any CVV)
5. Complete the payment
6. Verify payment success on the callback page
7. Check Google Sheets for the donation record

**Sandbox Mode Indicators:**
- Check browser console for "PhonePe Sandbox" logs
- Sandbox payments are not real - no money is charged

---

## Data Storage Structure

### Volunteers Sheet
| Timestamp | Full Name | Email | Phone | Skills/Background | Availability | Message |
|-----------|-----------|-------|-------|-------------------|--------------|---------|

### Donations Sheet
| Timestamp | Full Name | Email | Phone | Amount (₹) | Type | Message | Transaction ID | Payment Mode | Status |
|-----------|-----------|-------|-------|------------|------|---------|----------------|--------------|--------|

### Payment Webhooks Sheet (Auto-created)
| Timestamp | Event | Order ID | Merchant Order ID | Amount (₹) | State | Transaction ID | Payment Mode |
|-----------|-------|----------|-------------------|------------|-------|----------------|--------------|

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

**"Payment gateway not configured"**
- Verify PHONEPE_CLIENT_ID, PHONEPE_CLIENT_SECRET, and PHONEPE_MERCHANT_ID are set
- Check that PHONEPE_ENV is set to `sandbox` or `production`
- Restart the dev server after adding environment variables

**"Failed to create payment order"**
- Check server logs for PhonePe API errors
- Verify your sandbox credentials are active in PhonePe developer portal
- Ensure NEXT_PUBLIC_BASE_URL is correctly set

**Payment iframe not opening**
- Ensure the PhonePe checkout script is loaded (check browser network tab)
- Try refreshing the page and attempting again
- Check browser console for JavaScript errors

**Payment succeeded but not showing in Google Sheets**
- Payment verification runs after callback - wait a few seconds
- Check the "Payment Webhooks" sheet for server-side confirmations
- Verify Google Sheets permissions are still active

---

## Going Live (Production)

When ready to accept real payments:

1. Complete merchant verification in PhonePe Business portal
2. Request production credentials from PhonePe
3. Update environment variables:
   ```env
   PHONEPE_CLIENT_ID=your_production_client_id
   PHONEPE_CLIENT_SECRET=your_production_client_secret
   PHONEPE_MERCHANT_ID=your_production_merchant_id
   PHONEPE_ENV=production
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
   ```
4. Configure webhook URL in PhonePe dashboard: `https://yourdomain.com/api/phonepe/webhook`
5. Test with a small real payment before launch

