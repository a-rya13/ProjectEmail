// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// connect to DB
connectDB();

// middlewares
app.use(cors({ origin: "http://localhost:3000" })); // allow your react app
app.use(express.json()); // parse JSON bodies

// routes
app.use("/api/auth", require("./routes/auth"));

app.use("/api/user", require("./routes/user"));
app.use("/api/email", require("./routes/email"));

// root
app.get("/", (req, res) => res.send("Bulk Email Backend Running"));

// start
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
