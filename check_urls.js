const axios = require('axios');

const urls = [
  'https://eleckyo-backend.vercel.app',
  'https://eleckyobackend.vercel.app',
  'https://elekyo-backend.vercel.app',
  'https://elec-kyo-backend.vercel.app',
  'https://eleckyo-api.vercel.app'
];

async function checkUrls() {
  console.log('🌍 Checking Potential Backend URLs...');
  
  for (const url of urls) {
    try {
      console.log(`Checking ${url}...`);
      const res = await axios.get(url + '/', { timeout: 5000 });
      console.log(`✅ FOUND! ${url}`);
      console.log(`   Status: ${res.status}`);
      console.log(`   Data: ${res.data}`);
    } catch (error) {
      if (error.response) {
         console.log(`❌ ${url} -> Status: ${error.response.status} (${error.response.statusText})`);
         if (error.response.status === 404) console.log('   (Deployment likely does not exist)');
      } else {
         console.log(`❌ ${url} -> Error: ${error.message}`);
      }
    }
  }
}

checkUrls();
