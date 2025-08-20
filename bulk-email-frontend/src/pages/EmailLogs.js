import React, { useEffect, useState } from "react";
import "./EmailLogs.css";
import { fetchEmailLogs } from "../services/api";

function EmailLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchEmailLogs(token)
      .then((data) => setLogs(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="logs-container">
      <h2>Email Logs</h2>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Date</th>
            <th>Recipients</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr key={idx}>
              <td>{log.subject}</td>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
              <td>{log.recipients.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmailLogs;
