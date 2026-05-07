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

// Helper function to find product by name (fuzzy matching)
const findProductByName = (searchTerm: string) => {
  const term = searchTerm.toLowerCase();
  
  // Try exact/partial name match first
  let product = ALL_PRODUCTS.find(p => 
    p.name.toLowerCase().includes(term) ||
    term.includes(p.name.toLowerCase())
  );
  
  if (product) return product;
  
  // Try matching category (e.g., "keyboard" matches "Keyboards")
  product = ALL_PRODUCTS.find(p => 
    p.category.toLowerCase().includes(term) ||
    term.includes(p.category.toLowerCase().replace(/s$/, ''))
  );
  
  if (product) return product;
  
  // Try word-by-word matching
  const words = term.split(' ').filter(w => w.length > 2);
  product = ALL_PRODUCTS.find(p => 
    words.some(word => 
      p.name.toLowerCase().includes(word) ||
      p.category.toLowerCase().includes(word) ||
      p.brand.toLowerCase().includes(word) ||
      p.colour?.toLowerCase().includes(word)
    )
  );
  
  return product || null;
};

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
      
      // Explicitly request microphone permission first
      console.log('[v0] Requesting microphone permission...');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the stream immediately - we just needed to get permission
        stream.getTracks().forEach(track => track.stop());
        console.log('[v0] Microphone permission granted');
      } catch (micError) {
        console.error('[v0] Microphone permission error:', micError);
        if (micError instanceof Error) {
          if (micError.name === 'NotAllowedError' || micError.name === 'PermissionDeniedError') {
            throw new Error('Permission denied');
          } else if (micError.name === 'NotFoundError') {
            throw new Error('NotFoundError');
          } else if (micError.name === 'NotReadableError') {
            throw new Error('NotReadableError');
          }
        }
        throw micError;
      }
      
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
            const debugData: any = {
              timestamp: new Date().toISOString(),
              action: 'applyFilters',
              incomingParams: JSON.parse(JSON.stringify(params)),
            };
            
            console.log('[v0] Tool called: applyFilters', params);
            setLastAction(`Filtering: ${JSON.stringify(params)}`);
            
            // Filter products DIRECTLY using incoming params (React state is async!)
            const categories = params.categories 
              ? (Array.isArray(params.categories) ? params.categories : [params.categories])
              : [];
            const brands = params.brands
              ? (Array.isArray(params.brands) ? params.brands : [params.brands])
              : [];
            const colours = params.colours
              ? (Array.isArray(params.colours) ? params.colours : [params.colours])
              : [];
            
            const filteredProducts = ALL_PRODUCTS.filter(p => {
              if (categories.length && !categories.includes(p.category)) return false;
              if (brands.length && !brands.includes(p.brand)) return false;
              if (colours.length && !colours.includes(p.colour)) return false;
              if (params.freeShipping && !p.freeShipping) return false;
              if (params.minRating && p.rating < params.minRating) return false;
              if (params.minDiscount && p.discount < params.minDiscount) return false;
              if (params.priceMin !== undefined && p.price < params.priceMin) return false;
              if (params.priceMax !== undefined && p.price > params.priceMax) return false;
              return true;
            });
            
            const count = filteredProducts.length;
            
            console.log('[v0] Direct filter result:', { 
              categories, brands, colours, 
              priceMin: params.priceMin, 
              priceMax: params.priceMax,
              resultCount: count 
            });
            
            // Now update React state for UI (this is async but we already have our result)
            if (callbacksRef.current.onFiltersDetected) {
              callbacksRef.current.onFiltersDetected(params);
            }
            
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
          addToCart: async (params: { productName: string; quantity?: number }) => {
            console.log('[v0] Tool called: addToCart', params);
            
            // Find product by name
            const product = findProductByName(params.productName);
            
            if (!product) {
              return { 
                success: false, 
                message: `Could not find a product matching "${params.productName}". Try searching for products first.` 
              };
            }
            
            const qty = params.quantity ?? 1;
            setLastAction(`Added ${qty}x ${product.name} to cart`);
            
            if (callbacksRef.current.onAddToCart) {
              callbacksRef.current.onAddToCart(product.id, qty);
            }
            
            return { 
              success: true, 
              message: `Added ${qty} ${product.name} to your cart. Total: $${(product.price * qty).toFixed(2)}` 
            };
          },

          // Tool: Get product details
          getProductDetails: async (params: { productName: string }) => {
            console.log('[v0] Tool called: getProductDetails', params);
            
            // Find product by name
            const product = findProductByName(params.productName);
            
            if (!product) {
              return { 
                success: false, 
                message: `Could not find a product matching "${params.productName}". Try searching for products first.` 
              };
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
          navigateToProduct: async (params: { productName: string }) => {
            console.log('[v0] Tool called: navigateToProduct', params);
            
            // Find product by name using helper
            const product = findProductByName(params.productName);
            
            if (!product) {
              return { 
                success: false, 
                message: `Could not find a product matching "${params.productName}". Try searching for products first.` 
              };
            }
            
            setLastAction(`Navigating to ${product.name}`);
            
            if (callbacksRef.current.onNavigateToProduct) {
              callbacksRef.current.onNavigateToProduct(product.id);
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
