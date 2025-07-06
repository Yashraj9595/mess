require('dotenv').config();
const { testEmailConnection, sendRegistrationOTP } = require('./utils/emailService');

async function testEmailSetup() {
  console.log('🧪 Testing Email Configuration...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`EMAIL_HOST: ${process.env.EMAIL_HOST || 'NOT SET'}`);
  console.log(`EMAIL_PORT: ${process.env.EMAIL_PORT || 'NOT SET'}`);
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER || 'NOT SET'}`);
  console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? 'SET' : 'NOT SET'}\n`);
  
  // Test connection
  console.log('🔗 Testing Email Server Connection...');
  const connectionSuccess = await testEmailConnection();
  
  if (connectionSuccess) {
    console.log('\n✅ Email server connection successful!');
    
    // Test sending a sample email
    console.log('\n📧 Testing Email Sending...');
    try {
      const testEmail = process.env.EMAIL_USER; // Send to yourself
      const result = await sendRegistrationOTP(testEmail, 'Test User', '123456');
      console.log('✅ Test email sent successfully!');
      console.log(`Message ID: ${result.messageId}`);
    } catch (error) {
      console.error('❌ Test email failed:', error.message);
    }
  } else {
    console.log('\n❌ Email server connection failed!');
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Check your EMAIL_HOST and EMAIL_PORT settings');
    console.log('2. Verify your EMAIL_USER and EMAIL_PASS are correct');
    console.log('3. Make sure your email provider allows SMTP access');
    console.log('4. Check if you need to enable "Less secure app access" or use App Passwords');
    console.log('5. Try different ports (587 for TLS, 465 for SSL)');
  }
}

// Run the test
testEmailSetup().catch(console.error); 