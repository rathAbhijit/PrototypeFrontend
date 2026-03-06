const API_BASE =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "https://prototype-nmqf.onrender.com";

export default API_BASE;