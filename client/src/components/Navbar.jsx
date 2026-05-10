import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarDays, Home, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  // Initialize from document class to ensure sync with index.html script
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
