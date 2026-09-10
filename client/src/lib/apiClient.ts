import axios, { AxiosError } from 'axios';

export const API_MODE = (import.meta.env.VITE_API_MODE || 'mock') as 'mock' | 'live';
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'byteclub.token';

export const tokenStore = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (t: string) => {
    try {
      localStorage.setItem(TOKEN_KEY, t);
    } catch {
      /* ignore */
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;
  constructor(message: string, status = 500, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ error?: { message?: string; code?: string; details?: unknown } }>) => {
    if (error.response) {
      const body = error.response.data?.error;
      throw new ApiError(
        body?.message || 'Something went wrong. Please try again.',
        error.response.status,
        body?.code,
        body?.details,
      );
    }
    if (error.code === 'ECONNABORTED') {
      throw new ApiError('The kitchen is slow to respond. Check your connection and retry.', 408, 'timeout');
    }
    throw new ApiError('Can’t reach the server right now. Please try again shortly.', 0, 'network');
  },
);

/** Simulate latency so skeletons/loaders are visible in mock mode. */
export const delay = (ms = 380) => new Promise((r) => setTimeout(r, ms));
