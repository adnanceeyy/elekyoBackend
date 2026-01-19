const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function createAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected ✅');

    const email = 'admin@gmail.com';
    const password = 'admin123';

    // Delete existing admin if any
    await User.deleteMany({ email: email });
    console.log('Old admin cleared.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new User({
      name: 'Elekyo Admin',
      email: email,
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('-----------------------------------');
    console.log('Admin User Created Successfully! 🚀');
    console.log('ID:', admin._id);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('-----------------------------------');
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

createAdmin();
