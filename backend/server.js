/*const express = require("express");
const cors = require("cors");
//const bodyParser = require("body-parser");
//require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3002;

// ✅ Update Allowed Origins for CORS
const allowedOrigins = [
    'http://fencingproduction', // Internal Docker network URL
    'http://ssscg4kwgckck0cswgkokwcs.82.25.109.195.sslip.io', // Automated domain for frontend
    'https://yourapp.com' // Custom domain for production (if applicable)
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by CORS: ${origin}`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// ✅ Middleware
app.use(bodyParser.json());

// ✅ Load Routes
const bookNowRoutes = require("./booknow");
app.use("/api/booknow", bookNowRoutes);

// ✅ Determine Base URL Based on ENV
const getBaseUrl = () => {
    if (process.env.NODE_ENV === "production") {
        const host = process.env.HOST || "localhost"; // Fallback to localhost if HOST is not set
        return `https://${host}`;
    }
    return `http://localhost:${PORT}`;
};

// ✅ Start Server
app.listen(PORT, '0.0.0.0', () => { // Listen on all IPs
    console.log(`🚀 Server running at ${getBaseUrl()}`); 
});*/
// New Changes 

const express = require('express');
const cors = require('cors');
const app = express();

// Only allow requests from Angular container (container name: frontend)
const allowedOrigins = ['http://frontend:4200']; // 'frontend' = container name

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Not allowed'));
    }
  }
}));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});








