import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401 && !error.config._retry) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;