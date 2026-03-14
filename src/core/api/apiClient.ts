import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const resolveWebApiBaseUrl = (): string => {
    if (typeof window === 'undefined') {
        return 'http://127.0.0.1:5000';
    }
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    const hostname = window.location.hostname || '127.0.0.1';
    return `${protocol}//${hostname}:5000`;
};

const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    (Platform.OS === 'web' ? resolveWebApiBaseUrl() : 'https://api.bagumbayan-noise.com/v1');

const getWebFallbackBaseUrls = (): string[] => {
    if (Platform.OS !== 'web') {
        return [];
    }

    const urls = new Set<string>();
    urls.add(resolveWebApiBaseUrl());
    urls.add('http://localhost:5000');
    urls.add('http://127.0.0.1:5000');
    return Array.from(urls);
};

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─── Request Interceptor ───────────────────────────────────────────────────
// Attach the JWT token from AsyncStorage to every outgoing request.
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token =
                Platform.OS === 'web'
                    ? localStorage.getItem('@jwt_token')
                    : await AsyncStorage.getItem('@jwt_token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error fetching token for API request', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response Interceptor ──────────────────────────────────────────────────
// Automatically intercept 401 Unauthorized responses to trigger global logouts
// or handle silent token refreshes if implemented.
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error?.config;

        // Retry once with alternate local base URL when running on web and request fails to reach server.
        if (
            Platform.OS === 'web' &&
            originalRequest &&
            !error?.response &&
            !originalRequest.__retriedWithFallback
        ) {
            const candidates = getWebFallbackBaseUrls();
            const currentBase = originalRequest.baseURL || API_BASE_URL;
            const nextBase = candidates.find((url) => url !== currentBase);

            if (nextBase) {
                originalRequest.__retriedWithFallback = true;
                originalRequest.baseURL = nextBase;
                return apiClient.request(originalRequest);
            }
        }

        if (error.response && error.response.status === 401) {
            console.warn('Unauthorized! JWT token is missing or expired.');
            // Implementation detail: Token refresh logic or
            // dispatching an event to the AuthContext to log the user out goes here.
        }
        return Promise.reject(error);
    }
);
