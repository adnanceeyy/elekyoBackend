const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();
const Cart = require('./models/Cart');

async function checkCart() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const cart = await Cart.findOne({ email: 'adnansuperbazar@gmail.com' });
        fs.writeFileSync('cart_check.json', JSON.stringify(cart, (key, value) => {
            if (key === 'image' && value && value.length > 50) {
                return value.substring(0, 50) + '... [LEN: ' + value.length + ']';
            }
            return value;
        }, 2));
        await mongoose.disconnect();
    } catch (err) {
        fs.writeFileSync('cart_check.json', JSON.stringify({error: err.message}));
    }
}

checkCart();
