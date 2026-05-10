import { useState, useEffect } from 'react';
import api from '../api/axios';
import ExpertCard from '../components/ExpertCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { Search, Filter, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = ['All', 'Tech', 'Finance', 'Health', 'Legal', 'Career'];

const ExpertList = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('All');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); 
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      setError(null);
      const query = new URLSearchParams({
        page,
        limit: 6,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(category !== 'All' && { category })
      });
      
      const { data } = await api.get(`/experts?${query.toString()}`);
      setExperts(data.experts);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to fetch experts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, [debouncedSearch, category, page]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Find an Expert</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Book 1-on-1 sessions with top professionals</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full md:w-80"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl leading-5 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all shadow-sm"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide"
      >
        <div className="flex items-center text-gray-500 dark:text-gray-400 mr-2 shrink-0">
          <Filter className="w-4 h-4 mr-1.5" />
          <span className="text-sm font-bold uppercase tracking-wider">Filter:</span>
        </div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 shrink-0 ${
              category === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none'
                : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-700 shadow-sm'
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 flex items-start">
          <AlertCircle className="h-6 w-6 text-red-500 mt-0.5 mr-4" />
          <div className="flex-grow">
            <h3 className="text-lg font-bold text-red-800 dark:text-red-400">Error loading experts</h3>
            <p className="mt-1 text-red-700 dark:text-red-300">{error}</p>
          </div>
          <button onClick={fetchExperts} className="ml-4 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg font-bold hover:bg-red-200 transition-colors">
            Retry
          </button>
        </div>
      ) : loading ? (
        <LoadingSkeleton count={6} />
      ) : experts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 border-dashed"
        >
          <div className="bg-gray-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-10 w-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">No experts found</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your search or filters.</p>
          { (search || category !== 'All') && (
            <div className="mt-8">
              <button
                onClick={() => { setSearch(''); setCategory('All'); }}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-xl text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {experts.map((expert, index) => (
              <ExpertCard key={expert._id} expert={expert} index={index} />
            ))}
          </div>

          {totalPages > 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 flex items-center justify-between border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl shadow-sm border"
            >
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    Page <span className="font-bold text-blue-600 dark:text-blue-400">{page}</span> of <span className="font-bold text-gray-900 dark:text-white">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-slate-800" aria-label="Pagination">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-4 py-2.5 bg-white dark:bg-slate-900 text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="relative inline-flex items-center px-4 py-2.5 bg-white dark:bg-slate-900 text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default ExpertList;
