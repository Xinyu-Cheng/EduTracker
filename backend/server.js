require('dotenv').config();

const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// dotenv.config();


// Load .env
const result = dotenv.config({ path: '/Users/xinyucheng/Work/EduTrack/backend/.env' });

// Debugging
if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('Loaded .env variables:', result.parsed);
}

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('API is running...'));
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error(err));
