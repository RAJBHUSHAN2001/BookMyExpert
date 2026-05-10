import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ExpertList from './pages/ExpertList';
import ExpertDetail from './pages/ExpertDetail';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            className: 'dark:bg-slate-800 dark:text-white',
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<ExpertList />} />
            <Route path="/experts/:id" element={<ExpertDetail />} />
            <Route path="/book/:expertId" element={<Booking />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
