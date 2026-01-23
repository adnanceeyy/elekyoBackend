const axios = require('axios');

async function checkCors() {
  const url = 'https://eleckyo-backend.vercel.app/api/users/login';
  const origin = 'https://adminelekyo.vercel.app';

  console.log(`Testing OPTIONS request to ${url}`);
  console.log(`With Origin: ${origin}`);

  try {
    const response = await axios.options(url, {
      headers: {
        'Origin': origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });

    console.log('✅ Response Status:', response.status);
    console.log('Headers:', response.headers);

    const allowOrigin = response.headers['access-control-allow-origin'];
    if (allowOrigin === origin || allowOrigin === '*') {
      console.log('✅ CORS Header Present and Correct!');
    } else {
      console.error('❌ CORS Header Missing or Incorrect:', allowOrigin);
    }
  } catch (error) {
    console.error('❌ Request Failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

checkCors();
