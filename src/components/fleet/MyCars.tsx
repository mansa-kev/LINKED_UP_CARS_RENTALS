import React, { useEffect, useState } from 'react';
import { fleetService } from '../../services/fleetService';
import { supabase } from '../../lib/supabase';
import { Car, Plus, Wrench, AlertTriangle } from 'lucide-react';

export function MyCars() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const data = await fleetService.getMyCars(user.id);
        setCars(data || []);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading cars...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Cars</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm">
          <Plus size={16} /> Add New Car
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
            <tr>
              <th className="px-6 py-4 text-left">Car</th>
              <th className="px-6 py-4 text-left">License Plate</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Daily Rate</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-6 py-4 font-bold">{car.make} {car.model} ({car.year})</td>
                <td className="px-6 py-4">{car.license_plate}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    car.status === 'available' ? 'bg-success/10 text-success' :
                    car.status === 'booked' ? 'bg-primary/10 text-primary' :
                    'bg-warning/10 text-warning'
                  }`}>
                    {car.status}
                  </span>
                </td>
                <td className="px-6 py-4">Ksh {car.daily_rate.toLocaleString()}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="p-2 hover:bg-muted rounded-lg"><Car size={16} /></button>
                  <button className="p-2 hover:bg-muted rounded-lg"><Wrench size={16} /></button>
                  <button className="p-2 hover:bg-muted rounded-lg"><AlertTriangle size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
