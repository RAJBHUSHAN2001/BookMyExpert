import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Mail, Calendar, Clock, User as UserIcon, Briefcase, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../AuthContext';

const MyBookings = () => {
  const { user: authUser } = useAuth();
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Auto-fetch if user is logged in
  useEffect(() => {
    if (authUser?.email) {
      handleSearch(null, authUser.email);
    }
  }, [authUser]);

  const handleSearch = async (e, forcedEmail) => {
    if (e) e.preventDefault();
    const searchEmail = forcedEmail || email;
    
    if (!searchEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(searchEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get(`/bookings?email=${encodeURIComponent(searchEmail)}`);
      setBookings(data.bookings);
      setSubmittedEmail(searchEmail);
      setSearched(true);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-bold rounded-full border border-blue-200 dark:border-blue-900/50 shadow-sm">Confirmed</span>;
      case 'Completed':
        return <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-bold rounded-full border border-green-200 dark:border-green-900/50 shadow-sm">Completed</span>;
      case 'Pending':
      default:
        return <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs font-bold rounded-full border border-yellow-200 dark:border-yellow-900/50 shadow-sm">Pending</span>;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-4 py-12"
    >
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-4 tracking-tight"
        >
          {authUser ? 'My Appointments' : 'Find My Bookings'}
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg"
        >
          {authUser 
            ? `Viewing all sessions booked for ${authUser.name}`
            : 'Enter your email address to manage your upcoming sessions.'}
        </motion.p>
      </div>

      {!authUser && (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto mb-20 relative z-10"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur opacity-25 dark:opacity-40 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <form onSubmit={handleSearch} className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 p-2 flex">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Mail className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="block w-full pl-14 pr-4 py-4 bg-transparent border-none focus:ring-0 sm:text-lg transition-all outline-none text-gray-800 dark:text-white"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="flex-shrink-0 flex items-center px-8 bg-blue-600 text-white text-base font-extrabold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:bg-blue-400 disabled:shadow-none"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Search <ChevronRight className="w-5 h-5 ml-1 hidden sm:block" /></>
              )}
            </button>
          </form>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {loading ? (
           <div key="loader" className="text-center py-20 dark:text-white">Loading appointments...</div>
        ) : searched && bookings.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-20 text-center max-w-2xl mx-auto relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-gray-200 dark:border-slate-700">
              <Search className="h-10 w-10 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">No bookings found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-10 text-lg">We couldn't find any bookings for <strong className="text-gray-800 dark:text-gray-200 underline decoration-blue-500 underline-offset-4">{submittedEmail}</strong>.</p>
            <Link to="/" className="inline-flex items-center px-10 py-4 border border-transparent text-lg font-bold rounded-2xl shadow-lg text-white bg-blue-600 hover:bg-blue-700 transition-all hover:-translate-y-1 transform">
              Browse Experts
            </Link>
          </motion.div>
        ) : searched && bookings.length > 0 && (
          <motion.div 
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200 mb-8 px-2 flex items-center tracking-tight">
              {authUser ? 'Your upcoming sessions' : `Bookings for ${submittedEmail}`}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {bookings.map((booking, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={booking._id} 
                  className="bg-white dark:bg-slate-900 rounded-3xl shadow-md border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex justify-between items-start bg-gradient-to-r from-white to-gray-50/30 dark:from-slate-900 dark:to-slate-800/30">
                    <div>
                      <h4 className="font-extrabold text-2xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">{booking.expertId?.name || 'Unknown Expert'}</h4>
                      <div className="flex items-center mt-3 text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 w-max px-3 py-1.5 rounded-lg shadow-sm">
                        <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                        {booking.expertId?.category || 'Category'}
                      </div>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                  
                  <div className="p-8 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center text-gray-700 dark:text-gray-300 bg-gray-50/80 dark:bg-slate-800/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm transition-colors hover:bg-white dark:hover:bg-slate-800">
                        <div className="bg-white dark:bg-slate-900 p-2 rounded-lg shadow-sm mr-4 shrink-0">
                          <Calendar className="w-5 h-5 text-blue-500" />
                        </div>
                        <span className="font-bold text-sm whitespace-nowrap">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300 bg-gray-50/80 dark:bg-slate-800/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm transition-colors hover:bg-white dark:hover:bg-slate-800">
                        <div className="bg-white dark:bg-slate-900 p-2 rounded-lg shadow-sm mr-4 shrink-0">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-bold text-sm whitespace-nowrap">{booking.timeSlot}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-700 dark:text-gray-300 bg-blue-50/30 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100/30 dark:border-blue-900/20">
                      <div className="bg-white dark:bg-slate-900 p-2 rounded-lg shadow-sm mr-4 shrink-0">
                        <UserIcon className="w-5 h-5 text-blue-500" />
                      </div>
                      <span className="text-sm font-bold tracking-tight">Booked for: <span className="text-gray-900 dark:text-white underline decoration-blue-200">{booking.name}</span></span>
                    </div>
                    
                    {booking.notes && (
                      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800">
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-[0.2em] mb-3">Expert Notes</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic bg-yellow-50/30 dark:bg-yellow-900/10 p-4 rounded-2xl border border-yellow-100/30 dark:border-yellow-900/20 leading-relaxed shadow-inner">"{booking.notes}"</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyBookings;
