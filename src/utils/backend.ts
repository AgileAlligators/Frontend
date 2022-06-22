import axios from 'axios';

const backendUrl = 'https://agilealligators.timos.design/api/';
// const backendUrl = 'http://localhost:3000/api/';

const backend = axios.create({
  timeout: 10000,
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
    if (error.response) {
      error = error.response;
      if (error.data) error = error.data;
    }
    return Promise.reject(error);
  }
);

export { backendUrl, backend };
