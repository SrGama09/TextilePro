import { Building2, Crown, Star } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useTenant } from '../../hooks/useTenant';

export function TenantHeader() {
    const { currentTenant } = useTenant();

    if (!currentTenant) {
        return null;
    }

    const getPlanIcon = () => {
        switch (currentTenant.planType) {
            case 'enterprise':
                return <Crown className="h-3.5 w-3.5 text-yellow-600" />;
            case 'premium':
                return <Star className="h-3.5 w-3.5 text-purple-600" />;
            default:
                return null;
        }
    };

    const getPlanBadgeColor = () => {
        switch (currentTenant.planType) {
            case 'enterprise':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100';
            case 'premium':
                return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
            case 'standard':
                return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
            case 'basic':
                return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-card to-background border-b">
            {/* Logo or Icon */}
            {currentTenant.branding.logoUrl ? (
                <img
                    src={currentTenant.branding.logoUrl}
                    alt={`${currentTenant.displayName} logo`}
                    className="h-8 w-8 rounded object-contain"
                    onError={(e) => {
                        // Fallback to icon if image fails to load
                        e.currentTarget.style.display = 'none';
                        const icon = e.currentTarget.nextElementSibling;
                        if (icon) icon.classList.remove('hidden');
                    }}
                />
            ) : null}

            <div className={`flex items-center justify-center h-8 w-8 rounded bg-gradient-to-br from-primary/20 to-primary/10 ${currentTenant.branding.logoUrl ? 'hidden' : ''}`}>
                <Building2 className="h-4 w-4 text-primary" />
            </div>

            {/* Tenant Info */}
            <div className="flex-1 min-w-0 flex items-center gap-3">
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-foreground truncate">
                        {currentTenant.displayName}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                        {currentTenant.settings.companyName}
                    </span>
                </div>

                {/* Plan Badge */}
                <Badge
                    variant="outline"
                    className={`shrink-0 ${getPlanBadgeColor()}`}
                >
                    {getPlanIcon()}
                    <span className="ml-1 capitalize text-xs font-medium">
                        {currentTenant.planType}
                    </span>
                </Badge>

                {/* Trial Badge */}
                {currentTenant.status === 'trial' && currentTenant.trialEndsAt && (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 shrink-0">
                        <span className="text-xs">
                            Trial ends {new Date(currentTenant.trialEndsAt).toLocaleDateString()}
                        </span>
                    </Badge>
                )}

                {/* Suspended Badge */}
                {currentTenant.status === 'suspended' && (
                    <Badge variant="destructive" className="shrink-0">
                        <span className="text-xs">Suspended</span>
                    </Badge>
                )}
            </div>
        </div>
    );
}
