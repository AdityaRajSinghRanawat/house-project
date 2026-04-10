import { RotateCcw } from 'lucide-react';

export default function SidebarFilter({ filters, setFilters, onApply }) {
  return (
    <div className="sticky top-24 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Filters</h2>
        <button
          onClick={() => setFilters({ bedrooms: '', priceRange: 'all' })}
          className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Bedrooms */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h3 className="font-semibold text-slate-200">Bedrooms</h3>
        <div className="space-y-3">
          {['', '1', '2', '3', '4', '5'].map(val => (
            <label key={val} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  checked={filters.bedrooms === val}
                  onChange={() => setFilters({ ...filters, bedrooms: val })}
                  className="peer appearance-none w-5 h-5 border-2 border-slate-600 rounded-full checked:border-blue-500 checked:bg-blue-500 transition-all"
                />
                <div className="absolute w-2 h-2 bg-white rounded-full scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
              </div>
              <span className={`text-sm group-hover:text-white transition-colors ${
                filters.bedrooms === val ? 'text-white font-medium' : 'text-slate-400'
              }`}>
                {val === '' ? 'Any' : val === '5' ? '5+ Bedrooms' : `${val} Bedroom${val > '1' ? 's' : ''}`}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h3 className="font-semibold text-slate-200">Price Range</h3>
        <div className="space-y-3">
          {[
            { value: 'all', label: '💰 All Prices' },
            { value: 'budget', label: '💵 Under ₹25K' },
            { value: 'mid', label: '💴 ₹25K - ₹50K' },
            { value: 'premium', label: '💎 Above ₹50K' }
          ].map(opt => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  checked={filters.priceRange === opt.value}
                  onChange={() => setFilters({ ...filters, priceRange: opt.value })}
                  className="peer appearance-none w-5 h-5 border-2 border-slate-600 rounded-full checked:border-blue-500 checked:bg-blue-500 transition-all"
                />
                <div className="absolute w-2 h-2 bg-white rounded-full scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
              </div>
              <span className={`text-sm group-hover:text-white transition-colors ${
                filters.priceRange === opt.value ? 'text-white font-medium' : 'text-slate-400'
              }`}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Apply Button (Mobile Only usually, but good to have) */}
      <button
        onClick={onApply}
        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition-all active:scale-95 lg:hidden"
      >
        Apply Filters
      </button>
    </div>
  );
}
