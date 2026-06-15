import axios from "axios";
import { handleMockRequest } from "./mockDb.js";

const secureAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
  },
});

// Request Interceptor
secureAPI.interceptors.request.use(
  (config) => {
    // If in demo/sandbox mode, bypass live network requests
    if (localStorage.getItem("blog_app_demo_mode") === "true") {
      config.adapter = async (cfg) => {
        try {
          return await handleMockRequest(cfg);
        } catch (mockErr) {
          return Promise.reject(mockErr);
        }
      };
    }

    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (error) {
       console.error("Error parsing user token", error);
       localStorage.removeItem("currentUser");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
secureAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isNetworkError = !error.response || error.code === "ERR_NETWORK" || error.message === "Network Error";

    if (isNetworkError && originalRequest && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      console.warn("Backend offline. Dynamically redirecting request to Standalone Sandbox Adapter...");
      
      // Persist sandbox mode
      localStorage.setItem("blog_app_demo_mode", "true");
      // Notify other components (e.g. Navbar) to update their connection indicator status
      window.dispatchEvent(new Event("connection-change"));

      try {
        const mockResult = await handleMockRequest(originalRequest);
        return mockResult;
      } catch (mockErr) {
        return Promise.reject(mockErr);
      }
    }

    if (error.response?.status === 401) {
       // Automatic logout on 401 Unauthorized (disabled for dev)
    }
    return Promise.reject(error);
  }
);

export default secureAPI;
