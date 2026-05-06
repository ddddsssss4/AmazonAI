import { ShoppingCart, Heart, ArrowLeft, ArrowRight, Zap, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import VoiceFilterButton from '../components/VoiceFilterButton';
import ProductHoverSpeaker from '../components/ProductHoverSpeaker';
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
}

// ── product data ───────────────────────────────────────────────────────────────
const ALL_PRODUCTS: Product[] = [
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8biZLVpkCJJRjqCxt_aWWSt7WvHN_QZTvMmuxfwtZ1RKNTb8pp_ZnF3N76Xtde45vuyX-CJt2ulU--w9lBPHGku0RkT3SP8eTZqXmBXEaLl1qj8gNSHYxV3-FTqAhKhDqOKVSisMll-vAUQE53L1O7ASWyMHZM_RHsrguBWcls1G0njZ16jw1BqNDrTqpMBHqQJN1DwMagkp4bl1Kb-pFJZ3IQj6JBk5M9eDfwsYD3KKuMxNJW_RSGhUqqQiLb342oSs9ellv_0D3',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdSgcGAykcJiDJwYORA3S0fBoPn08FCuHb2EDwrIL96dVEdPlQB0I-r9Zj0TN7BTwP4q-vQn_ttFZu9cDGGLdBfkXHC2Jzp3VuyCd-xwp8c7V_Ayr29YsRvQl4sMhUjS84F2kKftfFS7YlgXLsKn598PQz_YlKLrpqCxCSrMPFfm6kEZ65rZZTwb9iwN3-SxABXEJOF4FRwa0Acnf8bmmefQPdPKpW6ruQGglcPN9fJ3o88Q-Ea4cruhysGqkbQBvywGERSda1jS3l',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDARHQ5UueYxJBVVQlnB51PdhzWlKkicUAFtNvVa7N60HZ23FipCqVXkE_9j4d7uu4aNSgpnP4q6wqQPR4Od8g6Hzg5EMH4ieqbw04rOpswRdhIOHSkuaRZ1wO1ihacP95VK49IjczyUqKePNL67_b-ic3SN-oVoRxcV67GS3j7-VDahpWB1hfKdRovPZ9VGBNSfte69riMEHyMV43LIUPnbQ1RUzG9mROGAbv1a6mZHaXv4queKKAvdcoBou_EdEFNgB9BvA4cCA4x',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ9kq6P8Kv_9nCeFkJ1ZlL8cKUDDjx3mz6-WrAjAfMNZBkHvUMkGcFl1rAYW3x00sM1mUi9L_Ihi-LX9o5lVXuJhBXdZRX8x2cGCwjnZU0z2nLtBFu3MIm5s_3mIopeBNcDTF8M9Z6YkVFJWlpO-4Ia3pXuGf1CcAQAqYIkEFQNbC0t2DRxhqGR4e8qfCbzMIcZ5E',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkgFW3z3pMHW_kq7aNQkHWcNY1DRc5T60V5M_SWyFbz-HNPxQfZuqD7E7RoAJaJHlRr_dq9gqxKlcyZgm3RLzRRGSvnQPfC1zClNaVA4VINHzLXGz8NrwVzSHb1YF0Ak4EzxoYGXxHiuLKjAeVXqQVMU0KrxsKPOb0_Y',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdTSGCVhQ4vXrPAv-PBYpD5WEYeIYmQ2_h7EMHB9t0QNLhFiX97NxjA2ULB3ZGmUkS1cFSQUJ97V8E22vfhFMRPk5zJ4Vii5v3lG_C1rIifMHpVlBblgmODLPdN4xzFhRpf8TIWCifwNiaBQ',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzOqMv9bPzXXvN5S9R5JHfBGbAbEoJSJMaFlwRLLv-zPcTgbqWI-hT2OJlHR1tkCXLT3I_KVQR5KuRU2nVCQK0yRQrRfUl',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZvOBkBd5H5YFt4s_TGMoJBZ8X6Nq1IaHJFq3VH7JwGMnrplUMRPH0cUF1dJeSYESmTjQxnKQ9Fn1E6m7TfqnQoHhPfMi_3ZF9j8K',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1q2J_xgqyMrCFvhLMEtY9d2B8uNxKvxR6tXJz3oNPDT0b1bTYFoRJPQv0w_ZtCz1Mj8CSnLrqGQ',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLK8_sUMRBSSfJQzJgXaIYdp3zs2Y9Fo7m2nVNB6tHRZuDaUUzfYbMsS-2Dkh8WVA7nRMkSOVDVJX6Kw1rmMPLr5PIJL5Xw',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUJqK_5c0MO4XBhWBSF4h0x7gG5n1XVnOxRqVQFAx0pXGPkGjLRiRJtmXpoBDUGGSmFMDALz5Y9S4',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBT5gPdMlwNJ3Ax3e78e2sxLXy3qOdl0sxQNNOgpPLGv9H1FuH0i1WbF_GiOMt2h93mNZxf3JFqxeqfxk',
  },
];

const BRANDS = ['AUSK', 'Imsa Moda', 'NexaFlair', 'ESSA', 'Samfor', 'DEELMO', 'GREGILOOKS'];
const COLOURS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Gray', hex: '#9CA3AF' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#22C55E' },
];
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

// ── main component ─────────────────────────────────────────────────────────────
export default function Shop() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColours, setSelectedColours] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [minDiscount, setMinDiscount] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [sortBy, setSortBy] = useState('Performance');
  const [voiceFiltersApplied, setVoiceFiltersApplied] = useState<string>('');

  // ── voice handler ─────────────────────────────────────────────────────────
  const handleVoiceFilters = (filters: ParsedFilters) => {
    if (filters.category && filters.category.length > 0) {
      setSelectedCategories(filters.category);
    }
    if (filters.priceRange) {
      setSelectedPriceRange(filters.priceRange);
    }
    const parts: string[] = [];
    if (filters.category?.length) parts.push(`Category: ${filters.category.join(', ')}`);
    if (filters.priceRange) parts.push(`Price: ${filters.priceRange}`);
    if (parts.length) setVoiceFiltersApplied(parts.join(' • '));
  };

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
    (selectedPriceRange ? 1 : 0) + (minDiscount ? 1 : 0) + (minRating ? 1 : 0) +
    (freeShippingOnly ? 1 : 0);

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedColours([]);
    setSelectedPriceRange(null);
    setMinDiscount(null);
    setMinRating(null);
    setFreeShippingOnly(false);
    setVoiceFiltersApplied('');
  };

  const checkboxClass = 'w-4 h-4 border-2 border-black rounded-none checked:bg-black checked:border-black focus:ring-0 focus:ring-offset-0 shrink-0';

  return (
    <main className="flex-grow w-full max-w-[1600px] mx-auto px-6 py-12 flex flex-col md:flex-row gap-8 relative">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-full md:w-[260px] shrink-0">
        <div className="sticky top-24 space-y-0 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">

          {/* AI Voice */}
          <div className="bg-white neo-border neo-shadow p-5 mb-4">
            <h2 className="font-headline text-xl font-black uppercase mb-4 pb-2 border-b-2 border-black">AI Voice</h2>
            <VoiceFilterButton onFiltersDetected={handleVoiceFilters} />
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
              <div className="space-y-2 font-mono text-sm">
                {['Keyboards', 'Audio', 'Power', 'Mice'].map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggle(selectedCategories, setSelectedCategories, cat)} className={checkboxClass} />
                    <span className="group-hover:text-electric-pink transition-colors">{cat}</span>
                  </label>
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
        {/* Header */}
        <div className="mb-8 border-b-2 border-black pb-6 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="font-headline text-[48px] md:text-[64px] font-black uppercase text-black break-words leading-[0.9]">
              Tech<br />Essentials
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
                  <Link to="/product" className="contents">
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
