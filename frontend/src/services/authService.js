import api from './api';
import { jwtDecode } from 'jwt-decode';

const authService = {
    register: async (userData) => {
        const response = await api.post('/auth/register/', userData);
        if (response.data.tokens) {
            localStorage.setItem('access_token', response.data.tokens.access);
            localStorage.setItem('refresh_token', response.data.tokens.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login/', credentials);
        if (response.data.tokens) {
            localStorage.setItem('access_token', response.data.tokens.access);
            localStorage.setItem('refresh_token', response.data.tokens.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: async () => {
        const refreshToken = localStorage.getItem('refresh_token');
        try {
            await api.post('/auth/logout/', { refresh_token: refreshToken });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
        }
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('access_token');
        if (!token) return false;

        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 > Date.now();
        } catch (error) {
            return false;
        }
    },

    getProfile: async () => {
        const response = await api.get('/auth/profile/');
        return response.data;
    },

    updateProfile: async (profileData) => {
        const response = await api.put('/auth/profile/', profileData);
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    forgetPassword: async (email) => {
        const response = await api.post('/auth/forget-password/', { email });
        return response.data;
    },

    resetPassword: async (token, newPassword, confirmPassword) => {
        const response = await api.post('/auth/reset-password/', {
            token,
            new_password: newPassword,
            confirm_password: confirmPassword,
        });
        return response.data;
    },
};

export default authService;