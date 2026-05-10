import { Link } from 'react-router-dom';
import { Star, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const ExpertCard = ({ expert, index = 0 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100/80 dark:border-slate-800/80 overflow-hidden flex flex-col group transition-all duration-300 relative"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      
      <div className="p-6 flex flex-col items-center flex-grow">
        <div className="relative mb-5">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-50 dark:border-blue-900/30 group-hover:border-blue-100 dark:group-hover:border-blue-800 group-hover:shadow-md transition-all duration-300"
          >
            <img src={expert.avatar} alt={expert.name} className="w-full h-full object-cover" />
          </motion.div>
          <span className="absolute -bottom-2 inset-x-0 mx-auto w-max bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-800 dark:text-blue-100 text-xs font-bold px-3 py-1 rounded-full border border-white dark:border-slate-800 shadow-sm">
            {expert.category}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2 mt-2">{expert.name}</h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4 bg-gray-50/80 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-transparent dark:border-slate-800">
          <div className="flex items-center font-medium text-gray-700 dark:text-gray-300">
            <Briefcase className="w-4 h-4 mr-1.5 text-blue-500" />
            {expert.experience} yrs
          </div>
          <div className="w-px h-4 bg-gray-300 dark:bg-slate-700"></div>
          <div className="flex items-center text-amber-500 font-bold">
            <Star className="w-4 h-4 mr-1.5 fill-amber-500" />
            {expert.rating}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm text-center line-clamp-2 mb-6">
          {expert.bio}
        </p>

        <Link 
          to={`/experts/${expert._id}`}
          className="mt-auto w-full bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-600 dark:hover:bg-blue-600 text-blue-700 dark:text-blue-400 hover:text-white dark:hover:text-white border border-transparent font-medium py-2.5 px-4 rounded-xl transition-colors duration-300 text-center flex items-center justify-center gap-2 group-hover:shadow-md"
        >
          View Profile
        </Link>
      </div>
    </motion.div>
  );
};

export default ExpertCard;
