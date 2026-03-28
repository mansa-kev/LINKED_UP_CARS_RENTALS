import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Fuel, 
  Settings, 
  Briefcase, 
  ShieldCheck, 
  Calendar,
  Star,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { fleetService } from '../../services/fleetService';
import { Car } from '../../types';
import { BookingForm } from './BookingForm';

export function CarDetails() {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function fetchCar() {
      if (!id) return;
      try {
        const result = await fleetService.getCarById(id);
        if (result && 'data' in result) {
          setCar(result.data);
        } else {
          setCar(result);
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCar();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-serif font-black italic mb-6">Car Not Found</h1>
        <p className="text-muted-foreground mb-12 max-w-md">The vehicle you're looking for might have been booked or is no longer in our fleet.</p>
        <Link to="/cars" className="px-10 py-5 bg-primary text-black font-black uppercase tracking-widest rounded-full">
          Back to Showroom
        </Link>
      </div>
    );
  }

  const images = car.images && car.images.length > 0 ? car.images : [`https://picsum.photos/seed/${car.id}/1200/800`];

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-4 mb-12">
          <Link to="/cars" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest">
            <ChevronLeft size={16} />
            Back to Showroom
          </Link>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <span className="text-xs font-black uppercase tracking-widest text-white/40">{car.make} {car.model}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Image Gallery */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[16/10] rounded-[60px] overflow-hidden border border-white/5 bg-card"
            >
              <img 
                src={images[activeImage]} 
                alt={`${car.make} ${car.model}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              {images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              )}
            </motion.div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative aspect-[16/10] rounded-2xl overflow-hidden border-2 transition-all ${
                      activeImage === i ? 'border-primary' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            {/* Features/Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
              {[
                { icon: Users, label: "Seats", value: car.seats || 5 },
                { icon: Briefcase, label: "Luggage", value: car.luggage || 4 },
                { icon: Fuel, label: "Fuel", value: car.fuel_type || "Petrol" },
                { icon: Settings, label: "Trans.", value: car.transmission || "Auto" }
              ].map((spec, i) => (
                <div key={i} className="p-6 rounded-3xl bg-card border border-white/5 flex flex-col items-center text-center">
                  <spec.icon className="w-6 h-6 text-primary mb-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{spec.label}</span>
                  <span className="text-sm font-bold text-white">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Details & Booking */}
          <div className="flex flex-col">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-12"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  {car.category}
                </span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-black">4.9</span>
                  <span className="text-white/40 text-[10px] font-medium">(120+ Reviews)</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tighter italic text-white leading-tight mb-6">
                {car.make} <span className="text-primary">{car.model}</span>
              </h1>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                {car.description || "Experience unparalleled luxury and performance. This vehicle is perfectly maintained and ready for your next adventure."}
              </p>
            </motion.div>

            {/* Booking Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <BookingForm car={car} />
            </motion.div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
                <ShieldCheck className="w-8 h-8 text-primary mb-4" />
                <h4 className="text-lg font-serif font-black italic text-white mb-2">Security Deposit</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">A refundable deposit of $500 is required at the time of pickup.</p>
              </div>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
                <Calendar className="w-8 h-8 text-primary mb-4" />
                <h4 className="text-lg font-serif font-black italic text-white mb-2">Flexible Pickup</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Choose from multiple locations or request home delivery.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
