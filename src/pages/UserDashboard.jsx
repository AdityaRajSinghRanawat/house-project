import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Clock, CheckCircle, XCircle, User } from 'lucide-react';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const stored = localStorage.getItem('reservations');
    if (stored) {
      const allReservations = JSON.parse(stored);
      // Filter reservations by user phone
      const userReservations = allReservations.filter(r => r.userPhone === user.phone);
      setReservations(userReservations);
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} className="text-yellow-500" />;
      case 'approved':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'rejected':
        return <XCircle size={20} className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">My Reservations</h1>
            <p className="text-slate-400 text-sm">Track your property reservations</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right border-r border-slate-700 pr-4">
              <div className="flex items-center gap-2 text-white font-semibold mb-1">
                <User size={18} className="text-blue-500" />
                {user?.email}
              </div>
              <p className="text-slate-400 text-xs">{user?.phone}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold mb-8 transition-colors"
        >
          <Home size={18} />
          Back to Home
        </Link>

        {/* Reservations List */}
        {reservations.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {reservations.map(reservation => (
              <div
                key={reservation.id}
                className="bg-slate-900 rounded-lg border border-slate-800 p-6 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {reservation.propertyName}
                    </h3>
                    <p className="text-slate-400">{reservation.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(reservation.status)}
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                        reservation.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : reservation.status === 'approved'
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {reservation.status.charAt(0).toUpperCase() +
                        reservation.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase mb-1">
                      Bedrooms
                    </p>
                    <p className="text-lg font-bold text-white">
                      {reservation.bedrooms}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase mb-1">
                      Price
                    </p>
                    <p className="text-lg font-bold text-blue-400">
                      ₹{(reservation.price / 1000).toFixed(0)}k/mo
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase mb-1">
                      Date Reserved
                    </p>
                    <p className="text-lg font-bold text-slate-300">
                      {reservation.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase mb-1">
                      Your Phone
                    </p>
                    <p className="text-lg font-bold text-slate-300">
                      {reservation.userPhone}
                    </p>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => navigate('/')}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm"
                    >
                      View More
                    </button>
                  </div>
                </div>

                {reservation.status === 'pending' && (
                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
                    <Clock size={18} className="text-yellow-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-yellow-400">
                      Your reservation is pending. Admin will review and approve or reject it soon.
                    </p>
                  </div>
                )}

                {reservation.status === 'approved' && (
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-green-400">
                      Your reservation has been approved! 🎉 Check your email for further details.
                    </p>
                  </div>
                )}

                {reservation.status === 'rejected' && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                    <XCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-400">
                      Unfortunately, your reservation was rejected. Try reserving another property!
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-900 rounded-lg border border-slate-800 border-dashed">
            <Home size={48} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Reservations Yet</h3>
            <p className="text-slate-400 mb-6">
              Start exploring properties and make your first reservation!
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all shadow-lg"
            >
              Explore Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
