import { useTenantContext } from '../contexts/TenantContext';

/**
 * Convenience hook for accessing tenant context
 * Re-exports the context hook with a cleaner name
 */
export function useTenant() {
    return useTenantContext();
}

export default useTenant;
