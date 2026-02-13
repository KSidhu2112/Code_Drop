const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['https://code-dropdsa.netlify.app', 'https://code-dropadmin.netlify.app'], // Frontend and Admin URLs
  credentials: true
}));

// Routes
app.use('https://code-drop-g4h1.onrender.com/api/posts', require('./src/routes/postRoutes'));
app.use('https://code-drop-g4h1.onrender.com/api/admin', require('./src/routes/adminRoutes'));
app.use('https://code-drop-g4h1.onrender.com/api/users', require('./src/routes/userRoutes'));
app.use('https://code-drop-g4h1.onrender.com/api/contact', require('./src/routes/contactRoutes'));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
