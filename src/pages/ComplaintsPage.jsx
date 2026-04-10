import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, Send, Sparkles, Home, FileText, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { analyzeComplaint } from '../lib/llm';

export default function ComplaintsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('admin-complaints');
    if (saved) {
      const allComplaints = JSON.parse(saved);
      // Filter complaints by current user
      return user ? allComplaints.filter(c => c.userEmail === user.email) : [];
    }
    return [];
  });

  const [formData, setFormData] = useState({
    propertyId: '',
    subject: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Re-filter complaints when user changes
    const saved = localStorage.getItem('admin-complaints');
    if (saved && user) {
      const allComplaints = JSON.parse(saved);
      const userComplaints = allComplaints.filter(c => c.userEmail === user.email);
      setComplaints(userComplaints);
    }
  }, [user]);

  // Mock properties (In a real app, fetch from user's reserved/owned properties)
  const myProperties = [
    { id: 1, name: 'Luxury Apartment in Delhi' },
    { id: 3, name: 'Modern House in Noida' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please sign in to submit a complaint');
      navigate('/signin');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Analyze with "LLM"
      const analysis = await analyzeComplaint(
        formData.description, 
        myProperties.find(p => p.id == formData.propertyId)?.name
      );

      // 2. Create Complaint Object
      const complaint = {
        id: Date.now(),
        complaintId: `CMP-${Date.now()}`,
        userEmail: user.email,
        subject: formData.subject,
        description: formData.description,
        propertyId: formData.propertyId,
        propertyName: myProperties.find(p => p.id == formData.propertyId)?.name,
        aiSummary: analysis?.summary || 'Complaint received and noted.',
        status: 'under work',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 3. Save to admin-complaints (shared database)
      const allComplaints = JSON.parse(localStorage.getItem('admin-complaints') || '[]');
      const updated = [complaint, ...allComplaints];
      localStorage.setItem('admin-complaints', JSON.stringify(updated));

      // Update local state with user's complaints
      setComplaints([complaint, ...complaints]);
      
      setFormData({ propertyId: '', subject: '', description: '' });
      alert('✓ Complaint filed successfully! Our AI agent has analyzed it.');
    } catch (error) {
      console.error(error);
      alert('Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Page Header */}
      <div className="bg-slate-900 border-b border-slate-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Resident <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Support</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Report issues with your property. Our AI-powered system ensures rapid response and prioritization.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* File Complaint Form */}
          <div className="lg:col-span-5 bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8 shadow-2xl sticky top-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                <FileText size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">New Request</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">Select Property</label>
                <div className="relative">
                  <select
                    value={formData.propertyId}
                    onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none transition-shadow"
                    required
                  >
                    <option value="">Choose a property...</option>
                    {myProperties.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <Home className="absolute left-3 top-3.5 text-slate-500" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Leaking Tap, No Power"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-600 transition-shadow"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Please describe the issue in detail..."
                  rows="5"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-600 resize-none transition-shadow"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="animate-spin" size={20} /> Analyzing...
                  </>
                ) : (
                  <>
                    <Send size={20} /> Submit Request
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Recent History */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3 px-2 mb-2">
               <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                  <Clock size={20} />
               </div>
               <h2 className="text-2xl font-bold text-white">Recent Requests</h2>
            </div>
            
            {complaints.length === 0 ? (
              <div className="bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed p-16 text-center">
                <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="text-slate-500" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No history yet</h3>
                <p className="text-slate-500">Your submitted complaints will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <div key={complaint.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-slate-700 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-white mb-1">{complaint.subject}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Home size={12}/> {complaint.propertyName}</span>
                          <span>•</span>
                          <span>{complaint.complaintId}</span>
                          <span>•</span>
                          <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap ${
                        complaint.status === 'solved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                        complaint.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {complaint.status === 'solved' ? <CheckCircle size={12} /> : 
                         complaint.status === 'rejected' ? <AlertTriangle size={12} /> :
                         <Clock size={12} />}
                        {complaint.status === 'under work' ? 'Under Work' : 
                         complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
                      <p className="text-sm text-slate-300 leading-relaxed">{complaint.description}</p>
                    </div>

                    {complaint.aiSummary && (
                       <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                          <div className="flex items-center gap-2 text-indigo-400">
                             <Sparkles size={16} />
                             <span className="text-xs font-bold uppercase tracking-wider">AI Summary</span>
                          </div>
                          <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/50">
                             <p className="text-xs text-slate-400 italic">"{complaint.aiSummary}"</p>
                          </div>
                       </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
