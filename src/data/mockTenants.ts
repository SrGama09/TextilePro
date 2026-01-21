import type { Tenant } from '../types/tenant';

/**
 * Mock tenant data for demonstration and testing
 * In production, this would come from the backend API
 */

export const MOCK_TENANTS: Tenant[] = [
    {
        id: 'tenant-001',
        name: 'textiles-abc',
        slug: 'textiles-abc',
        displayName: 'Textiles ABC Internacional',
        description: 'Empresa líder en confección de prendas deportivas',
        status: 'active',
        planType: 'enterprise',
        createdAt: new Date('2023-01-15'),

        branding: {
            primaryColor: '#2563eb', // Blue
            secondaryColor: '#7c3aed', // Purple
            accentColor: '#06b6d4', // Cyan
            logoUrl: '/logos/textiles-abc.png',
            headerBgColor: '#1e40af',
        },

        settings: {
            companyName: 'Textiles ABC Internacional S.A.',
            timezone: 'America/Bogota',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h',
            currency: 'COP',
            language: 'es',

            features: {
                modules: true,
                people: true,
                references: true,
                reports: true,
                administration: true,
                qualityControl: true,
                inventory: true,
                analytics: true,
            },

            notifications: {
                email: true,
                inApp: true,
                productionAlerts: true,
                lowEfficiencyAlerts: true,
            },

            workingHours: {
                start: '07:00',
                end: '18:00',
            },
            defaultEfficiencyThreshold: 85,
        },

        limits: {
            maxUsers: 500,
            maxModules: 50,
            maxStorageGB: 200,
            apiCallsPerMonth: 1000000,
        },

        contactEmail: 'admin@textilesabc.com',
        contactPhone: '+57 300 123 4567',
        address: 'Carrera 45 #78-90, Medellín, Colombia',
    },

    {
        id: 'tenant-002',
        name: 'confecciones-valle',
        slug: 'confecciones-valle',
        displayName: 'Confecciones Del Valle',
        description: 'Especialistas en uniformes corporativos y escolares',
        status: 'active',
        planType: 'premium',
        createdAt: new Date('2023-06-20'),

        branding: {
            primaryColor: '#059669', // Green
            secondaryColor: '#0891b2', // Teal
            accentColor: '#f59e0b', // Amber
            logoUrl: '/logos/confecciones-valle.png',
            headerBgColor: '#047857',
        },

        settings: {
            companyName: 'Confecciones Del Valle Ltda.',
            timezone: 'America/Bogota',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '12h',
            currency: 'COP',
            language: 'es',

            features: {
                modules: true,
                people: true,
                references: true,
                reports: true,
                administration: true,
                qualityControl: true,
                inventory: false,
                analytics: true,
            },

            notifications: {
                email: true,
                inApp: true,
                productionAlerts: true,
                lowEfficiencyAlerts: false,
            },

            workingHours: {
                start: '08:00',
                end: '17:00',
            },
            defaultEfficiencyThreshold: 80,
        },

        limits: {
            maxUsers: 150,
            maxModules: 20,
            maxStorageGB: 100,
            apiCallsPerMonth: 100000,
        },

        contactEmail: 'contacto@confeccionesvalle.com',
        contactPhone: '+57 315 987 6543',
        address: 'Calle 25 #15-32, Cali, Colombia',
    },

    {
        id: 'tenant-003',
        name: 'taller-produccion',
        slug: 'taller-produccion',
        displayName: 'Taller Producción',
        description: 'Taller de confección familiar',
        status: 'trial',
        planType: 'standard',
        trialEndsAt: new Date('2025-12-31'),
        createdAt: new Date('2024-11-01'),

        branding: {
            primaryColor: '#dc2626', // Red
            secondaryColor: '#ea580c', // Orange
            accentColor: '#4f46e5', // Indigo
            logoUrl: '/logos/taller-produccion.png',
            headerBgColor: '#b91c1c',
        },

        settings: {
            companyName: 'Taller Producción',
            timezone: 'America/Bogota',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h',
            currency: 'COP',
            language: 'es',

            features: {
                modules: true,
                people: true,
                references: true,
                reports: true,
                administration: false,
                qualityControl: false,
                inventory: false,
                analytics: false,
            },

            notifications: {
                email: false,
                inApp: true,
                productionAlerts: true,
                lowEfficiencyAlerts: false,
            },

            workingHours: {
                start: '08:00',
                end: '16:00',
            },
            defaultEfficiencyThreshold: 75,
        },

        limits: {
            maxUsers: 50,
            maxModules: 10,
            maxStorageGB: 50,
            apiCallsPerMonth: 10000,
        },

        contactEmail: 'info@tallerproduccion.com',
        contactPhone: '+57 320 456 7890',
        address: 'Carrera 10 #5-20, Bogotá, Colombia',
    },

    {
        id: 'tenant-004',
        name: 'elite-fashion',
        slug: 'elite-fashion',
        displayName: 'Elite Fashion Group',
        description: 'Grupo de empresas de moda premium',
        status: 'active',
        planType: 'enterprise',
        createdAt: new Date('2022-03-10'),

        branding: {
            primaryColor: '#7c3aed', // Purple
            secondaryColor: '#ec4899', // Pink
            accentColor: '#f59e0b', // Amber
            logoUrl: '/logos/elite-fashion.png',
            headerBgColor: '#6d28d9',
        },

        settings: {
            companyName: 'Elite Fashion Group S.A.S.',
            timezone: 'America/Mexico_City',
            dateFormat: 'MM/DD/YYYY',
            timeFormat: '12h',
            currency: 'MXN',
            language: 'es',

            features: {
                modules: true,
                people: true,
                references: true,
                reports: true,
                administration: true,
                qualityControl: true,
                inventory: true,
                analytics: true,
            },

            notifications: {
                email: true,
                inApp: true,
                productionAlerts: true,
                lowEfficiencyAlerts: true,
            },

            workingHours: {
                start: '08:00',
                end: '19:00',
            },
            defaultEfficiencyThreshold: 90,
        },

        limits: {
            maxUsers: 1000,
            maxModules: 100,
            maxStorageGB: 500,
            apiCallsPerMonth: 5000000,
        },

        contactEmail: 'corporativo@elitefashion.mx',
        contactPhone: '+52 55 1234 5678',
        address: 'Av. Insurgentes Sur 1234, CDMX, México',
    },
];

/**
 * Get tenant by ID
 */
export function getTenantById(tenantId: string): Tenant | undefined {
    return MOCK_TENANTS.find(t => t.id === tenantId);
}

/**
 * Get tenant by slug
 */
export function getTenantBySlug(slug: string): Tenant | undefined {
    return MOCK_TENANTS.find(t => t.slug === slug);
}

/**
 * Get tenants by IDs (for users with multiple tenant access)
 */
export function getTenantsByIds(tenantIds: string[]): Tenant[] {
    return MOCK_TENANTS.filter(t => tenantIds.includes(t.id));
}
