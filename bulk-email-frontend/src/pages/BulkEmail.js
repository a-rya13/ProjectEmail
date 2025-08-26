import React, { useState } from "react";
import "./BulkEmail.css";
import { sendBulkEmail } from "../services/api";

function BulkEmail() {
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!file || !subject || !message) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const data = await sendBulkEmail(token, file, subject, message);
      alert(`${data.sentCount} emails sent successfully!`);
    } catch (err) {
      // alert(err.response?.data?.message);
      console.log("email not sent", err);
    }
    setLoading(false);
  };

  return (
    <div className="bulk-email-container">
      <h2>Send Bulk Emails</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email List (CSV or TXT)</label>
          <input
            type="file"
            accept=".csv,.txt"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div className="form-group">
          <label>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="send-btn" disabled={loading}>
          {loading ? "Sending..." : "Send Emails"}
        </button>
      </form>
    </div>
  );
}

export default BulkEmail;
