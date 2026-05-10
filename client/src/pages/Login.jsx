import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import api from '../api/axios';
import { Mail, Lock, LogIn, ArrowRight, Users, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Login = () => {
  const [role, setRole] = useState('user'); // 'user' or 'expert'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('admin123'); // Default for experts
  const [showPassword, setShowPassword] = useState(false);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'expert') {
      const fetchExperts = async () => {
        try {
          const { data } = await api.get('/experts?limit=100');
          setExperts(data.experts);
          // Set first expert as default
          if (data.experts.length > 0) {
            setEmail(`${data.experts[0].name.toLowerCase().replace(/\s/g, '')}@expert.com`);
          }
        } catch (err) {
          console.error('Failed to fetch experts');
        }
      };
      fetchExperts();
      setPassword('admin123');
    } else {
      setEmail('');
      setPassword('');
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data);
      toast.success(`Welcome back, ${data.user.name}!`);
      if (data.user.role === 'expert') {
        navigate('/admin');
      } else {
        navigate('/my-bookings');
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800"
      >
        <div className="text-center mb-8">
          <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Login to your account</p>
        </div>

        {/* Role Selector */}
        <div className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-2xl mb-8">
          <button 
            onClick={() => setRole('user')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${role === 'user' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-gray-500'}`}
          >
            User Login
          </button>
          <button 
            onClick={() => setRole('expert')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${role === 'expert' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-gray-500'}`}
          >
            Expert Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {role === 'expert' ? (
              <motion.div 
                key="expert-select"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Select Your Profile</label>
                <div className="relative">
                  <Users className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <select 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-10 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white appearance-none cursor-pointer font-bold"
                  >
                    <option value="admin@expert.com">Global Admin</option>
                    {experts.map(exp => (
                      <option key={exp._id} value={`${exp.name.toLowerCase().replace(/\s/g, '')}@expert.com`}>
                        {exp.name} ({exp.category})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="user-input"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                placeholder="••••••••"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-blue-500 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {role === 'expert' && <p className="text-[10px] text-blue-500 font-bold mt-2 ml-1">Hint: Default password is admin123</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : <><span className="mr-1">Login to Dashboard</span> <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500 dark:text-gray-400 text-sm">
          Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register as a User</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
