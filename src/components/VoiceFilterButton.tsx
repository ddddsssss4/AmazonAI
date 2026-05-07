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
        <div className="bg-green-50 border-2 border-green-400 p-2 font-mono text-xs text-green-800 flex items-center gap-2">
          <Zap size={14} className="text-green-600" />
          {lastAction}
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 p-3 font-mono text-sm text-red-700">
          {error}
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
