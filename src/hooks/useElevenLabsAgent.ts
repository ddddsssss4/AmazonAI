import { useState, useRef, useCallback } from 'react';

export interface ParsedFilters {
  category?: string[];
  priceRange?: string;
  fabric?: string;
  color?: string;
}

const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID;

export function useElevenLabsAgent() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startListening = useCallback(async () => {
    try {
      setError(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start recording';
      setError(message);
      console.error('[v0] Error starting recording:', err);
    }
  }, []);

  const stopListening = useCallback(
    async (onFiltersDetected?: (filters: ParsedFilters) => void) => {
      try {
        setIsListening(false);
        setIsProcessing(true);

        if (!mediaRecorderRef.current) {
          throw new Error('No recorder found');
        }

        await new Promise((resolve) => {
          mediaRecorderRef.current!.onstop = resolve;
          mediaRecorderRef.current!.stop();
        });

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        console.log('[v0] Audio blob created:', audioBlob.size, 'bytes');

        // Convert audio to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);

        reader.onload = async () => {
          try {
            const base64Audio = (reader.result as string).split(',')[1];

            // Call ElevenLabs Conversational API
            const response = await fetch('https://api.elevenlabs.io/v1/conversational/message', {
              method: 'POST',
              headers: {
                'xi-api-key': API_KEY,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                agent_id: AGENT_ID,
                message: base64Audio,
                mode: 'speech',
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(
                `API error: ${errorData.message || response.statusText}`
              );
            }

            const data = await response.json();
            console.log('[v0] Agent response:', data);

            // Parse the agent response to extract filters
            const filters = parseAgentResponse(data.text || data.message);
            if (onFiltersDetected) {
              onFiltersDetected(filters);
            }
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to process audio';
            setError(message);
            console.error('[v0] Error processing audio:', err);
          } finally {
            setIsProcessing(false);
          }
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to stop recording';
        setError(message);
        setIsProcessing(false);
        console.error('[v0] Error stopping recording:', err);
      }
    },
    []
  );

  return {
    isListening,
    isProcessing,
    error,
    startListening,
    stopListening,
  };
}

// Parse natural language response from agent into structured filters
function parseAgentResponse(text: string): ParsedFilters {
  const filters: ParsedFilters = {};

  // Convert to lowercase for easier matching
  const lower = text.toLowerCase();

  // Extract category/product type
  const categoryMatch = lower.match(
    /(?:show|find|looking for)\s+(?:me\s+)?(?:a\s+)?([a-z\s-]+?)(?:\s+with|\s+in|\s+under|\s+price|\s+made|$)/i
  );
  if (categoryMatch) {
    filters.category = [categoryMatch[1].trim()];
  }

  // Extract price ranges
  if (lower.includes('under') || lower.includes('less than')) {
    const priceMatch = lower.match(/(?:under|less than|below)\s*\$?(\d+)/i);
    if (priceMatch) {
      filters.priceRange = `0-${priceMatch[1]}`;
    }
  } else if (lower.includes('over') || lower.includes('more than')) {
    const priceMatch = lower.match(/(?:over|more than|above)\s*\$?(\d+)/i);
    if (priceMatch) {
      filters.priceRange = `${priceMatch[1]}-999`;
    }
  }

  // Extract fabric/material type
  const fabricMatch = lower.match(
    /(?:fabric|material|made of|in|with)\s+([a-z\s-]+?)(?:\s+fabric|\s+material|,|$)/i
  );
  if (fabricMatch) {
    filters.fabric = fabricMatch[1].trim();
  }

  // Extract color
  const colorMatch = lower.match(
    /(?:color|in|with)\s+([a-z]+?)(?:\s+color|,|$)/i
  );
  if (colorMatch) {
    filters.color = colorMatch[1].trim();
  }

  console.log('[v0] Parsed filters:', filters);
  return filters;
}
