import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import type { Section } from "../App";
import type { User as UserType } from "../hooks/useAuth";
import { TenantSwitcher } from "./tenant/TenantSwitcher";

interface NavigationProps {
  currentSection: Section;
  onSectionChange: (section: Section) => void;
  user?: UserType | null;
  onLogout?: () => void;
}

export function Navigation({ currentSection, onSectionChange, user, onLogout }: NavigationProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getNavItems = () => {
    const baseItems = [
      { name: 'Dashboard', value: 'dashboard' as Section },
      { name: 'Modules', value: 'modules' as Section },
      { name: 'People', value: 'people' as Section },
      { name: 'References', value: 'references' as Section },
      { name: 'Reports', value: 'reports' as Section },
    ];

    // Add administration for administrators
    if (user?.role === 'administrator') {
      baseItems.push({ name: 'Administration', value: 'administration' as Section });
    }

    return baseItems;
  };

  const navItems = getNavItems();

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplay = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-border/40 shadow-soft sticky top-0 z-50">
      <div className="px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-teal-600 rounded-xl flex items-center justify-center shadow-soft">
                <span className="text-white font-semibold text-lg">T</span>
              </div>
              <div>
                <span className="font-semibold text-xl text-foreground">TextilePro</span>
                <div className="text-xs text-muted-foreground">Production Assistant</div>
              </div>
            </div>

            {/* Tenant Switcher */}
            <div className="flex items-center">
              <TenantSwitcher />
            </div>

            <div className="flex items-center space-x-2">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant={currentSection === item.value ? "default" : "ghost"}
                  className={`h-10 px-4 rounded-xl transition-gentle ${currentSection === item.value
                      ? "bg-primary text-primary-foreground shadow-soft-md"
                      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                    }`}
                  onClick={() => onSectionChange(item.value)}
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">{currentDate}</div>
              <div className="font-medium text-foreground">{user?.name || 'User'}</div>
              <div className="text-xs text-primary">{getRoleDisplay(user?.role || 'user')}</div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-teal-50 hover:from-primary/20 hover:to-teal-100 transition-gentle outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 shadow-soft">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-teal-600 text-white font-medium">
                    {getUserInitials(user?.name || 'User')}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 shadow-soft-lg border-0 rounded-xl" align="end" forceMount>
                <div className="flex flex-col space-y-2 p-4">
                  <p className="text-sm font-medium leading-none text-foreground">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem disabled className="m-2 rounded-lg text-muted-foreground">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                  <span className="ml-auto text-xs">Coming soon</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem onClick={onLogout} className="m-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-gentle">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}