const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/authMiddleware");
const {
  sendBulkEmail,
  getEmailLogs,
} = require("../controllers/emailController");

const upload = multer({ dest: "uploads/" });

// Send bulk emails
router.post("/send", auth, upload.single("file"), sendBulkEmail);

// Get email logs
router.get("/logs", auth, getEmailLogs);

module.exports = router;
