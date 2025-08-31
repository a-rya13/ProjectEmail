const fs = require("fs");
const path = require("path");

const UPLOADS_FOLDER = path.join(__dirname, "../uploads");

// middleware deletes all existing files in the uploads directory
function clearUploadsFolder(req, res, next) {
  fs.readdirSync(UPLOADS_FOLDER).forEach((file) => {
    fs.unlinkSync(path.join(UPLOADS_FOLDER, file));
  });
  next();
}

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
router.post(
  "/send",
  auth,
  clearUploadsFolder,
  upload.single("file"),
  sendBulkEmail
);

// Get email logs
router.get("/logs", auth, getEmailLogs);

module.exports = router;
