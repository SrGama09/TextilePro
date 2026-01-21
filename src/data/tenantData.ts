/**
 * Tenant-specific mock data
 * Different data sets for each tenant to demonstrate multi-tenancy
 */

export const TENANT_MODULES_DATA = {
    'tenant-001': [ // Textiles ABC Internacional
        {
            id: 'M-001',
            name: 'Línea Deportiva A',
            code: 'LD-A',
            status: 'Active' as const,
            assignedPeople: 12,
            currentReference: 'Jersey Deportivo Premium',
            efficiency: 92,
            lastActivity: '2 min ago'
        },
        {
            id: 'M-002',
            name: 'Línea Deportiva B',
            code: 'LD-B',
            status: 'Active' as const,
            assignedPeople: 10,
            currentReference: 'Pantalón Running Pro',
            efficiency: 88,
            lastActivity: '5 min ago'
        },
        {
            id: 'M-003',
            name: 'Línea Casual',
            code: 'LC-1',
            status: 'Maintenance' as const,
            assignedPeople: 0,
            currentReference: '-',
            efficiency: 0,
            lastActivity: '2 hours ago'
        },
    ],
    'tenant-002': [ // Confecciones Del Valle
        {
            id: 'M-101',
            name: 'Módulo Uniformes Escolares',
            code: 'UE-01',
            status: 'Active' as const,
            assignedPeople: 15,
            currentReference: 'Camisa Escolar Blanca',
            efficiency: 85,
            lastActivity: '1 min ago'
        },
        {
            id: 'M-102',
            name: 'Módulo Uniformes Corporativos',
            code: 'UC-01',
            status: 'Active' as const,
            assignedPeople: 8,
            currentReference: 'Camisa Ejecutiva Azul',
            efficiency: 90,
            lastActivity: '3 min ago'
        },
    ],
    'tenant-003': [ // Taller Producción
        {
            id: 'M-201',
            name: 'Mesa Principal',
            code: 'MP-1',
            status: 'Active' as const,
            assignedPeople: 5,
            currentReference: 'Pantalón Jean Básico',
            efficiency: 75,
            lastActivity: '10 min ago'
        },
    ],
    'tenant-004': [ // Elite Fashion Group
        {
            id: 'M-301',
            name: 'Alta Costura - Línea A',
            code: 'AC-A',
            status: 'Active' as const,
            assignedPeople: 18,
            currentReference: 'Vestido Gala Premium',
            efficiency: 95,
            lastActivity: '30 sec ago'
        },
        {
            id: 'M-302',
            name: 'Alta Costura - Línea B',
            code: 'AC-B',
            status: 'Active' as const,
            assignedPeople: 16,
            currentReference: 'Traje Ejecutivo Luxury',
            efficiency: 93,
            lastActivity: '1 min ago'
        },
        {
            id: 'M-303',
            name: 'Prêt-à-Porter',
            code: 'PAP-1',
            status: 'Active' as const,
            assignedPeople: 14,
            currentReference: 'Blusa Casual Chic',
            efficiency: 89,
            lastActivity: '2 min ago'
        },
    ],
};

export const TENANT_PEOPLE_DATA = {
    'tenant-001': [
        {
            id: 'P-001',
            name: 'Carlos Mendoza',
            code: 'EMP-001',
            status: 'Active' as const,
            assignedModule: 'Línea Deportiva A',
            efficiency: 94,
            dailyMinutes: 420,
            department: 'Producción',
            joinDate: '2022-01-15'
        },
        {
            id: 'P-002',
            name: 'Ana Rodríguez',
            code: 'EMP-002',
            status: 'Active' as const,
            assignedModule: 'Línea Deportiva A',
            efficiency: 91,
            dailyMinutes: 410,
            department: 'Producción',
            joinDate: '2022-03-20'
        },
        {
            id: 'P-003',
            name: 'Luis Fernández',
            code: 'EMP-003',
            status: 'Active' as const,
            assignedModule: 'Línea Deportiva B',
            efficiency: 87,
            dailyMinutes: 395,
            department: 'Producción',
            joinDate: '2023-01-10'
        },
    ],
    'tenant-002': [
        {
            id: 'P-101',
            name: 'María López',
            code: 'VAL-001',
            status: 'Active' as const,
            assignedModule: 'Módulo Uniformes Escolares',
            efficiency: 88,
            dailyMinutes: 400,
            department: 'Uniformes',
            joinDate: '2021-06-10'
        },
        {
            id: 'P-102',
            name: 'Jorge Ramírez',
            code: 'VAL-002',
            status: 'Active' as const,
            assignedModule: 'Módulo Uniformes Corporativos',
            efficiency: 92,
            dailyMinutes: 415,
            department: 'Corporativo',
            joinDate: '2022-02-15'
        },
    ],
    'tenant-003': [
        {
            id: 'P-201',
            name: 'Pedro Sánchez',
            code: 'TAL-001',
            status: 'Active' as const,
            assignedModule: 'Mesa Principal',
            efficiency: 78,
            dailyMinutes: 380,
            department: 'General',
            joinDate: '2023-08-01'
        },
        {
            id: 'P-202',
            name: 'Laura Gómez',
            code: 'TAL-002',
            status: 'Active' as const,
            assignedModule: 'Mesa Principal',
            efficiency: 72,
            dailyMinutes: 370,
            department: 'General',
            joinDate: '2024-01-15'
        },
    ],
    'tenant-004': [
        {
            id: 'P-301',
            name: 'Isabella Moretti',
            code: 'ELT-001',
            status: 'Active' as const,
            assignedModule: 'Alta Costura - Línea A',
            efficiency: 96,
            dailyMinutes: 450,
            department: 'Alta Costura',
            joinDate: '2020-05-01'
        },
        {
            id: 'P-302',
            name: 'Alessandro Rossi',
            code: 'ELT-002',
            status: 'Active' as const,
            assignedModule: 'Alta Costura - Línea B',
            efficiency: 94,
            dailyMinutes: 445,
            department: 'Alta Costura',
            joinDate: '2020-07-15'
        },
        {
            id: 'P-303',
            name: 'Sofia Martinez',
            code: 'ELT-003',
            status: 'Active' as const,
            assignedModule: 'Prêt-à-Porter',
            efficiency: 90,
            dailyMinutes: 430,
            department: 'Ready-to-Wear',
            joinDate: '2021-03-10'
        },
    ],
};

export const TENANT_REFERENCES_DATA = {
    'tenant-001': [
        {
            id: 'REF-001',
            code: 'JDP-2024-001',
            description: 'Jersey Deportivo Premium - Colección Verano',
            lot: 'LOT-2024-A',
            status: 'En proceso' as const,
            progress: 65,
            totalMinutes: 2400,
            remainingMinutes: 840,
            minutesPerUnit: 12,
            assignedModules: ['Línea Deportiva A'],
            priority: 'High' as const,
            createdDate: '2024-11-20',
            estimatedCompletion: '2024-11-28'
        },
        {
            id: 'REF-002',
            code: 'PRP-2024-002',
            description: 'Pantalón Running Pro - Línea Performance',
            lot: 'LOT-2024-B',
            status: 'En proceso' as const,
            progress: 45,
            totalMinutes: 3200,
            remainingMinutes: 1760,
            minutesPerUnit: 16,
            assignedModules: ['Línea Deportiva B'],
            priority: 'High' as const,
            createdDate: '2024-11-22',
            estimatedCompletion: '2024-12-02'
        },
    ],
    'tenant-002': [
        {
            id: 'REF-101',
            code: 'UE-2024-101',
            description: 'Camisa Escolar Blanca - Talla 8-12',
            lot: 'ESC-2024-01',
            status: 'En proceso' as const,
            progress: 80,
            totalMinutes: 1800,
            remainingMinutes: 360,
            minutesPerUnit: 9,
            assignedModules: ['Módulo Uniformes Escolares'],
            priority: 'High' as const,
            createdDate: '2024-11-18',
            estimatedCompletion: '2024-11-27'
        },
        {
            id: 'REF-102',
            code: 'UC-2024-102',
            description: 'Camisa Ejecutiva Azul - Talla M-XL',
            lot: 'CORP-2024-01',
            status: 'En proceso' as const,
            progress: 55,
            totalMinutes: 2100,
            remainingMinutes: 945,
            minutesPerUnit: 10.5,
            assignedModules: ['Módulo Uniformes Corporativos'],
            priority: 'Medium' as const,
            createdDate: '2024-11-22',
            estimatedCompletion: '2024-11-30'
        },
    ],
    'tenant-003': [
        {
            id: 'REF-201',
            code: 'JB-2024-001',
            description: 'Pantalón Jean Básico - Hombre',
            lot: 'JEAN-001',
            status: 'En proceso' as const,
            progress: 30,
            totalMinutes: 1500,
            remainingMinutes: 1050,
            minutesPerUnit: 15,
            assignedModules: ['Mesa Principal'],
            priority: 'Medium' as const,
            createdDate: '2024-11-24',
            estimatedCompletion: '2024-12-05'
        },
    ],
    'tenant-004': [
        {
            id: 'REF-301',
            code: 'VGP-2024-301',
            description: 'Vestido Gala Premium - Colección Otoño',
            lot: 'GALA-2024-A',
            status: 'En proceso' as const,
            progress: 75,
            totalMinutes: 4800,
            remainingMinutes: 1200,
            minutesPerUnit: 40,
            assignedModules: ['Alta Costura - Línea A'],
            priority: 'High' as const,
            createdDate: '2024-11-15',
            estimatedCompletion: '2024-11-26'
        },
        {
            id: 'REF-302',
            code: 'TEL-2024-302',
            description: 'Traje Ejecutivo Luxury - Línea Business',
            lot: 'LUX-2024-B',
            status: 'En proceso' as const,
            progress: 60,
            totalMinutes: 5400,
            remainingMinutes: 2160,
            minutesPerUnit: 45,
            assignedModules: ['Alta Costura - Línea B'],
            priority: 'High' as const,
            createdDate: '2024-11-17',
            estimatedCompletion: '2024-11-29'
        },
        {
            id: 'REF-303',
            code: 'BCC-2024-303',
            description: 'Blusa Casual Chic - Temporada Actual',
            lot: 'CHIC-2024-C',
            status: 'En proceso' as const,
            progress: 85,
            totalMinutes: 2800,
            remainingMinutes: 420,
            minutesPerUnit: 14,
            assignedModules: ['Prêt-à-Porter'],
            priority: 'Medium' as const,
            createdDate: '2024-11-19',
            estimatedCompletion: '2024-11-25'
        },
    ],
};

// Helper functions to get tenant-specific data
export function getModulesForTenant(tenantId: string) {
    const modules = TENANT_MODULES_DATA[tenantId as keyof typeof TENANT_MODULES_DATA] || [];
    const people = TENANT_PEOPLE_DATA[tenantId as keyof typeof TENANT_PEOPLE_DATA] || [];

    // Calculate actual assigned people count for each module
    return modules.map(module => {
        const assignedCount = people.filter(person =>
            person.assignedModule === module.name
        ).length;

        return {
            ...module,
            assignedPeople: assignedCount
        };
    });
}

export function getPeopleForTenant(tenantId: string) {
    return TENANT_PEOPLE_DATA[tenantId as keyof typeof TENANT_PEOPLE_DATA] || [];
}

export function getReferencesForTenant(tenantId: string) {
    return TENANT_REFERENCES_DATA[tenantId as keyof typeof TENANT_REFERENCES_DATA] || [];
}

// Dashboard data per tenant
export const TENANT_DASHBOARD_DATA = {
    'tenant-001': { // Textiles ABC Internacional
        activeUsers: 28,
        lastBackupTime: "2:30 AM",
        lastBackupDate: "Today",
        systemHealth: "Optimal",
        modules: { active: 2, inactive: 1, total: 3 },
        people: { active: 3, inactive: 0, total: 3 },
        references: { pending: 0, inProgress: 2, finished: 45, total: 47 },
        users: { administrators: 2, supervisors: 4, total: 6 },
        recentUsers: [
            { name: "Carlos Mendoza", role: "operator", action: "logged in", time: "1 hour ago" },
            { name: "Ana Rodríguez", role: "operator", action: "updated profile", time: "3 hours ago" },
        ],
        systemLogs: [
            { type: "success", message: "Daily production target achieved for Línea Deportiva A", time: "4:30 PM" },
            { type: "info", message: "User 'admin@company.com' logged in", time: "8:00 AM" },
            { type: "success", message: "Backup completed - 2.3 GB stored", time: "2:30 AM" },
        ],
        // KPI Panel Data
        production: {
            totalMinutes: 13200,
            targetMinutes: 15000,
            overallEfficiency: 92,
            activeModules: 2,
            referencesInProgress: 2
        },
        // Alerts Panel Data
        alerts: [
            {
                id: 1,
                type: "info",
                title: "Línea Deportiva A Performing Well",
                message: "Línea Deportiva A efficiency at 92% - exceeding target",
                timestamp: "15 minutes ago"
            },
            {
                id: 2,
                type: "warning",
                title: "Línea Casual Under Maintenance",
                message: "Línea Casual scheduled for preventive maintenance until 5 PM",
                timestamp: "2 hours ago"
            },
            {
                id: 3,
                type: "info",
                title: "New Order Received",
                message: "Production order for 1000 units Jersey Deportivo Premium",
                timestamp: "3 hours ago"
            }
        ],
        // Active References (showing progress for references in production)
        activeReferences: [
            {
                code: "JDP-001",
                name: "Jersey Deportivo Premium",
                progress: 68,
                remainingMinutes: 384,
                totalMinutes: 1200,
                priority: "High"
            },
            {
                code: "PRP-002",
                name: "Pantalón Running Pro",
                progress: 45,
                remainingMinutes: 660,
                totalMinutes: 1200,
                priority: "Medium"
            }
        ]
    },
    'tenant-002': { // Confecciones Del Valle
        activeUsers: 15,
        lastBackupTime: "3:00 AM",
        lastBackupDate: "Today",
        systemHealth: "Good",
        modules: { active: 2, inactive: 0, total: 2 },
        people: { active: 2, inactive: 0, total: 2 },
        references: { pending: 0, inProgress: 2, finished: 68, total: 70 },
        users: { administrators: 1, supervisors: 2, total: 3 },
        recentUsers: [
            { name: "María López", role: "operator", action: "created", time: "2 hours ago" },
            { name: "Jorge Ramírez", role: "supervisor", action: "logged in", time: "4 hours ago" },
        ],
        systemLogs: [
            { type: "success", message: "Uniformes Escolares batch completed ahead of schedule", time: "2:45 PM" },
            { type: "info", message: "New order received: 500 units Camisa Ejecutiva", time: "11:00 AM" },
            { type: "success", message: "System backup successful", time: "3:00 AM" },
        ],
        // KPI Panel Data
        production: {
            totalMinutes: 8500,
            targetMinutes: 10000,
            overallEfficiency: 88,
            activeModules: 2,
            referencesInProgress: 2
        },
        // Alerts Panel Data
        alerts: [
            {
                id: 1,
                type: "critical",
                title: "Urgent - Camisa Escolar Deadline",
                message: "Order deadline approaching: 200 units Camisa Escolar Blanca due tomorrow",
                timestamp: "30 minutes ago"
            },
            {
                id: 2,
                type: "info",
                title: "Quality Check Passed",
                message: "Uniformes Corporativos batch passed quality inspection",
                timestamp: "1 hour ago"
            },
            {
                id: 3,
                type: "warning",
                title: "Material Running Low",
                message: "White fabric inventory below threshold - order required",
                timestamp: "2 hours ago"
            }
        ],
        // Active References
        activeReferences: [
            {
                code: "CEB-001",
                name: "Camisa Escolar Blanca",
                progress: 82,
                remainingMinutes: 180,
                totalMinutes: 1000,
                priority: "High"
            },
            {
                code: "CEA-002",
                name: "Camisa Ejecutiva Azul",
                progress: 55,
                remainingMinutes: 450,
                totalMinutes: 1000,
                priority: "Medium"
            }
        ]
    },
    'tenant-003': { // Taller Producción
        activeUsers: 8,
        lastBackupTime: "3:30 AM",
        lastBackupDate: "Today",
        systemHealth: "Fair",
        modules: { active: 1, inactive: 0, total: 1 },
        people: { active: 2, inactive: 0, total: 2 },
        references: { pending: 0, inProgress: 1, finished: 12, total: 13 },
        users: { administrators: 1, supervisors: 1, total: 2 },
        recentUsers: [
            { name: "Pedro Sánchez", role: "operator", action: "logged in", time: "30 min ago" },
        ],
        systemLogs: [
            { type: "warning", message: "Mesa Principal efficiency below target: 75%", time: "1:00 PM" },
            { type: "info", message: "Trial period: 12 days remaining", time: "9:00 AM" },
            { type: "success", message: "Backup completed", time: "3:30 AM" },
        ],
        // KPI Panel Data
        production: {
            totalMinutes: 3200,
            targetMinutes: 5000,
            overallEfficiency: 75,
            activeModules: 1,
            referencesInProgress: 1
        },
        // Alerts Panel Data
        alerts: [
            {
                id: 1,
                type: "critical",
                title: "Efficiency Below Target",
                message: "Mesa Principal efficiency at 75% - below 85% target threshold",
                timestamp: "45 minutes ago"
            },
            {
                id: 2,
                type: "warning",
                title: "Trial Period Ending Soon",
                message: "Only 12 days remaining in trial period - consider upgrading",
                timestamp: "2 hours ago"
            }
        ],
        // Active References
        activeReferences: [
            {
                code: "PJB-001",
                name: "Pantalón Jean Básico",
                progress: 38,
                remainingMinutes: 496,
                totalMinutes: 800,
                priority: "Medium"
            }
        ]
    },
    'tenant-004': { // Elite Fashion Group
        activeUsers: 42,
        lastBackupTime: "1:00 AM",
        lastBackupDate: "Today",
        systemHealth: "Excellent",
        modules: { active: 3, inactive: 0, total: 3 },
        people: { active: 3, inactive: 0, total: 3 },
        references: { pending: 0, inProgress: 3, finished: 156, total: 159 },
        users: { administrators: 2, supervisors: 6, total: 8 },
        recentUsers: [
            { name: "Isabella Moretti", role: "operator", action: "logged in", time: "45 min ago" },
            { name: "Alessandro Rossi", role: "operator", action: "completed task", time: "2 hours ago" },
            { name: "Sofia Martinez", role: "operator", action: "updated", time: "5 hours ago" },
        ],
        systemLogs: [
            { type: "success", message: "Premium collection Vestido Gala 75% complete", time: "5:15 PM" },
            { type: "success", message: "Quality inspection passed for Traje Ejecutivo Luxury", time: "3:30 PM" },
            { type: "info", message: "New VIP client order received", time: "10:45 AM" },
            { type: "success", message: "Enterprise backup completed - 8.7 GB", time: "1:00 AM" },
        ],
        // KPI Panel Data
        production: {
            totalMinutes: 18500,
            targetMinutes: 20000,
            overallEfficiency: 95,
            activeModules: 3,
            referencesInProgress: 3
        },
        // Alerts Panel Data
        alerts: [
            {
                id: 1,
                type: "info",
                title: "VIP Order In Progress",
                message: "Exclusive Vestido Gala for VIP client - 75% complete",
                timestamp: "1 hour ago"
            },
            {
                id: 2,
                type: "info",
                title: "Quality Certification",
                message: "Traje Ejecutivo Luxury passed premium quality inspection",
                timestamp: "2 hours ago"
            },
            {
                id: 3,
                type: "warning",
                title: "Premium Materials Order",
                message: "Silk fabric reorder required for next production cycle",
                timestamp: "4 hours ago"
            },
            {
                id: 4,
                type: "info",
                title: "New Client Onboarding",
                message: "VIP client consultation scheduled for next week",
                timestamp: "5 hours ago"
            }
        ],
        // Active References
        activeReferences: [
            {
                code: "VGP-001",
                name: "Vestido Gala Premium",
                progress: 75,
                remainingMinutes: 200,
                totalMinutes: 800,
                priority: "High"
            },
            {
                code: "TEL-002",
                name: "Traje Ejecutivo Luxury",
                progress: 88,
                remainingMinutes: 96,
                totalMinutes: 800,
                priority: "High"
            },
            {
                code: "BCC-003",
                name: "Blusa Casual Chic",
                progress: 52,
                remainingMinutes: 288,
                totalMinutes: 600,
                priority: "Medium"
            }
        ]
    },
};

export function getDashboardDataForTenant(tenantId: string) {
    return TENANT_DASHBOARD_DATA[tenantId as keyof typeof TENANT_DASHBOARD_DATA] || TENANT_DASHBOARD_DATA['tenant-001'];
}
