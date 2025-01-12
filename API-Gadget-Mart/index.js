// Importing required packages
const express = require("express");
const connectDatabase = require("./database/database");
const dotenv = require("dotenv");
const cors = require("cors");
const acceptFormdata = require("express-fileupload");
const cartRoutes = require("./routes/cartRoutes"); // Import cart routes
const favouritesRoutes = require("./routes/favouritesRoutes"); // Import favourites routes
const morgan = require("morgan");

// Load environment variables
dotenv.config();

// Create an express app
const app = express();

// Configure CORS
const corsOptions = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(morgan("dev"));
// Express JSON configuration
app.use(express.json());

// Configure form data handling
app.use(acceptFormdata());

// Serve static files (optional)
app.use(express.static("./public"));

// Connect to database
connectDatabase();

// Define test endpoint
app.get("/test", (req, res) => {
  res.send("Test API is Working!...");
});

// Define routes
// Use cartRoutes for /api/cart endpoints
app.use("/api/cart", cartRoutes);

// Use favouritesRoutes for /api/favourites endpoints
app.use("/api/favourite", favouritesRoutes);

// Configure existing routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/product", require("./routes/productRoutes"));
app.use("/api/order", require("./routes/orderRoutes"));

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});

module.exports = app;
