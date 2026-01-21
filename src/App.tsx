import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./components/sections/Dashboard";
import { OperatorDashboard } from "./components/sections/OperatorDashboard";
import { ModulesSection } from "./components/sections/ModulesSection";
import { PeopleSection } from "./components/sections/PeopleSection";
import { ReferencesSection } from "./components/sections/ReferencesSection";
import { ReportsSection } from "./components/sections/ReportsSection";
import { AdministrationSection } from "./components/sections/AdministrationSection";
import { LoginPage } from "./components/auth/LoginPage";
import { ForgotPasswordPage } from "./components/auth/ForgotPasswordPage";
import { useAuth } from "./hooks/useAuth";
import { TenantProvider } from "./contexts/TenantContext";

export type Section =
  | "dashboard"
  | "modules"
  | "people"
  | "references"
  | "reports"
  | "administration";
type AuthView = "login" | "forgot-password";

export default function App() {
  const [currentSection, setCurrentSection] =
    useState<Section>("dashboard");
  const [authView, setAuthView] = useState<AuthView>("login");
  const {
    user,
    isLoading,
    error,
    login,
    logout,
    clearError,
    isAuthenticated,
  } = useAuth();

  const handleLogin = async (
    email: string,
    password: string,
  ) => {
    clearError();
    await login(email, password);
  };

  const handleForgotPassword = () => {
    clearError();
    setAuthView("forgot-password");
  };

  const handleBackToLogin = () => {
    clearError();
    setAuthView("login");
  };

  const renderSection = () => {
    switch (currentSection) {
      case "dashboard":
        return <Dashboard user={user} />;
      case "modules":
        return <ModulesSection user={user} />;
      case "people":
        return <PeopleSection user={user} />;
      case "references":
        return <ReferencesSection user={user} />;
      case "reports":
        return <ReportsSection user={user} />;
      case "administration":
        return <AdministrationSection user={user} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication pages if not authenticated
  if (!isAuthenticated) {
    if (authView === "forgot-password") {
      return <ForgotPasswordPage onBack={handleBackToLogin} />;
    }

    return (
      <LoginPage
        onLogin={handleLogin}
        onForgotPassword={handleForgotPassword}
        error={error || undefined}
        isLoading={isLoading}
      />
    );
  }

  // Show operator-specific interface for operators
  if (user?.role === 'operator') {
    return (
      <div className="min-h-screen bg-background">
        {/* Simple operator header */}
        <div className="border-b bg-card shadow-soft">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">T</span>
              </div>
              <span className="font-medium">My Digital Workstation</span>
            </div>
            <button
              onClick={logout}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted"
            >
              Sign Out
            </button>
          </div>
        </div>
        <OperatorDashboard user={user} />
      </div>
    );
  }

  // Show main application for administrators and supervisors
  return (
    <TenantProvider userTenantIds={user?.tenantIds || []}>
      <div className="min-h-screen bg-background">
        <Navigation
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          user={user}
          onLogout={logout}
        />
        {renderSection()}
      </div>
    </TenantProvider>
  );
}