const express = require("express");
const app = express();
const booknowRoutes = require("./backend/booknow");
//const booknowRoutes = require("./booknow.js");
app.use(express.json());

// Mount booknow route
app.use("/api", booknowRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
