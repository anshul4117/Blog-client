import axios from "axios";

const secureAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    // Prevent MIME sniffing
    "X-Content-Type-Options": "nosniff",
    // Basic protection against XSS (though Content-Security-Policy header from server is better)
    "X-XSS-Protection": "1; mode=block",
  },
});

// Request Interceptor
secureAPI.interceptors.request.use(
  (config) => {
    // Attempt to get token securely
    // In a real 'secure' app, we prefer HttpOnly cookies, 
    // but if we must use localStorage, we ensure it exists and is valid string
    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (error) {
       console.error("Error parsing user token", error);
       // If token is corrupted, clear it
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
  (error) => {
    // specific error handling
    if (error.response?.status === 401) {
       // Automatic logout on 401 Unauthorized
       // localStorage.removeItem("currentUser");
       // window.location.href = "/login"; 
       // Commented out to prevent redirect loops during dev, but good practice for prod
    }
    return Promise.reject(error);
  }
);

export default secureAPI;
