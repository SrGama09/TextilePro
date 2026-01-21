import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import {
    Building2,
    Palette,
    Settings as SettingsIcon,
    Save,
    RefreshCw,
    Globe,
    Clock,
    DollarSign,
    Bell,
    Shield,
    Users,
    Database
} from 'lucide-react';
import { useTenant } from '../../hooks/useTenant';
import { toast } from 'sonner';
import type { TenantBranding } from '../../types/tenant';

export function TenantSettings() {
    const { currentTenant, updateTenantSettings, updateTenantBranding, isLoading } = useTenant();
    const [activeTab, setActiveTab] = useState('general');

    if (!currentTenant) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Tenant Settings</CardTitle>
                    <CardDescription>No tenant selected</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const handleBrandingUpdate = async (updates: Partial<TenantBranding>) => {
        try {
            await updateTenantBranding(updates);
            toast.success('Branding updated successfully');
        } catch (error) {
            toast.error('Failed to update branding');
        }
    };

    const handleSettingsUpdate = async (updates: any) => {
        try {
            await updateTenantSettings(updates);
            toast.success('Settings updated successfully');
        } catch (error) {
            toast.error('Failed to update settings');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Building2 className="h-4 w-4 mr-2" />
                    General
                </TabsTrigger>
                <TabsTrigger value="branding">
                    <Palette className="h-4 w-4 mr-2" />
                    Branding
                </TabsTrigger>
                <TabsTrigger value="preferences">
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Preferences
                </TabsTrigger>
                <TabsTrigger value="plan">
                    <Shield className="h-4 w-4 mr-2" />
                    Plan & Usage
                </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Organization Information</CardTitle>
                        <CardDescription>
                            Basic information about your organization
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Display Name</Label>
                                <Input
                                    id="displayName"
                                    defaultValue={currentTenant.displayName}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Legal Company Name</Label>
                                <Input
                                    id="companyName"
                                    defaultValue={currentTenant.settings.companyName}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="contactEmail">Contact Email</Label>
                                <Input
                                    id="contactEmail"
                                    type="email"
                                    defaultValue={currentTenant.contactEmail}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactPhone">Contact Phone</Label>
                                <Input
                                    id="contactPhone"
                                    defaultValue={currentTenant.contactPhone}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                defaultValue={currentTenant.address}
                                disabled={isLoading}
                            />
                        </div>

                        <Separator />

                        <div className="flex justify-end">
                            <Button disabled={isLoading}>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Branding Settings */}
            <TabsContent value="branding" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Brand Colors</CardTitle>
                        <CardDescription>
                            Customize your organization's color scheme
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="primaryColor">Primary Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="primaryColor"
                                        type="color"
                                        defaultValue={currentTenant.branding.primaryColor}
                                        className="w-20 h-10"
                                        onChange={(e) => handleBrandingUpdate({ primaryColor: e.target.value })}
                                    />
                                    <Input
                                        type="text"
                                        defaultValue={currentTenant.branding.primaryColor}
                                        className="flex-1 font-mono"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="secondaryColor">Secondary Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="secondaryColor"
                                        type="color"
                                        defaultValue={currentTenant.branding.secondaryColor}
                                        className="w-20 h-10"
                                        onChange={(e) => handleBrandingUpdate({ secondaryColor: e.target.value })}
                                    />
                                    <Input
                                        type="text"
                                        defaultValue={currentTenant.branding.secondaryColor}
                                        className="flex-1 font-mono"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="accentColor">Accent Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="accentColor"
                                        type="color"
                                        defaultValue={currentTenant.branding.accentColor || '#000000'}
                                        className="w-20 h-10"
                                        onChange={(e) => handleBrandingUpdate({ accentColor: e.target.value })}
                                    />
                                    <Input
                                        type="text"
                                        defaultValue={currentTenant.branding.accentColor}
                                        placeholder="#000000"
                                        className="flex-1 font-mono"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Color Preview</Label>
                            <div className="flex gap-2">
                                <div
                                    className="h-16 flex-1 rounded border"
                                    style={{ backgroundColor: currentTenant.branding.primaryColor }}
                                />
                                <div
                                    className="h-16 flex-1 rounded border"
                                    style={{ backgroundColor: currentTenant.branding.secondaryColor }}
                                />
                                {currentTenant.branding.accentColor && (
                                    <div
                                        className="h-16 flex-1 rounded border"
                                        style={{ backgroundColor: currentTenant.branding.accentColor }}
                                    />
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Logo & Assets</CardTitle>
                        <CardDescription>
                            Upload your organization's logo and brand assets
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="logoUrl">Logo URL</Label>
                            <Input
                                id="logoUrl"
                                placeholder="https://example.com/logo.png"
                                defaultValue={currentTenant.branding.logoUrl}
                                disabled={isLoading}
                            />
                            <p className="text-xs text-muted-foreground">
                                Enter the URL of your logo image (recommended: PNG, 200x200px)
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Preferences */}
            <TabsContent value="preferences" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Regional Settings</CardTitle>
                        <CardDescription>
                            Configure timezone, language, and formats
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="timezone">
                                    <Clock className="h-4 w-4 inline mr-2" />
                                    Timezone
                                </Label>
                                <Input
                                    id="timezone"
                                    defaultValue={currentTenant.settings.timezone}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currency">
                                    <DollarSign className="h-4 w-4 inline mr-2" />
                                    Currency
                                </Label>
                                <Input
                                    id="currency"
                                    defaultValue={currentTenant.settings.currency}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dateFormat">Date Format</Label>
                                <Input
                                    id="dateFormat"
                                    defaultValue={currentTenant.settings.dateFormat}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="language">
                                    <Globe className="h-4 w-4 inline mr-2" />
                                    Language
                                </Label>
                                <Input
                                    id="language"
                                    defaultValue={currentTenant.settings.language}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Working Hours</CardTitle>
                        <CardDescription>
                            Set default working hours for production tracking
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="workStart">Start Time</Label>
                                <Input
                                    id="workStart"
                                    type="time"
                                    defaultValue={currentTenant.settings.workingHours.start}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="workEnd">End Time</Label>
                                <Input
                                    id="workEnd"
                                    type="time"
                                    defaultValue={currentTenant.settings.workingHours.end}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Plan & Usage */}
            <TabsContent value="plan" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Current Plan</CardTitle>
                        <CardDescription>
                            Your subscription plan and usage limits
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h4 className="font-semibold capitalize">{currentTenant.planType} Plan</h4>
                                <p className="text-sm text-muted-foreground">
                                    Status: <span className="capitalize">{currentTenant.status}</span>
                                </p>
                            </div>
                            <Button variant="outline">Upgrade Plan</Button>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <h4 className="font-medium">Usage Limits</h4>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Users
                                    </span>
                                    <span className="text-muted-foreground">0 / {currentTenant.limits.maxUsers}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4" />
                                        Modules
                                    </span>
                                    <span className="text-muted-foreground">0 / {currentTenant.limits.maxModules}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                        <Database className="h-4 w-4" />
                                        Storage
                                    </span>
                                    <span className="text-muted-foreground">0 GB / {currentTenant.limits.maxStorageGB} GB</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
        </div >
    );
}
