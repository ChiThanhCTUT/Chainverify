const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

const path = require('path');

// Middlewares
app.use(cors());
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
const certificateRoutes = require('./routes/certificateRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ChainVerify API' });
});

// Mount Routes
app.use('/api/certificates', certificateRoutes);
app.use('/api/upload', uploadRoutes);

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
