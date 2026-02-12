import axios from "axios";

const API_BASE = "https://api.freeapi.app/";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Simple retry interceptor (3 attempts)
api.interceptors.response.use(undefined, async (error) => {
  const config = error.config;
  if (!config) return Promise.reject(error);
  config.__retryCount = config.__retryCount || 0;
  if (config.__retryCount >= 2) return Promise.reject(error);
  config.__retryCount += 1;
  await new Promise((res) => setTimeout(res, 500 * config.__retryCount));
  return api(config);
});

export default api;
