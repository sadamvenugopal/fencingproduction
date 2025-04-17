const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3002;

const allowedOrigins = ['http://fencingproduction'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(bodyParser.json());

// ✅ Load Routes
const bookNowRoutes = require("./booknow");
app.use("/api/booknow", bookNowRoutes);

// ✅ Determine URL Based on ENV
const getBaseUrl = () => {
    if (process.env.NODE_ENV === "production") {
         console.log('Venugopal');  
         console.log(process.env.HOST);   
        return `https://${process.env.HOST }`;
    }
    return `http://localhost:${PORT}`;
};

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running at ${getBaseUrl()}`);
});
