import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import SidebarFilter from '../components/SidebarFilter';
import PropertyDetails from '../components/PropertyDetails';
import { properties } from '../data/properties';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ bedrooms: '', priceRange: 'all' });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem('reservations');
    return saved ? JSON.parse(saved) : [];
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const filteredProperties = useMemo(() => {
    let filtered = properties.filter(prop =>
      prop.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filters.bedrooms) {
      filtered = filtered.filter(prop => 
        filters.bedrooms === '5' ? prop.bedrooms >= 5 : prop.bedrooms === parseInt(filters.bedrooms)
      );
    }

    if (filters.priceRange === 'budget') {
      filtered = filtered.filter(prop => prop.price < 25000);
    } else if (filters.priceRange === 'mid') {
      filtered = filtered.filter(prop => prop.price >= 25000 && prop.price <= 50000);
    } else if (filters.priceRange === 'premium') {
      filtered = filtered.filter(prop => prop.price > 50000);
    }

    return filtered;
  }, [searchQuery, filters]);

  const handleReserve = (property) => {
    if (!user) {
      alert('Please sign in or register to reserve a property');
      navigate('/signin');
      return;
    }

    const reservation = {
      id: Date.now(),
      propertyId: property.id,
      propertyName: property.name,
      location: property.location,
      price: property.price,
      bedrooms: property.bedrooms,
      date: new Date().toLocaleDateString(),
      status: 'pending',
      userName: user.email.split('@')[0],
      userPhone: user.phone
    };
    
    const newReservations = [...reservations, reservation];
    setReservations(newReservations);
    localStorage.setItem('reservations', JSON.stringify(newReservations));
    setSelectedProperty(null); 
    alert(`✨ Property reserved! Admin will review your request.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-slate-900 border-b border-slate-800 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Dream Home</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Discover properties tailored to your lifestyle in Delhi, Mumbai, Noida, and beyond.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative group">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative flex items-center bg-slate-950 rounded-2xl border border-slate-800 p-2 shadow-xl">
              <Search className="text-slate-500 ml-4" size={24} />
              <input
                type="text"
                placeholder="Search location (e.g. Delhi, Mumbai)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 text-lg px-4 py-3 text-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <button 
            className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-slate-900 rounded-xl border border-slate-800 text-white font-medium"
            onClick={() => setShowMobileFilter(!showMobileFilter)}
          >
            <SlidersHorizontal size={18} /> Filters
          </button>

          {/* Sidebar */}
          <aside className={`lg:w-1/4 ${showMobileFilter ? 'block' : 'hidden'} lg:block`}>
            <SidebarFilter filters={filters} setFilters={setFilters} onApply={() => setShowMobileFilter(false)} />
          </aside>

          {/* Property Grid */}
          <div className="lg:w-3/4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {filteredProperties.length} Properties Found
              </h2>
            </div>

            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onClick={() => setSelectedProperty(property)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-slate-900 rounded-3xl border border-slate-800 border-dashed">
                <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin size={32} className="text-slate-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No properties found</h3>
                <p className="text-slate-400">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Property Details Modal */}
      <PropertyDetails
        property={selectedProperty}
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onReserve={handleReserve}
      />
    </div>
  );
}
