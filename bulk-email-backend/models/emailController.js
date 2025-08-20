const nodemailer = require("nodemailer");
const EmailLog = require("../models/EmailLog");
const fs = require("fs");
const path = require("path");

exports.sendBulkEmail = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const filePath = req.file.path;

    if (!subject || !message || !filePath) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Read and parse file into email array
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const recipients = fileContent
      .split(/\r?\n/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    if (recipients.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid email addresses found" });
    }

    // Configure SMTP transporter (use your email provider details)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your app password
      },
    });

    // Send emails
    for (const email of recipients) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        text: message,
      });
    }

    // Save log in DB
    const log = new EmailLog({
      userId: req.user.userId,
      subject,
      message,
      recipients,
      status: "Sent",
    });
    await log.save();

    res.json({
      message: "Emails sent successfully",
      sentCount: recipients.length,
    });
  } catch (err) {
    console.error("Bulk email error:", err);
    res.status(500).json({ message: "Failed to send emails" });
  } finally {
    if (req.file) fs.unlinkSync(req.file.path); // delete uploaded file
  }
};

exports.getEmailLogs = async (req, res) => {
  try {
    const logs = await EmailLog.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};
