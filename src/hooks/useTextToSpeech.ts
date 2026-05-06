import { useState, useRef, useCallback } from 'react';

const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

export interface TextToSpeechOptions {
  voiceId?: string; // Default voice ID from ElevenLabs
  model?: string; // 'eleven_monolingual_v1', 'eleven_multilingual_v1', 'eleven_turbo_v2', etc.
}

export function useTextToSpeech(options: TextToSpeechOptions = {}) {
  const { voiceId = 'JBFqnCBsd6RMkjVtLZvb', model = 'eleven_turbo_v2_5' } = options;
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(
    async (text: string) => {
      try {
        setError(null);
        setIsLoading(true);

        console.log('[v0] TTS request for:', text);

        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
          {
            method: 'POST',
            headers: {
              'xi-api-key': API_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text,
              model_id: model,
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
              },
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `TTS error: ${errorData.detail?.message || response.statusText}`
          );
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        if (!audioRef.current) {
          audioRef.current = new Audio();
        }

        audioRef.current.src = audioUrl;
        audioRef.current.onplay = () => setIsSpeaking(true);
        audioRef.current.onended = () => setIsSpeaking(false);
        audioRef.current.onerror = () => {
          setError('Failed to play audio');
          setIsSpeaking(false);
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
    [voiceId, model]
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
