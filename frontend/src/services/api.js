import createInstanceAxios from './axios.customize';

const axios = createInstanceAxios(import.meta.env.VITE_BACKEND_URL);

export const registerApi = (fullName, email, password, phone) => {
    return axios.post('/api/v1/user/register', {fullName, email, password, phone})
};

export const loginApi = (username, password) => {
    return axios.post('/api/v1/auth/login', { username, password }, {
        headers: {
            delay: 2000
        }
    });
};

export const fetchAccountApi = () => {
    return axios.get('/api/v1/auth/account', {
        headers: {
            delay: 1000
        }
    });
};

export const logoutApi = () => {
    return axios.post('/api/v1/auth/logout');
};

export const getUserApi = (query) => {
    return axios.get(`/api/v1/user?${query}`);
};

export const createUserApi = (fullName, email, password, phone) => {
    return axios.post('/api/v1/user', {fullName, email, password, phone});
};