# Email Setup Guide for Mess App

## Overview
This guide helps you configure email sending for OTP verification and password reset functionality in the Mess App backend.

## Email Configuration

### 1. Environment Variables
Add these to your `.env` file:

```env
# Email Configuration
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-email-password
```

### 2. Common Email Providers

#### Gmail
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```
**Note:** For Gmail, you must:
1. Enable 2-Step Verification
2. Generate an App Password (not your regular password)
3. Use the App Password in EMAIL_PASS

#### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

#### Custom Domain (like mitaoe.ac.in)
```env
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-email-password
```

### 3. Port Configuration
- **Port 587**: TLS (Transport Layer Security) - Recommended
- **Port 465**: SSL (Secure Sockets Layer)
- **Port 25**: Unencrypted - Not recommended for production

## Testing Your Email Configuration

### 1. Run the Test Script
```bash
cd backend
node test-email.js
```

This script will:
- Check your environment variables
- Test the email server connection
- Send a test email to yourself

### 2. Manual Testing
1. Start your backend server
2. Try to register a new user
3. Check the backend console for detailed error messages
4. Check your email inbox for the verification code

## Troubleshooting

### Common Issues

#### 1. Authentication Failed (EAUTH)
- **Cause**: Wrong email/password
- **Solution**: Double-check EMAIL_USER and EMAIL_PASS
- **For Gmail**: Use App Password, not regular password

#### 2. Connection Failed (ECONNECTION)
- **Cause**: Wrong EMAIL_HOST or EMAIL_PORT
- **Solution**: Verify SMTP server details with your email provider

#### 3. Connection Timeout (ETIMEDOUT)
- **Cause**: Network issues or firewall blocking
- **Solution**: Check internet connection and firewall settings

#### 4. TLS/SSL Issues
- **Cause**: Wrong port configuration
- **Solution**: 
  - Use port 587 for TLS
  - Use port 465 for SSL
  - Check if your email provider requires specific settings

### Debug Steps

1. **Check Environment Variables**
   ```bash
   echo $EMAIL_HOST
   echo $EMAIL_PORT
   echo $EMAIL_USER
   ```

2. **Test SMTP Connection**
   ```bash
   telnet your-smtp-server.com 587
   ```

3. **Check Backend Logs**
   - Look for detailed error messages in the console
   - Check for specific error codes (EAUTH, ECONNECTION, etc.)

4. **Verify Email Provider Settings**
   - Check if SMTP is enabled
   - Verify authentication requirements
   - Check for any rate limiting

## Security Best Practices

1. **Use Environment Variables**: Never hardcode email credentials
2. **Use App Passwords**: For Gmail, always use App Passwords
3. **Enable 2FA**: Enable two-factor authentication on your email account
4. **Regular Updates**: Keep your email credentials updated
5. **Monitor Logs**: Regularly check for failed email attempts

## Production Considerations

1. **Use a Dedicated Email Service**: Consider services like:
   - SendGrid
   - Mailgun
   - Amazon SES
   - Resend

2. **Rate Limiting**: Implement rate limiting for email sending
3. **Monitoring**: Set up alerts for email failures
4. **Backup Plan**: Have a fallback email service

## Support

If you continue to have issues:
1. Check the backend console for detailed error messages
2. Run the test script: `node test-email.js`
3. Verify your email provider's SMTP settings
4. Check if your email provider has any restrictions 