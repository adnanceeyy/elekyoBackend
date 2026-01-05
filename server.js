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
 
// Home route
app.get('/', (req, res) => {
  res.send('Eleckyo Backend is running! 🎉🚀');
});

// Routes
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// 404 Handler - Place this AFTER all routes
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
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🚀`);
  console.log(`Images available at: http://localhost:${PORT}/uploads/images/your-image.png 🖼️`);
});