const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col animate-pulse">
          <div className="p-6 flex flex-col items-center flex-grow">
            <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            
            <div className="w-full flex justify-center space-x-2 mb-4">
               <div className="h-4 bg-gray-200 rounded w-1/4"></div>
               <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            
            <div className="w-full h-10 bg-gray-200 rounded-lg mt-auto"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
