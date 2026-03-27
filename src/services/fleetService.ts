import { supabase, handleSupabaseError } from '../lib/supabase';

export const fleetService = {
  // --- Dashboard ---
  getDashboardStats: async (fleetOwnerId: string) => {
    try {
      // Fetch cars
      const { data: cars, error: cError } = await supabase
        .from('cars')
        .select('id, status')
        .eq('fleet_owner_id', fleetOwnerId);
      if (cError) throw cError;

      // Fetch bookings
      const { data: bookings, error: bError } = await supabase
        .from('bookings')
        .select('id, status, total_price, created_at')
        .eq('fleet_owner_id', fleetOwnerId);
      if (bError) throw bError;

      // Fetch payouts
      const { data: payouts, error: pError } = await supabase
        .from('payouts')
        .select('amount, status')
        .eq('fleet_owner_id', fleetOwnerId);
      if (pError) throw pError;

      const totalCars = cars.length;
      const activeBookings = bookings.filter(b => b.status === 'confirmed').length;
      const maintenanceCars = cars.filter(c => c.status === 'maintenance').length;
      
      // Utilization Rate (simplified: active bookings / total cars)
      const utilizationRate = totalCars > 0 ? Math.round((activeBookings / totalCars) * 100) : 0;

      const totalEarnings = bookings
        .filter(b => b.status === 'completed' || b.status === 'confirmed')
        .reduce((sum, b) => sum + Number(b.total_price), 0);

      const netPayouts = payouts
        .filter(p => p.status === 'processed')
        .reduce((sum, p) => sum + Number(p.amount), 0);

      const pendingPayouts = payouts
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + Number(p.amount), 0);

      return {
        totalCars,
        activeBookings,
        maintenanceCars,
        utilizationRate,
        totalEarnings,
        netPayouts,
        pendingPayouts
      };
    } catch (error) {
      return handleSupabaseError(error, 'getDashboardStats');
    }
  },

  // --- Fleet Management ---
  getMyCars: async (fleetOwnerId: string) => {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('fleet_owner_id', fleetOwnerId);
    if (error) return handleSupabaseError(error, 'getMyCars');
    return data;
  },

  addCar: async (car: any) => {
    const { data, error } = await supabase
      .from('cars')
      .insert([car])
      .select();
    if (error) return handleSupabaseError(error, 'addCar');
    return data;
  },

  updateCar: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('cars')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) return handleSupabaseError(error, 'updateCar');
    return data;
  },

  getMaintenanceLogs: async (fleetOwnerId: string) => {
    const { data, error } = await supabase
      .from('maintenance')
      .select('*, cars(make, model)')
      .eq('fleet_owner_id', fleetOwnerId);
    if (error) return handleSupabaseError(error, 'getMaintenanceLogs');
    return data;
  },

  addMaintenanceLog: async (log: any) => {
    const { data, error } = await supabase
      .from('maintenance')
      .insert([log])
      .select();
    if (error) return handleSupabaseError(error, 'addMaintenanceLog');
    return data;
  },

  getDamageReports: async (fleetOwnerId: string) => {
    const { data, error } = await supabase
      .from('damage_reports')
      .select('*, cars(make, model)')
      .eq('fleet_owner_id', fleetOwnerId);
    if (error) return handleSupabaseError(error, 'getDamageReports');
    return data;
  },

  addDamageReport: async (report: any) => {
    const { data, error } = await supabase
      .from('damage_reports')
      .insert([report])
      .select();
    if (error) return handleSupabaseError(error, 'addDamageReport');
    return data;
  },
};
