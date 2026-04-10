import { BedDouble, Bath, Heart, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function PropertyCard({ property, onClick }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = property.images?.length > 0 ? property.images : [property.image];

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      onClick={onClick}
      className="group bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-blue-900/30 transition-all duration-300 cursor-pointer hover:-translate-y-1 flex flex-col h-96"
    >
      {/* Image Section */}
      <div className="relative h-48 shrink-0 overflow-hidden bg-slate-950">
        <img
          src={images[currentImageIndex]}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full text-white transition-all z-10"
        >
          <Heart
            size={18}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}
          />
        </button>

        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="text-white drop-shadow-lg">
            <span className="text-lg font-bold">₹{(property.price / 1000).toFixed(0)}k</span>
            <span className="text-xs text-slate-200 ml-1">/mo</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Title & Location */}
        <div className="mb-3">
          <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
            {property.name}
          </h3>
          <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
            <MapPin size={12} className="text-blue-500 shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex-1" />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-lg p-2">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Bedrooms</p>
            <p className="text-sm font-bold text-white">
              <BedDouble size={12} className="inline mr-1" />
              {property.bedrooms}
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Bathrooms</p>
            <p className="text-sm font-bold text-white">
              <Bath size={12} className="inline mr-1" />
              {property.bathrooms}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
