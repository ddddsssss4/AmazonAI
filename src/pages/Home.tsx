import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';

// ── Horizontal scroll carousel ──────────────────────────────────────────────
interface CarouselItem {
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
        {items.map((item, i) => (
          <Link
            to="/shop"
            key={i}
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
            to="/shop"
            key={i}
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
  { img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&q=80', label: 'Crystal Globe Lamp' },
  { img: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=300&q=80', label: 'Galaxy Night Light' },
  { img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80', label: 'Floral Mood Lamp' },
  { img: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=300&q=80', label: 'Clip Reading Light' },
  { img: 'https://images.unsplash.com/photo-1513506003901-1e6a35073a57?w=300&q=80', label: 'Smart Plug-In Nightlight' },
  { img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80', label: 'Sensor Wall Light' },
  { img: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=300&q=80', label: 'Warm Glow Strip' },
  { img: 'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=300&q=80', label: 'Nordic Table Lamp' },
];

const KITCHEN_ITEMS: CarouselItem[] = [
  { img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80', label: 'Chef Knife Set' },
  { img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300&q=80', label: 'Colourful Chopping Bowls' },
  { img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&q=80', label: 'Ceramic Mug' },
  { img: 'https://images.unsplash.com/photo-1585837575652-267e041d8a9e?w=300&q=80', label: 'Lunch Thermos Flask' },
  { img: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=300&q=80', label: 'Storage Spice Jar' },
  { img: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&q=80', label: 'Precision Kitchen Scale' },
  { img: 'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?w=300&q=80', label: 'Travel Makeup Case' },
];

const SMALL_BIZ_PRODUCTS: DealProduct[] = [
  { img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80', name: 'Engineered Wood Study & Office Table 120x60x75cm', price: '₹6,080', originalPrice: '₹13,000' },
  { img: 'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=300&q=80', name: 'Bamboo Bedside Nightstand with Drawer', price: '₹3,499', originalPrice: '₹7,200' },
  { img: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=300&q=80', name: 'Minimalist Floating Wall Shelf Set of 3', price: '₹1,299', originalPrice: '₹2,800' },
  { img: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=300&q=80', name: 'Rattan Storage Basket with Lid', price: '₹899', originalPrice: '₹1,600' },
];

const WOMEN_KITCHEN_PRODUCTS: DealProduct[] = [
  { img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300&q=80', name: 'hapo Refrigerator Organizer 6 Grid Compartments 1200ML', price: '₹263', originalPrice: '₹1,200' },
  { img: 'https://images.unsplash.com/photo-1585837575652-267e041d8a9e?w=300&q=80', name: 'Stainless Steel Lunch Box 3 Tier Tiffin', price: '₹449', originalPrice: '₹999' },
  { img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&q=80', name: 'Borosilicate Glass Water Bottle 1L with Sleeve', price: '₹349', originalPrice: '₹799' },
  { img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80', name: 'Non-stick Granite Cookware Set 5-Piece', price: '₹2,199', originalPrice: '₹5,499' },
];

const BEST_SELLERS_KITCHEN: DealProduct[] = [
  { img: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=300&q=80', name: 'Vacuum Sealer Bags Rolls 5-Pack Food Saver', price: '₹599', originalPrice: '₹1,200' },
  { img: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&q=80', name: 'NutriBullet Pro 900W Personal Blender', price: '₹4,999', originalPrice: '₹8,500' },
  { img: 'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?w=300&q=80', name: 'Digital Kitchen Scale 5kg with Tare Function', price: '₹349', originalPrice: '₹699' },
  { img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80', name: 'Instant Read Meat Thermometer Waterproof', price: '₹799', originalPrice: '₹1,499' },
];

const CURATED_COLLECTIONS: DealProduct[] = [
  { img: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=300&q=80', name: 'DADDY COOL Multipurpose Extra Long Rocking Chair Cushion', price: '₹739', originalPrice: '₹1,299' },
  { img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&q=80', name: 'Outdoor Waterproof Hammock with Steel Stand', price: '₹3,299', originalPrice: '₹6,499' },
  { img: 'https://images.unsplash.com/photo-1513506003901-1e6a35073a57?w=300&q=80', name: 'Garden Solar Pathway Lights Set of 12', price: '₹1,199', originalPrice: '₹2,800' },
  { img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80', name: 'Foldable Camping Chair with Side Pocket', price: '₹999', originalPrice: '₹1,999' },
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
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeIF9XFbIvRRh4OXOdTdTeXS051eN0KOCM1lubY2zI2CbvaK-cgFpmxLoNvAKcWYxeMr0KhyaaeElMRX-SBPRo5ub6498mRpPafcxqTDCMYZDH_-p7vLGdPnWabL4nNldCQsIqIyQup0moFegVlITbRgifKoTB99zPdtfJLN9ESalVwAkhARGMwlJeNPHR471c708U1E5EP_GNpLYyG4igpoOku0bug-Y7ZsFnWi2v5vL8AgSYQiZMY9zC2_eBeUm0y0FIJstQOF8v" alt="Echo Studio Minimal" className="object-cover w-full h-full filter grayscale hover:grayscale-0 transition-all duration-500" />
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
          <article className="bg-white neo-border neo-shadow flex flex-col group cursor-pointer relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:neo-shadow-lg">
            <Link to="/product" className="contents">
              <div className="h-64 border-b-2 border-black overflow-hidden relative p-4 bg-surface-container flex items-center justify-center">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuABdGboraAV8hzhGGRn-_ykfZbVoi--iefeU58GOLCVoTz0_251hHsrpTJEyqsY9K0-QEzEF8wmNOmt-yFSNjG50fGEsUpgsZBVXGsFFfKE2-RNdF65Ca8BX3PpZtDQyrZz-tCcaXEtNWnH1tizAJfRkAkRcsTQc6NvRe7ipshSmaYb1WtldgRQfYA50G-m028CVfi0hqrEw1dzRsAdzD8Q4YZGsP1k5O3MB6If3y_36Qsdsci4PIIXb3BfJLcOqIL8potw8Uu3wtJK" alt="Acoustic Over-Ear" className="object-cover h-full w-full mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4 flex flex-col gap-2 bg-white z-10 relative flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="font-headline font-bold uppercase text-xl leading-tight">Acoustic Over-Ear</h3>
                  <span className="font-mono font-bold">$299</span>
                </div>
                <p className="font-body text-gray-600 text-sm">Industrial Grade Audio.</p>
                <div className="mt-auto pt-4">
                  <button className="w-full py-3 bg-white text-black border-2 border-black font-mono font-bold uppercase hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2">
                    Add to Cart <Plus size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </Link>
          </article>

          <article className="bg-white neo-border neo-shadow flex flex-col group cursor-pointer relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:neo-shadow-lg">
            <div className="h-64 border-b-2 border-black overflow-hidden relative p-4 bg-surface-container flex items-center justify-center">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCN1L-FJhHkvLcFGEy74ARSTaPPE65ohBOXtWnL1LD6kMZXa_M10w3zKNnXQEm0kGtH7VnxJSv6x1wshtI9jmq1N0H43kVTS8Yg28q45udOfODxwVVR4aeAvj6l11JBK9KYggDmWCCO-hfac-lgPv5HwN2oAEjzZwj8mlOm2uhePudUHS46Y_YXvc0vX5_9If0AvcYU1HjcX4RaYto5LCOW01V6IVXIyXnpbZxb6-SkzFXsI4ei4kN84w5rRv8RB3E9_Kbffo0YiRTn" alt="Essential Chrono" className="object-cover h-full w-full mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-4 flex flex-col gap-2 bg-white z-10 relative flex-grow">
              <div className="flex justify-between items-start">
                <h3 className="font-headline font-bold uppercase text-xl leading-tight">Essential Chrono</h3>
                <span className="font-mono font-bold">$149</span>
              </div>
              <p className="font-body text-gray-600 text-sm">Precision Timekeeping.</p>
              <div className="mt-auto pt-4">
                <button className="w-full py-3 bg-white text-black border-2 border-black font-mono font-bold uppercase hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2">
                  Add to Cart <Plus size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          </article>

          <article className="bg-white neo-border neo-shadow flex flex-col group cursor-pointer relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:neo-shadow-lg">
            <div className="h-64 border-b-2 border-black overflow-hidden relative p-0 bg-surface-container flex items-center justify-center">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcSHAZSMU21yRG2YHQ81hslwhKgjKh0ZWPVmHmlRek1VxsjsgCPRyBZLd2-ZI_3oICkOM0A1xsXNTOxi0bRaFNwA5Vfrj-zeQbBB38D9ssIyi7qNhh5rJ2U6tRmNCh_ckSlwmceSnNJQfj6AZZS51WwMoDizrYyvoDCEdH0Dwr5B7bGNYK3yhn3O_9Dlu-IdRfxwC3Z-2QUAMZgiYi9FXkEdXSATVwi41S21vNXPe2FTnCh55YgFB01mahbRX2GkH2JsTzOmsriPvy" alt="Morning Ceramic" className="object-cover h-full w-full mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 font-mono text-[10px] font-bold uppercase z-20">Best Seller</div>
            </div>
            <div className="p-4 flex flex-col gap-2 bg-white z-10 relative flex-grow">
              <div className="flex justify-between items-start">
                <h3 className="font-headline font-bold uppercase text-xl leading-tight">Morning Ceramic</h3>
                <span className="font-mono font-bold">$85</span>
              </div>
              <p className="font-body text-gray-600 text-sm">Raw Form Function.</p>
              <div className="mt-auto pt-4">
                <button className="w-full py-3 bg-white text-black border-2 border-black font-mono font-bold uppercase hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2">
                  Add to Cart <Plus size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          </article>

          <article className="bg-white neo-border neo-shadow flex flex-col group cursor-pointer relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:neo-shadow-lg">
            <div className="h-64 border-b-2 border-black overflow-hidden relative p-0 bg-surface-container flex items-center justify-center">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZNh8DCGXeuZErRcVS_R0_XaOSBpSR-u3wgdht_Db9rhrLxpYK0fcZ9unW_3tWDJEJkX99X-QRG0rbvWIV-9UMJkOAtQdzZCLJbYrOJjLE6ARC717_Z3sPZkuGbJLYVvA91YHDMXHJ9HvHoSORxnYLoFkOyv8MY_LDk8zKjlUJbGefgXu8iN3nUaKwGr9TjLT1zqlLiFUSHa6efqWcUI3BIKjg8WpR8Vfydn04LwGbvkrPObiEGxBZr-qgeFjJASgv62OK-3Gy_SjI" alt="Slim Folio" className="object-cover h-full w-full mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-4 flex flex-col gap-2 bg-white z-10 relative flex-grow">
              <div className="flex justify-between items-start">
                <h3 className="font-headline font-bold uppercase text-xl leading-tight">Slim Folio</h3>
                <span className="font-mono font-bold">$110</span>
              </div>
              <p className="font-body text-gray-600 text-sm">Uncompromising Storage.</p>
              <div className="mt-auto pt-4">
                <button className="w-full py-3 bg-white text-black border-2 border-black font-mono font-bold uppercase hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2">
                  Add to Cart <Plus size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

    </main>
  );
}
