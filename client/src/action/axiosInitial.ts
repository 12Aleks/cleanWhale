import axios from "axios";
import Cookies from "js-cookie";
import {logout, refresh} from "./authAction";


export const api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
});



api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/register')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const data = await refresh();
                Cookies.set('accessToken', data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                await logout();
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

