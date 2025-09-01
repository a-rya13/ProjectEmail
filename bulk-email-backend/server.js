// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// connect to DB
connectDB();
const allowedOrigins = [
  "http://localhost:3000",
  "https://email-sending-bulk.netlify.app",
  "https://projectemail.onrender.com/", // (optional) if you serve frontend from Render
];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
// middlewares
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "https://email-sending-bulk.netlify.app",
//       "https://projectemail.onrender.com/",
//     ],
//   })
// );
// allow your react app
app.use(express.json()); // parse JSON bodies

// routes
app.use("/auth", require("./routes/auth"));

app.use("/user", require("./routes/user"));
app.use("/email", require("./routes/email"));

// root
app.get("/", (req, res) => res.send("Bulk Email Backend Running"));

// start
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
