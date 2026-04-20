const https = require('https');

const data = JSON.stringify({ email: 'dhanachavhan@gmail.com', password: 'dhanashree' });
const opts = { hostname: 'skillswapbackend-ec63.onrender.com', path: '/api/auth/login', method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } };
const req = https.request(opts, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    const token = JSON.parse(body).token;
    
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    let formDataStr = '--' + boundary + '\r\n';
    formDataStr += 'Content-Disposition: form-data; name="availability"\r\n\r\n{"Monday":{"enabled":true,"start":"09:00","end":"17:00"}}\r\n';
    formDataStr += '--' + boundary + '--\r\n';

    const profOpts = { hostname: 'skillswapbackend-ec63.onrender.com', path: '/api/users/profile', method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'multipart/form-data; boundary=' + boundary, 'Content-Length': Buffer.byteLength(formDataStr) } };
    
    const req2 = https.request(profOpts, (r) => {
      let b = '';
      r.on('data', c => b += c);
      r.on('end', () => {
        console.log('Status:', r.statusCode);
        console.log('Response:', b);
      });
    });
    req2.write(formDataStr);
    req2.end();
  });
});
req.write(data);
req.end();
