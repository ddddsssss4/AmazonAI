import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from 'react';
import { Conversation } from '@elevenlabs/client';
import { getProductById, ALL_PRODUCTS } from '../data/products';
import { type ParsedFilters, type AgentToolCallbacks } from '../hooks/useElevenLabsAgent';
import { useCart } from './CartContext';

// Re-export types for convenience
export type { ParsedFilters, AgentToolCallbacks };

interface AgentState {
  isListening: boolean;
  isProcessing: boolean;
  error: string | null;
  lastAction: string | null;
}

interface AgentContextType extends AgentState {
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  registerCallbacks: (callbacks: AgentToolCallbacks) => void;
  clearError: () => void;
}

const AgentContext = createContext<AgentContextType | null>(null);

const BACKEND_URL = '';

// Helper function to find ALL products matching a search term (fuzzy matching)
const findProductsByName = (searchTerm: string) => {
  const term = searchTerm.toLowerCase();
  const words = term.split(' ').filter(w => w.length > 2);
  
  const scored = ALL_PRODUCTS.map(p => {
    let score = 0;
    const name = p.name.toLowerCase();
    const category = p.category.toLowerCase();
    const brand = p.brand.toLowerCase();
    const colour = p.colour?.toLowerCase() || '';
    
    if (name === term) score += 100;
    else if (name.includes(term)) score += 50;
    else if (term.includes(name)) score += 40;
    
    if (category.includes(term) || term.includes(category.replace(/s$/, ''))) score += 30;
    
    words.forEach(word => {
      if (name.includes(word)) score += 20;
      if (category.includes(word)) score += 15;
      if (brand.includes(word)) score += 10;
      if (colour.includes(word)) score += 10;
    });
    
    return { product: p, score };
  });
  
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.product);
};

export function ElevenLabsAgentProvider({ children }: { children: ReactNode }) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const { addToCart: cartAddToCart } = useCart();
  
  const conversationRef = useRef<Awaited<ReturnType<typeof Conversation.startSession>> | null>(null);
  const callbacksRef = useRef<AgentToolCallbacks>({});
  // Track whether the disconnect was intentional (user clicked disconnect)
  const intentionalDisconnectRef = useRef(false);

  // Register callbacks from components (e.g., Shop page)
  const registerCallbacks = useCallback((callbacks: AgentToolCallbacks) => {
    callbacksRef.current = { ...callbacksRef.current, ...callbacks };
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const startListening = useCallback(async () => {
    // If already connected with an active session, do nothing
    if (conversationRef.current) {
      console.log('[v0] Already connected to agent');
      setIsListening(true); // Re-sync UI state in case it got out of sync
      return;
    }

    try {
      setError(null);
      setLastAction(null);
      setIsListening(true);
      
      // Check permission state
      let permissionState = 'prompt';
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        permissionState = permissionStatus.state;
        console.log('[v0] Current microphone permission state:', permissionState);
      } catch {
        console.log('[v0] Could not query permission state, will request directly');
      }
      
      // Request microphone permission
      console.log('[v0] Requesting microphone access...');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        console.log('[v0] Microphone access granted');
      } catch (micError) {
        console.error('[v0] Microphone access error:', micError);
        
        if (micError instanceof Error) {
          if (micError.name === 'NotAllowedError' || micError.name === 'PermissionDeniedError') {
            const isBlocked = permissionState === 'denied';
            if (isBlocked) {
              throw new Error('Microphone is blocked. Click the lock/camera icon in your browser address bar and allow microphone access, then try again.');
            } else {
              throw new Error('Microphone access was denied. Please click the Voice Filter button again and allow microphone access when prompted.');
            }
          } else if (micError.name === 'NotFoundError') {
            throw new Error('No microphone found. Please connect a microphone and try again.');
          } else if (micError.name === 'NotReadableError') {
            throw new Error('Microphone is busy. Please close other apps using the microphone and try again.');
          }
        }
        throw micError;
      }
      
      console.log('[v0] Requesting signed URL from backend...');

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

      const conversation = await Conversation.startSession({
        signedUrl,
        
        clientTools: {
          applyFilters: async (params: ParsedFilters) => {
            const debugData: any = {
              timestamp: new Date().toISOString(),
              action: 'applyFilters',
              incomingParams: JSON.parse(JSON.stringify(params)),
            };
            
            console.log('[v0] Tool called: applyFilters', params);
            setLastAction(`Filtering: ${JSON.stringify(params)}`);
            
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
            
            debugData.filteredProductCount = count;
            debugData.filteredProducts = filteredProducts.slice(0, 10).map((p: any) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              category: p.category,
              colour: p.colour,
              colours: p.colours
            }));

            const debugLogs = JSON.parse(localStorage.getItem('voiceFilterDebug') || '[]');
            debugLogs.push(debugData);
            localStorage.setItem('voiceFilterDebug', JSON.stringify(debugLogs.slice(-100)));

            console.log('[v0] Direct filter result:', { 
              categories, brands, colours, 
              priceMin: params.priceMin, 
              priceMax: params.priceMax,
              resultCount: count 
            });
            
            // Call registered callback
            if (callbacksRef.current.onFiltersDetected) {
              callbacksRef.current.onFiltersDetected(params);
            }
            
            if (count === 0) {
              console.warn('[v0] WARNING: No products found after filtering!');
              return { 
                success: true, 
                productsFound: 0,
                message: `No products found matching your criteria. Please try adjusting your filters.` 
              };
            }
            
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

          clearFilters: async () => {
            console.log('[v0] Tool called: clearFilters');
            setLastAction('Filters cleared');
            
            if (callbacksRef.current.onClearFilters) {
              callbacksRef.current.onClearFilters();
            }
            
            return { success: true, message: 'All filters cleared.' };
          },

          addToCart: async (params: { productName: string; quantity?: number }) => {
            console.log('[v0] Tool called: addToCart', params);
            
            const matches = findProductsByName(params.productName);
            
            if (matches.length === 0) {
              return { 
                success: false, 
                message: `Could not find a product matching "${params.productName}". Try searching for products first.` 
              };
            }
            
            if (matches.length > 1) {
              const options = matches.slice(0, 5).map(p => 
                `${p.name} by ${p.brand} ($${p.price})`
              );
              return {
                success: false,
                multipleMatches: true,
                count: matches.length,
                options: options,
                message: `Found ${matches.length} products matching "${params.productName}". Which one would you like to add? Options: ${options.join(', ')}`
              };
            }
            
            const product = matches[0];
            const qty = params.quantity ?? 1;
            setLastAction(`Added ${qty}x ${product.name} to cart`);
            
            // Add directly to cart context
            cartAddToCart(product, qty);
            
            // Also call optional UI callback (e.g. for showing toast in Shop)
            if (callbacksRef.current.onAddToCart) {
              callbacksRef.current.onAddToCart(product.id, qty);
            }
            
            const effectivePrice = product.discount > 0
              ? product.price * (1 - product.discount / 100)
              : product.price;
            
            return { 
              success: true, 
              message: `Added ${qty}x ${product.name} to your cart. Item total: $${(effectivePrice * qty).toFixed(2)}. Go to /cart to checkout.` 
            };
          },

          getProductDetails: async (params: { productName: string }) => {
            console.log('[v0] Tool called: getProductDetails', params);
            
            const matches = findProductsByName(params.productName);
            
            if (matches.length === 0) {
              return { 
                success: false, 
                message: `Could not find a product matching "${params.productName}". Try searching for products first.` 
              };
            }
            
            if (matches.length > 1) {
              const products = matches.slice(0, 5).map(p => ({
                id: p.id,
                name: p.name,
                price: p.price,
                brand: p.brand,
                rating: p.rating,
                colour: p.colour
              }));
              return {
                success: true,
                multipleMatches: true,
                count: matches.length,
                products: products,
                message: `Found ${matches.length} products matching "${params.productName}".`
              };
            }
            
            const product = matches[0];
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

          navigateToProduct: async (params: { productName: string }) => {
            console.log('[v0] Tool called: navigateToProduct', params);
            
            const matches = findProductsByName(params.productName);
            
            if (matches.length === 0) {
              return { 
                success: false, 
                message: `Could not find a product matching "${params.productName}". Try searching for products first.` 
              };
            }
            
            if (matches.length > 1) {
              const options = matches.slice(0, 5).map(p => 
                `${p.name} by ${p.brand} ($${p.price})`
              );
              return {
                success: false,
                multipleMatches: true,
                count: matches.length,
                options: options,
                message: `Found ${matches.length} products matching "${params.productName}". Please be more specific. Options: ${options.join(', ')}`
              };
            }
            
            const product = matches[0];
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

        onMessage: ({ message, source }) => {
          console.log('[v0] Agent message:', source, message);
        },
        
        onError: (err) => {
          // Only show error as a non-fatal warning - do NOT reset connection state
          // The session may still be alive even after a tool error
          const errMsg = typeof err === 'string' ? err : (err as Error)?.message || 'Conversation error';
          console.error('[v0] Conversation error (non-fatal):', errMsg);
          setError(errMsg);
          // Do NOT setIsListening(false) here - keep connection alive
        },
        
        onStatusChange: ({ status }) => {
          console.log('[v0] Conversation status changed to:', status);
          if (status === 'connected') {
            setIsListening(true);
            setIsProcessing(false);
            setError(null); // Clear any previous errors on successful connect
          } else if (status === 'disconnected') {
            setIsProcessing(false);
            // Only reset state if this was an intentional disconnect
            // If unintentional (network drop etc.), keep isListening true so UI knows it WAS connected
            if (intentionalDisconnectRef.current) {
              setIsListening(false);
              conversationRef.current = null;
              intentionalDisconnectRef.current = false;
            } else {
              // Unintentional disconnect - show error but keep state so user knows
              setIsListening(false);
              conversationRef.current = null;
              setError('Connection lost. Click Voice Filter to reconnect.');
            }
          }
        },
        
        onModeChange: ({ mode }) => {
          setIsProcessing(mode === 'thinking' || mode === 'speaking');
        },
      });

      conversationRef.current = conversation;
    } catch (err) {
      // Startup failed - no session was established, safe to reset all state
      let message = 'Failed to start voice session';
      
      if (err instanceof Error) {
        message = err.message;
      }
      
      setError(message);
      setIsListening(false);
      setIsProcessing(false);
      conversationRef.current = null;
      console.error('[v0] Error starting conversation:', err);
    }
  }, []);

  const stopListening = useCallback(async () => {
    try {
      // Mark as intentional so onStatusChange knows not to show "connection lost" error
      intentionalDisconnectRef.current = true;
      setIsListening(false);
      setError(null);
      if (conversationRef.current) {
        console.log('[v0] Ending ElevenLabs conversation session...');
        await conversationRef.current.endSession();
        conversationRef.current = null;
      }
    } catch (err) {
      console.error('[v0] Error stopping conversation:', err);
      intentionalDisconnectRef.current = false;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (conversationRef.current) {
        conversationRef.current.endSession().catch(console.error);
      }
    };
  }, []);

  return (
    <AgentContext.Provider
      value={{
        isListening,
        isProcessing,
        error,
        lastAction,
        startListening,
        stopListening,
        registerCallbacks,
        clearError,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within an ElevenLabsAgentProvider');
  }
  return context;
}
