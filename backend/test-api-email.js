const http = require('http');

const data = JSON.stringify({
  firstName: 'Shahmir',
  lastName: 'Internship',
  email: 'ashahmir467@gmail.com',
  inquiry: 'Account Verification Test',
  message: 'This is a test email sent from UrbanThread backend via Gmail SMTP.',
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/contact',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('✅ Server Response:', body);
  });
});

req.on('error', (e) => console.error('❌ Request error:', e));
req.write(data);
req.end();
