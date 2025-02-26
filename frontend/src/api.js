import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

// ✅ Automatically add token and language in every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const language = localStorage.getItem("language") || "en"; // Default to English

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ✅ Include the selected language in headers
  config.headers["Accept-Language"] = language;

  return config;
});

export default api;
