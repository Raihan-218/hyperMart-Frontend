import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // IMPORTANT for cookies/JWT
});

// Global error handling (optional but professional)
api.interceptors.response.use(
  res => res,
  err => {
    const message =
      err.response?.data?.message || err.message || 'Server Error';
    return Promise.reject(message);
  }
);

export default api;
