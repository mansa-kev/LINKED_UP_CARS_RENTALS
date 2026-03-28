import { 
  mockAdminStats, mockCars, mockBookings, mockUsers, 
  mockPendingPayments, mockMessages, mockContracts, 
  mockVerifications, mockDrivers, mockReviews, 
  mockTransactions, mockExpenses, mockPayouts, 
  mockHeroContent, mockCoupons, mockIncidents, 
  mockClientDocuments 
} from '../lib/mockData';

export const adminService = new Proxy({} as any, {
  get: (target, prop) => {
    if (prop === 'getDashboardStats') return async () => mockAdminStats;
    if (prop === 'getBookings') return async () => ({ data: mockBookings, count: mockBookings.length });
    if (prop === 'getCars') return async () => ({ data: mockCars, count: mockCars.length });
    if (prop === 'getUsers') return async () => mockUsers;
    if (prop === 'getFleetOwnersWithStats') return async () => mockUsers.filter(u => u.role === 'fleet_owner');
    if (prop === 'getFleetOwners') return async () => mockUsers.filter(u => u.role === 'fleet_owner');
    if (prop === 'getAdmins') return async () => mockUsers.filter(u => u.role === 'admin');
    if (prop === 'getSettings') return async () => ({});
    if (prop === 'getFinancials') return async () => ({ totalRevenue: 125430, platformCommission: 18814, pendingPayouts: 850, activeSubscriptions: 12 });
    if (prop === 'getPayouts') return async () => mockPayouts;
    if (prop === 'getTransactions') return async () => mockTransactions;
    if (prop === 'getExpenses') return async () => mockExpenses;
    if (prop === 'getPricingRules') return async () => [];
    if (prop === 'getReviews') return async () => mockReviews;
    if (prop === 'getReports') return async () => [];
    if (prop === 'getReportStats') return async () => ({ totalReports: 0, activeReports: 0, resolvedReports: 0, pendingReports: 0 });
    if (prop === 'getDrivers') return async () => mockDrivers;
    if (prop === 'getVerifications') return async () => mockVerifications;
    if (prop === 'getCarEarnings') return async () => [];
    if (prop === 'getCarEarningsStats') return async () => ({ totalEarnings: 0, averagePerCar: 0, topEarner: null });
    if (prop === 'getMessages') return async () => mockMessages;
    if (prop === 'getHeroContent') return async () => mockHeroContent;
    if (prop === 'getContracts') return async () => mockContracts;
    if (prop === 'getPendingPayments') return async () => mockPendingPayments;
    if (prop === 'getCoupons') return async () => mockCoupons;
    if (prop === 'getIncidents') return async () => mockIncidents;
    if (prop === 'getClientDocuments') return async () => mockClientDocuments;
    if (prop === 'getSystemHealth') return async () => ({ status: 'healthy', latency: 42, lastBackup: new Date().toISOString() });
    
    // Default mock for any other method
    return async () => {
      console.log(`Mocked adminService.${String(prop)} called`);
      return [];
    };
  }
});
