import axios from "axios";

const axiosInstance = axios.create();

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // console.log("axios interceptor");
      // Retrieve the API base URL from Vite environment variables
      const baseURL = `${import.meta.env.VITE_BASE_URL}`;

      // If the base URL is available, set it as the request's base URL
      if (baseURL) {
        config.baseURL = baseURL;
      }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
