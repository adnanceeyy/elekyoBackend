const axios = require('axios');

const urls = [
  'https://eleckyo-backend.vercel.app',
  'https://eleckyobackend.vercel.app',
  'https://eleckyo-api.vercel.app'
];

async function checkUrls() {
  console.log('🌍 Checking Potential Backend URLs...');
  
  for (const url of urls) {
    try {
      console.log(`Testing ${url}...`);
      const res = await axios.get(url + '/'); // Root health check
      console.log(`✅ FOUND! ${url} - Status: ${res.status}`);
      console.log('Response:', res.data);
    } catch (error) {
      // console.log(`❌ ${url} failed: ${error.message}`);
    }
  }
}

checkUrls();
