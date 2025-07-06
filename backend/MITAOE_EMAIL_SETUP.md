# MITAOE Email Setup for Mess App

## Your Current Configuration (INCORRECT)
```env
EMAIL_HOST=202301040092@mitaoe.ac.in  ❌ Wrong
EMAIL_PORT=587
EMAIL_USER=202301040092@mitaoe.ac.in
EMAIL_PASS=wfkh gugx qojx bgur
```

## Corrected Configuration
```env
EMAIL_HOST=smtp.mitaoe.ac.in  ✅ Correct
EMAIL_PORT=587
EMAIL_USER=202301040092@mitaoe.ac.in
EMAIL_PASS=wfkh gugx qojx bgur
```

## Alternative SMTP Servers to Try

If `smtp.mitaoe.ac.in` doesn't work, try these common SMTP servers:

### Option 1: Gmail SMTP (Recommended)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=202301040092@mitaoe.ac.in
EMAIL_PASS=wfkh gugx qojx bgur
```

### Option 2: Outlook SMTP
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=202301040092@mitaoe.ac.in
EMAIL_PASS=wfkh gugx qojx bgur
```

### Option 3: Try different ports
```env
EMAIL_HOST=smtp.mitaoe.ac.in
EMAIL_PORT=465  # Try SSL instead of TLS
EMAIL_USER=202301040092@mitaoe.ac.in
EMAIL_PASS=wfkh gugx qojx bgur
```

## Steps to Fix

1. **Update your `.env` file** with the corrected EMAIL_HOST
2. **Test the configuration**:
   ```bash
   node test-email.js
   ```
3. **If it still doesn't work**, try the alternative SMTP servers above
4. **Check with your IT department** for the correct SMTP settings for mitaoe.ac.in

## Common Issues with Educational Email Domains

1. **SMTP might be disabled** - Check with your IT department
2. **Different SMTP server** - Educational institutions often use different servers
3. **Authentication requirements** - May need specific settings
4. **Firewall restrictions** - Campus networks often block SMTP

## Testing Steps

1. Update your `.env` file
2. Run: `node test-email.js`
3. Check the output for success/error messages
4. If successful, try registering a user in your app
5. Check your email for the verification code

## If Nothing Works

Consider using a free email service like Gmail for testing:
1. Create a Gmail account
2. Enable 2-Step Verification
3. Generate an App Password
4. Use Gmail SMTP settings 