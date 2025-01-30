// Importing required packages
const express = require('express');
const connectDatabase = require('./database/database');
const dotenv = require('dotenv');
const cors = require('cors');
const acceptFormdata = require('express-fileupload');
const cartRoutes = require('./routes/cartRoutes'); // Import cart routes
const favouritesRoutes = require('./routes/favouritesRoutes'); // Import favourites routes
const morgan = require('morgan');
const logActivity = require('./middleware/LogActivity');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { limiter } = require('./controllers/userController');

// Load environment variables
dotenv.config();

// Create an express app
const app = express();

// Configure CORS
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(morgan('tiny'));
// Express JSON configuration
app.use(express.json());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xssClean());

// LogActivity
app.use(logActivity.activityLoggerMiddleware);

// Rate Limiter
app.use(limiter);

// Configure form data handling
app.use(acceptFormdata());

// Serve static files (optional)
app.use(express.static('./public'));

// Connect to database
connectDatabase();

// Define test endpoint
app.get('/test', (req, res) => {
  res.send('Test API is Working!...');
});

const options = {
  key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
  cert: fs.readFileSync(path.resolve(__dirname, 'server.crt')),
};

// Define routes
// Use cartRoutes for /api/cart endpoints
app.use('/api/cart', cartRoutes);

// Use favouritesRoutes for /api/favourites endpoints
app.use('/api/favourite', favouritesRoutes);

// Configure existing routes
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/product', require('./routes/productRoutes'));
app.use('/api/order', require('./routes/orderRoutes'));
app.use('/api/logactivity', require('./routes/LogActivityRoutes'));
// Define port
const PORT = process.env.PORT;

https.createServer(options, app).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
