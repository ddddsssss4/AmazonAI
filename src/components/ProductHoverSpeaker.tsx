import { Volume2, VolumeX } from 'lucide-react';
import { ReactNode, useState } from 'react';
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
  const [showSpeaker, setShowSpeaker] = useState(false);
  const { speak, stop, isSpeaking, isLoading } = useTextToSpeech();

  const handleMouseEnter = () => {
    setShowSpeaker(true);
  };

  const handleMouseLeave = () => {
    setShowSpeaker(false);
    if (isSpeaking) {
      stop();
    }
  };

  const fullDescription = `${productName}. Price: $${productPrice}. ${productDescription}`;

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      stop();
    } else {
      speak(fullDescription);
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative group"
    >
      {children}

      {showSpeaker && (
        <button
          onClick={handleSpeak}
          disabled={isLoading}
          className={`absolute top-4 right-4 z-20 p-2 rounded-full transition-all duration-200 ${
            isSpeaking
              ? 'bg-electric-pink text-white scale-110'
              : isLoading
                ? 'bg-gray-400 text-white cursor-wait'
                : 'bg-white text-black border-2 border-black hover:bg-electric-pink hover:text-white hover:border-electric-pink'
          }`}
          title={isSpeaking ? 'Stop' : 'Speak product details'}
        >
          {isSpeaking ? (
            <VolumeX size={20} />
          ) : (
            <Volume2 size={20} />
          )}
        </button>
      )}
    </div>
  );
}
