import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { 
  Search, 
  Filter, 
  Plus, 
  Car, 
  Building2, 
  MapPin, 
  MoreVertical, 
  Edit3, 
  Eye, 
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  X,
  Save,
  Image as ImageIcon,
  Video,
  Settings,
  Calendar,
  Wrench,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import { toast } from 'sonner';

// --- Types ---

type CarStatus = 'available' | 'rented' | 'maintenance' | 'unavailable';
type MaintenanceStatus = 'ok' | 'due' | 'in_progress';

interface CarItem {
  id: string;
  fleet_owner_id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  category: string;
  description: string;
  primary_image_url: string;
  photos: string[];
  video_url: string;
  transmission: string;
  fuel_type: string;
  seats: number;
  features: string[];
  location_lat: number;
  location_lon: number;
  status: CarStatus;
  maintenance_status: MaintenanceStatus;
  last_maintenance_date: string;
  next_service_date: string;
  daily_rate: number;
  overtime_rate: number;
  security_deposit: number;
  created_at: string;
  fleet_owner?: { 
    full_name: string; 
    fleet_owner_settings?: Array<{ company_name?: string }>;
  };
}

// --- Components ---

const StatusBadge = ({ status }: { status: CarStatus }) => {
  const styles: Record<CarStatus, string> = {
    available: 'bg-success/10 text-success border-success/20',
    rented: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    maintenance: 'bg-warning/10 text-warning border-warning/20',
    unavailable: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}>
      {status}
    </span>
  );
};

const MaintenanceBadge = ({ status }: { status: MaintenanceStatus }) => {
  const styles: Record<MaintenanceStatus, string> = {
    ok: 'bg-success/10 text-success border-success/20',
    due: 'bg-warning/10 text-warning border-warning/20',
    in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

export function AdminCars() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Cars Management</h1>
      <div className="mt-4">
        <p>This is a test to see if the component renders.</p>
        <ul>
          <li>Car 1</li>
          <li>Car 2</li>
        </ul>
      </div>
    </div>
  );
}
