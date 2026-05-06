import { useState, useRef, useCallback } from 'react';

// Relative path — Vite proxy forwards /api/* to localhost:3001 server-side (no mixed content issue)
const BACKEND_URL = '';

export interface TextToSpeechOptions {
  voiceId?: string; // Voice ID from ElevenLabs
}

export function useTextToSpeech(options: TextToSpeechOptions = {}) {
  const { voiceId = 'Rachel' } = options;
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(
    async (text: string) => {
      try {
        setError(null);
        setIsLoading(true);

        console.log('[v0] TTS request via backend:', text.substring(0, 50) + '...');

        // Call backend TTS endpoint
        const response = await fetch(
          `${BACKEND_URL}/api/elevenlabs/tts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text,
              voiceId,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `TTS error: ${errorData.error || response.statusText}`
          );
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        if (!audioRef.current) {
          audioRef.current = new Audio();
        }

        audioRef.current.src = audioUrl;
        audioRef.current.onplay = () => setIsSpeaking(true);
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        audioRef.current.onerror = () => {
          setError('Failed to play audio');
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        await audioRef.current.play();
        setIsLoading(false);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to generate speech';
        setError(message);
        setIsLoading(false);
        console.error('[v0] TTS error:', err);
      }
    },
    [voiceId]
  );

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
    error,
  };
}
