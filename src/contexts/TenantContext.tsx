import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Tenant, TenantContextType } from '../types/tenant';
import { MOCK_TENANTS, getTenantById } from '../data/mockTenants';
import { TenantStorage } from '../services/tenantStorage';

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
    children: ReactNode;
    userTenantIds?: string[]; // Tenants the current user has access to
}

export function TenantProvider({ children, userTenantIds = [] }: TenantProviderProps) {
    const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
    const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize tenant from storage or first available
    useEffect(() => {
        const initializeTenant = async () => {
            try {
                setIsLoading(true);

                // Get tenants user has access to
                const userTenants = userTenantIds.length > 0
                    ? MOCK_TENANTS.filter(t => userTenantIds.includes(t.id))
                    : MOCK_TENANTS; // Show all for demo purposes

                setAvailableTenants(userTenants);

                // Try to restore last selected tenant
                const savedTenantId = TenantStorage.getCurrentTenantId();
                let tenant: Tenant | null = null;

                if (savedTenantId) {
                    tenant = getTenantById(savedTenantId) || null;
                    // Verify user still has access to this tenant
                    if (tenant && !userTenants.find(t => t.id === savedTenantId)) {
                        tenant = null;
                        TenantStorage.clearCurrentTenantId();
                    }
                }

                // If no saved tenant or invalid, use first available
                if (!tenant && userTenants.length > 0) {
                    tenant = userTenants[0];
                }

                if (tenant) {
                    setCurrentTenant(tenant);
                    TenantStorage.setCurrentTenantId(tenant.id);
                    applyBranding(tenant);
                }

                setError(null);
            } catch (err) {
                console.error('Error initializing tenant:', err);
                setError('Failed to initialize tenant');
            } finally {
                setIsLoading(false);
            }
        };

        initializeTenant();
    }, [userTenantIds]);

    // Apply tenant branding to the document
    const applyBranding = useCallback((tenant: Tenant) => {
        const root = document.documentElement;
        const { branding } = tenant;

        // Set CSS custom properties for dynamic theming
        root.style.setProperty('--tenant-primary', branding.primaryColor);
        root.style.setProperty('--tenant-secondary', branding.secondaryColor);
        if (branding.accentColor) {
            root.style.setProperty('--tenant-accent', branding.accentColor);
        }
        if (branding.headerBgColor) {
            root.style.setProperty('--tenant-header-bg', branding.headerBgColor);
        }

        // Update document title
        document.title = `${tenant.displayName} - Textile Production Dashboard`;

        // Update favicon if provided
        if (branding.faviconUrl) {
            const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (favicon) {
                favicon.href = branding.faviconUrl;
            }
        }
    }, []);

    // Switch to a different tenant
    const switchTenant = useCallback(async (tenantId: string): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const tenant = getTenantById(tenantId);

            if (!tenant) {
                throw new Error('Tenant not found');
            }

            // Verify user has access to this tenant
            if (!availableTenants.find(t => t.id === tenantId)) {
                throw new Error('Access denied to this tenant');
            }

            // In production, this would call an API to switch tenant context
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call

            setCurrentTenant(tenant);
            TenantStorage.setCurrentTenantId(tenant.id);
            applyBranding(tenant);

            // Optionally reload page data for new tenant here
            console.log(`Switched to tenant: ${tenant.displayName}`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to switch tenant';
            setError(errorMessage);
            console.error('Error switching tenant:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [availableTenants, applyBranding]);

    // Update tenant settings
    const updateTenantSettings = useCallback(async (settings: Partial<Tenant['settings']>): Promise<void> => {
        if (!currentTenant) {
            throw new Error('No active tenant');
        }

        try {
            setIsLoading(true);
            setError(null);

            // In production, this would call an API
            await new Promise(resolve => setTimeout(resolve, 500));

            const updatedTenant: Tenant = {
                ...currentTenant,
                settings: {
                    ...currentTenant.settings,
                    ...settings,
                },
            };

            setCurrentTenant(updatedTenant);

            // Save to storage for persistence in demo
            TenantStorage.setTenantData(currentTenant.id, 'settings', updatedTenant.settings);

            console.log('Tenant settings updated:', settings);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update settings';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [currentTenant]);

    // Update tenant branding
    const updateTenantBranding = useCallback(async (branding: Partial<Tenant['branding']>): Promise<void> => {
        if (!currentTenant) {
            throw new Error('No active tenant');
        }

        try {
            setIsLoading(true);
            setError(null);

            // In production, this would call an API
            await new Promise(resolve => setTimeout(resolve, 500));

            const updatedBranding = {
                ...currentTenant.branding,
                ...branding,
            };

            const updatedTenant: Tenant = {
                ...currentTenant,
                branding: updatedBranding,
            };

            setCurrentTenant(updatedTenant);
            applyBranding(updatedTenant);

            // Save to storage for persistence in demo
            TenantStorage.setTenantData(currentTenant.id, 'branding', updatedBranding);

            console.log('Tenant branding updated:', branding);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update branding';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [currentTenant, applyBranding]);

    // Refresh tenant data
    const refreshTenant = useCallback(async (): Promise<void> => {
        if (!currentTenant) return;

        try {
            setIsLoading(true);
            setError(null);

            // In production, this would fetch fresh data from API
            await new Promise(resolve => setTimeout(resolve, 300));

            const refreshedTenant = getTenantById(currentTenant.id);
            if (refreshedTenant) {
                setCurrentTenant(refreshedTenant);
                applyBranding(refreshedTenant);
            }
        } catch (err) {
            console.error('Error refreshing tenant:', err);
            setError('Failed to refresh tenant data');
        } finally {
            setIsLoading(false);
        }
    }, [currentTenant, applyBranding]);

    const value: TenantContextType = {
        currentTenant,
        availableTenants,
        isLoading,
        error,
        switchTenant,
        updateTenantSettings,
        updateTenantBranding,
        refreshTenant,
    };

    return (
        <TenantContext.Provider value={value}>
            {children}
        </TenantContext.Provider>
    );
}

export function useTenantContext(): TenantContextType {
    const context = React.useContext(TenantContext);
    if (context === undefined) {
        throw new Error('useTenantContext must be used within a TenantProvider');
    }
    return context;
}
