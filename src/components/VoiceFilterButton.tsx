import { Mic, Square, Zap } from 'lucide-react';
import { useElevenLabsAgent, type ParsedFilters, type AgentToolCallbacks } from '../hooks/useElevenLabsAgent';

interface VoiceFilterButtonProps {
  onFiltersDetected: (filters: ParsedFilters) => void;
  onClearFilters: () => void;
  onAddToCart?: (productId: number, quantity: number) => void;
  onNavigateToProduct?: (productId: number) => void;
  getFilteredProductCount?: () => number;
}

export default function VoiceFilterButton({ 
  onFiltersDetected, 
  onClearFilters,
  onAddToCart,
  onNavigateToProduct,
  getFilteredProductCount,
}: VoiceFilterButtonProps) {
  const callbacks: AgentToolCallbacks = {
    onFiltersDetected,
    onClearFilters,
    onAddToCart,
    onNavigateToProduct,
    getFilteredProductCount,
  };

  const { isListening, isProcessing, error, lastAction, startListening, stopListening } = useElevenLabsAgent(callbacks);

  const handleMouseDown = async () => {
    await startListening();
  };

  const handleMouseUp = async () => {
    await stopListening();
  };

  const handleTouchStart = async () => {
    await startListening();
  };

  const handleTouchEnd = async () => {
    await stopListening();
  };

  return (
    <div className="space-y-3">
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        disabled={isProcessing}
        className={`w-full font-mono font-bold px-4 py-3 uppercase border-2 border-black flex items-center justify-center gap-2 transition-all duration-200 ${
          isListening
            ? 'bg-electric-pink text-white border-electric-pink neo-shadow-lg scale-105'
            : isProcessing
              ? 'bg-gray-300 text-black border-gray-300 cursor-wait'
              : 'bg-white text-black hover:bg-black hover:text-white neo-button'
        }`}
        title={isListening ? 'Release to stop listening' : 'Press and hold to speak'}
      >
        {isListening ? (
          <>
            <Square size={20} fill="currentColor" />
            Listening...
          </>
        ) : isProcessing ? (
          <>
            <Mic size={20} className="animate-pulse" />
            Processing...
          </>
        ) : (
          <>
            <Mic size={20} />
            Voice Filter
          </>
        )}
      </button>
      
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
                // Parse the JSON from "Filtering: {...}"
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
                  // Force request microphone permission again
                  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                  stream.getTracks().forEach(track => track.stop());
                  // If successful, try starting the listener
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
      
      {/* Help Text */}
      <p className="font-mono text-xs text-gray-500 text-center leading-relaxed">
        {isListening 
          ? 'Listening... speak your request'
          : 'Hold to speak your filter preferences'}
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
