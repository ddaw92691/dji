import axios from "axios";

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

service.interceptors.request.use((config) => {
  const locale = localStorage.getItem("mall_locale") || "en-US";
  const countryCode = localStorage.getItem("mall_countryCode") || "US";
  const languageCode = localStorage.getItem("mall_languageCode") || "en";
  config.headers["X-Locale"] = locale;
  config.headers["X-Country-Code"] = countryCode;
  config.headers["X-Language-Code"] = languageCode;
  config.headers["Accept-Language"] = locale;
  return config;
});

export default service;
