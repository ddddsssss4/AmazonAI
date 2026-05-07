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

// Helper function to find ALL products matching a search term (fuzzy matching)
const findProductsByName = (searchTerm: string) => {
  const term = searchTerm.toLowerCase();
  const words = term.split(' ').filter(w => w.length > 2);
  
  // Score each product based on how well it matches
  const scored = ALL_PRODUCTS.map(p => {
    let score = 0;
    const name = p.name.toLowerCase();
    const category = p.category.toLowerCase();
    const brand = p.brand.toLowerCase();
    const colour = p.colour?.toLowerCase() || '';
    
    // Exact name match = highest score
    if (name === term) score += 100;
    // Name contains search term
    else if (name.includes(term)) score += 50;
    // Search term contains product name
    else if (term.includes(name)) score += 40;
    
    // Category match
    if (category.includes(term) || term.includes(category.replace(/s$/, ''))) score += 30;
    
    // Word-by-word matching
    words.forEach(word => {
      if (name.includes(word)) score += 20;
      if (category.includes(word)) score += 15;
      if (brand.includes(word)) score += 10;
      if (colour.includes(word)) score += 10;
    });
    
    return { product: p, score };
  });
  
  // Return products with score > 0, sorted by score descending
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.product);
};

// Helper to find single best match
const findProductByName = (searchTerm: string) => {
  const matches = findProductsByName(searchTerm);
  return matches.length > 0 ? matches[0] : null;
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
      
      // Check current permission state first
      let permissionState = 'prompt';
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        permissionState = permissionStatus.state;
        console.log('[v0] Current microphone permission state:', permissionState);
      } catch {
        console.log('[v0] Could not query permission state, will request directly');
      }
      
      // Request microphone permission (this will prompt user if not granted)
      console.log('[v0] Requesting microphone access...');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the stream immediately - we just needed to get permission
        stream.getTracks().forEach(track => track.stop());
        console.log('[v0] Microphone access granted');
      } catch (micError) {
        console.error('[v0] Microphone access error:', micError);
        
        if (micError instanceof Error) {
          // If denied, provide helpful message with instructions
          if (micError.name === 'NotAllowedError' || micError.name === 'PermissionDeniedError') {
            // Check if it's a persistent denial or just dismissed
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
            
            // Find ALL matching products
            const matches = findProductsByName(params.productName);
            
            if (matches.length === 0) {
              return { 
                success: false, 
                message: `Could not find a product matching "${params.productName}". Try searching for products first.` 
              };
            }
            
            // If multiple matches, ask user to be more specific
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
            
            // Single match - add to cart
            const product = matches[0];
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
            
            // Find ALL matching products
            const matches = findProductsByName(params.productName);
            
            if (matches.length === 0) {
              return { 
                success: false, 
                message: `Could not find a product matching "${params.productName}". Try searching for products first.` 
              };
            }
            
            // If multiple matches, return all of them so AI can describe options
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
            
            // Single match - return full details
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

          // Tool: Navigate to product detail page
          navigateToProduct: async (params: { productName: string }) => {
            console.log('[v0] Tool called: navigateToProduct', params);
            
            // Find ALL matching products
            const matches = findProductsByName(params.productName);
            
            if (matches.length === 0) {
              return { 
                success: false, 
                message: `Could not find a product matching "${params.productName}". Try searching for products first.` 
              };
            }
            
            // If multiple matches, ask user to be more specific
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
            
            // Single match - navigate
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

        // ── Event Handlers ───────────────────���─────────────��───────────────
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
