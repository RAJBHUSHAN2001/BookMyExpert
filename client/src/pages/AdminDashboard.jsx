import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, Calendar, CheckCircle, Clock, Trash2, Edit, LayoutDashboard, Briefcase, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, expertsRes] = await Promise.all([
        api.get('/bookings/all'), // We'll need to create this endpoint
        api.get('/experts?limit=100')
      ]);
      setBookings(bookingsRes.data.bookings);
      setExperts(expertsRes.data.experts);
    } catch (err) {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      toast.success(`Booking ${status}`);
      fetchData();
    } catch (e) {
      toast.error('Update failed');
    }
  };

  const stats = [
    { label: 'Total Experts', value: experts.length, icon: Users, color: 'blue' },
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'indigo' },
    { label: 'Confirmed', value: bookings.filter(b => b.status === 'Confirmed').length, icon: CheckCircle, color: 'green' },
    { label: 'Pending', value: bookings.filter(b => b.status === 'Pending').length, icon: Clock, color: 'amber' },
  ];

  if (loading) return <div className="p-10 text-center dark:text-white">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none">
          <LayoutDashboard className="text-white w-6 h-6" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Admin Console</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-5"
          >
            <div className={`bg-${stat.color}-100 dark:bg-${stat.color}-900/30 p-4 rounded-2xl`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-100 dark:border-slate-800 pb-2">
        <button 
          onClick={() => setActiveTab('bookings')}
          className={`pb-4 px-2 font-bold text-sm transition-all relative ${activeTab === 'bookings' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}
        >
          Recent Bookings
          {activeTab === 'bookings' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('experts')}
          className={`pb-4 px-2 font-bold text-sm transition-all relative ${activeTab === 'experts' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}
        >
          Expert Management
          {activeTab === 'experts' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />}
        </button>
      </div>

      {activeTab === 'bookings' ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Expert</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Client</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Date & Time</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 dark:text-white">{booking.expertId?.name || 'Deleted'}</p>
                      <p className="text-xs text-gray-400">{booking.expertId?.category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 dark:text-white">{booking.name}</p>
                      <p className="text-xs text-gray-400">{booking.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-3 h-3 mr-1.5" /> {new Date(booking.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-3 h-3 mr-1.5" /> {booking.timeSlot}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        booking.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {booking.status === 'Pending' && (
                          <button onClick={() => updateStatus(booking._id, 'Confirmed')} className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {booking.status !== 'Completed' && (
                          <button onClick={() => updateStatus(booking._id, 'Completed')} className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-600 hover:text-white transition-all">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((expert) => (
            <div key={expert._id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 flex items-center gap-4">
              <img src={expert.avatar} className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" alt="" />
              <div className="flex-grow">
                <p className="font-bold text-gray-900 dark:text-white">{expert.name}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center"><Briefcase className="w-3 h-3 mr-1" /> {expert.category}</span>
                  <span className="flex items-center"><Star className="w-3 h-3 mr-1 text-amber-500" /> {expert.rating}</span>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
