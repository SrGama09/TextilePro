import { useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'administrator' | 'supervisor' | 'operator';
  // Multi-tenancy fields
  tenantIds: string[]; // IDs of tenants the user has access to
  currentTenantId?: string; // Currently active tenant
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Demo users for authentication with tenant access
const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'admin@company.com',
    name: 'Michael Chen',
    role: 'administrator',
    tenantIds: ['tenant-001', 'tenant-002'], // Has access to 2 tenants
  },
  {
    id: '2',
    email: 'supervisor@company.com',
    name: 'Sarah Johnson',
    role: 'supervisor',
    tenantIds: ['tenant-001'], // Only tenant-001
  },
  {
    id: '3',
    email: 'operator@company.com',
    name: 'David Martinez',
    role: 'operator',
    tenantIds: ['tenant-001'],
  },
  {
    id: '4',
    email: 'maria.garcia@company.com',
    name: 'Maria Garcia',
    role: 'operator',
    tenantIds: ['tenant-002'],
  },
  {
    id: '5',
    email: 'john.smith@company.com',
    name: 'John Smith',
    role: 'operator',
    tenantIds: ['tenant-003'],
  },
  // Additional users for other tenants
  {
    id: '6',
    email: 'admin@elitefashion.com',
    name: 'Carlos Rodriguez',
    role: 'administrator',
    tenantIds: ['tenant-004'],
  },
  {
    id: '7',
    email: 'multi@company.com',
    name: 'Alex Thompson',
    role: 'administrator',
    tenantIds: ['tenant-001', 'tenant-002', 'tenant-003', 'tenant-004'], // Super admin with access to all
  },
];

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const storedUser = localStorage.getItem('textile_user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            isLoading: false,
            error: null
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setAuthState({
          user: null,
          isLoading: false,
          error: null
        });
      }
    };

    checkExistingSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Demo authentication logic
      const user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Invalid email or password'
        }));
        return false;
      }

      // For demo purposes, accept any password for existing users
      // In production, this would verify against a secure backend
      if (password !== 'password123') {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Invalid email or password'
        }));
        return false;
      }

      // Store user session
      localStorage.setItem('textile_user', JSON.stringify(user));

      setAuthState({
        user,
        isLoading: false,
        error: null
      });

      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'An error occurred during login. Please try again.'
      }));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('textile_user');
    setAuthState({
      user: null,
      isLoading: false,
      error: null
    });
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    login,
    logout,
    clearError,
    isAuthenticated: !!authState.user
  };
}