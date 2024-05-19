import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:8080', // replace with your base URL
  });
  
  instance.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
        console.log('Request headers:', config.headers);
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

export default instance;