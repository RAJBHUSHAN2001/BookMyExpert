import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Calendar, Clock, User, ArrowLeft, CheckCircle, Mail, Phone, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Booking = () => {
  const { expertId } = useParams();
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');
  const timeSlot = searchParams.get('timeSlot');
  const navigate = useNavigate();

  const [expertName, setExpertName] = useState('');
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (!date || !timeSlot) {
      navigate('/');
      return;
    }

    const fetchExpert = async () => {
      try {
        const { data } = await api.get(`/experts/${expertId}`);
        setExpertName(data.expert.name);
      } catch (err) {
        console.error('Failed to fetch expert name');
      }
    };
    fetchExpert();
  }, [expertId, date, timeSlot, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name || form.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Valid email is required';
    if (!form.phone || !/^\d{10}$/.test(form.phone)) newErrors.phone = 'Phone must be exactly 10 digits';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Please check the form for errors');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { data } = await api.post('/bookings', {
        expertId,
        date,
        timeSlot,
        ...form
      });
      setBooking(data.booking);
      setSubmitted(true);
      toast.success('Booking confirmed successfully!');
    } catch (err) {
      if (err.status === 409) {
        toast.error('This slot was just booked by someone else!', { duration: 6000 });
      } else {
        toast.error(err.message || 'An error occurred while booking.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted && booking) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-2xl mx-auto px-4 py-16"
      >
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-50 to-white dark:from-green-900/10 dark:to-slate-900 -z-10"></div>
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
            className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12" />
          </motion.div>
          
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Booking Confirmed!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg">Your session with <span className="font-bold text-gray-900 dark:text-white">{expertName || 'the expert'}</span> has been successfully booked.</p>
          
          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-8 mb-10 text-left max-w-md mx-auto border border-gray-100 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center uppercase tracking-wider text-sm">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Booking Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-50 dark:border-slate-700">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg mr-4">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-bold">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-50 dark:border-slate-700">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg mr-4">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-bold">{booking.timeSlot}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/my-bookings" className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200">
              View My Bookings
            </Link>
            <Link to={`/experts/${expertId}`} className="px-8 py-3.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200">
              Book Another Slot
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto px-4 py-8"
    >
      <button onClick={() => navigate(-1)} className="inline-flex items-center px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white mb-8 transition-all shadow-sm">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Expert
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        <div className="bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-900/10 dark:to-slate-900 p-8 md:p-10 border-b border-gray-100 dark:border-slate-800">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Complete Your Booking</h1>
          {expertName && <p className="text-blue-600 dark:text-blue-400 font-bold text-lg">Session with {expertName}</p>}
          
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {date && new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-bold text-gray-800 dark:text-gray-200">{timeSlot}</span>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center uppercase tracking-wider">
                  <User className="w-4 h-4 mr-1.5 text-gray-400" /> Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all dark:text-white ${errors.name ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="mt-2 text-sm text-red-500 font-bold">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center uppercase tracking-wider">
                  <Mail className="w-4 h-4 mr-1.5 text-gray-400" /> Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all dark:text-white ${errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="mt-2 text-sm text-red-500 font-bold">{errors.email}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center uppercase tracking-wider">
                  <Phone className="w-4 h-4 mr-1.5 text-gray-400" /> Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all dark:text-white ${errors.phone ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}`}
                  placeholder="1234567890"
                />
                {errors.phone && <p className="mt-2 text-sm text-red-500 font-bold">{errors.phone}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center uppercase tracking-wider">
                  <FileText className="w-4 h-4 mr-1.5 text-gray-400" /> Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all dark:text-white hover:border-gray-300 dark:hover:border-slate-600"
                  placeholder="Any specific topics you want to discuss?"
                ></textarea>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-gray-100 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className={`px-10 py-4 rounded-2xl text-white font-extrabold text-lg transition-all duration-300 flex items-center justify-center min-w-[220px] ${
                  submitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-200 dark:hover:shadow-none transform hover:-translate-y-1'
                }`}
              >
                {submitting ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Processing...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Booking;
