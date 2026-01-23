const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    image: String,
    images: [String],
    id: Number,
    price: Number
}, { collection: 'products' }));

async function checkProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const products = await Product.find({ 
            name: { $in: ['iPhone 17 Pro', 'Porsche'] } 
        });
        fs.writeFileSync('product_check.json', JSON.stringify(products, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        fs.writeFileSync('product_check.json', JSON.stringify({error: err.message}));
    }
}

checkProducts();
