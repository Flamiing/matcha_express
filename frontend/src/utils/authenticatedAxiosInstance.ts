import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const authenticatedAxiosInstance = axios.create({
    baseURL: process.env.API_BASE_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the access token to headers
authenticatedAxiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            try {
                const refreshResponse = await authenticatedAxiosInstance.post(
                    '/api/auth/refresh', 
                    {}, 
                    { withCredentials: true }
                );
                const { accessToken, user } = refreshResponse.data;
                localStorage.setItem('accessToken', accessToken);
            } catch (error) {
                // Handle refresh error: delete the access token from local storage
                localStorage.removeItem('accessToken');
                return Promise.reject(error);
            }
        }
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
authenticatedAxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is due to token expiration
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await authenticatedAxiosInstance.post(
                    '/api/auth/refresh', 
                    {}, 
                    { withCredentials: true }
                );
                const { accessToken, user } = refreshResponse.data;

                // Save the new access token to local storage
                localStorage.setItem('accessToken', accessToken);

                // Update the original request with the new access token
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                return axios(originalRequest);
            } catch (refreshError) {
                // Handle refresh error: delete the access token from local storage
                localStorage.removeItem('accessToken');
                return Promise.reject(refreshError);
            }
        }
        // If the second attempt fails: delete the access token from local storage
        if (error.response && error.response.status === 401 && originalRequest._retry) {
            localStorage.removeItem('accessToken');
        }

        return Promise.reject(error);
    }
);

export default authenticatedAxiosInstance;
