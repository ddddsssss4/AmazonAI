import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Mic, MicOff, VideoIcon } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { useAgent } from '../contexts/ElevenLabsAgentContext';

export default function Layout() {
  const { isListening, stopListening, registerNavigate } = useAgent();
  const navigate = useNavigate();
  const location = useLocation();

  // Give the agent access to navigate so it can route the user programmatically
  useEffect(() => {
    registerNavigate(navigate);
  }, [navigate, registerNavigate]);
  const isOnShopPage = location.pathname === '/shop';

  return (
    <div className="min-h-screen flex flex-col selection:bg-electric-pink selection:text-white">
      <Header />

      {/* No Credits Banner */}
      <div className="w-full bg-black text-white border-b-4 border-electric-pink px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-electric-pink shrink-0"></span>
          <p className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wide">
            ElevenLabs credits exhausted &mdash; Voice agent is offline for this demo
          </p>
        </div>
        <a
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 bg-electric-pink text-white font-mono text-xs font-black uppercase border-2 border-electric-pink hover:bg-white hover:text-black transition-colors"
        >
          <VideoIcon size={13} />
          Watch Demo
        </a>
      </div>

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
