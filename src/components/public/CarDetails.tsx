import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
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
  ArrowRight,
  Heart
} from 'lucide-react';
import { fleetService } from '../../services/fleetService';
import { Car } from '../../types';
import { BookingFlow } from './BookingFlow/BookingFlow';

export function CarDetails() {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function fetchCar() {
      if (!id) return;
      try {
        const [carData, reviewsData] = await Promise.all([
          fleetService.getCarById(id),
          fleetService.getReviews(id)
        ]);
        setCar(carData);
        setReviews(reviewsData || []);
      } catch (error) {
        console.error('Error fetching car details:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCar();
  }, [id]);

  if (loading || !car) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const images = car.images && car.images.length > 0 ? car.images : [`https://picsum.photos/seed/${car.id}/1200/800`];

  return (
    <div className="pt-32 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Hero Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[16/10] rounded-[60px] overflow-hidden border border-white/5 bg-card group">
              <img 
                src={images[activeImage]} 
                alt={`${car.make} ${car.model}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <button className="absolute top-6 right-6 p-4 glass rounded-full text-white hover:text-primary transition-all">
                <Heart size={24} />
              </button>
            </div>
          </div>

          {/* Car Overview & Booking */}
          <div className="flex flex-col">
            <h1 className="text-5xl font-serif font-black italic text-white mb-6">
              {car.make} <span className="text-primary">{car.model}</span>
            </h1>
            <p className="text-2xl font-bold mb-8">${car.daily_rate}<span className="text-sm text-muted-foreground">/day</span></p>
            
            <BookingFlow car={car} />
          </div>
        </div>

        {/* Detailed Specifications */}
        <div className="mt-20">
          <h2 className="text-3xl font-serif font-black italic text-white mb-8">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-card rounded-3xl border border-white/5">
              <h4 className="font-bold text-white mb-4">Engine & Performance</h4>
              <p className="text-muted-foreground text-sm">Details about engine...</p>
            </div>
            <div className="p-8 bg-card rounded-3xl border border-white/5">
              <h4 className="font-bold text-white mb-4">Safety Features</h4>
              <p className="text-muted-foreground text-sm">Details about safety...</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-20">
          <h2 className="text-3xl font-serif font-black italic text-white mb-8">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="p-8 bg-card rounded-3xl border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <Star size={16} className="text-amber-500" fill="currentColor" />
                  <span className="font-bold text-white">{review.rating}</span>
                </div>
                <p className="text-muted-foreground text-sm italic">"{review.comment}"</p>
                <p className="text-xs font-bold text-primary mt-4">- {review.user_profiles?.full_name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 w-full bg-background border-t border-white/10 p-6 flex justify-center z-50">
        <button className="px-12 py-4 bg-primary text-black font-black uppercase tracking-widest rounded-full hover:bg-primary/90 transition-all">
          Book Now
        </button>
      </div>
    </div>
  );
}
