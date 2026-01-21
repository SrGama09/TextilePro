import { useEffect } from 'react';
import { useTenant } from './useTenant';

/**
 * Hook to apply and manage tenant branding
 * Automatically applies CSS variables and updates document metadata
 */
export function useBranding() {
    const { currentTenant } = useTenant();

    useEffect(() => {
        if (!currentTenant) return;

        const { branding, displayName } = currentTenant;
        const root = document.documentElement;

        // Apply CSS custom properties
        root.style.setProperty('--tenant-primary', branding.primaryColor);
        root.style.setProperty('--tenant-secondary', branding.secondaryColor);

        if (branding.accentColor) {
            root.style.setProperty('--tenant-accent', branding.accentColor);
        }

        if (branding.headerBgColor) {
            root.style.setProperty('--tenant-header-bg', branding.headerBgColor);
        }

        // Update document title
        document.title = `${displayName} - Textile Production Dashboard`;

        // Update meta theme color for mobile browsers
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.setAttribute('name', 'theme-color');
            document.head.appendChild(themeColorMeta);
        }
        themeColorMeta.setAttribute('content', branding.primaryColor);

        // Update favicon if provided
        if (branding.faviconUrl) {
            let favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (!favicon) {
                favicon = document.createElement('link');
                favicon.rel = 'icon';
                document.head.appendChild(favicon);
            }
            favicon.href = branding.faviconUrl;
        }

        // Cleanup function
        return () => {
            // Reset to default values if needed
            root.style.removeProperty('--tenant-primary');
            root.style.removeProperty('--tenant-secondary');
            root.style.removeProperty('--tenant-accent');
            root.style.removeProperty('--tenant-header-bg');
        };
    }, [currentTenant]);

    return {
        primaryColor: currentTenant?.branding.primaryColor,
        secondaryColor: currentTenant?.branding.secondaryColor,
        accentColor: currentTenant?.branding.accentColor,
        headerBgColor: currentTenant?.branding.headerBgColor,
        logoUrl: currentTenant?.branding.logoUrl,
    };
}

export default useBranding;
