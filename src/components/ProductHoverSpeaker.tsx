import { Volume2, VolumeX, Loader } from 'lucide-react';
import { ReactNode } from 'react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface ProductHoverSpeakerProps {
  children: ReactNode;
  productName: string;
  productDescription: string;
  productPrice: number;
}

export default function ProductHoverSpeaker({
  children,
  productName,
  productDescription,
  productPrice,
}: ProductHoverSpeakerProps) {
  const { speak, stop, isSpeaking, isLoading } = useTextToSpeech();

  const fullDescription = `${productName}. Price: $${productPrice}. ${productDescription}`;

  const handleSpeak = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSpeaking) {
      stop();
    } else {
      speak(fullDescription);
    }
  };

  return (
    <div className="relative">
      {children}

      {/* Always visible speaker button */}
      <button
        onClick={handleSpeak}
        disabled={isLoading}
        className={`absolute top-4 right-4 z-20 p-2 neo-border transition-all duration-200 ${
          isSpeaking
            ? 'bg-electric-pink text-white neo-shadow'
            : isLoading
              ? 'bg-gray-200 text-gray-500 cursor-wait'
              : 'bg-white text-black hover:bg-electric-pink hover:text-white neo-shadow'
        }`}
        title={isSpeaking ? 'Stop listening' : 'Listen to product details'}
        aria-label={isSpeaking ? 'Stop listening' : 'Listen to product details'}
      >
        {isLoading ? (
          <Loader size={18} className="animate-spin" />
        ) : isSpeaking ? (
          <VolumeX size={18} />
        ) : (
          <Volume2 size={18} />
        )}
      </button>
    </div>
  );
}
