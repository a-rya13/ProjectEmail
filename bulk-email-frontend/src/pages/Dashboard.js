import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { getUserInfo } from "../services/api";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUserInfo(token)
        .then((data) => setUser(data))
        .catch((err) => console.error(err));
    }
  }, []);

  return (
    <div className="dashboard">
      <h2>Welcome to Your Dashboard</h2>
      {user && (
        <p>
          Hello, {user.name} ({user.email})
        </p>
      )}

      <div className="stats">
        <div className="stat-card">
          <h3>Total Emails Sent</h3>
          <p>120</p>
        </div>
        <div className="stat-card">
          <h3>Campaigns</h3>
          <p>5</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
