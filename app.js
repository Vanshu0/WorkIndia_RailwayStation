
const path = require('path');
require('dotenv').config({ 
  path: path.resolve(__dirname, '.env') 
});

// DEBUG: Force-check environment variables
console.log("ENV VARIABLES LOADED:", {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  JWT_SECRET: process.env.JWT_SECRET
});

const express = require('express');

const app = express();
const cors = require('cors');
app.use(cors()); // Place this after app initialization
const PORT = process.env.PORT || 3000;

const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');


const adminRoutes = require('./routes/adminRoutes');
const { verifyAdminAPIKey } = require('./middleware/adminMiddleware');

app.use(express.json());
app.use(morgan('dev'));
app.use('/api/user', userRoutes);
app.use('/api/admin', verifyAdminAPIKey, adminRoutes);

app.get('/', (req, res) => {
    res.send('IRCTC Railway Management API running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});