import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('hb_access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('hb_refresh_token');
                if (refreshToken) {
                    const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
                    const { accessToken } = response.data;

                    localStorage.setItem('hb_access_token', accessToken);
                    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                    return api(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem('hb_access_token');
                localStorage.removeItem('hb_refresh_token');
                localStorage.removeItem('hb_user');
                window.location.href = '/auth';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
