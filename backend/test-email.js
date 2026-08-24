require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('=== SMTP Configuration ===');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_SECURE:', process.env.SMTP_SECURE);
console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL);
console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '****' + process.env.SMTP_PASSWORD.slice(-4) : 'NOT SET');
console.log('FROM_NAME:', process.env.FROM_NAME);
console.log('FROM_EMAIL:', process.env.FROM_EMAIL);
console.log('');

async function testEmail() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    console.log('1. Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    console.log('2. Sending test email...');
    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: process.env.SMTP_EMAIL,
      subject: 'UrbanThread Test Email ✓',
      html: '<h2>Test email from UrbanThread</h2><p>If you received this, email is working correctly!</p>',
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  } catch (err) {
    console.error('❌ Email FAILED!');
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
    
    if (err.code === 'EAUTH') {
      console.log('\n🔧 FIX: Gmail App Password is wrong or expired.');
      console.log('   1. Go to https://myaccount.google.com/apppasswords');
      console.log('   2. Generate a new App Password for "Mail"');
      console.log('   3. Update SMTP_PASSWORD in .env (no spaces needed, 16 chars)');
    } else if (err.code === 'ESOCKET' || err.code === 'ECONNECTION') {
      console.log('\n🔧 FIX: Cannot connect to SMTP server.');
      console.log('   - Check your internet connection');
      console.log('   - Verify SMTP_HOST and SMTP_PORT in .env');
      console.log('   - Try SMTP_PORT=587 with SMTP_SECURE=false');
    } else if (err.responseCode === 535) {
      console.log('\n🔧 FIX: Authentication failed.');
      console.log('   - Make sure 2-Step Verification is ON for your Google account');
      console.log('   - Generate a fresh App Password at https://myaccount.google.com/apppasswords');
    }
  }
  process.exit(0);
}

testEmail();
