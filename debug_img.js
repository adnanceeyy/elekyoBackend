const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();
const Cart = require('./models/Cart');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const cart = await Cart.findOne({ email: 'adnansuperbazar@gmail.com' });
    const log = cart.items.map(item => ({
        name: item.name,
        imgStart: item.image ? item.image.substring(0, 50) : 'NULL',
        imgType: typeof item.image
    }));
    fs.writeFileSync('img_debug.json', JSON.stringify(log, null, 2));
    await mongoose.disconnect();
}
check();
