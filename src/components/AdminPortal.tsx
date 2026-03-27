import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Car, 
  Users, 
  UserCheck, 
  Building2, 
  ShieldCheck, 
  Wallet, 
  TrendingUp, 
  Tag, 
  BarChart3, 
  Inbox, 
  Rocket, 
  AlertTriangle, 
  Settings, 
  Image, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  User
} from 'lucide-react';

import { AdminDashboard } from './admin/AdminDashboard';
import { AdminBookings } from './admin/AdminBookings';
import { AdminCars } from './admin/AdminCars';
import { AdminUsers } from './admin/AdminUsers';
import { AdminDrivers } from './admin/AdminDrivers';
import { AdminFleetOwners } from './admin/AdminFleetOwners';
import { AdminVerification } from './admin/AdminVerification';
import { AdminFinancials } from './admin/AdminFinancials';
import { AdminCarEarnings } from './admin/AdminCarEarnings';
import { AdminPricing } from './admin/AdminPricing';
import { AdminReports } from './admin/AdminReports';
import { AdminInbox } from './admin/AdminInbox';
import { AdminReviews } from './admin/AdminReviews';
import { AdminGrowthTools } from './admin/AdminGrowthTools';
import { AdminIncidentCommand } from './admin/AdminIncidentCommand';
import { AdminHeroContent } from './admin/AdminHeroContent';
import { AdminContractManager } from './admin/AdminContractManager';
import { AdminSystemHealth } from './admin/AdminSystemHealth';
import { AdminSettings } from './admin/AdminSettings';
import { AdminLogout } from './admin/AdminLogout';

// --- Types ---
type ModuleCategory = {
  title: string;
  items: {
    id: string;
    label: string;
    icon: React.ElementType;
  }[];
};

const MODULE_CATEGORIES: ModuleCategory[] = [
  {
    title: 'Dashboard',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Core Operations',
    items: [
      { id: 'bookings', label: 'Bookings Management', icon: Calendar },
      { id: 'cars', label: 'Cars Management', icon: Car },
      { id: 'users', label: 'Users Management', icon: Users },
      { id: 'drivers', label: 'Drivers Management', icon: UserCheck },
    ]
  },
  {
    title: 'Partner Management',
    items: [
      { id: 'fleet-owners', label: 'Fleet Owners Management', icon: Building2 },
      { id: 'verification', label: 'Verification Queue', icon: ShieldCheck },
    ]
  },
  {
    title: 'Financials & Reporting',
    items: [
      { id: 'financials', label: 'Financials', icon: Wallet },
      { id: 'car-earnings', label: 'Car Earnings', icon: TrendingUp },
      { id: 'pricing', label: 'Pricing', icon: Tag },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
    ]
  },
  {
    title: 'Communication & Growth',
    items: [
      { id: 'inbox', label: 'Inbox', icon: Inbox },
      { id: 'growth', label: 'Growth Tools', icon: Rocket },
      { id: 'incident', label: 'Incident Command', icon: AlertTriangle },
    ]
  },
  {
    title: 'System Configuration',
    items: [
      { id: 'hero', label: 'Hero Content Manager', icon: Image },
      { id: 'contracts', label: 'Contract Manager', icon: FileText },
      { id: 'settings', label: 'Settings', icon: Settings },
    ]
  }
];

// --- Components ---

const AdminSidebar = ({ 
  activeModule, 
  setActiveModule, 
  isCollapsed, 
  setIsCollapsed 
}: { 
  activeModule: string; 
  setActiveModule: (id: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}) => {
  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-white dark:bg-[#1E1E1E] border-r border-border transition-all duration-300 z-40 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-border">
        {!isCollapsed && (
          <span className="text-xl font-bold tracking-tighter text-primary">LINKEDUP ADMIN</span>
        )}
        {isCollapsed && <span className="text-xl font-bold text-primary mx-auto">L</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 scrollbar-hide">
        {MODULE_CATEGORIES.map((category) => (
          <div key={category.title} className="mb-6">
            {!isCollapsed && (
              <h3 className="px-6 mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">
                {category.title}
              </h3>
            )}
            <div className="px-3 space-y-1">
              {category.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative group ${
                    activeModule === item.id
                      ? 'bg-primary-light dark:bg-primary-dark text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {/* Active Indicator Bar */}
                  {activeModule === item.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                  
                  <item.icon size={20} className={activeModule === item.id ? 'text-primary' : ''} />
                  
                  {!isCollapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="h-12 border-t border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </aside>
  );
};

const AdminHeader = ({ activeModuleLabel }: { activeModuleLabel: string }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="h-20 bg-white dark:bg-[#1E1E1E] border-b border-border px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold text-foreground">{activeModuleLabel}</h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Global Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search bookings, cars, users..." 
            className="pl-10 pr-4 py-2 bg-muted border-none rounded-full text-sm w-80 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 text-muted-foreground hover:text-primary transition-colors">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="relative">
            <button className="p-2 text-muted-foreground hover:text-primary transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-[#1E1E1E]" />
            </button>
          </div>

          <div className="h-8 w-[1px] bg-border mx-2" />

          <button className="flex items-center gap-3 pl-2 group">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all overflow-hidden border border-border">
              <User size={24} />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-bold text-foreground leading-none">Admin User</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Super Admin</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

// --- Main Portal Component ---

export function AdminPortal() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  console.log('[AdminPortal] Rendering, activeModule:', activeModule);

  const activeModuleLabel = MODULE_CATEGORIES
    .flatMap(c => c.items)
    .find(i => i.id === activeModule)?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar 
        activeModule={activeModule} 
        setActiveModule={setActiveModule} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      <main className={`transition-all duration-300 ${isCollapsed ? 'pl-20' : 'pl-72'}`}>
        <AdminHeader activeModuleLabel={activeModuleLabel} />
        
        <div className="p-8">
          {/* Module Content Area */}
          <div className="max-w-[1600px] mx-auto">
            {activeModule === 'dashboard' && <AdminDashboard />}
            {activeModule === 'bookings' && <AdminBookings />}
            {activeModule === 'cars' && <AdminCars />}
            {activeModule === 'users' && <AdminUsers />}
            {activeModule === 'drivers' && <AdminDrivers />}
            {activeModule === 'fleet-owners' && <AdminFleetOwners />}
            {activeModule === 'verification' && <AdminVerification />}
            {activeModule === 'financials' && <AdminFinancials />}
            {activeModule === 'car-earnings' && <AdminCarEarnings />}
            {activeModule === 'pricing' && <AdminPricing />}
            {activeModule === 'reports' && <AdminReports />}
            {activeModule === 'inbox' && <AdminInbox />}
            {activeModule === 'reviews' && <AdminReviews />}
            {activeModule === 'growth' && <AdminGrowthTools />}
            {activeModule === 'incident' && <AdminIncidentCommand />}
            {activeModule === 'hero' && <AdminHeroContent />}
            {activeModule === 'contracts' && <AdminContractManager />}
            {activeModule === 'system-health' && <AdminSystemHealth />}
            {activeModule === 'settings' && <AdminSettings />}
            {activeModule === 'logout' && <AdminLogout />}
            
            {!['dashboard', 'bookings', 'cars', 'users', 'drivers', 'fleet-owners', 'verification', 'financials', 'car-earnings', 'pricing', 'reports', 'inbox', 'reviews', 'growth', 'incident', 'hero', 'contracts', 'system-health', 'settings', 'logout'].includes(activeModule) && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                  {React.createElement(MODULE_CATEGORIES.flatMap(c => c.items).find(i => i.id === activeModule)?.icon || LayoutDashboard, { size: 40 })}
                </div>
                <h1 className="text-3xl font-bold mb-2">{activeModuleLabel}</h1>
                <p className="text-muted-foreground max-w-md">
                  This module is ready to be connected to Supabase. All UI components will adhere to the Modern Professional design system.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
