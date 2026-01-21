import { Check, ChevronsUpDown, Building2, Crown, Star } from 'lucide-react';
import { Button } from '../ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '../ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../ui/popover';
import { Badge } from '../ui/badge';
import { useState } from 'react';
import { useTenant } from '../../hooks/useTenant';
import type { Tenant } from '../../types/tenant';

export function TenantSwitcher() {
    const { currentTenant, availableTenants, switchTenant, isLoading } = useTenant();
    const [open, setOpen] = useState(false);

    const handleSelect = async (tenant: Tenant) => {
        if (tenant.id === currentTenant?.id) {
            setOpen(false);
            return;
        }

        try {
            await switchTenant(tenant.id);
            setOpen(false);
        } catch (error) {
            console.error('Failed to switch tenant:', error);
        }
    };

    const getPlanIcon = (plan: Tenant['planType']) => {
        switch (plan) {
            case 'enterprise':
                return <Crown className="h-3 w-3" />;
            case 'premium':
                return <Star className="h-3 w-3" />;
            default:
                return null;
        }
    };

    const getPlanColor = (plan: Tenant['planType']) => {
        switch (plan) {
            case 'enterprise':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'premium':
                return 'text-purple-600 bg-purple-50 border-purple-200';
            case 'standard':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'basic':
                return 'text-gray-600 bg-gray-50 border-gray-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusBadge = (status: Tenant['status']) => {
        switch (status) {
            case 'trial':
                return <Badge variant="outline" className="ml-auto text-xs">Trial</Badge>;
            case 'suspended':
                return <Badge variant="destructive" className="ml-auto text-xs">Suspended</Badge>;
            case 'inactive':
                return <Badge variant="secondary" className="ml-auto text-xs">Inactive</Badge>;
            default:
                return null;
        }
    };

    if (!currentTenant || availableTenants.length === 0) {
        return null;
    }

    // Don't show switcher if user only has access to one tenant
    if (availableTenants.length === 1) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium leading-none">{currentTenant.displayName}</span>
                    <span className="text-xs text-muted-foreground capitalize">{currentTenant.planType} Plan</span>
                </div>
            </div>
        );
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select a tenant"
                    className="w-[260px] justify-between"
                    disabled={isLoading}
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="flex flex-col items-start gap-0.5 overflow-hidden">
                            <span className="text-sm font-medium truncate">{currentTenant.displayName}</span>
                            <span className="text-xs text-muted-foreground capitalize">{currentTenant.planType}</span>
                        </div>
                    </div>
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[260px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search organization..." />
                    <CommandList>
                        <CommandEmpty>No organization found.</CommandEmpty>
                        <CommandGroup heading="Your Organizations">
                            {availableTenants.map((tenant) => (
                                <CommandItem
                                    key={tenant.id}
                                    onSelect={() => handleSelect(tenant)}
                                    className="cursor-pointer"
                                >
                                    <div className="flex items-center gap-2 flex-1 overflow-hidden">
                                        <Check
                                            className={`h-4 w-4 shrink-0 ${currentTenant.id === tenant.id
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                                }`}
                                        />
                                        <div className="flex flex-col flex-1 gap-1 overflow-hidden">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium truncate">
                                                    {tenant.displayName}
                                                </span>
                                                {getStatusBadge(tenant.status)}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${getPlanColor(tenant.planType)}`}
                                                >
                                                    {getPlanIcon(tenant.planType)}
                                                    <span className="ml-1 capitalize">{tenant.planType}</span>
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
