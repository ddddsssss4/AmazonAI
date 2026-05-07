import { ShoppingCart, Heart, ArrowLeft, ArrowRight, Zap, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import VoiceFilterButton from '../components/VoiceFilterButton';
import ProductHoverSpeaker from '../components/ProductHoverSpeaker';
import { DebugPanel } from '../components/DebugPanel';
import { type ParsedFilters } from '../hooks/useElevenLabsAgent';

// ── types ──────────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  colour: string;
  discount: number;
  rating: number;
  badge?: string;
  freeShipping: boolean;
  image: string;
  size?: string;
}

// ── product data ───────────────────────────────────────────────────────────────
const ALL_PRODUCTS: Product[] = [
  // ── Tech ──
  {
    id: 1,
    name: 'Tactile Pro Keyboard',
    description: 'Heavy-duty mechanical switches in a reinforced aluminum chassis. Built for high APM execution.',
    price: 189,
    category: 'Keyboards',
    brand: 'AUSK',
    colour: 'Black',
    discount: 10,
    rating: 4,
    badge: 'New',
    freeShipping: true,
    image: '/products/keyboard-tactile-pro.jpg',
  },
  {
    id: 2,
    name: 'Acoustic Isolation Over-Ear',
    description: 'Studio-grade drivers with absolute noise gating. For complete environmental detachment.',
    price: 240,
    category: 'Audio',
    brand: 'Imsa Moda',
    colour: 'Black',
    discount: 25,
    rating: 5,
    badge: 'Best Seller',
    freeShipping: true,
    image: '/products/headphones-acoustic.jpg',
  },
  {
    id: 3,
    name: 'Qi Ceramic Station',
    description: 'High-density ceramic power slab. 15W rapid energy transfer with brutalist stability.',
    price: 65,
    category: 'Power',
    brand: 'NexaFlair',
    colour: 'White',
    discount: 0,
    rating: 4,
    freeShipping: false,
    image: '/products/charger-qi-ceramic.jpg',
  },
  {
    id: 4,
    name: 'Precision Ergo Mouse',
    description: '16,000 DPI optical sensor with ergonomic right-hand grip. Zero fatigue, maximum tracking.',
    price: 79,
    category: 'Mice',
    brand: 'ESSA',
    colour: 'Black',
    discount: 10,
    rating: 4,
    badge: 'New',
    freeShipping: true,
    image: '/products/mouse-precision-ergo.jpg',
  },
  {
    id: 5,
    name: 'Compact TKL Keyboard',
    description: 'Tenkeyless layout with hot-swappable switches. RGB underglow with per-key lighting.',
    price: 129,
    category: 'Keyboards',
    brand: 'Samfor',
    colour: 'White',
    discount: 35,
    rating: 4,
    freeShipping: true,
    image: '/products/keyboard-tkl-compact.jpg',
  },
  {
    id: 6,
    name: 'Studio Monitor Earbuds',
    description: 'Hybrid active noise cancellation with 30hr battery. Crystal-clear highs and deep bass response.',
    price: 159,
    category: 'Audio',
    brand: 'DEELMO',
    colour: 'White',
    discount: 50,
    rating: 5,
    badge: 'Deal',
    freeShipping: true,
    image: '/products/earbuds-studio-monitor.jpg',
  },
  {
    id: 7,
    name: 'GaN 100W USB-C Charger',
    description: 'Gallium nitride 4-port charger. Powers laptop, tablet, phone simultaneously at full speed.',
    price: 89,
    category: 'Power',
    brand: 'GREGILOOKS',
    colour: 'Black',
    discount: 25,
    rating: 4,
    freeShipping: false,
    image: '/products/charger-gan-100w.jpg',
  },
  {
    id: 8,
    name: 'Ambidextrous FPS Mouse',
    description: 'Symmetric 60g ultralight shell. Polling rate 1000Hz with optical micro-switches.',
    price: 119,
    category: 'Mice',
    brand: 'AUSK',
    colour: 'White',
    discount: 10,
    rating: 5,
    badge: 'Top Rated',
    freeShipping: true,
    image: '/products/mouse-fps-ambidextrous.jpg',
  },
  {
    id: 9,
    name: 'Portable Power Bank 26800',
    description: '26,800mAh fast-charge bank. Dual USB-C with pass-through charging. Airline-approved.',
    price: 49,
    category: 'Power',
    brand: 'NexaFlair',
    colour: 'Black',
    discount: 60,
    rating: 4,
    badge: 'Deal',
    freeShipping: false,
    image: '/products/powerbank-26800.jpg',
  },
  {
    id: 10,
    name: 'Wireless Desktop Speaker',
    description: '360° omnidirectional sound with 20W output. IPX5 waterproof casing built for any workspace.',
    price: 135,
    category: 'Audio',
    brand: 'Samfor',
    colour: 'Gray',
    discount: 35,
    rating: 4,
    freeShipping: true,
    image: '/products/speaker-wireless-desktop.jpg',
  },
  {
    id: 11,
    name: 'Vertical Ergonomic Mouse',
    description: 'Natural handshake grip reduces wrist strain by 60%. 7 programmable buttons with tilt wheel.',
    price: 95,
    category: 'Mice',
    brand: 'ESSA',
    colour: 'Black',
    discount: 25,
    rating: 5,
    freeShipping: true,
    image: '/products/mouse-vertical-ergo.jpg',
  },
  {
    id: 12,
    name: 'Split Ortholinear Keyboard',
    description: 'Columnar stagger layout eliminates ulnar deviation. QMK/VIA compatible, fully programmable.',
    price: 249,
    category: 'Keyboards',
    brand: 'DEELMO',
    colour: 'Gray',
    discount: 0,
    rating: 5,
    badge: 'New',
    freeShipping: true,
    image: '/products/keyboard-split-ortho.jpg',
  },

  // ── T-Shirts ──
  {
    id: 13,
    name: 'Classic Cotton Crew Tee',
    description: '100% pure cotton heavyweight tee. Pre-shrunk, drop-shoulder fit. Ribbed collar with double-needle hems.',
    price: 22,
    category: 'T-Shirts',
    brand: 'Imsa Moda',
    colour: 'White',
    discount: 10,
    rating: 4,
    badge: 'Best Seller',
    freeShipping: true,
    image: '/products/tshirt-classic-cotton.jpg',
  },
  {
    id: 14,
    name: 'Oversized Graphic Street Tee',
    description: 'Boxy oversized cut in 240gsm cotton. Bold screen-print graphic. Unisex sizing runs large.',
    price: 35,
    category: 'T-Shirts',
    brand: 'NexaFlair',
    colour: 'Black',
    discount: 25,
    rating: 5,
    badge: 'New',
    freeShipping: true,
    image: '/products/tshirt-oversized-graphic.jpg',
  },
  {
    id: 15,
    name: 'Performance Dry-Fit Tee',
    description: 'Moisture-wicking polyester blend. 4-way stretch panel for unrestricted movement. UPF 40+ protection.',
    price: 28,
    category: 'T-Shirts',
    brand: 'ESSA',
    colour: 'Gray',
    discount: 0,
    rating: 4,
    freeShipping: false,
    image: '/products/tshirt-dryfit.jpg',
  },

  // ── Dresses ──
  {
    id: 16,
    name: 'Flowy Linen Midi Dress',
    description: 'Breathable linen-blend midi dress. Adjustable tie waist, side pockets, and subtle A-line silhouette.',
    price: 58,
    category: 'Dresses',
    brand: 'Imsa Moda',
    colour: 'White',
    discount: 35,
    rating: 5,
    badge: 'Best Seller',
    freeShipping: true,
    image: '/products/dress-linen-midi.jpg',
  },
  {
    id: 17,
    name: 'Bodycon Evening Dress',
    description: 'Stretch velvet bodycon silhouette. Invisible back zip, sweetheart neckline, ankle length.',
    price: 89,
    category: 'Dresses',
    brand: 'NexaFlair',
    colour: 'Black',
    discount: 10,
    rating: 4,
    badge: 'New',
    freeShipping: true,
    image: '/products/dress-bodycon-evening.jpg',
  },
  {
    id: 18,
    name: 'Boho Floral Wrap Dress',
    description: 'Viscose floral wrap dress with tiered hem. Self-tie belt, V-neckline, flutter sleeves.',
    price: 45,
    category: 'Dresses',
    brand: 'DEELMO',
    colour: 'Red',
    discount: 50,
    rating: 4,
    badge: 'Deal',
    freeShipping: false,
    image: '/products/dress-boho-wrap.jpg',
  },

  // ── Kurtas ──
  {
    id: 19,
    name: 'Straight Cotton Kurta',
    description: 'Classic straight-cut kurta in 100% hand-woven cotton. Mandarin collar with wooden button placket.',
    price: 32,
    category: 'Kurtas',
    brand: 'GREGILOOKS',
    colour: 'White',
    discount: 10,
    rating: 5,
    badge: 'Best Seller',
    freeShipping: true,
    image: '/products/kurta-straight-cotton.jpg',
  },
  {
    id: 20,
    name: 'Embroidered Anarkali Kurta',
    description: 'Flared Anarkali silhouette with intricate thread embroidery on yoke. Paired with inner lining.',
    price: 65,
    category: 'Kurtas',
    brand: 'Imsa Moda',
    colour: 'Blue',
    discount: 25,
    rating: 4,
    freeShipping: true,
    image: '/products/kurta-anarkali-embroidered.jpg',
  },
  {
    id: 21,
    name: 'Block Print A-Line Kurta',
    description: 'Hand block-printed A-line kurta in Jaipur cotton. Three-quarter sleeves, side slits.',
    price: 41,
    category: 'Kurtas',
    brand: 'Samfor',
    colour: 'Red',
    discount: 35,
    rating: 4,
    badge: 'Deal',
    freeShipping: false,
    image: '/products/kurta-blockprint-aline.jpg',
  },

  // ── Sweatshirts ──
  {
    id: 22,
    name: 'Essential Fleece Hoodie',
    description: '380gsm brushed fleece hoodie. Kangaroo pocket, metal-tipped drawcord, ribbed cuffs and hem.',
    price: 55,
    category: 'Sweatshirts',
    brand: 'AUSK',
    colour: 'Gray',
    discount: 10,
    rating: 5,
    badge: 'Best Seller',
    freeShipping: true,
    image: '/products/sweatshirt-fleece-hoodie.jpg',
  },
  {
    id: 23,
    name: 'Vintage Crewneck Sweatshirt',
    description: 'Garment-dyed heavyweight crew. 100% cotton, washed for a broken-in feel. Boxy relaxed fit.',
    price: 48,
    category: 'Sweatshirts',
    brand: 'NexaFlair',
    colour: 'Black',
    discount: 25,
    rating: 4,
    freeShipping: true,
    image: '/products/sweatshirt-vintage-crew.jpg',
  },
  {
    id: 24,
    name: 'Zip-Up Tech Fleece',
    description: 'Engineered tech fleece with articulated seams. Full-zip, stand collar, zippered side pockets.',
    price: 72,
    category: 'Sweatshirts',
    brand: 'ESSA',
    colour: 'Blue',
    discount: 0,
    rating: 4,
    badge: 'New',
    freeShipping: true,
    image: '/products/sweatshirt-zip-techfleece.jpg',
  },

  // ── Leather ──
  {
    id: 25,
    name: 'Classic Biker Jacket',
    description: 'Full-grain cowhide leather biker jacket. YKK zippers, quilted shoulder panels, snap-tab collar.',
    price: 249,
    category: 'Leather',
    brand: 'DEELMO',
    colour: 'Black',
    discount: 10,
    rating: 5,
    badge: 'Top Rated',
    freeShipping: true,
    image: '/products/leather-biker-jacket.jpg',
  },
  {
    id: 26,
    name: 'Suede Bomber Jacket',
    description: 'Genuine suede bomber with ribbed trims. Satin lining, dual side-entry pockets, welt chest pocket.',
    price: 189,
    category: 'Leather',
    brand: 'GREGILOOKS',
    colour: 'Gray',
    discount: 25,
    rating: 4,
    freeShipping: false,
    image: '/products/leather-suede-bomber.jpg',
  },
  {
    id: 27,
    name: 'Slim Leather Blazer',
    description: 'Nappa leather slim blazer. Notch lapel, two-button front, fully lined with welt pockets.',
    price: 319,
    category: 'Leather',
    brand: 'Imsa Moda',
    colour: 'Black',
    discount: 35,
    rating: 5,
    badge: 'Deal',
    freeShipping: true,
    image: '/products/leather-slim-blazer.jpg',
  },
];

const CATEGORIES_TECH = ['Keyboards', 'Audio', 'Power', 'Mice'];
const CATEGORIES_CLOTHING = ['T-Shirts', 'Dresses', 'Kurtas', 'Sweatshirts', 'Leather'];
const ALL_CATEGORIES = [...CATEGORIES_TECH, ...CATEGORIES_CLOTHING];

const BRANDS = ['AUSK', 'Imsa Moda', 'NexaFlair', 'ESSA', 'Samfor', 'DEELMO', 'GREGILOOKS'];
const COLOURS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Gray', hex: '#9CA3AF' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#22C55E' },
];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const DISCOUNT_TIERS = [10, 25, 35, 50, 60];

// ── helpers ───────────────────────────────────────────────────────────────────
function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          className={i <= rating ? 'text-black fill-black' : 'text-gray-300 fill-gray-300'}
        />
      ))}
    </div>
  );
}

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="pt-4 border-t-2 border-black">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full font-mono font-bold uppercase tracking-wider text-sm mb-3"
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && children}
    </div>
  );
}

// ── main component ────────────────────────────────────────────��────────────────
export default function Shop() {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColours, setSelectedColours] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [minDiscount, setMinDiscount] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [sortBy, setSortBy] = useState('Performance');
  const [voiceFiltersApplied, setVoiceFiltersApplied] = useState<string>('');

  // ── voice handlers ─────────────────────────────────────────────────────────
  
  // Map AI keywords to actual product categories
  const mapToCategory = (input: string): string[] => {
    const lowerInput = input.toLowerCase();
    
    // Direct matches to actual categories
    const categoryMap: Record<string, string[]> = {
      // Tech categories
      'keyboard': ['Keyboards'],
      'keyboards': ['Keyboards'],
      'audio': ['Audio'],
      'headphones': ['Audio'],
      'earphones': ['Audio'],
      'power': ['Power'],
      'charger': ['Power'],
      'battery': ['Power'],
      'mouse': ['Mice'],
      'mice': ['Mice'],
      'tech': ['Keyboards', 'Audio', 'Power', 'Mice'], // Tech = all tech categories
      
      // Clothing categories
      't-shirt': ['T-Shirts'],
      't-shirts': ['T-Shirts'],
      'tshirt': ['T-Shirts'],
      'tshirts': ['T-Shirts'],
      'shirt': ['T-Shirts'],
      'dress': ['Dresses'],
      'dresses': ['Dresses'],
      'kurta': ['Kurtas'],
      'kurtas': ['Kurtas'],
      'sweatshirt': ['Sweatshirts'],
      'sweatshirts': ['Sweatshirts'],
      'hoodie': ['Sweatshirts'],
      'jacket': ['Leather Jackets'],
      'jackets': ['Leather Jackets'],
      'leather jacket': ['Leather Jackets'],
      'leather jackets': ['Leather Jackets'],
      'clothing': ['T-Shirts', 'Dresses', 'Kurtas', 'Sweatshirts', 'Leather Jackets'], // Clothing = all clothing
    };
    
    // Check for exact or partial match
    for (const [key, categories] of Object.entries(categoryMap)) {
      if (lowerInput.includes(key)) {
        return categories;
      }
    }
    
    // Return as-is if no mapping found (might be exact category name)
    return [input];
  };
  
  const handleVoiceFilters = (filters: ParsedFilters) => {
    // Apply categories - normalize to array and map to actual categories
    if (filters.categories) {
      const inputCats = Array.isArray(filters.categories) ? filters.categories : [filters.categories];
      const mappedCats = inputCats.flatMap(cat => mapToCategory(cat));
      // Remove duplicates
      const uniqueCats = [...new Set(mappedCats)];
      if (uniqueCats.length) setSelectedCategories(uniqueCats);
    }
    
    // Apply brands - normalize to array if needed
    if (filters.brands) {
      const brands = Array.isArray(filters.brands) ? filters.brands : [filters.brands];
      if (brands.length) setSelectedBrands(brands);
    }
    
    // Apply colours - normalize to array if needed
    if (filters.colours) {
      const colors = Array.isArray(filters.colours) ? filters.colours : [filters.colours];
      if (colors.length) setSelectedColours(colors);
    }
    
    // Apply price range
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      const min = filters.priceMin ?? 0;
      const max = filters.priceMax ?? 999;
      setSelectedPriceRange(`${min}-${max}`);
    }
    
    // Apply free shipping
    if (filters.freeShipping !== undefined) {
      setFreeShippingOnly(filters.freeShipping);
    }
    
    // Apply minimum rating
    if (filters.minRating !== undefined) {
      setMinRating(filters.minRating);
    }
    
    // Apply minimum discount
    if (filters.minDiscount !== undefined) {
      setMinDiscount(filters.minDiscount);
    }
    
    // Apply sorting
    if (filters.sortBy) {
      const sortMap: Record<string, string> = {
        'price_low': 'Price: Low to High',
        'price_high': 'Price: High to Low',
        'rating': 'Top Rated',
        'discount': 'Performance',
      };
      setSortBy(sortMap[filters.sortBy] || 'Performance');
    }
    
    // Build feedback string
    const parts: string[] = [];
    if (filters.categories) {
      const cats = Array.isArray(filters.categories) ? filters.categories : [filters.categories];
      if (cats.length) parts.push(`Category: ${cats.join(', ')}`);
    }
    if (filters.brands) {
      const brands = Array.isArray(filters.brands) ? filters.brands : [filters.brands];
      if (brands.length) parts.push(`Brand: ${brands.join(', ')}`);
    }
    if (filters.colours) {
      const colors = Array.isArray(filters.colours) ? filters.colours : [filters.colours];
      if (colors.length) parts.push(`Color: ${colors.join(', ')}`);
    }
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      parts.push(`Price: $${filters.priceMin ?? 0}-$${filters.priceMax ?? '999+'}`);
    }
    if (filters.freeShipping) parts.push('Free Shipping');
    if (filters.minRating) parts.push(`${filters.minRating}+ Stars`);
    if (parts.length) setVoiceFiltersApplied(parts.join(' • '));
  };

  const handleClearFilters = () => {
    clearAll();
  };

  const handleAddToCart = (productId: number, quantity: number) => {
    // For now, just log - cart integration will be added
    console.log(`[v0] Add to cart: Product ${productId}, Qty: ${quantity}`);
    // TODO: Integrate with cart context when available
  };

  const handleNavigateToProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const getFilteredProductCount = () => filteredProducts.length;

  // ── filter logic ──────────────────────────────────────────────────────────
  const filteredProducts = ALL_PRODUCTS.filter(p => {
    if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
    if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
    if (selectedColours.length && !selectedColours.includes(p.colour)) return false;
    if (freeShippingOnly && !p.freeShipping) return false;
    if (minRating && p.rating < minRating) return false;
    if (minDiscount && p.discount < minDiscount) return false;
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      if (p.price < min || p.price > max) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Top Rated') return b.rating - a.rating;
    return b.discount - a.discount; // Performance = biggest discount first
  });

  const getFilteredProducts = () => filteredProducts;

  const toggle = <T extends string>(
    list: T[],
    setList: React.Dispatch<React.SetStateAction<T[]>>,
    value: T
  ) => {
    setList(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    setVoiceFiltersApplied('');
  };

  const activeFilterCount =
    selectedCategories.length + selectedBrands.length + selectedColours.length +
    selectedSizes.length + (selectedPriceRange ? 1 : 0) + (minDiscount ? 1 : 0) +
    (minRating ? 1 : 0) + (freeShippingOnly ? 1 : 0);

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedColours([]);
    setSelectedSizes([]);
    setSelectedPriceRange(null);
    setMinDiscount(null);
    setMinRating(null);
    setFreeShippingOnly(false);
    setVoiceFiltersApplied('');
  };

  const checkboxClass = 'w-4 h-4 border-2 border-black rounded-none checked:bg-black checked:border-black focus:ring-0 focus:ring-offset-0 shrink-0';

  return (
    <main className="flex-grow w-full max-w-[1600px] mx-auto px-6 py-12 flex flex-col md:flex-row gap-8 relative">
      <DebugPanel />

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-full md:w-[260px] shrink-0">
        <div className="sticky top-24 space-y-0 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">

          {/* AI Voice */}
          <div className="bg-white neo-border neo-shadow p-5 mb-4">
            <h2 className="font-headline text-xl font-black uppercase mb-4 pb-2 border-b-2 border-black">AI Voice</h2>
            <VoiceFilterButton 
              onFiltersDetected={handleVoiceFilters}
              onClearFilters={handleClearFilters}
              onAddToCart={handleAddToCart}
              onNavigateToProduct={handleNavigateToProduct}
              getFilteredProductCount={getFilteredProductCount}
              getFilteredProducts={getFilteredProducts}
            />
            {voiceFiltersApplied && (
              <div className="mt-3 bg-electric-pink bg-opacity-10 border-2 border-electric-pink p-2 font-mono text-xs text-black">
                {voiceFiltersApplied}
              </div>
            )}
          </div>

          {/* Filters Panel */}
          <div className="bg-white neo-border neo-shadow p-5 mb-4">
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-black">
              <h2 className="font-headline text-2xl font-black uppercase">Filters</h2>
              {activeFilterCount > 0 && (
                <button onClick={clearAll} className="font-mono text-xs uppercase font-bold underline hover:text-electric-pink transition-colors">
                  Clear All ({activeFilterCount})
                </button>
              )}
            </div>

            {/* Category */}
            <FilterSection title="Category">
              <div className="space-y-3 font-mono text-sm">
                <p className="text-xs uppercase tracking-widest font-bold text-gray-400">Clothing</p>
                {CATEGORIES_CLOTHING.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggle(selectedCategories, setSelectedCategories, cat)} className={checkboxClass} />
                    <span className="group-hover:text-electric-pink transition-colors">{cat}</span>
                  </label>
                ))}
                <p className="text-xs uppercase tracking-widest font-bold text-gray-400 pt-2">Tech</p>
                {CATEGORIES_TECH.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggle(selectedCategories, setSelectedCategories, cat)} className={checkboxClass} />
                    <span className="group-hover:text-electric-pink transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Size (clothing) */}
            <FilterSection title="Size" defaultOpen={false}>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => toggle(selectedSizes, setSelectedSizes, s)}
                    className={`px-3 py-1.5 font-mono text-xs font-bold border-2 transition-all ${
                      selectedSizes.includes(s)
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-black hover:bg-surface-container'
                    }`}
                    aria-pressed={selectedSizes.includes(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* Delivery */}
            <FilterSection title="Delivery Day">
              <div className="space-y-2 font-mono text-sm">
                {['Get It Today', 'Get It Tomorrow', 'Get It in 2 Days'].map(d => (
                  <label key={d} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className={checkboxClass} />
                    <span className="group-hover:text-electric-pink transition-colors">{d}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Free Shipping */}
            <FilterSection title="Free Shipping">
              <label className="flex items-center gap-3 cursor-pointer group font-mono text-sm">
                <input type="checkbox" checked={freeShippingOnly} onChange={() => { setFreeShippingOnly(v => !v); setVoiceFiltersApplied(''); }} className={checkboxClass} />
                <span className="group-hover:text-electric-pink transition-colors">Eligible for Free Shipping</span>
              </label>
            </FilterSection>

            {/* Brands */}
            <FilterSection title="Brands">
              <div className="space-y-2 font-mono text-sm">
                {BRANDS.map(brand => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggle(selectedBrands, setSelectedBrands, brand)} className={checkboxClass} />
                    <span className="group-hover:text-electric-pink transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Price */}
            <FilterSection title="Price">
              <div className="space-y-2 font-mono text-sm">
                {[
                  { label: 'Under $50', value: '0-50' },
                  { label: '$50 – $100', value: '50-100' },
                  { label: '$100 – $150', value: '100-150' },
                  { label: '$150 – $200', value: '150-200' },
                  { label: '$200+', value: '200-9999' },
                ].map(r => (
                  <label key={r.value} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedPriceRange === r.value}
                      onChange={() => { setSelectedPriceRange(selectedPriceRange === r.value ? null : r.value); setVoiceFiltersApplied(''); }}
                      className={checkboxClass}
                    />
                    <span className="group-hover:text-electric-pink transition-colors">{r.label}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Customer Review */}
            <FilterSection title="Customer Review">
              <div className="space-y-2">
                {[4, 3, 2].map(stars => (
                  <label key={stars} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={minRating === stars}
                      onChange={() => { setMinRating(minRating === stars ? null : stars); setVoiceFiltersApplied(''); }}
                      className={checkboxClass}
                    />
                    <div className="flex items-center gap-1">
                      <StarRating rating={stars} size={13} />
                      <span className="font-mono text-xs">& Up</span>
                    </div>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Colour */}
            <FilterSection title="Colour">
              <div className="flex flex-wrap gap-2">
                {COLOURS.map(c => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => { toggle(selectedColours, setSelectedColours, c.name); }}
                    className={`w-7 h-7 border-2 transition-all ${selectedColours.includes(c.name) ? 'border-electric-pink scale-110' : 'border-black'} ${c.name === 'White' ? 'bg-white' : ''}`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={c.name}
                    aria-pressed={selectedColours.includes(c.name)}
                  />
                ))}
              </div>
            </FilterSection>

            {/* Discount */}
            <FilterSection title="Discount">
              <div className="space-y-2 font-mono text-sm">
                {DISCOUNT_TIERS.map(d => (
                  <label key={d} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={minDiscount === d}
                      onChange={() => { setMinDiscount(minDiscount === d ? null : d); setVoiceFiltersApplied(''); }}
                      className={checkboxClass}
                    />
                    <span className="group-hover:text-electric-pink transition-colors">{d}% or more</span>
                  </label>
                ))}
              </div>
            </FilterSection>
          </div>

          {/* Promo Banner */}
          <div className="bg-electric-pink text-white neo-border neo-shadow p-5 flex flex-col items-center text-center">
            <Zap size={40} className="mb-2" fill="currentColor" />
            <h3 className="font-headline text-2xl font-black leading-tight mb-2 uppercase">Flash Drop</h3>
            <p className="font-mono text-xs mb-4">Use code EDGE24 for free next-day logistics.</p>
            <button className="bg-black text-white px-4 py-3 font-mono font-bold uppercase hover:bg-white hover:text-black hover:border-black border-2 border-transparent transition-colors w-full text-sm">
              Apply
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <section className="flex-grow min-w-0">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 font-mono text-sm font-bold uppercase hover:text-electric-pink transition-colors group"
          aria-label="Go back"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Header */}
        <div className="mb-8 border-b-2 border-black pb-6 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="font-headline text-[48px] md:text-[64px] font-black uppercase text-black break-words leading-[0.9]">
              All<br />Products
            </h1>
            <p className="font-mono text-sm mt-2 text-gray-600">
              {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
              {activeFilterCount > 0 && ` for ${activeFilterCount} active filter${activeFilterCount > 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white neo-border px-4 py-2 shrink-0">
            <span className="font-mono text-sm uppercase font-bold">Sort By:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border-none bg-transparent font-mono text-sm outline-none focus:ring-0 cursor-pointer uppercase font-bold"
            >
              <option>Performance</option>
              <option>Price: High to Low</option>
              <option>Price: Low to High</option>
              <option>Top Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-headline text-4xl font-black uppercase mb-4">No Results</p>
            <p className="font-mono text-sm text-gray-600 mb-6">Try adjusting or clearing your filters.</p>
            <button onClick={clearAll} className="bg-black text-white font-mono font-bold px-6 py-3 uppercase border-2 border-black hover:bg-white hover:text-black transition-colors neo-button">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <article key={product.id} className="bg-white neo-border neo-shadow flex flex-col h-full group transition-all duration-200 hover:-translate-y-1 hover:neo-shadow-lg">
                <ProductHoverSpeaker
                  productName={product.name}
                  productDescription={product.description}
                  productPrice={product.price}
                >
                  <Link to={`/product/${product.id}`} className="contents">
                    <div className="relative w-full aspect-square border-b-2 border-black bg-surface-container overflow-hidden p-4 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                      />
                      {product.badge && (
                        <div className={`absolute top-3 left-3 px-2 py-1 font-mono text-xs uppercase font-bold border-2 border-black ${product.badge === 'Deal' ? 'bg-electric-pink text-white' : 'bg-black text-white'}`}>
                          {product.badge}
                        </div>
                      )}
                      {product.discount > 0 && (
                        <div className="absolute top-3 right-3 bg-white border-2 border-black px-2 py-1 font-mono text-xs font-bold text-black">
                          -{product.discount}%
                        </div>
                      )}
                    </div>
                  </Link>
                </ProductHoverSpeaker>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className="font-headline text-xl leading-tight uppercase font-black">{product.name}</h3>
                    <span className={`font-mono text-base font-bold px-2 py-1 shrink-0 ${product.badge === 'Deal' ? 'bg-electric-pink text-white' : 'bg-black text-white'}`}>
                      ${product.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={product.rating} size={12} />
                    <span className="font-mono text-xs text-gray-500">{product.brand}</span>
                    {product.freeShipping && (
                      <span className="font-mono text-xs font-bold text-green-700 ml-auto">FREE Ship</span>
                    )}
                  </div>
                  <p className="font-body text-gray-600 mb-4 flex-grow text-sm leading-relaxed">
                    {product.description}
                  </p>
                  <div className="flex gap-2">
                    <button className="bg-white text-black border-2 border-black font-mono font-bold px-4 py-2.5 uppercase flex-grow text-center hover:bg-black hover:text-white transition-colors neo-button flex items-center justify-center gap-2 text-sm">
                      <ShoppingCart size={16} /> Add to Cart
                    </button>
                    <button className="bg-surface-container text-black border-2 border-black p-2.5 hover:bg-electric-pink hover:text-white transition-colors neo-button flex items-center justify-center">
                      <Heart size={18} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-12 border-t-2 border-black pt-8 flex justify-center items-center gap-4">
          <button className="bg-white border-2 border-black w-12 h-12 flex items-center justify-center neo-button hover:bg-black hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="flex gap-2 font-mono text-lg font-bold">
            <span className="bg-black text-white w-10 h-10 flex items-center justify-center border-2 border-black">1</span>
            <span className="bg-white text-black w-10 h-10 flex items-center justify-center border-2 border-black hover:bg-surface-container cursor-pointer">2</span>
            <span className="bg-white text-black w-10 h-10 flex items-center justify-center border-2 border-black hover:bg-surface-container cursor-pointer">3</span>
          </div>
          <button className="bg-white border-2 border-black w-12 h-12 flex items-center justify-center neo-button hover:bg-black hover:text-white transition-colors">
            <ArrowRight size={24} />
          </button>
        </div>
      </section>
    </main>
  );
}
