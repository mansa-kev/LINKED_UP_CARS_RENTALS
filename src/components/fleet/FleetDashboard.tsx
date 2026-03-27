import React, { useEffect, useState } from 'react';
import { fleetService } from '../../services/fleetService';
import { supabase } from '../../lib/supabase';
import { Car, Calendar, Wrench, TrendingUp, DollarSign, CreditCard, Clock } from 'lucide-react';

export function FleetDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const data = await fleetService.getDashboardStats(user.id);
        setStats(data);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 animate-pulse">Loading dashboard...</div>;
  if (!stats) return <div className="p-8">No data available.</div>;

  const cards = [
    { title: 'Total Cars', value: stats.totalCars, icon: Car, color: 'text-primary' },
    { title: 'Active Bookings', value: stats.activeBookings, icon: Calendar, color: 'text-success' },
    { title: 'Cars in Maintenance', value: stats.maintenanceCars, icon: Wrench, color: 'text-warning' },
    { title: 'Avg. Utilization', value: `${stats.utilizationRate}%`, icon: TrendingUp, color: 'text-primary' },
  ];

  const financialCards = [
    { title: 'Total Earnings (Lifetime)', value: `Ksh ${stats.totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'text-primary' },
    { title: 'Net Payouts Received', value: `Ksh ${stats.netPayouts.toLocaleString()}`, icon: CreditCard, color: 'text-success' },
    { title: 'Pending Payouts', value: `Ksh ${stats.pendingPayouts.toLocaleString()}`, icon: Clock, color: 'text-warning' },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Strategic Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className={`mb-4 ${card.color}`}>
              <card.icon size={24} />
            </div>
            <h3 className="text-muted-foreground text-sm font-bold uppercase tracking-wider">{card.title}</h3>
            <p className="text-3xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-bold">Financial Overview (Owner's Share)</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {financialCards.map((card, i) => (
          <div key={i} className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className={`mb-4 ${card.color}`}>
              <card.icon size={24} />
            </div>
            <h3 className="text-muted-foreground text-sm font-bold uppercase tracking-wider">{card.title}</h3>
            <p className="text-2xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
