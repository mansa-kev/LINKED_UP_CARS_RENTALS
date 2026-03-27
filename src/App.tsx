import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useSubdomain } from './contexts/SubdomainContext';
import { SubdomainSwitcher } from './components/SubdomainSwitcher';
import { AdminPortal } from './components/AdminPortal';
import { DriverOnboardingForm } from './components/public/DriverOnboardingForm';
import { FleetLayout } from './components/fleet/FleetLayout';
import { ClientLayout } from './components/client/ClientLayout';

// Placeholder Pages
const PublicSite = () => (
  <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-8 text-center">
    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 blur-[120px] -z-10" />
    <h1 className="text-6xl font-serif italic mb-4 text-[#FF6B00]">LinkedUp Cars</h1>
    <p className="text-xl text-gray-400 max-w-2xl">
      Premium. Atmospheric. Emotional. This is the Public Site (www.)
    </p>
    <div className="mt-8 flex gap-4">
      <button className="px-8 py-3 bg-[#FF6B00] rounded-full font-bold hover:scale-105 transition-transform">
        Browse Fleet
      </button>
      <button className="px-8 py-3 border border-white/20 rounded-full font-bold hover:bg-white/5 transition-colors">
        Learn More
      </button>
    </div>
  </div>
);

const AppPortal = () => (
  <BrowserRouter>
    <div className="min-h-screen bg-background">
      <ClientLayout />
    </div>
  </BrowserRouter>
);



// ... (rest of the file)

const FleetPortal = () => (
  <BrowserRouter>
    <div className="min-h-screen bg-background">
      <FleetLayout />
    </div>
  </BrowserRouter>
);

export default function App() {
  const { subdomain } = useSubdomain();

  // Debug log for subdomain detection
  console.log('Current Subdomain:', subdomain);

  return (
    <div className="relative min-h-screen">
      {subdomain === 'www' && <PublicSite />}
      {subdomain === 'onboarding' && <DriverOnboardingForm />}
      {subdomain === 'app' && <AppPortal />}
      {subdomain === 'admin' && (
        <BrowserRouter>
          <AdminPortal />
        </BrowserRouter>
      )}
      {subdomain === 'fleet' && <FleetPortal />}
      
      {/* Dev Switcher for previewing subdomains */}
      <SubdomainSwitcher />
    </div>
  );
}
