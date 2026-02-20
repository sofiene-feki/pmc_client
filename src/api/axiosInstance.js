import axios from "axios";
import { store } from "../redux/store";
import { setToken, logout } from "../redux/slices/authSlice";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
    withCredentials: true,
});

// Request interceptor for API calls
api.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Use the same baseURL as the axios instance for refresh
                const refreshURL = `${api.defaults.baseURL}/auth/refresh`;
                const { data } = await axios.get(refreshURL, {
                    withCredentials: true,
                });
                store.dispatch(setToken(data.accessToken));
                axios.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (err) {
                store.dispatch(logout());
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
