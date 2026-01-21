/**
 * Multi-tenancy type definitions
 * These types support the SaaS multi-tenant architecture
 */

export interface TenantBranding {
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  logoUrl?: string;
  faviconUrl?: string;
  headerBgColor?: string;
}

export interface TenantSettings {
  // General settings
  companyName: string;
  timezone: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  currency: string;
  language: 'en' | 'es' | 'pt';
  
  // Feature flags
  features: {
    modules: boolean;
    people: boolean;
    references: boolean;
    reports: boolean;
    administration: boolean;
    qualityControl: boolean;
    inventory: boolean;
    analytics: boolean;
  };
  
  // Notifications
  notifications: {
    email: boolean;
    inApp: boolean;
    productionAlerts: boolean;
    lowEfficiencyAlerts: boolean;
  };
  
  // Business settings
  workingHours: {
    start: string; // e.g., "08:00"
    end: string;   // e.g., "17:00"
  };
  defaultEfficiencyThreshold: number; // e.g., 85
}

export type TenantStatus = 'active' | 'suspended' | 'trial' | 'inactive';
export type TenantPlan = 'basic' | 'standard' | 'premium' | 'enterprise';

export interface Tenant {
  id: string;
  name: string;
  slug: string; // URL-friendly identifier for future subdomain support
  displayName: string;
  description?: string;
  
  // Plan and status
  status: TenantStatus;
  planType: TenantPlan;
  trialEndsAt?: Date;
  createdAt: Date;
  
  // Branding
  branding: TenantBranding;
  
  // Settings
  settings: TenantSettings;
  
  // Limits based on plan
  limits: {
    maxUsers: number;
    maxModules: number;
    maxStorageGB: number;
    apiCallsPerMonth: number;
  };
  
  // Contact info
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
}

export interface TenantContextType {
  currentTenant: Tenant | null;
  availableTenants: Tenant[];
  isLoading: boolean;
  error: string | null;
  switchTenant: (tenantId: string) => Promise<void>;
  updateTenantSettings: (settings: Partial<TenantSettings>) => Promise<void>;
  updateTenantBranding: (branding: Partial<TenantBranding>) => Promise<void>;
  refreshTenant: () => Promise<void>;
}

// User-Tenant relationship
export interface UserTenantAccess {
  tenantId: string;
  role: 'administrator' | 'supervisor' | 'operator';
  permissions: string[];
  assignedModules?: string[]; // For operators
}
