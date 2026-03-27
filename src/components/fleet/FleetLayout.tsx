import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Wrench, 
  AlertTriangle, 
  DollarSign, 
  Inbox, 
  FileText, 
  TrendingUp, 
  Settings,
  Menu,
  X,
  Bell,
  Search,
  User
} from 'lucide-react';
import { FleetDashboard } from './FleetDashboard';
import { MyCars } from './MyCars';

const navItems = [
  { name: 'Dashboard', path: '/fleet', icon: LayoutDashboard },
  { name: 'My Cars', path: '/fleet/cars', icon: Car },
  { name: 'Maintenance', path: '/fleet/maintenance', icon: Wrench },
  { name: 'Damage Reports', path: '/fleet/damage', icon: AlertTriangle },
  { name: 'Earnings & Payouts', path: '/fleet/financials', icon: DollarSign },
  { name: 'Inbox', path: '/fleet/inbox', icon: Inbox },
  { name: 'Digital Vault', path: '/fleet/vault', icon: FileText },
  { name: 'Growth & Insights', path: '/fleet/growth', icon: TrendingUp },
  { name: 'Settings', path: '/fleet/settings', icon: Settings },
];

export function FleetLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-card border-r border-border transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <span className="font-bold text-xl text-primary">LinkedUp</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-muted rounded-lg">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <item.icon size={20} />
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 bg-muted rounded-xl text-sm outline-none" />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-muted rounded-lg relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              <User size={16} />
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/fleet" element={<FleetDashboard />} />
            <Route path="/fleet/cars" element={<MyCars />} />
            <Route path="/fleet/maintenance" element={<div>Maintenance Placeholder</div>} />
            <Route path="/fleet/damage" element={<div>Damage Reports Placeholder</div>} />
            <Route path="/fleet/financials" element={<div>Earnings & Payouts Placeholder</div>} />
            <Route path="/fleet/inbox" element={<div>Inbox Placeholder</div>} />
            <Route path="/fleet/vault" element={<div>Digital Vault Placeholder</div>} />
            <Route path="/fleet/growth" element={<div>Growth & Insights Placeholder</div>} />
            <Route path="/fleet/settings" element={<div>Settings Placeholder</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
