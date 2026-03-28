import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Users, 
  Fuel, 
  Settings, 
  Briefcase,
  ArrowRight,
  Star,
  SlidersHorizontal
} from 'lucide-react';
import { fleetService } from '../../services/fleetService';
import { Car } from '../../types';

export function CarShowroom() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    category: 'All',
    priceRange: 'All',
    search: ''
  });
  const [sortBy, setSortBy] = useState('price-low');

  useEffect(() => {
    async function fetchCars() {
      try {
        const result = await fleetService.getAllCars();
        if (result && 'data' in result) {
          setCars(result.data || []);
        } else if (Array.isArray(result)) {
          setCars(result);
        }
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  const categories = ['All', 'Luxury', 'SUV', 'Sports', 'Electric', 'Convertible'];
  const priceRanges = ['All', 'Under $200', '$200 - $500', '$500+'];

  const filteredCars = cars.filter(car => {
    const matchesCategory = filter.category === 'All' || car.category === filter.category;
    const matchesSearch = car.make.toLowerCase().includes(filter.search.toLowerCase()) || 
                         car.model.toLowerCase().includes(filter.search.toLowerCase());
    
    let matchesPrice = true;
    if (filter.priceRange === 'Under $200') matchesPrice = car.daily_rate < 200;
    else if (filter.priceRange === '$200 - $500') matchesPrice = car.daily_rate >= 200 && car.daily_rate <= 500;
    else if (filter.priceRange === '$500+') matchesPrice = car.daily_rate > 500;

    return matchesCategory && matchesSearch && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.daily_rate - b.daily_rate;
    if (sortBy === 'price-high') return b.daily_rate - a.daily_rate;
    return 0;
  });

  return (
    <section className="py-32 px-6 bg-background relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-4 block"
            >
              The Curated Showroom
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-serif font-black tracking-tighter italic text-white leading-tight"
            >
              Experience the Pinnacle of <span className="text-primary">Automotive Excellence</span>
            </motion.h2>
          </div>
          
          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search fleet..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                className="pl-12 pr-6 py-4 bg-card border border-white/5 rounded-2xl text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-primary/40 transition-all w-64"
              />
            </div>
            <div className="flex items-center gap-2 p-1 bg-card border border-white/5 rounded-2xl">
              <button 
                onClick={() => setSortBy('price-low')}
                className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'price-low' ? 'bg-primary text-black' : 'text-muted-foreground hover:text-white'}`}
              >
                Lowest Price
              </button>
              <button 
                onClick={() => setSortBy('price-high')}
                className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'price-high' ? 'bg-primary text-black' : 'text-muted-foreground hover:text-white'}`}
              >
                Highest Price
              </button>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          <div className="flex items-center gap-2 px-6 py-3 bg-card border border-white/5 rounded-full text-xs font-black uppercase tracking-widest text-primary">
            <Filter size={14} />
            Filters
          </div>
          <div className="h-6 w-[1px] bg-white/10 mx-2" />
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setFilter({ ...filter, category: cat })}
              className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                filter.category === cat ? 'bg-primary border-primary text-black' : 'border-white/5 text-muted-foreground hover:border-primary/40 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Car Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[16/10] rounded-[40px] bg-card animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredCars.map((car, i) => (
                <motion.div 
                  key={car.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="group cursor-pointer"
                >
                  <Link to={`/cars/${car.id}`}>
                    <div className="relative aspect-[16/10] rounded-[40px] overflow-hidden mb-6 bg-card border border-white/5">
                      <img 
                        src={car.primary_image_url || `https://picsum.photos/seed/${car.id}/800/500`} 
                        alt={`${car.make} ${car.model}`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-6 right-6 px-4 py-2 glass rounded-full text-[10px] font-black uppercase tracking-widest text-white">
                        {car.category}
                      </div>
                      
                      {/* Quick Specs Overlay */}
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                        <div className="flex flex-col items-center gap-2">
                          <Users size={20} className="text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-white">{car.seats} Seats</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <Settings size={20} className="text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-white">{car.transmission}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <Fuel size={20} className="text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-white">{car.fuel_type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-2xl font-serif font-black tracking-tight italic group-hover:text-primary transition-colors">
                            {car.make} {car.model}
                          </h3>
                          <div className="flex items-center gap-1 text-amber-500 mt-1">
                            <Star size={12} fill="currentColor" />
                            <span className="text-[10px] font-black uppercase tracking-widest">4.9 (120+)</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-primary font-black text-2xl tracking-tighter">${car.daily_rate}</span>
                          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest block">/day</span>
                        </div>
                      </div>
                      
                      <div className="mt-8 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Available Now</span>
                        </div>
                        <div className="flex items-center gap-2 text-primary group-hover:translate-x-2 transition-transform">
                          <span className="text-[10px] font-black uppercase tracking-widest">Book Now</span>
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredCars.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-card border border-white/5 flex items-center justify-center mx-auto mb-8">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-serif font-black italic text-white mb-4">No Vehicles Found</h3>
            <p className="text-muted-foreground mb-8">Try adjusting your filters or search terms.</p>
            <button 
              onClick={() => setFilter({ category: 'All', priceRange: 'All', search: '' })}
              className="px-8 py-4 border border-primary/20 rounded-full text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/10 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
