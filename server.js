const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// SERVE IMAGES FROM UPLOADS FOLDER
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);
// Home route
app.get('/', (req, res) => {
  res.send('Eleckyo Backend v2.0 - Role System Active 🛡️');
});

// Routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);
const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/categories', categoryRoutes);
const settingsRoutes = require('./routes/settingsRoutes');
app.use('/api/settings', settingsRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found 😅' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? 'Please check backend logs' : err.message 
  });
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// MongoDB Connection Options for Serverless
const mongooseOptions = {
  bufferCommands: false, // Disable buffering so we fail fast if not connected
  autoIndex: true,       // Can be false in production for performance
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, mongooseOptions)
  .then(() => console.log('MongoDB Connected ✅'))
  .catch((err) => {
    console.error('MongoDB Connection Error ❌:');
    console.error('Name:', err.name);
    console.error('Message:', err.message);
    console.error('Full Error:', err);
    
    if (err.name === 'MongoParseError') {
      console.error('Check your MONGO_URI format in Vercel settings');
    }
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {  // ← Important: add '0.0.0.0'
  console.log(`Server running on port ${PORT} 🚀`);
  console.log(`Images available at: /uploads/images/your-image.png 🖼️`);
});