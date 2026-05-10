import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useSocket from '../hooks/useSocket';
import { ArrowLeft, Star, Briefcase, Calendar, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const socketRef = useSocket();
  
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/experts/${id}`);
        setExpert(data.expert);
      } catch (err) {
        setError(err.message || 'Failed to fetch expert details');
        toast.error('Failed to load expert details');
      } finally {
        setLoading(false);
      }
    };
    fetchExpert();
  }, [id]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('slotBooked', (event) => {
        if (event.expertId === id) {
          setExpert(prev => {
            if (!prev) return prev;
            
            const slotToUpdate = prev.availableSlots.find(s => s.date === event.date && s.time === event.timeSlot);
            if (slotToUpdate && !slotToUpdate.isBooked) {
              toast(`${prev.name}'s slot on ${event.date} at ${event.timeSlot} was just booked!`, {
                icon: '👀',
                style: {
                  background: '#3B82F6',
                  color: '#fff',
                },
              });
            }

            return {
              ...prev,
              availableSlots: prev.availableSlots.map(slot =>
                slot.date === event.date && slot.time === event.timeSlot
                  ? { ...slot, isBooked: true }
                  : slot
              )
            };
          });
        }
      });
    }
  }, [socketRef, id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-40 h-40 bg-gray-200 dark:bg-slate-800 rounded-full mb-6"></div>
          <div className="h-10 bg-gray-200 dark:bg-slate-800 rounded-xl w-1/3 mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded-lg w-1/4 mb-10"></div>
          <div className="w-full h-80 bg-gray-200 dark:bg-slate-800 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (error || !expert) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto px-4 py-20 text-center"
      >
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Expert Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">{error || 'The expert you are looking for does not exist.'}</p>
        <Link to="/" className="inline-flex items-center px-6 py-3 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 rounded-xl text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 font-bold transition-all">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Experts
        </Link>
      </motion.div>
    );
  }

  const groupedSlots = expert.availableSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedSlots).sort();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <Link to="/" className="inline-flex items-center px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white mb-8 transition-all shadow-sm">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Experts
      </Link>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-800 overflow-hidden mb-10 relative group"
      >
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-10 dark:opacity-20"></div>
        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
          <div className="flex-shrink-0">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden border-8 border-white dark:border-slate-800 shadow-xl"
            >
              <img src={expert.avatar} alt={expert.name} className="w-full h-full object-cover bg-blue-50 dark:bg-slate-800" />
            </motion.div>
          </div>
          
          <div className="flex-grow text-center md:text-left">
            <div className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-800 dark:text-blue-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4 shadow-sm border border-white dark:border-slate-800">
              {expert.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">{expert.name}</h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-600 dark:text-gray-400 mb-8">
              <div className="flex items-center bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 px-4 py-2 rounded-xl shadow-sm">
                <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                <span className="font-bold">{expert.experience} Years Exp.</span>
              </div>
              <div className="flex items-center bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 px-4 py-2 rounded-xl shadow-sm">
                <Star className="w-5 h-5 mr-2 text-amber-500 fill-amber-500" />
                <span className="font-bold">{expert.rating} Rating</span>
              </div>
            </div>

            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100/50 dark:border-blue-900/30">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">About Me</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{expert.bio}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-800 p-8 md:p-12"
      >
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-slate-800">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Available Slots</h2>
        </div>

        {sortedDates.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-10 w-10 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">No slots available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {sortedDates.map((dateStr, index) => {
              const dateObj = new Date(dateStr);
              const isToday = new Date().toDateString() === dateObj.toDateString();
              const displayDate = isToday 
                ? 'Today' 
                : dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

              return (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                  key={dateStr}
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center">
                    <span className="bg-gray-900 dark:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm shadow-md">{displayDate}</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {groupedSlots[dateStr].map((slot, idx) => (
                      <button
                        key={idx}
                        disabled={slot.isBooked}
                        onClick={() => navigate(`/book/${expert._id}?date=${dateStr}&timeSlot=${encodeURIComponent(slot.time)}`)}
                        className={`flex items-center justify-center px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 transform ${
                          slot.isBooked
                            ? 'bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-70'
                            : 'bg-white dark:bg-slate-900 border-2 border-blue-100 dark:border-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white hover:border-blue-600 dark:hover:border-blue-600 shadow-sm hover:shadow-md hover:-translate-y-1'
                        }`}
                      >
                        <Clock className={`w-4 h-4 mr-2 ${slot.isBooked ? 'text-gray-400' : 'text-blue-500 dark:text-blue-400 group-hover:text-white'}`} />
                        {slot.isBooked ? 'Booked' : slot.time}
                      </button>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ExpertDetail;
