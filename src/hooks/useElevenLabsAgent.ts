import { useState, useRef, useCallback } from 'react';
import { Conversation } from '@elevenlabs/client';
import { getProductById, ALL_PRODUCTS } from '../data/products';

// ── Expanded Filter Interface ──────────────────────────────────────────────────
export interface ParsedFilters {
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
  brands?: string[];
  colours?: string[];
  freeShipping?: boolean;
  minRating?: number;
  minDiscount?: number;
  sortBy?: 'price_low' | 'price_high' | 'rating' | 'discount';
  searchQuery?: string;
}

// ── Tool Callbacks Interface ───────────────────────────────────────────────────
export interface AgentToolCallbacks {
  onFiltersDetected?: (filters: ParsedFilters) => void;
  onClearFilters?: () => void;
  onAddToCart?: (productId: number, quantity: number) => void;
  onNavigateToProduct?: (productId: number) => void;
  getFilteredProductCount?: () => number;
  getFilteredProducts?: () => any[]; // Returns filtered product list for AI context
}

// Relative path — Vite proxy forwards /api/* to localhost:3001 server-side
const BACKEND_URL = '';

export function useElevenLabsAgent(callbacks: AgentToolCallbacks = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const conversationRef = useRef<Awaited<ReturnType<typeof Conversation.startSession>> | null>(null);
  const callbacksRef = useRef(callbacks);
  
  // Keep callbacks ref updated
  callbacksRef.current = callbacks;

  const startListening = useCallback(async () => {
    try {
      setError(null);
      setLastAction(null);
      setIsListening(true);
      console.log('[v0] Requesting signed URL from backend...');

      // Fetch signed URL from backend
      const response = await fetch(`${BACKEND_URL}/api/elevenlabs/signed-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to get signed URL: ${text}`);
      }

      const { signedUrl } = await response.json();
      console.log('[v0] Signed URL received, starting ElevenLabs conversation with client tools...');

      // Start ElevenLabs conversation with client tools
      const conversation = await Conversation.startSession({
        signedUrl,
        
        // ── Client Tools Registration ──────────────────────────────────────
        clientTools: {
          // Tool: Apply shopping filters
          applyFilters: async (params: ParsedFilters) => {
            const debugData = {
              timestamp: new Date().toISOString(),
              action: 'applyFilters',
              incomingParams: JSON.parse(JSON.stringify(params)),
            };
            
            console.log('[v0] Tool called: applyFilters', params);
            setLastAction(`Filtering: ${JSON.stringify(params)}`);
            
            if (callbacksRef.current.onFiltersDetected) {
              callbacksRef.current.onFiltersDetected(params);
            }
            
            const filteredProducts = callbacksRef.current.getFilteredProducts?.() ?? [];
            const count = filteredProducts.length;
            
            debugData.filteredProductCount = count;
            debugData.filteredProducts = filteredProducts.slice(0, 10).map((p: any) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              category: p.category,
              colour: p.colour,
              colours: p.colours
            }));
            
            // Save debug data to localStorage for inspection
            const debugLogs = JSON.parse(localStorage.getItem('voiceFilterDebug') || '[]');
            debugLogs.push(debugData);
            localStorage.setItem('voiceFilterDebug', JSON.stringify(debugLogs.slice(-100))); // Keep last 100
            
            console.log('[v0] Filtered products count:', count);
            console.log('[v0] Filtered products:', filteredProducts);
            console.log('[v0] Debug logs saved to localStorage');
            
            if (count === 0) {
              console.warn('[v0] WARNING: No products found after filtering!');
              console.warn('[v0] Filter params were:', params);
              console.warn('[v0] All products count:', ALL_PRODUCTS.length);
              
              return { 
                success: true, 
                productsFound: 0,
                message: `No products found matching your criteria. Please try adjusting your filters.` 
              };
            }
            
            // Send product details to AI so it can generate meaningful responses
            const productSummary = filteredProducts.slice(0, 5).map((p: any) => ({
              name: p.name,
              price: p.price,
              brand: p.brand,
              category: p.category,
              rating: p.rating
            }));
            
            const responseMessage = `Found ${count} products matching your criteria. Top results include: ${productSummary.map(p => `${p.name} ($${p.price})`).join(', ')}.`;
            
            debugData.responseMessage = responseMessage;
            
            return { 
              success: true, 
              productsFound: count,
              topProducts: productSummary,
              message: responseMessage
            };
          },

          // Tool: Clear all filters
          clearFilters: async () => {
            console.log('[v0] Tool called: clearFilters');
            setLastAction('Cleared all filters');
            
            if (callbacksRef.current.onClearFilters) {
              callbacksRef.current.onClearFilters();
            }
            
            return { 
              success: true, 
              message: `All filters cleared. Showing all ${ALL_PRODUCTS.length} products.` 
            };
          },

          // Tool: Add product to cart
          addToCart: async (params: { productId: number; quantity?: number }) => {
            console.log('[v0] Tool called: addToCart', params);
            const product = getProductById(params.productId);
            
            if (!product) {
              return { success: false, message: 'Product not found' };
            }
            
            const qty = params.quantity ?? 1;
            setLastAction(`Added ${qty}x ${product.name} to cart`);
            
            if (callbacksRef.current.onAddToCart) {
              callbacksRef.current.onAddToCart(params.productId, qty);
            }
            
            return { 
              success: true, 
              message: `Added ${qty} ${product.name} to your cart. Total: $${(product.price * qty).toFixed(2)}` 
            };
          },

          // Tool: Get product details
          getProductDetails: async (params: { productId: number }) => {
            console.log('[v0] Tool called: getProductDetails', params);
            const product = getProductById(params.productId);
            
            if (!product) {
              return { success: false, message: 'Product not found' };
            }
            
            setLastAction(`Showing details for ${product.name}`);
            
            return { 
              success: true, 
              product: {
                id: product.id,
                name: product.name,
                price: product.price,
                description: product.description,
                rating: product.rating,
                brand: product.brand,
                category: product.category,
                freeShipping: product.freeShipping,
                discount: product.discount,
              }
            };
          },

          // Tool: Navigate to product detail page
          navigateToProduct: async (params: { productId: number }) => {
            console.log('[v0] Tool called: navigateToProduct', params);
            const product = getProductById(params.productId);
            
            if (!product) {
              return { success: false, message: 'Product not found' };
            }
            
            setLastAction(`Navigating to ${product.name}`);
            
            if (callbacksRef.current.onNavigateToProduct) {
              callbacksRef.current.onNavigateToProduct(params.productId);
            }
            
            return { 
              success: true, 
              message: `Opening ${product.name} details page.` 
            };
          },
        },

        // ── Event Handlers ───────────────────���─────────────────────────────
        onMessage: ({ message, source }) => {
          console.log('[v0] Agent message:', source, message);
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
      let message = 'Failed to start voice session';
      
      if (err instanceof Error) {
        message = err.message;
        
        // Provide specific guidance for permission errors
        if (message.includes('Permission denied') || message.includes('NotAllowedError')) {
          message = 'Microphone permission denied. Please allow microphone access in your browser settings.';
        } else if (message.includes('NotFoundError')) {
          message = 'No microphone found. Please check your device has a working microphone.';
        } else if (message.includes('NotReadableError')) {
          message = 'Microphone is in use by another application. Please close other apps using the microphone.';
        }
      }
      
      setError(message);
      setIsListening(false);
      setIsProcessing(false);
      console.error('[v0] Error starting conversation:', err);
    }
  }, []);

  const stopListening = useCallback(async () => {
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
    lastAction,
    startListening,
    stopListening,
  };
}
