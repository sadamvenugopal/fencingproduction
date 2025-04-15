const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3002;

// CORS
app.use(cors());
app.use(bodyParser.json());

// ✅ Load Routes
const bookNowRoutes = require("./booknow");
app.use("/api/booknow", bookNowRoutes);

// ✅ Determine URL Based on ENV
const getBaseUrl = () => {
    if (process.env.NODE_ENV === "production") {
        return `https://${process.env.HOST }`;
    }
    return `http://localhost:${PORT}`;
};

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running at ${getBaseUrl()}`);
});
