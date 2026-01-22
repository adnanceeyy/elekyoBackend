const mongoose = require('mongoose');
const Product = require('./models/Product');
const fs = require('fs');
require('dotenv').config();

async function checkProducts() {
  let output = '';
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eleckyo');
    output += '✅ Connected to MongoDB\n';

    // Count products
    const count = await Product.countDocuments();
    output += `\n📊 Total products in database: ${count}\n`;

    if (count > 0) {
      // Get first 10 products
      const products = await Product.find().limit(10);
      output += '\n📦 Sample products:\n';
      products.forEach((product, index) => {
        output += `\n${index + 1}. ${product.name}\n`;
        output += `   ID: ${product.id || product._id}\n`;
        output += `   Price: ₹${product.price}\n`;
        output += `   Stock: ${product.countInStock}\n`;
        output += `   Category: ${product.category || 'N/A'}\n`;
        output += `   Image: ${product.image ? 'Yes' : 'No'}\n`;
      });
    } else {
      output += '\n⚠️  No products found in database!\n';
      output += '   You need to add products first.\n';
    }

    await mongoose.disconnect();
    output += '\n✅ Disconnected from MongoDB\n';
    
    // Write to file
    fs.writeFileSync('product-check-results.txt', output);
    console.log(output);
    console.log('\n📄 Results saved to product-check-results.txt');
  } catch (error) {
    output += `\n❌ Error: ${error.message}\n`;
    fs.writeFileSync('product-check-results.txt', output);
    console.error(output);
    process.exit(1);
  }
}

checkProducts();
