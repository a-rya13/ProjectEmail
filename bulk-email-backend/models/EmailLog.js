const mongoose = require("mongoose");

const emailLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  subject: String,
  message: String,
  recipients: [String],
  status: { type: String, default: "Sent" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EmailLog", emailLogSchema);
