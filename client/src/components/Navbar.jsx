import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CalendarDays, Home, Sun, Moon, LayoutDashboard, LogIn, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-gray-100/50 dark:border-slate-800/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="bg-blue-600/10 p-2 rounded-xl group-hover:bg-blue-600/20 transition-colors">
                <CalendarDays className="h-6 w-6 text-blue-600" />
              </div>
              <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">BookMyExpert</span>
            </Link>
          </motion.div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-1 sm:space-x-2 mr-2 pr-2 border-r border-gray-100 dark:border-slate-800"
            >
              <Link 
                to="/" 
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/') 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Home className={`w-4 h-4 mr-2 ${isActive('/') ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="hidden sm:inline">Home</span>
              </Link>
              
              {user ? (
                <>
                  {user.role === 'user' && (
                    <Link 
                      to="/my-bookings" 
                      className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive('/my-bookings') 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <CalendarDays className={`w-4 h-4 mr-2 ${isActive('/my-bookings') ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className="hidden sm:inline">My Bookings</span>
                    </Link>
                  )}
                  {user.role === 'expert' && (
                    <Link 
                      to="/admin" 
                      className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive('/admin') 
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <LayoutDashboard className={`w-4 h-4 mr-2 ${isActive('/admin') ? 'text-indigo-600' : 'text-gray-400'}`} />
                      <span className="hidden sm:inline">Admin Panel</span>
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                  <div className="hidden lg:flex items-center ml-4 pl-4 border-l border-gray-100 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs mr-2">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase text-gray-400 leading-none mb-1">{user.role}</p>
                      <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">{user.name}</p>
                    </div>
                  </div>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 dark:shadow-none transition-all"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Link>
              )}
            </motion.div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all border border-gray-100 dark:border-slate-700 shadow-sm"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
