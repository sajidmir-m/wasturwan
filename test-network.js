const https = require('https');

const url = 'https://xemtjwsxtbwuhcnlvmyb.supabase.co/rest/v1/';

console.log('Testing connection to:', url);

const req = https.get(url, (res) => {
  console.log('✅ Connection Successful!');
  console.log('Status Code:', res.statusCode);
  
  res.on('data', (d) => {
    // Consume data
  });
});

req.on('error', (e) => {
  console.error('❌ Connection Failed:', e);
});

req.end();