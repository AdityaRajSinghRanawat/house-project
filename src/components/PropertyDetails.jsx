import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, MapPin, Phone, Mail, Star, Wifi, Car, Shield } from 'lucide-react';

export default function PropertyDetails({ property, isOpen, onClose, onReserve }) {
  const [imageIndex, setImageIndex] = useState(0);

  if (!isOpen || !property) return null;

  const images = property.images?.length > 0 ? property.images : [property.image];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header with Close */}
        <div className="flex justify-between items-center p-4 border-b border-slate-800 shrink-0">
          <h2 className="text-xl font-bold text-white line-clamp-1">{property.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Image Carousel */}
          <div className="relative h-64 bg-slate-950">
            <img
              src={images[imageIndex]}
              alt={property.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

            {/* Image Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImageIndex((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setImageIndex((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === imageIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Price Badge */}
            <div className="absolute bottom-4 left-4 z-10">
              <div className="text-white drop-shadow-lg">
                <span className="text-2xl font-bold">₹{(property.price / 1000).toFixed(0)}k</span>
                <span className="text-xs text-slate-200 ml-1">/mo</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6 space-y-6">
            
            {/* Location */}
            <div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-500 mt-1 shrink-0" />
                <p className="text-slate-300">{property.location}</p>
              </div>
            </div>

            {/* Key Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Bedrooms</p>
                <p className="text-2xl font-bold text-white">{property.bedrooms}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Bathrooms</p>
                <p className="text-2xl font-bold text-white">{property.bathrooms}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Rating</p>
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-yellow-500 text-yellow-500" />
                  <p className="text-lg font-bold text-white">4.8</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-bold text-white mb-2">About this property</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {property.description || 'Modern property with premium amenities and comfortable living spaces.'}
              </p>
            </div>

            {/* Amenities - Grid */}
            <div>
              <h3 className="text-sm font-bold text-white mb-3">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(property.amenities || property.services || ['WiFi', 'AC', 'Parking']).slice(0, 6).map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-300 bg-slate-800/50 p-2.5 rounded-lg border border-slate-700">
                    <div className="text-blue-400">
                      {amenity.toLowerCase().includes('wifi') && <Wifi size={16} />}
                      {amenity.toLowerCase().includes('park') && <Car size={16} />}
                      {amenity.toLowerCase().includes('secu') && <Shield size={16} />}
                      {!amenity.toLowerCase().includes('wifi') && !amenity.toLowerCase().includes('park') && !amenity.toLowerCase().includes('secu') && <Wifi size={16} />}
                    </div>
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Host Info */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <h3 className="text-sm font-bold text-white mb-3">Host Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {property.owner?.name?.[0] || 'O'}
                  </div>
                  <span className="text-sm text-slate-300">
                    Hosted by <span className="font-semibold">{property.owner?.name || 'Property Manager'}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm pt-2 border-t border-slate-700">
                  <Phone size={14} /> {property.owner?.phone || '+91 98765 43210'}
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Mail size={14} /> {property.owner?.email || 'host@aura.com'}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 shrink-0">
          <button
            onClick={() => onReserve(property)}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-900/40 transition-all active:scale-95"
          >
            Reserve Now
          </button>
        </div>
      </div>
    </div>
  );
}
