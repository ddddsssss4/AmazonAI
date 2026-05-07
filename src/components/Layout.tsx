import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Mic, MicOff } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { useAgent } from '../contexts/ElevenLabsAgentContext';

export default function Layout() {
  const { isListening, stopListening } = useAgent();
  const navigate = useNavigate();
  const location = useLocation();
  const isOnShopPage = location.pathname === '/shop';

  return (
    <div className="min-h-screen flex flex-col selection:bg-electric-pink selection:text-white">
      <Header />
      <div className="flex-grow flex flex-col">
        <Outlet />
      </div>
      <Footer />
      
      {/* Global Voice Assistant Status - shown when connected and not on Shop page */}
      {isListening && !isOnShopPage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-white border-2 border-black p-3 neo-shadow">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="font-mono text-xs font-bold uppercase">Voice Active</span>
          <button
            onClick={() => navigate('/shop')}
            className="ml-2 px-2 py-1 bg-electric-pink text-white font-mono text-xs uppercase hover:bg-black transition-colors"
          >
            Go to Shop
          </button>
          <button
            onClick={stopListening}
            className="p-1 hover:bg-red-100 rounded transition-colors"
            title="Disconnect"
          >
            <MicOff size={16} className="text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
}
