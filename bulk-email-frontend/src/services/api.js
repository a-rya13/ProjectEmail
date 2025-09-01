import axios from "axios";

const API_BASE = "https://projectemail.onrender.com";

export const signupUser = async (name, email, password) => {
  const res = await axios.post(`${API_BASE}/auth/signup`, {
    name,
    email,
    password,
  });
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
  return res.data;
};

export const getUserInfo = async (token) => {
  const res = await axios.get(`${API_BASE}/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const sendBulkEmail = async (token, file, subject, message) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("subject", subject);
  formData.append("message", message);
  console.log("bulk email");

  const res = await axios.post(`${API_BASE}/email/send`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const fetchEmailLogs = async (token) => {
  const res = await axios.get(`${API_BASE}/email/logs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
