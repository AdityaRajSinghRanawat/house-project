import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, TrendingUp, BrainCircuit, Phone, User, Check, X, Eye } from 'lucide-react';

export default function AdminPage() {
  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem('reservations');
    return saved ? JSON.parse(saved) : [];
  });

  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('complaints');
    return saved ? JSON.parse(saved) : [];
  });

  // Listen for storage changes to update real-time if multiple tabs are open
  useEffect(() => {
    const handleStorageChange = () => {
      const savedReservations = localStorage.getItem('reservations');
      if (savedReservations) setReservations(JSON.parse(savedReservations));
      
      const savedComplaints = localStorage.getItem('complaints');
      if (savedComplaints) setComplaints(JSON.parse(savedComplaints));
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [activeTab, setActiveTab] = useState('reservations');

  const handleApprove = (id) => {
    const updated = reservations.map(r => r.id === id ? { ...r, status: 'approved' } : r);
    setReservations(updated);
    localStorage.setItem('reservations', JSON.stringify(updated));
  };

  const handleDecline = (id) => {
    const updated = reservations.map(r => r.id === id ? { ...r, status: 'declined' } : r);
    setReservations(updated);
    localStorage.setItem('reservations', JSON.stringify(updated));
  };

  const handleComplaintStatus = (id, status) => {
    const updated = complaints.map(c => c.id === id ? { ...c, status } : c);
    setComplaints(updated);
    localStorage.setItem('complaints', JSON.stringify(updated));
  };

  const pendingCount = reservations.filter(r => r.status === 'pending').length;
  const complaintCount = complaints.filter(c => c.status !== 'resolved').length;
  const approvedCount = reservations.filter(r => r.status === 'approved').length;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 inline-block mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-400">Manage reservations and view resident insights</p>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Pending Reservations</p>
                <p className="text-4xl font-bold text-white tracking-tight">{pendingCount}</p>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500 border border-yellow-500/20">
                <Clock size={28} />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden group hover:border-red-500/30 transition-colors">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Open Complaints</p>
                <p className="text-4xl font-bold text-white tracking-tight">{complaintCount}</p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-xl text-red-500 border border-red-500/20">
                <AlertCircle size={28} />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden group hover:border-green-500/30 transition-colors">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Approved</p>
                <p className="text-4xl font-bold text-white tracking-tight">{approvedCount}</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-xl text-green-500 border border-green-500/20">
                <CheckCircle size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => setActiveTab('reservations')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'reservations' 
                  ? 'border-b-2 border-blue-500 text-blue-400 bg-slate-800' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Reservations
            </button>
            <button
              onClick={() => setActiveTab('complaints')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'complaints' 
                  ? 'border-b-2 border-blue-500 text-blue-400 bg-slate-800' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Complaints & AI Insights
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'reservations' ? (
              reservations.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                  <p className="text-slate-400">No reservations yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400 uppercase text-xs tracking-wider">
                        <th className="py-4 px-4 font-semibold">Property</th>
                        <th className="py-4 px-4 font-semibold">User</th>
                        <th className="py-4 px-4 font-semibold">Date</th>
                        <th className="py-4 px-4 font-semibold">Price</th>
                        <th className="py-4 px-4 font-semibold">Status</th>
                        <th className="py-4 px-4 font-semibold">Contact / Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {reservations.map(res => (
                        <tr key={res.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="py-4 px-4 text-slate-200 font-medium">{res.propertyName}</td>
                          <td className="py-4 px-4 text-slate-400">
                             <div className="flex items-center gap-2">
                                <User size={14} className="text-slate-500" />
                                {res.userName || 'User'}
                             </div>
                          </td>
                          <td className="py-4 px-4 text-slate-400">{res.date}</td>
                          <td className="py-4 px-4 text-slate-200">₹{(res.price / 1000).toFixed(0)}k</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                              res.status === 'approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                              res.status === 'declined' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                              'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                res.status === 'approved' ? 'bg-green-400' :
                                res.status === 'declined' ? 'bg-red-400' :
                                'bg-yellow-400'
                              }`}></span>
                              {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-800/50 px-2 py-1 rounded w-fit">
                                    <Phone size={12} className="text-blue-400" />
                                    {res.userPhone || 'N/A'}
                                </div>
                                {res.status === 'pending' && (
                                <div className="flex gap-2">
                                    <button
                                    onClick={() => handleApprove(res.id)}
                                    className="p-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg transition-colors"
                                    title="Approve"
                                    >
                                    <CheckCircle size={16} />
                                    </button>
                                    <button
                                    onClick={() => handleDecline(res.id)}
                                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-colors"
                                    title="Decline"
                                    >
                                    <XCircle size={16} />
                                    </button>
                                </div>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              complaints.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                  <p className="text-slate-400">No complaints yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {complaints.map(complaint => (
                    <div key={complaint.id} className="bg-slate-950 rounded-xl p-6 border border-slate-800 hover:border-slate-700 transition-colors">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-white">{complaint.title}</h3>
                            <span className="px-2.5 py-0.5 bg-slate-800 border border-slate-700 rounded-md text-xs font-medium text-slate-400">
                              {complaint.propertyName}
                            </span>
                            {/* Status Badge */}
                            {complaint.status && (
                                <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded border ${
                                    complaint.status === 'resolved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                    complaint.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                    complaint.status === 'under_review' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                    'bg-slate-700 text-slate-300 border-slate-600'
                                }`}>
                                    {complaint.status.replace('_', ' ')}
                                </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-sm mb-3 leading-relaxed">{complaint.description}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                            <Clock size={12} />
                            <span>Filed on {complaint.date}</span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2 mt-2">
                             <button 
                                onClick={() => handleComplaintStatus(complaint.id, 'resolved')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                                    complaint.status === 'resolved' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                                }`}
                             >
                                <Check size={14} /> Problem Solved
                             </button>
                             <button 
                                onClick={() => handleComplaintStatus(complaint.id, 'under_review')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                                    complaint.status === 'under_review' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                                }`}
                             >
                                <Eye size={14} /> Under Review
                             </button>
                             <button 
                                onClick={() => handleComplaintStatus(complaint.id, 'rejected')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                                    complaint.status === 'rejected' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                                }`}
                             >
                                <X size={14} /> Rejected
                             </button>
                          </div>
                        </div>
                        
                        {/* AI Analysis Card */}
                        {complaint.aiAnalysis && (
                          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 md:w-96 w-full flex-shrink-0 shadow-lg mt-4 md:mt-0">
                            <div className="flex items-center gap-2 mb-4 text-indigo-400 font-bold text-sm">
                              <BrainCircuit size={18} />
                              <span>AI Analysis</span>
                            </div>
                            
                            <div className="space-y-4">
                              {/* Category & Summary */}
                              <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30 mb-2">
                                  {complaint.aiAnalysis.category || 'General'}
                                </span>
                                <p className="text-xs text-slate-300 italic leading-relaxed">"{complaint.aiAnalysis.summary}"</p>
                              </div>

                              {/* Churn Risk */}
                              <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                  <span className="text-slate-400 font-medium">Churn Risk</span>
                                  <span className={`font-mono font-bold ${
                                    complaint.aiAnalysis.churnRisk > 0.6 ? 'text-red-400' : 
                                    complaint.aiAnalysis.churnRisk > 0.3 ? 'text-yellow-400' : 'text-green-400'
                                  }`}>
                                    {(complaint.aiAnalysis.churnRisk * 100).toFixed(0)}%
                                  </span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${
                                      complaint.aiAnalysis.churnRisk > 0.6 ? 'bg-red-500' : 
                                      complaint.aiAnalysis.churnRisk > 0.3 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${complaint.aiAnalysis.churnRisk * 100}%` }}
                                  />
                                </div>
                              </div>

                              {/* Solutions */}
                              {complaint.aiAnalysis.solutions && (
                                <div>
                                  <p className="text-xs text-slate-400 font-medium mb-1">Suggested Actions:</p>
                                  <ul className="list-disc list-inside text-xs text-slate-500 space-y-1">
                                    {complaint.aiAnalysis.solutions.map((sol, i) => (
                                      <li key={i}>{sol}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Contact */}
                              {complaint.aiAnalysis.contact && (
                                <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-800/30 p-2 rounded">
                                  <span className="font-semibold text-slate-300 shrink-0">Contact:</span>
                                  <span>{complaint.aiAnalysis.contact}</span>
                                </div>
                              )}
                              
                              <div className="pt-3 border-t border-slate-800 mt-2">
                                <p className="text-xs text-slate-300 font-semibold mb-1">Recommendation:</p>
                                <p className="text-xs text-slate-400 italic leading-relaxed">"{complaint.aiAnalysis.recommendation}"</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
