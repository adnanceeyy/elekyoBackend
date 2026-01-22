const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function createProductionAdmin() {
  try {
    console.log('🔌 Connecting to PRODUCTION MongoDB...');
    console.log('URI:', process.env.MONGO_URI.replace(/:[^:@]+@/, ':****@')); // Hide password
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to Production Database');

    const email = 'admin@gmail.com';
    const password = 'admin@123'; // Changed to match the screenshot

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: email });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('ID:', existingAdmin._id);
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      
      // Update password and role just to be sure
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      
      console.log('✅ Admin password and role updated!');
    } else {
      // Create new admin
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
      console.log('✅ Admin User Created Successfully! 🚀');
      console.log('ID:', admin._id);
    }
    
    console.log('-----------------------------------');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('-----------------------------------');
    
    // Verify the admin can login
    const testUser = await User.findOne({ email: email });
    const passwordMatch = await bcrypt.compare(password, testUser.password);
    
    console.log('🧪 Password verification test:', passwordMatch ? '✅ PASS' : '❌ FAIL');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

createProductionAdmin();
