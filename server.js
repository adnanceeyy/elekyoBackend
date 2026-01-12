const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// SERVE IMAGES FROM UPLOADS FOLDER
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);
// Home route
app.get('/', (req, res) => {
  res.send('Eleckyo Backend is running! 🎉🚀');
});

// Routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found 😅' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message 
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected ✅'))
  .catch((err) => {
    console.error('MongoDB Connection Error:', err.message);
    // Don't exit in production — Render will restart anyway
    // process.exit(1);  ← Remove or comment this line
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {  // ← Important: add '0.0.0.0'
  console.log(`Server running on port ${PORT} 🚀`);
  console.log(`Images available at: /uploads/images/your-image.png 🖼️`);
});