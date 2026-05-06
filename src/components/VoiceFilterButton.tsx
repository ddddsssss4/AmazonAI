import { Mic, Square } from 'lucide-react';
import { useElevenLabsAgent, type ParsedFilters } from '../hooks/useElevenLabsAgent';

interface VoiceFilterButtonProps {
  onFiltersDetected: (filters: ParsedFilters) => void;
}

export default function VoiceFilterButton({ onFiltersDetected }: VoiceFilterButtonProps) {
  const { isListening, isProcessing, error, startListening, stopListening } = useElevenLabsAgent();

  const handleMouseDown = async () => {
    await startListening();
  };

  const handleMouseUp = async () => {
    await stopListening(onFiltersDetected);
  };

  const handleTouchStart = async () => {
    await startListening();
  };

  const handleTouchEnd = async () => {
    await stopListening(onFiltersDetected);
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
      
      {error && (
        <div className="bg-red-50 border-2 border-red-300 p-3 font-mono text-sm text-red-700">
          {error}
        </div>
      )}
      
      <p className="font-mono text-xs text-gray-600 text-center">
        {isListening 
          ? 'Say: "Show me t-shirts with cotton fabric under $50"'
          : 'Hold to speak your filter preferences'}
      </p>
    </div>
  );
}
