import { Search, ShoppingCart, Heart, ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import VoiceFilterButton from '../components/VoiceFilterButton';
import ProductHoverSpeaker from '../components/ProductHoverSpeaker';
import { type ParsedFilters } from '../hooks/useElevenLabsAgent';

export default function Shop() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Keyboards', 'Audio', 'Power']);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [voiceFiltersApplied, setVoiceFiltersApplied] = useState<string>('');

  const handleVoiceFilters = (filters: ParsedFilters) => {
    console.log('[v0] Voice filters detected:', filters);
    
    // Apply category filters
    if (filters.category && filters.category.length > 0) {
      setSelectedCategories(filters.category);
      setVoiceFiltersApplied(`Category: ${filters.category.join(', ')}`);
    }

    // Apply price range filters
    if (filters.priceRange) {
      setSelectedPriceRange(filters.priceRange);
      setVoiceFiltersApplied(prev => prev ? `${prev} • Price: ${filters.priceRange}` : `Price: ${filters.priceRange}`);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setVoiceFiltersApplied('');
  };

  const handlePriceChange = (range: string | null) => {
    setSelectedPriceRange(range);
    setVoiceFiltersApplied('');
  };

  return (
    <main className="flex-grow w-full max-w-[1600px] mx-auto px-6 py-12 flex flex-col md:flex-row gap-8 relative">
      {/* Sidebar / Filters */}
      <aside className="w-full md:w-1/4 lg:w-1/5 shrink-0 space-y-6">
        <div className="sticky top-24">
          {/* Voice Filter Section */}
          <div className="bg-white neo-border neo-shadow p-6 mb-6">
            <h2 className="font-headline text-xl font-black uppercase mb-4 pb-2 border-b-2 border-black">AI Voice</h2>
            <VoiceFilterButton onFiltersDetected={handleVoiceFilters} />
            {voiceFiltersApplied && (
              <div className="mt-3 bg-electric-pink bg-opacity-10 border-2 border-electric-pink p-3 font-mono text-xs text-black rounded">
                ✓ {voiceFiltersApplied}
              </div>
            )}
          </div>

          {/* Manual Filters Section */}
          <div className="bg-white neo-border neo-shadow p-6 mb-6">
            <h2 className="font-headline text-2xl font-black uppercase mb-4 pb-2 border-b-2 border-black">Filters</h2>
            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="font-mono font-bold mb-3 uppercase tracking-wider text-sm">Category</h3>
                <div className="space-y-3 font-mono text-sm">
                  {['Keyboards', 'Audio', 'Power', 'Mice'].map(category => (
                    <label key={category} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="w-5 h-5 border-2 border-black rounded-none checked:bg-black checked:border-black focus:ring-0 focus:ring-offset-0" 
                      />
                      <span className="group-hover:text-electric-pink transition-colors">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Price Filter */}
              <div>
                <h3 className="font-mono font-bold mb-3 uppercase tracking-wider text-sm pt-4 border-t-2 border-black">Price Range</h3>
                <div className="space-y-3 font-mono text-sm">
                  {[
                    { label: 'Under $50', value: '0-50' },
                    { label: '$50 - $150', value: '50-150' },
                    { label: '$150+', value: '150-999' }
                  ].map(range => (
                    <label key={range.value} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={selectedPriceRange === range.value}
                        onChange={() => handlePriceChange(selectedPriceRange === range.value ? null : range.value)}
                        className="w-5 h-5 border-2 border-black rounded-none checked:bg-black checked:border-black focus:ring-0 focus:ring-offset-0" 
                      />
                      <span className="group-hover:text-electric-pink transition-colors">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Promo Banner */}
          <div className="bg-electric-pink text-white neo-border neo-shadow p-6 mt-6 flex flex-col items-center text-center">
            <Zap size={48} className="mb-2" fill="currentColor" />
            <h3 className="font-headline text-[24px] font-black leading-tight mb-2 uppercase">Flash Drop</h3>
            <p className="font-mono text-sm mb-4">Use code EDGE24 for free next-day logistics.</p>
            <button className="bg-black text-white px-4 py-3 font-mono font-bold uppercase hover:bg-white hover:text-black hover:border-black border-2 border-transparent transition-colors w-full">Apply</button>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <section className="flex-grow w-full">
        {/* Header Area */}
        <div className="mb-8 border-b-2 border-black pb-6 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="font-headline text-[48px] md:text-[64px] font-black uppercase text-black break-words leading-[0.9]">
              Tech <br />Essentials
            </h1>
          </div>
          <div className="flex items-center gap-4 bg-white neo-border px-4 py-2">
            <span className="font-mono text-sm uppercase font-bold">Sort By:</span>
            <select className="border-none bg-transparent font-mono text-sm outline-none focus:ring-0 cursor-pointer uppercase font-bold">
              <option>Performance</option>
              <option>Price: High to Low</option>
              <option>Price: Low to High</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product 1 */}
          <article className="bg-white neo-border neo-shadow flex flex-col h-full group transition-all duration-200 hover:-translate-y-1 hover:neo-shadow-lg">
            <ProductHoverSpeaker
              productName="Tactile Pro Keyboard"
              productDescription="Heavy-duty mechanical switches housed in a reinforced aluminum chassis. Built for high APM execution."
              productPrice={189}
            >
              <Link to="/product" className="contents">
                <div className="relative w-full aspect-square border-b-2 border-black bg-surface-container overflow-hidden p-4 flex items-center justify-center">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8biZLVpkCJJRjqCxt_aWWSt7WvHN_QZTvMmuxfwtZ1RKNTb8pp_ZnF3N76Xtde45vuyX-CJt2ulU--w9lBPHGku0RkT3SP8eTZqXmBXEaLl1qj8gNSHYxV3-FTqAhKhDqOKVSisMll-vAUQE53L1O7ASWyMHZM_RHsrguBWcls1G0njZ16jw1BqNDrTqpMBHqQJN1DwMagkp4bl1Kb-pFJZ3IQj6JBk5M9eDfwsYD3KKuMxNJW_RSGhUqqQiLb342oSs9ellv_0D3" alt="Tactile Pro Keyboard" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
                  <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 font-mono text-xs uppercase font-bold border-2 border-black flex items-center gap-2">
                    New
                  </div>
                </div>
              </Link>
            </ProductHoverSpeaker>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-headline text-2xl leading-tight uppercase font-black">Tactile Pro<br />Keyboard</h3>
                <span className="font-mono text-lg font-bold bg-electric-pink text-white px-2 py-1">$189</span>
              </div>
              <p className="font-body text-gray-600 mb-6 flex-grow text-sm">Heavy-duty mechanical switches housed in a reinforced aluminum chassis. Built for high APM execution.</p>
              <div className="flex gap-2">
                <button className="bg-white text-black border-2 border-black font-mono font-bold px-4 py-3 uppercase flex-grow text-center hover:bg-black hover:text-white transition-colors neo-button flex items-center justify-center gap-2">
                  <ShoppingCart size={18} /> Add
                </button>
                <button className="bg-surface-container text-black border-2 border-black p-3 hover:bg-electric-pink hover:text-white transition-colors neo-button flex items-center justify-center">
                  <Heart size={20} />
                </button>
              </div>
            </div>
          </article>

          {/* Product 2 */}
          <article className="bg-white neo-border neo-shadow flex flex-col h-full group transition-all duration-200 hover:-translate-y-1 hover:neo-shadow-lg">
            <ProductHoverSpeaker
              productName="Acoustic Isolation Over-Ear"
              productDescription="Studio-grade drivers with absolute noise gating. For complete environmental detachment."
              productPrice={240}
            >
              <Link to="/product" className="contents">
                <div className="relative w-full aspect-square border-b-2 border-black bg-surface-container overflow-hidden p-4 flex items-center justify-center">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdSgcGAykcJiDJwYORA3S0fBoPn08FCuHb2EDwrIL96dVEdPlQB0I-r9Zj0TN7BTwP4q-vQn_ttFZu9cDGGLdBfkXHC2Jzp3VuyCd-xwp8c7V_Ayr29YsRvQl4sMhUjS84F2kKftfFS7YlgXLsKn598PQz_YlKLrpqCxCSrMPFfm6kEZ65rZZTwb9iwN3-SxABXEJOF4FRwa0Acnf8bmmefQPdPKpW6ruQGglcPN9fJ3o88Q-Ea4cruhysGqkbQBvywGERSda1jS3l" alt="Acoustic Isolation Over-Ear" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
                </div>
              </Link>
            </ProductHoverSpeaker>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-headline text-2xl leading-tight uppercase font-black">Acoustic Isolation<br />Over-Ear</h3>
                <span className="font-mono text-lg font-bold bg-black text-white px-2 py-1">$240</span>
              </div>
              <p className="font-body text-gray-600 mb-6 flex-grow text-sm">Studio-grade drivers with absolute noise gating. For complete environmental detachment.</p>
              <div className="flex gap-2">
                <button className="bg-white text-black border-2 border-black font-mono font-bold px-4 py-3 uppercase flex-grow text-center hover:bg-black hover:text-white transition-colors neo-button flex items-center justify-center gap-2">
                  <ShoppingCart size={18} /> Add
                </button>
                <button className="bg-surface-container text-black border-2 border-black p-3 hover:bg-electric-pink hover:text-white transition-colors neo-button flex items-center justify-center">
                  <Heart size={20} />
                </button>
              </div>
            </div>
          </article>
          
          {/* Product 3 */}
          <article className="bg-white neo-border neo-shadow flex flex-col h-full group transition-all duration-200 hover:-translate-y-1 hover:neo-shadow-lg">
            <ProductHoverSpeaker
              productName="Qi Ceramic Station"
              productDescription="High-density ceramic power slab. 15W rapid energy transfer with brutalist stability."
              productPrice={65}
            >
              <Link to="/product" className="contents">
                <div className="relative w-full aspect-square border-b-2 border-black bg-surface-container overflow-hidden flex items-center justify-center">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDARHQ5UueYxJBVVQlnB51PdhzWlKkicUAFtNvVa7N60HZ23FipCqVXkE_9j4d7uu4aNSgpnP4q6wqQPR4Od8g6Hzg5EMH4ieqbw04rOpswRdhIOHSkuaRZ1wO1ihacP95VK49IjczyUqKePNL67_b-ic3SN-oVoRxcV67GS3j7-VDahpWB1hfKdRovPZ9VGBNSfte69riMEHyMV43LIUPnbQ1RUzG9mROGAbv1a6mZHaXv4queKKAvdcoBou_EdEFNgB9BvA4cCA4x" alt="Qi Ceramic Station" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              </Link>
            </ProductHoverSpeaker>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-headline text-2xl leading-tight uppercase font-black">Qi Ceramic<br />Station</h3>
                <span className="font-mono text-lg font-bold bg-black text-white px-2 py-1">$65</span>
              </div>
              <p className="font-body text-gray-600 mb-6 flex-grow text-sm">High-density ceramic power slab. 15W rapid energy transfer with brutalist stability.</p>
              <div className="flex gap-2">
                <button className="bg-white text-black border-2 border-black font-mono font-bold px-4 py-3 uppercase flex-grow text-center hover:bg-black hover:text-white transition-colors neo-button flex items-center justify-center gap-2">
                  <ShoppingCart size={18} /> Add
                </button>
                <button className="bg-surface-container text-black border-2 border-black p-3 hover:bg-electric-pink hover:text-white transition-colors neo-button flex items-center justify-center">
                  <Heart size={20} />
                </button>
              </div>
            </div>
          </article>
        </div>

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
