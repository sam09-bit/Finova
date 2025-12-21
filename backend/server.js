require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(cors());

// --- Database Connection ---
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/finova';
mongoose.connect(dbURI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Failed:', err.message));

// --- ROUTES ---
// This connects the file we just created to the server
app.use('/api/auth', require('./routes/auth'));

// Test Route
app.get('/', (req, res) => {
    res.send('Finova API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});