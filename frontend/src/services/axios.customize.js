import axios from 'axios';
import { Mutex } from "async-mutex";

const mutex = new Mutex();

const createInstanceAxios = (baseURL) => {
  const instance = axios.create({
      baseURL: baseURL,
      withCredentials: true,
  });

  const handleRefreshToken = async () => {
      return await mutex.runExclusive(async () => {
        const res = await instance.get('/api/v1/auth/refresh');
        if (res && res.data) return res.data.accessToken;
        else return null;
      });
  }

  instance.interceptors.request.use(function (config) {
      const token = localStorage.getItem('accessToken');
      const auth = token ? `Bearer ${token}` : '';
      config.headers['Authorization'] = auth;

      return config;
    }, function (error) {
      return Promise.reject(error);
    });

  instance.interceptors.response.use(function (response) {
    if (response && response.data)  return response.data;
    return response;
  }, async function (error) {
    if (error.config && error.response && +error.response.status === 401) {
      const accessToken = await handleRefreshToken();
      if (accessToken) {
        error.config.headers['Authorization'] = `Bearer ${accessToken}`;
        localStorage.setItem('accessToken', accessToken);
        return instance.request(error.config);
      }
    };

    if (error && error.response && error.response.data)
        return error.response.data;
    return Promise.reject(error);
  });

  return instance;
};

export default createInstanceAxios;