const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary');
const connectDatabase = require('./config/database');
const app = express();

// CORS Middleware
app.use(cors());

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();

// connect database
connectDatabase();

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// import routes
const book = require('./routes/bookRoute');
app.use('/api', book);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});