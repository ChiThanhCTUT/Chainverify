const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true }));

// Import Routes
const certificateRoutes = require('./routes/certificateRoutes');
const sequelize = require('./config/db');

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ChainVerify API' });
});

// Mount Routes
app.use('/api/certificates', certificateRoutes);

const Certificate = require('./models/Certificate');

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced successfully (Strict real database mode - No hardcoded seed data)');
  }).catch(err => {
    console.error('Failed to sync db: ' + err.message);
  });
});
