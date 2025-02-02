require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const instructorRoutes = require('./routes/instructorRoutes');

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/instructors', instructorRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
