import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { TenantStorage } from './tenantStorage';

/**
 * API Client configured for multi-tenancy
 * Automatically adds tenant ID and auth headers to all requests
 */

// Base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request interceptor to add tenant and auth headers
 */
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Add tenant ID header
        const tenantId = TenantStorage.getCurrentTenantId();
        if (tenantId) {
            config.headers['X-Tenant-ID'] = tenantId;
        }

        // Add auth token header
        const userToken = localStorage.getItem('textile_auth_token');
        if (userToken) {
            config.headers['Authorization'] = `Bearer ${userToken}`;
        }

        // Add tenant context to request for debugging
        if (process.env.NODE_ENV === 'development') {
            console.log('[API Request]', {
                method: config.method?.toUpperCase(),
                url: config.url,
                tenantId,
                hasAuth: !!userToken,
            });
        }

        return config;
    },
    (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
    (response) => {
        // Log successful responses in dev
        if (process.env.NODE_ENV === 'development') {
            console.log('[API Response]', {
                status: response.status,
                url: response.config.url,
                data: response.data,
            });
        }
        return response;
    },
    (error) => {
        // Handle specific error cases
        if (error.response) {
            const { status, data } = error.response;

            // Tenant-related errors
            if (status === 403 && data.code === 'TENANT_ACCESS_DENIED') {
                console.error('[API Error] Access denied to tenant');
                // Could trigger a tenant switch or logout here
            }

            // Subscription/plan errors
            if (status === 402 && data.code === 'TENANT_PLAN_LIMIT') {
                console.error('[API Error] Tenant plan limit reached');
                // Could show upgrade modal
            }

            // Auth errors
            if (status === 401) {
                console.error('[API Error] Unauthorized - token may be expired');
                // Could trigger re-authentication
                localStorage.removeItem('textile_auth_token');
                localStorage.removeItem('textile_user');
            }

            // Tenant suspended/inactive
            if (status === 423 && data.code === 'TENANT_SUSPENDED') {
                console.error('[API Error] Tenant account suspended');
                // Could show suspension message
            }

            console.error('[API Error]', {
                status,
                url: error.config?.url,
                message: data.message || error.message,
            });
        } else if (error.request) {
            console.error('[API Error] No response received', error.request);
        } else {
            console.error('[API Error]', error.message);
        }

        return Promise.reject(error);
    }
);

/**
 * Helper function to make tenant-specific requests
 */
export function makeTenantRequest<T>(
    config: AxiosRequestConfig,
    tenantId?: string
): Promise<T> {
    const headers = { ...config.headers };

    if (tenantId) {
        headers['X-Tenant-ID'] = tenantId;
    }

    return apiClient.request<T>({
        ...config,
        headers,
    }).then(response => response.data);
}

/**
 * API endpoints organized by resource
 */
export const api = {
    // Tenant endpoints
    tenants: {
        get: (tenantId: string) =>
            apiClient.get(`/tenants/${tenantId}`),
        update: (tenantId: string, data: any) =>
            apiClient.put(`/tenants/${tenantId}`, data),
        updateSettings: (tenantId: string, settings: any) =>
            apiClient.patch(`/tenants/${tenantId}/settings`, settings),
        updateBranding: (tenantId: string, branding: any) =>
            apiClient.patch(`/tenants/${tenantId}/branding`, branding),
    },

    // User endpoints
    users: {
        getAll: () => apiClient.get('/users'),
        get: (userId: string) => apiClient.get(`/users/${userId}`),
        create: (data: any) => apiClient.post('/users', data),
        update: (userId: string, data: any) => apiClient.put(`/users/${userId}`, data),
        delete: (userId: string) => apiClient.delete(`/users/${userId}`),
    },

    // Module endpoints
    modules: {
        getAll: () => apiClient.get('/modules'),
        get: (moduleId: string) => apiClient.get(`/modules/${moduleId}`),
        create: (data: any) => apiClient.post('/modules', data),
        update: (moduleId: string, data: any) => apiClient.put(`/modules/${moduleId}`, data),
        delete: (moduleId: string) => apiClient.delete(`/modules/${moduleId}`),
    },

    // People endpoints
    people: {
        getAll: () => apiClient.get('/people'),
        get: (personId: string) => apiClient.get(`/people/${personId}`),
        create: (data: any) => apiClient.post('/people', data),
        update: (personId: string, data: any) => apiClient.put(`/people/${personId}`, data),
        delete: (personId: string) => apiClient.delete(`/people/${personId}`),
    },

    // References endpoints
    references: {
        getAll: () => apiClient.get('/references'),
        get: (refId: string) => apiClient.get(`/references/${refId}`),
        create: (data: any) => apiClient.post('/references', data),
        update: (refId: string, data: any) => apiClient.put(`/references/${refId}`, data),
        delete: (refId: string) => apiClient.delete(`/references/${refId}`),
    },

    // Production logging endpoints
    production: {
        log: (data: any) => apiClient.post('/production/log', data),
        getLogs: (params?: any) => apiClient.get('/production/logs', { params }),
        updateLog: (logId: string, data: any) => apiClient.put(`/production/logs/${logId}`, data),
    },

    // Reports endpoints
    reports: {
        generate: (type: string, params: any) =>
            apiClient.post(`/reports/${type}`, params),
        export: (type: string, format: 'excel' | 'pdf', params: any) =>
            apiClient.post(`/reports/${type}/export`, { format, ...params }, { responseType: 'blob' }),
    },

    // Analytics endpoints
    analytics: {
        getKPIs: () => apiClient.get('/analytics/kpis'),
        getEfficiency: (params?: any) => apiClient.get('/analytics/efficiency', { params }),
        getTrends: (params?: any) => apiClient.get('/analytics/trends', { params }),
    },
};

export default apiClient;
