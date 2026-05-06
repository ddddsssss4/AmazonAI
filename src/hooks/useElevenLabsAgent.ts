import { useState, useRef, useCallback } from 'react';
import { Conversation } from '@elevenlabs/client';

export interface ParsedFilters {
  category?: string[];
  priceRange?: string;
  fabric?: string;
  color?: string;
}

// Relative path — Vite proxy forwards /api/* to localhost:3001 server-side (no mixed content issue)
const BACKEND_URL = '';

export function useElevenLabsAgent() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationRef = useRef<Awaited<ReturnType<typeof Conversation.startSession>> | null>(null);

  const startListening = useCallback(async (onFiltersDetected?: (filters: ParsedFilters) => void) => {
    try {
      setError(null);
      setIsListening(true);
      console.log('[v0] Requesting signed URL from backend via Vite proxy...');

      // Fetch signed URL from backend — goes through Vite proxy (server-side HTTP, no CORS/mixed-content issue)
      const response = await fetch(`${BACKEND_URL}/api/elevenlabs/signed-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to get signed URL: ${text}`);
      }

      const { signedUrl } = await response.json();
      console.log('[v0] Signed URL received, starting ElevenLabs conversation session...');

      // Start ElevenLabs conversation via WebSocket (WSS — HTTPS-safe, no mixed content)
      const conversation = await Conversation.startSession({
        signedUrl,
        onMessage: ({ message, source }) => {
          console.log('[v0] Agent message:', source, message);
          if (source === 'agent' && message) {
            const filters = parseAgentResponse(message);
            console.log('[v0] Parsed filters from agent:', filters);
            if (onFiltersDetected && Object.keys(filters).length > 0) {
              onFiltersDetected(filters);
            }
          }
        },
        onError: (err) => {
          console.error('[v0] Conversation error:', err);
          setError(typeof err === 'string' ? err : 'Conversation error');
          setIsListening(false);
        },
        onStatusChange: ({ status }) => {
          console.log('[v0] Conversation status:', status);
          if (status === 'connected') {
            setIsListening(true);
            setIsProcessing(false);
          } else if (status === 'disconnected') {
            setIsListening(false);
            setIsProcessing(false);
          }
        },
        onModeChange: ({ mode }) => {
          console.log('[v0] Mode changed:', mode);
          setIsProcessing(mode === 'thinking' || mode === 'speaking');
        },
      });

      conversationRef.current = conversation;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start voice session';
      setError(message);
      setIsListening(false);
      setIsProcessing(false);
      console.error('[v0] Error starting conversation:', err);
    }
  }, []);

  const stopListening = useCallback(async (onFiltersDetected?: (filters: ParsedFilters) => void) => {
    try {
      setIsListening(false);
      if (conversationRef.current) {
        console.log('[v0] Ending ElevenLabs conversation session...');
        await conversationRef.current.endSession();
        conversationRef.current = null;
      }
    } catch (err) {
      console.error('[v0] Error stopping conversation:', err);
    } finally {
      setIsProcessing(false);
    }
  }, []);

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
  const lower = text.toLowerCase();

  // Extract category/product type
  const categoryKeywords = ['keyboard', 'keyboards', 'audio', 'headphones', 'mouse', 'mice', 'charger', 'power'];
  const foundCategories = categoryKeywords.filter(k => lower.includes(k));
  if (foundCategories.length > 0) {
    filters.category = foundCategories.map(c =>
      c === 'keyboards' ? 'Keyboards' :
      c === 'keyboard' ? 'Keyboards' :
      c === 'headphones' ? 'Audio' :
      c === 'audio' ? 'Audio' :
      c === 'mouse' || c === 'mice' ? 'Mice' :
      c === 'charger' || c === 'power' ? 'Power' : c
    );
  }

  // Extract price ranges
  if (lower.includes('under') || lower.includes('less than') || lower.includes('below')) {
    const priceMatch = lower.match(/(?:under|less than|below)\s*\$?(\d+)/i);
    if (priceMatch) filters.priceRange = `0-${priceMatch[1]}`;
  } else if (lower.includes('over') || lower.includes('more than') || lower.includes('above')) {
    const priceMatch = lower.match(/(?:over|more than|above)\s*\$?(\d+)/i);
    if (priceMatch) filters.priceRange = `${priceMatch[1]}-999`;
  } else if (lower.includes('between')) {
    const priceMatch = lower.match(/between\s*\$?(\d+)\s*and\s*\$?(\d+)/i);
    if (priceMatch) filters.priceRange = `${priceMatch[1]}-${priceMatch[2]}`;
  }

  // Extract fabric/material
  const fabricMatch = lower.match(/(?:cotton|polyester|wool|linen|silk|denim|leather)/i);
  if (fabricMatch) filters.fabric = fabricMatch[0];

  // Extract color
  const colorMatch = lower.match(/(?:red|blue|green|black|white|grey|gray|navy|pink|yellow|purple|orange)/i);
  if (colorMatch) filters.color = colorMatch[0];

  return filters;
}
