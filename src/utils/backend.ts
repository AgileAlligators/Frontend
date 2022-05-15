import axios from 'axios';

const backendUrl = 'https://agilealligators.timos.design/api/';
// const backendUrl = 'http://localhost:3000/api/';

const backend = axios.create({
  timeout: 3000,
  baseURL: backendUrl,
});

backend.interceptors.request.use((config) => {
  if (process.env.NODE_ENV === 'development') {
    console.info('✉️ ', config.method?.toUpperCase() + ' ' + config.url);
  }
  config.headers = {
    Authorization: `Bearer ${localStorage.getItem('alligator-token')}`,
  };
  return config;
});

backend.interceptors.response.use(
  (config) => config,
  (error) => {
    return Promise.reject(error.response.data);
  }
);

export { backendUrl, backend };
