const fs = require("fs");
const nodemailer = require("nodemailer");
const csv = require("csv-parser");
const EmailLog = require("../models/EmailLog");

exports.sendBulkEmail = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const filePath = req.file.path;

    if (!subject || !message || !filePath) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let recipients = [];

    // If CSV, parse for emails
    if (filePath.endsWith(".csv")) {
      const results = [];
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (row) => {
            console.log("Parsed row:", row); // Debug log
            const emailKey = Object.keys(row).find(
              (key) => key.trim().toLowerCase() === "email"
            );
            if (emailKey && row[emailKey]) {
              results.push(row[emailKey].trim());
            }
          })
          .on("end", () => {
            recipients = results;
            resolve();
          })
          .on("error", reject);
      });
    } else {
      // Plain text file
      const fileContent = fs.readFileSync(filePath, "utf-8");
      recipients = fileContent
        .split(/\r?\n/)
        .map((email) => email.trim())
        .filter((email) => email.length > 0);
    }

    if (recipients.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid email addresses found" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send in parallel
    await Promise.all(
      recipients.map((email) =>
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject,
          text: message,
        })
      )
    );

    // Log emails
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
    if (req.file) fs.unlinkSync(req.file.path);
  }
};
exports.getEmailLogs = async (req, res) => {
  try {
    const logs = await EmailLog.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(logs);
  } catch (err) {
    console.error("Get logs error:", err);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};
