import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';

// ── Horizontal scroll carousel ──────────────────────────────────────────────
interface CarouselItem {
  id: number;
  img: string;
  label: string;
}

function HorizontalCarousel({ items }: { items: CarouselItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => {
    if (ref.current) ref.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };
  return (
    <div className="relative group/carousel">
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white neo-border neo-shadow p-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black hover:text-white"
      >
        <ChevronLeft size={20} />
      </button>
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {items.map((item) => (
          <Link
            to={`/product/${item.id}`}
            key={item.id}
            className="flex-none w-36 flex flex-col gap-2 group/item"
          >
            <div className="w-36 h-36 neo-border neo-shadow overflow-hidden bg-surface-container flex-none">
              <img
                src={item.img}
                alt={item.label}
                className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="font-mono text-xs font-bold uppercase leading-tight line-clamp-2">{item.label}</span>
          </Link>
        ))}
      </div>
      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white neo-border neo-shadow p-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black hover:text-white"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

// ── Deal Collection Card (with internal prev/next) ───────────────────────────
interface DealProduct {
  id: number;
  img: string;
  name: string;
  price: string;
  originalPrice?: string;
}

interface DealCollectionProps {
  title: string;
  subtitle?: string;
  products: DealProduct[];
  accentColor?: string;
}

function DealCollection({ title, subtitle, products, accentColor = 'bg-black' }: DealCollectionProps) {
  const [idx, setIdx] = useState(0);
  const perPage = 2;
  const total = products.length;
  const prev = () => setIdx(i => Math.max(0, i - perPage));
  const next = () => setIdx(i => Math.min(total - perPage, i + perPage));
  const visible = products.slice(idx, idx + perPage);

  return (
    <div className="bg-white neo-border neo-shadow flex flex-col h-full">
      {/* header */}
      <div className={`${accentColor} text-white p-4 border-b-2 border-black`}>
        <h3 className="font-headline font-black uppercase text-lg leading-tight">{title}</h3>
        {subtitle && <p className="font-mono text-xs mt-1 opacity-80">{subtitle}</p>}
      </div>
      {/* product grid */}
      <div className="flex-grow grid grid-cols-2 gap-0 relative">
        {visible.map((p, i) => (
          <Link
            to={`/product/${p.id}`}
            key={p.id}
            className={`flex flex-col gap-2 p-3 hover:bg-surface-container transition-colors ${i === 0 ? 'border-r-2 border-black' : ''} border-b-2 border-black`}
          >
            <div className="w-full aspect-square overflow-hidden bg-surface-container">
              <img src={p.img} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <p className="font-mono text-[10px] font-bold leading-tight line-clamp-2">{p.name}</p>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-mono text-xs font-black">{p.price}</span>
              {p.originalPrice && (
                <span className="font-mono text-[10px] text-gray-400 line-through">{p.originalPrice}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
      {/* nav */}
      <div className="flex items-center justify-between p-3 border-t-2 border-black">
        <button
          onClick={prev}
          disabled={idx === 0}
          aria-label="Previous"
          className="p-1 neo-border disabled:opacity-30 hover:bg-black hover:text-white transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <Link to="/shop" className="font-mono text-xs font-bold uppercase hover:text-electric-pink transition-colors">
          See all
        </Link>
        <button
          onClick={next}
          disabled={idx + perPage >= total}
          aria-label="Next"
          className="p-1 neo-border disabled:opacity-30 hover:bg-black hover:text-white transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const LIGHTING_ITEMS: CarouselItem[] = [
  { id: 28, img: '/home/lamp-crystal-globe.jpg', label: 'Crystal Globe Lamp' },
  { id: 29, img: '/home/lamp-galaxy-night.jpg', label: 'Galaxy Night Light' },
  { id: 30, img: '/home/lamp-floral-mood.jpg', label: 'Floral Mood Lamp' },
  { id: 31, img: '/home/lamp-clip-reading.jpg', label: 'Clip Reading Light' },
  { id: 32, img: '/home/lamp-smart-plug-night.jpg', label: 'Smart Plug-In Nightlight' },
  { id: 33, img: '/home/lamp-sensor-wall.jpg', label: 'Sensor Wall Light' },
  { id: 34, img: '/home/lamp-warm-glow-strip.jpg', label: 'Warm Glow Strip' },
  { id: 35, img: '/home/lamp-nordic-table.jpg', label: 'Nordic Table Lamp' },
];

const KITCHEN_ITEMS: CarouselItem[] = [
  { id: 36, img: '/home/kitchen-chef-knife.jpg', label: 'Chef Knife Set' },
  { id: 37, img: '/home/kitchen-chopping-bowls.jpg', label: 'Colourful Chopping Bowls' },
  { id: 38, img: '/home/kitchen-ceramic-mug.jpg', label: 'Ceramic Mug' },
  { id: 39, img: '/home/kitchen-lunch-thermos.jpg', label: 'Lunch Thermos Flask' },
  { id: 40, img: '/home/kitchen-spice-jar.jpg', label: 'Storage Spice Jar' },
  { id: 41, img: '/home/kitchen-scale.jpg', label: 'Precision Kitchen Scale' },
  { id: 42, img: '/home/kitchen-travel-case.jpg', label: 'Travel Makeup Case' },
];

const SMALL_BIZ_PRODUCTS: DealProduct[] = [
  { id: 43, img: '/home/deal-wood-study-table.jpg', name: 'Engineered Wood Study & Office Table 120x60x75cm', price: '₹6,080', originalPrice: '₹13,000' },
  { id: 44, img: '/home/deal-bamboo-nightstand.jpg', name: 'Bamboo Bedside Nightstand with Drawer', price: '₹3,499', originalPrice: '₹7,200' },
  { id: 45, img: '/home/deal-floating-shelf.jpg', name: 'Minimalist Floating Wall Shelf Set of 3', price: '₹1,299', originalPrice: '₹2,800' },
  { id: 46, img: '/home/deal-rattan-basket.jpg', name: 'Rattan Storage Basket with Lid', price: '₹899', originalPrice: '₹1,600' },
];

const WOMEN_KITCHEN_PRODUCTS: DealProduct[] = [
  { id: 47, img: '/home/deal-fridge-organizer.jpg', name: 'hapo Refrigerator Organizer 6 Grid Compartments 1200ML', price: '₹263', originalPrice: '₹1,200' },
  { id: 48, img: '/home/deal-steel-lunchbox.jpg', name: 'Stainless Steel Lunch Box 3 Tier Tiffin', price: '₹449', originalPrice: '₹999' },
  { id: 49, img: '/home/deal-glass-bottle.jpg', name: 'Borosilicate Glass Water Bottle 1L with Sleeve', price: '₹349', originalPrice: '₹799' },
  { id: 50, img: '/home/deal-cookware-set.jpg', name: 'Non-stick Granite Cookware Set 5-Piece', price: '₹2,199', originalPrice: '₹5,499' },
];

const BEST_SELLERS_KITCHEN: DealProduct[] = [
  { id: 47, img: '/home/deal-vacuum-sealer-bags.jpg', name: 'Vacuum Sealer Bags Rolls 5-Pack Food Saver', price: '₹599', originalPrice: '₹1,200' },
  { id: 48, img: '/home/deal-nutribullet-blender.jpg', name: 'NutriBullet Pro 900W Personal Blender', price: '₹4,999', originalPrice: '₹8,500' },
  { id: 41, img: '/home/deal-kitchen-scale-digital.jpg', name: 'Digital Kitchen Scale 5kg with Tare Function', price: '₹349', originalPrice: '₹699' },
  { id: 39, img: '/home/deal-meat-thermometer.jpg', name: 'Instant Read Meat Thermometer Waterproof', price: '₹799', originalPrice: '₹1,499' },
];

const CURATED_COLLECTIONS: DealProduct[] = [
  { id: 46, img: '/home/deal-rocking-chair-cushion.jpg', name: 'DADDY COOL Multipurpose Extra Long Rocking Chair Cushion', price: '₹739', originalPrice: '₹1,299' },
  { id: 45, img: '/home/deal-outdoor-hammock.jpg', name: 'Outdoor Waterproof Hammock with Steel Stand', price: '₹3,299', originalPrice: '₹6,499' },
  { id: 34, img: '/home/deal-solar-pathway-lights.jpg', name: 'Garden Solar Pathway Lights Set of 12', price: '₹1,199', originalPrice: '₹2,800' },
  { id: 44, img: '/home/deal-camping-chair.jpg', name: 'Foldable Camping Chair with Side Pocket', price: '₹999', originalPrice: '₹1,999' },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 py-12 md:px-12 flex flex-col gap-16 md:gap-20">

      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[614px] border-b-2 border-black pb-12">
        <div className="lg:col-span-5 flex flex-col gap-8 z-10">
          <h1 className="font-headline text-[64px] leading-[0.9] md:text-[80px] uppercase font-black tracking-tighter">
            Designed <br /> for your <br /> <span className="text-electric-pink">everyday</span>
          </h1>
          <p className="font-body text-lg max-w-md bg-white neo-border p-4 neo-shadow text-gray-800">
            Unapologetic design. Brutal performance. The new standard for modern living essentials.
          </p>
          <div className="flex gap-4">
            <Link to="/shop" className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-mono uppercase neo-border neo-shadow neo-button hover:bg-electric-pink hover:border-black font-bold">
              Shop Now
            </Link>
            <Link to="/shop" className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-mono uppercase neo-border neo-shadow neo-button hover:bg-gray-100 font-bold">
              View Drops
            </Link>
          </div>
        </div>
        <div className="lg:col-span-7 relative h-[500px] w-full neo-border neo-shadow-lg bg-surface-container overflow-hidden group">
          <img src="/home/hero-banner.jpg" alt="Echo Studio Minimal" className="object-cover w-full h-full filter grayscale hover:grayscale-0 transition-all duration-500" />
          <div className="absolute top-4 right-4 bg-electric-pink text-white px-3 py-1 font-mono uppercase font-bold neo-border">
            New Arrival
          </div>
        </div>
      </section>

      {/* Lights & Lighting Carousel */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-end border-b-2 border-black pb-4">
          <div>
            <h2 className="font-headline text-[36px] font-black uppercase tracking-tight leading-none">Lights &amp; Lighting</h2>
            <p className="font-mono text-sm text-gray-500 mt-1">Popular picks — brighten your space</p>
          </div>
          <Link to="/shop" className="font-mono font-bold uppercase text-electric-pink hover:underline decoration-2 underline-offset-4 hidden md:block text-sm">
            See all &rarr;
          </Link>
        </div>
        <HorizontalCarousel items={LIGHTING_ITEMS} />
      </section>

      {/* Up to 60% off – Kitchen Banner */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-4 bg-black text-white neo-border neo-shadow px-6 py-4">
          <span className="font-headline text-2xl font-black uppercase whitespace-nowrap">Up to 60% off</span>
          <span className="w-0.5 h-8 bg-white opacity-30 hidden sm:block" />
          <span className="font-mono text-sm font-bold uppercase opacity-80">Cookware, kitchen tools &amp; more</span>
          <Link to="/shop" className="ml-auto font-mono text-xs font-bold uppercase text-electric-pink hover:underline whitespace-nowrap">
            See all
          </Link>
        </div>
        <HorizontalCarousel items={KITCHEN_ITEMS} />
      </section>

      {/* 4 Deal Collection Cards */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-end border-b-2 border-black pb-4">
          <h2 className="font-headline text-[36px] font-black uppercase tracking-tight leading-none">Top Deal Collections</h2>
          <Link to="/shop" className="font-mono font-bold uppercase text-electric-pink hover:underline decoration-2 underline-offset-4 hidden md:block text-sm">
            Browse all deals &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DealCollection
            title="Min. 30% off | Top selections from Small Businesses"
            products={SMALL_BIZ_PRODUCTS}
            accentColor="bg-black"
          />
          <DealCollection
            title="Up to 60% off | Home & kitchen essentials from Women"
            products={WOMEN_KITCHEN_PRODUCTS}
            accentColor="bg-electric-pink"
          />
          <DealCollection
            title="Best Sellers in Home & Kitchen"
            subtitle="Most loved by customers"
            products={BEST_SELLERS_KITCHEN}
            accentColor="bg-black"
          />
          <DealCollection
            title="Min. 30% off | Curated collections from Small Businesses"
            products={CURATED_COLLECTIONS}
            accentColor="bg-electric-pink"
          />
        </div>
      </section>

      {/* Featured Objects */}
      <section className="flex flex-col gap-8">
        <div className="flex justify-between items-end border-b-2 border-black pb-4">
          <h2 className="font-headline text-[48px] font-black uppercase tracking-tight">Featured Objects</h2>
          <Link to="/shop" className="font-mono font-bold uppercase text-electric-pink hover:underline decoration-2 underline-offset-4 hidden md:block">
            View All Objects &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* id=2: Acoustic Over-Ear headphones */}
          <article className="bg-white neo-border neo-shadow flex flex-col group cursor-pointer relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:neo-shadow-lg">
            <Link to="/product/2" className="contents">
              <div className="h-64 border-b-2 border-black overflow-hidden relative p-4 bg-surface-container flex items-center justify-center">
                <img src="/home/featured-acoustic-headphones.jpg" alt="Acoustic Over-Ear" className="object-cover h-full w-full mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4 flex flex-col gap-2 bg-white z-10 relative flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="font-headline font-bold uppercase text-xl leading-tight">Acoustic Over-Ear</h3>
                  <span className="font-mono font-bold">$240</span>
                </div>
                <p className="font-body text-gray-600 text-sm">Industrial Grade Audio.</p>
                <div className="mt-auto pt-4">
                  <span className="w-full py-3 bg-white text-black border-2 border-black font-mono font-bold uppercase hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2">
                    View Product <Plus size={18} strokeWidth={3} />
                  </span>
                </div>
              </div>
            </Link>
          </article>

          {/* id=1: Tactile Pro Keyboard */}
          <article className="bg-white neo-border neo-shadow flex flex-col group cursor-pointer relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:neo-shadow-lg">
            <Link to="/product/1" className="contents">
              <div className="h-64 border-b-2 border-black overflow-hidden relative p-4 bg-surface-container flex items-center justify-center">
                <img src="/home/featured-chrono-watch.jpg" alt="Tactile Pro Keyboard" className="object-cover h-full w-full mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4 flex flex-col gap-2 bg-white z-10 relative flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="font-headline font-bold uppercase text-xl leading-tight">Tactile Pro Keyboard</h3>
                  <span className="font-mono font-bold">$189</span>
                </div>
                <p className="font-body text-gray-600 text-sm">Precision Keystroke.</p>
                <div className="mt-auto pt-4">
                  <span className="w-full py-3 bg-white text-black border-2 border-black font-mono font-bold uppercase hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2">
                    View Product <Plus size={18} strokeWidth={3} />
                  </span>
                </div>
              </div>
            </Link>
          </article>

          {/* id=22: Essential Fleece Hoodie */}
          <article className="bg-white neo-border neo-shadow flex flex-col group cursor-pointer relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:neo-shadow-lg">
            <Link to="/product/22" className="contents">
              <div className="h-64 border-b-2 border-black overflow-hidden relative p-0 bg-surface-container flex items-center justify-center">
                <img src="/home/featured-morning-ceramic.jpg" alt="Essential Fleece Hoodie" className="object-cover h-full w-full mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 font-mono text-[10px] font-bold uppercase z-20">Best Seller</div>
              </div>
              <div className="p-4 flex flex-col gap-2 bg-white z-10 relative flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="font-headline font-bold uppercase text-xl leading-tight">Essential Fleece Hoodie</h3>
                  <span className="font-mono font-bold">$55</span>
                </div>
                <p className="font-body text-gray-600 text-sm">380gsm Warmth.</p>
                <div className="mt-auto pt-4">
                  <span className="w-full py-3 bg-white text-black border-2 border-black font-mono font-bold uppercase hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2">
                    View Product <Plus size={18} strokeWidth={3} />
                  </span>
                </div>
              </div>
            </Link>
          </article>

          {/* id=25: Classic Biker Jacket */}
          <article className="bg-white neo-border neo-shadow flex flex-col group cursor-pointer relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:neo-shadow-lg">
            <Link to="/product/25" className="contents">
              <div className="h-64 border-b-2 border-black overflow-hidden relative p-0 bg-surface-container flex items-center justify-center">
                <img src="/home/featured-slim-folio.jpg" alt="Classic Biker Jacket" className="object-cover h-full w-full mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4 flex flex-col gap-2 bg-white z-10 relative flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="font-headline font-bold uppercase text-xl leading-tight">Classic Biker Jacket</h3>
                  <span className="font-mono font-bold">$249</span>
                </div>
                <p className="font-body text-gray-600 text-sm">Full-grain Cowhide.</p>
                <div className="mt-auto pt-4">
                  <span className="w-full py-3 bg-white text-black border-2 border-black font-mono font-bold uppercase hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2">
                    View Product <Plus size={18} strokeWidth={3} />
                  </span>
                </div>
              </div>
            </Link>
          </article>
        </div>
      </section>

    </main>
  );
}
