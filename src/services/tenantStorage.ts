/**
 * Tenant-isolated storage service
 * Provides data isolation per tenant using localStorage with tenant prefixes
 */

const STORAGE_PREFIX = 'textile_tenant_';

export class TenantStorage {
    /**
     * Get data for a specific tenant
     */
    static getTenantData<T>(tenantId: string, key: string): T | null {
        try {
            const storageKey = `${STORAGE_PREFIX}${tenantId}_${key}`;
            const data = localStorage.getItem(storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error reading tenant data for ${tenantId}:${key}`, error);
            return null;
        }
    }

    /**
     * Set data for a specific tenant
     */
    static setTenantData<T>(tenantId: string, key: string, value: T): void {
        try {
            const storageKey = `${STORAGE_PREFIX}${tenantId}_${key}`;
            localStorage.setItem(storageKey, JSON.stringify(value));
        } catch (error) {
            console.error(`Error saving tenant data for ${tenantId}:${key}`, error);
            throw new Error('Failed to save tenant data');
        }
    }

    /**
     * Remove specific data for a tenant
     */
    static removeTenantData(tenantId: string, key: string): void {
        try {
            const storageKey = `${STORAGE_PREFIX}${tenantId}_${key}`;
            localStorage.removeItem(storageKey);
        } catch (error) {
            console.error(`Error removing tenant data for ${tenantId}:${key}`, error);
        }
    }

    /**
     * Clear all data for a specific tenant
     */
    static clearTenantData(tenantId: string): void {
        try {
            const prefix = `${STORAGE_PREFIX}${tenantId}_`;
            const keysToRemove: string[] = [];

            // Find all keys for this tenant
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(prefix)) {
                    keysToRemove.push(key);
                }
            }

            // Remove them
            keysToRemove.forEach(key => localStorage.removeItem(key));

            console.log(`Cleared ${keysToRemove.length} items for tenant ${tenantId}`);
        } catch (error) {
            console.error(`Error clearing tenant data for ${tenantId}`, error);
        }
    }

    /**
     * Get all keys for a specific tenant
     */
    static getTenantKeys(tenantId: string): string[] {
        const prefix = `${STORAGE_PREFIX}${tenantId}_`;
        const keys: string[] = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                // Remove the prefix to get the actual key name
                keys.push(key.replace(prefix, ''));
            }
        }

        return keys;
    }

    /**
     * Check if tenant has any data stored
     */
    static hasTenantData(tenantId: string): boolean {
        return this.getTenantKeys(tenantId).length > 0;
    }

    /**
     * Get the current active tenant ID from storage
     */
    static getCurrentTenantId(): string | null {
        return localStorage.getItem('textile_current_tenant_id');
    }

    /**
     * Set the current active tenant ID
     */
    static setCurrentTenantId(tenantId: string): void {
        localStorage.setItem('textile_current_tenant_id', tenantId);
    }

    /**
     * Clear the current tenant ID
     */
    static clearCurrentTenantId(): void {
        localStorage.removeItem('textile_current_tenant_id');
    }

    /**
     * Migrate data from non-tenant storage to tenant storage
     * Useful for backwards compatibility
     */
    static migrateToTenant(tenantId: string, oldKey: string, newKey?: string): void {
        try {
            const data = localStorage.getItem(oldKey);
            if (data) {
                const targetKey = newKey || oldKey;
                this.setTenantData(tenantId, targetKey, JSON.parse(data));
                localStorage.removeItem(oldKey);
                console.log(`Migrated ${oldKey} to tenant ${tenantId}:${targetKey}`);
            }
        } catch (error) {
            console.error(`Error migrating data from ${oldKey}`, error);
        }
    }

    /**
     * Export all tenant data (for backup/debugging)
     */
    static exportTenantData(tenantId: string): Record<string, any> {
        const keys = this.getTenantKeys(tenantId);
        const data: Record<string, any> = {};

        keys.forEach(key => {
            data[key] = this.getTenantData(tenantId, key);
        });

        return data;
    }

    /**
     * Import tenant data (for restore/testing)
     */
    static importTenantData(tenantId: string, data: Record<string, any>): void {
        Object.entries(data).forEach(([key, value]) => {
            this.setTenantData(tenantId, key, value);
        });
        console.log(`Imported ${Object.keys(data).length} items for tenant ${tenantId}`);
    }

    /**
     * Get storage statistics for a tenant
     */
    static getTenantStorageStats(tenantId: string): {
        itemCount: number;
        estimatedSizeKB: number;
        keys: string[];
    } {
        const keys = this.getTenantKeys(tenantId);
        let totalSize = 0;

        keys.forEach(key => {
            const data = this.getTenantData(tenantId, key);
            if (data) {
                totalSize += JSON.stringify(data).length;
            }
        });

        return {
            itemCount: keys.length,
            estimatedSizeKB: Math.round(totalSize / 1024),
            keys,
        };
    }
}

// Export convenience methods
export const {
    getTenantData,
    setTenantData,
    removeTenantData,
    clearTenantData,
    getCurrentTenantId,
    setCurrentTenantId,
} = TenantStorage;
