import { useEffect } from 'react';
import { Mic, MicOff, Zap } from 'lucide-react';
import { useAgent, type AgentToolCallbacks } from '../contexts/ElevenLabsAgentContext';

interface VoiceFilterButtonProps {
  onFiltersDetected: (filters: any) => void;
  onClearFilters: () => void;
  onAddToCart?: (productId: number, quantity: number) => void;
  onNavigateToProduct?: (productId: number) => void;
  getFilteredProductCount?: () => number;
  getFilteredProducts?: () => any[];
}

export default function VoiceFilterButton({ 
  onFiltersDetected, 
  onClearFilters,
  onAddToCart,
  onNavigateToProduct,
  getFilteredProductCount,
  getFilteredProducts,
}: VoiceFilterButtonProps) {
  const { 
    isListening, 
    isProcessing, 
    error, 
    lastAction, 
    startListening, 
    stopListening,
    registerCallbacks,
    clearError
  } = useAgent();

  // Register callbacks when component mounts or callbacks change
  useEffect(() => {
    const callbacks: AgentToolCallbacks = {
      onFiltersDetected,
      onClearFilters,
      onAddToCart,
      onNavigateToProduct,
      getFilteredProductCount,
      getFilteredProducts,
    };
    registerCallbacks(callbacks);
  }, [onFiltersDetected, onClearFilters, onAddToCart, onNavigateToProduct, getFilteredProductCount, getFilteredProducts, registerCallbacks]);

  const handleToggle = async () => {
    if (isListening) {
      await stopListening();
    } else {
      clearError();
      await startListening();
    }
  };

  return (
    <div className="space-y-3">
      {/* Connection Status Indicator */}
      {isListening && (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-100 border-2 border-green-500 rounded-sm">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="font-mono text-xs text-green-700 font-bold uppercase">Agent Connected</span>
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={handleToggle}
        disabled={isProcessing}
        className={`w-full font-mono font-bold px-4 py-3 uppercase border-2 border-black flex items-center justify-center gap-2 transition-all duration-200 ${
          isListening
            ? 'bg-electric-pink text-white border-electric-pink neo-shadow-lg'
            : isProcessing
              ? 'bg-gray-300 text-black border-gray-300 cursor-wait'
              : 'bg-white text-black hover:bg-black hover:text-white neo-button'
        }`}
        title={isListening ? 'Click to disconnect' : 'Click to start voice assistant'}
      >
        {isListening ? (
          <>
            <Mic size={20} className="animate-pulse" />
            Connected - Listening
          </>
        ) : isProcessing ? (
          <>
            <Mic size={20} className="animate-pulse" />
            Connecting...
          </>
        ) : (
          <>
            <Mic size={20} />
            Voice Filter
          </>
        )}
      </button>

      {/* Disconnect Button - only shown when connected */}
      {isListening && (
        <button
          onClick={stopListening}
          className="w-full font-mono font-bold px-4 py-2 uppercase border-2 border-red-500 bg-red-50 text-red-600 flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all duration-200"
        >
          <MicOff size={18} />
          Disconnect
        </button>
      )}
      
      {/* Last Action Feedback */}
      {lastAction && (
        <div className="bg-green-50 border-2 border-green-400 p-2 font-mono text-xs text-green-800">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-green-600 flex-shrink-0" />
            <span className="font-bold">Filters Applied</span>
          </div>
          <div className="pl-5 space-y-0.5">
            {(() => {
              try {
                const jsonStr = lastAction.replace('Filtering: ', '');
                const filters = JSON.parse(jsonStr);
                const items: string[] = [];
                
                if (filters.categories) {
                  const cats = Array.isArray(filters.categories) ? filters.categories : [filters.categories];
                  items.push(`Category: ${cats.join(', ')}`);
                }
                if (filters.brands) {
                  const brands = Array.isArray(filters.brands) ? filters.brands : [filters.brands];
                  items.push(`Brand: ${brands.join(', ')}`);
                }
                if (filters.colours) {
                  const colors = Array.isArray(filters.colours) ? filters.colours : [filters.colours];
                  items.push(`Color: ${colors.join(', ')}`);
                }
                if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
                  const min = filters.priceMin ?? 0;
                  const max = filters.priceMax ?? '∞';
                  items.push(`Price: $${min} - $${max}`);
                }
                if (filters.freeShipping) items.push('Free Shipping');
                if (filters.minRating) items.push(`Rating: ${filters.minRating}+ stars`);
                
                return items.length > 0 
                  ? items.map((item, i) => <div key={i}>{item}</div>)
                  : <div>{lastAction}</div>;
              } catch {
                return <div>{lastAction}</div>;
              }
            })()}
          </div>
        </div>
      )}
      
      {/* Error Display with Retry Button */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 p-3 font-mono text-sm text-red-700">
          <p className="mb-2">{error}</p>
          {error.toLowerCase().includes('microphone') && (
            <button
              onClick={async () => {
                try {
                  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                  stream.getTracks().forEach(track => track.stop());
                  clearError();
                  await startListening();
                } catch (e) {
                  console.error('[v0] Retry permission failed:', e);
                }
              }}
              className="w-full mt-2 px-3 py-2 bg-red-600 text-white font-bold text-xs uppercase hover:bg-red-700 transition-colors"
            >
              Request Microphone Permission
            </button>
          )}
        </div>
      )}
      
      {/* Status Text */}
      <p className="font-mono text-xs text-gray-500 text-center leading-relaxed">
        {isListening 
          ? 'Voice assistant connected. Speak naturally to filter products.'
          : 'Click to connect voice assistant'}
      </p>

      {/* Example Commands */}
      {!isListening && !isProcessing && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="font-mono text-[10px] text-gray-400 uppercase tracking-wider mb-1">Try saying:</p>
          <ul className="font-mono text-[11px] text-gray-500 space-y-0.5">
            <li>"Show me black keyboards under $150"</li>
            <li>"Find dresses with free shipping"</li>
            <li>"Clear all filters"</li>
          </ul>
        </div>
      )}
    </div>
  );
}
