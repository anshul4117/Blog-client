import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Optional — interceptors for auth tokens
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`|| config.cookies.token;
  }
  return config;
});

export default API;
