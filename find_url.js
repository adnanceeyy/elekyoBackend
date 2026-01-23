const axios = require('axios');

const candidates = [
  'https://elekyo-backend.vercel.app',
  'https://elekyobackend.vercel.app',
  'https://elekyo-backend-theta.vercel.app',
  'https://eleckyo-backend.vercel.app' // The one failing
];

async function findAlive() {
  console.log('🕵️ Hunting for the correct backend URL...');
  
  for (const url of candidates) {
    try {
      process.stdout.write(`Testing: ${url} ... `);
      const res = await axios.get(url + '/', { timeout: 3000 });
      console.log(`✅ ALIVE! (Status: ${res.status})`);
      console.log(`   -> This is the correct URL.`);
    } catch (err) {
      if (err.response) {
        console.log(`❌ ${err.response.status} ${err.response.statusText}`);
      } else {
        console.log(`❌ Failed (${err.code})`);
      }
    }
  }
}

findAlive();
