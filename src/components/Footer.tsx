import { ChevronDown, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full flex flex-col mt-auto bg-black text-white border-t-2 border-black">
      {/* Back to top */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="bg-surface-container text-black hover:bg-electric-pink hover:text-white transition-colors text-center py-4 font-mono font-bold uppercase border-b-2 border-black w-full"
      >
        Back to top
      </button>

      {/* Main Footer Links */}
      <div className="w-full px-6 py-12 border-b-2 border-surface-container/20">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 font-body text-sm">
          {/* Column 1 */}
          <div className="flex flex-col gap-3">
            <h3 className="font-headline font-bold uppercase text-base mb-2">Get to Know Us</h3>
            <Link to="#" className="hover:text-electric-pink hover:underline underline-offset-2 transition-colors">About Amazon Glass</Link>
            <Link to="#" className="hover:text-electric-pink hover:underline underline-offset-2 transition-colors">Careers</Link>
            <Link to="#" className="hover:text-electric-pink hover:underline underline-offset-2 transition-colors">Press Releases</Link>
            <Link to="#" className="hover:text-electric-pink hover:underline underline-offset-2 transition-colors">Amazon Science</Link>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-3">
            <h3 className="font-headline font-bold uppercase text-base mb-2">Connect with Us</h3>
            <Link to="#" className="hover:text-electric-pink hover:underline underline-offset-2 transition-colors">Facebook</Link>
            <Link to="#" className="hover:text-electric-pink hover:underline underline-offset-2 transition-colors">Twitter</Link>
            <Link to="#" className="hover:text-electric-pink hover:underline underline-offset-2 transition-colors">Instagram</Link>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-3">
            <h3 className="font-headline font-bold uppercase text-base mb-2">Make Money with Us</h3>
            <Link to="#" className="hover:text-electric-pink hover:underline underline-offset-2 transition-colors">Sell on Amazon Glass</Link>
            <Link to="#" className="hover:text-electric-pink hover:underline underline-offset-2 transition-colors">Sell under Accelerator</Link>
            <Link to="#" className="hover:text-electric-pink hover:underline underline-offset-2 transition-colors">Protect and Build Your Brand</Link>
            <Link to="#" className="hover:text-electric-pink hover:underline underline-offset-2 transition-colors">Global Selling</Link>
            <Link to="#" className="hover:text-electric-pink hover:underline underline-offset-2 transition-colors">Supply to Amazon</Link>
            <Link to="#" className="hover:text-electric-pink hover:underline underline-offset-2 transition-colors">Become an Affiliate</Link>
            <Link to="#" className="hover:text-electric-pink hover:underline underline-offset-2 transition-colors">Fulfilment by Amazon</Link>
            <Link to="#" className="hover:text-electric-pink hover:underline underline-offset-2 transition-colors">Advertise Your Products</Link>
            <Link to="#" className="hover:text-electric-pink hover:underline underline-offset-2 transition-colors">Amazon Pay on Merchants</Link>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col gap-3">
            <h3 className="font-headline font-bold uppercase text-base mb-2">Let Us Help You</h3>
            <Link to="#" className="hover:text-electric-pink hover:underline underline-offset-2 transition-colors">Your Account</Link>
            <Link to="#" className="hover:text-electric-pink hover:underline underline-offset-2 transition-colors">Returns Centre</Link>
            <Link to="#" className="hover:text-electric-pink hover:underline underline-offset-2 transition-colors">Recalls and Product Safety</Link>
            <Link to="#" className="hover:text-electric-pink hover:underline underline-offset-2 transition-colors">100% Purchase Protection</Link>
            <Link to="#" className="hover:text-electric-pink hover:underline underline-offset-2 transition-colors">Amazon App Download</Link>
            <Link to="#" className="hover:text-electric-pink hover:underline underline-offset-2 transition-colors">Help</Link>
          </div>
        </div>
      </div>

      {/* Middle Section: Logo & Locales */}
      <div className="w-full px-6 py-8 border-b-2 border-surface-container/20">
        <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
          <Link to="/" className="text-2xl font-headline font-black uppercase flex items-end gap-1">
            <span className="bg-white text-black px-2 py-1 text-xl leading-none">A</span>
            <span className="tracking-tighter leading-none text-white">AMAZON<span className="text-base font-normal">.IN</span></span>
          </Link>
          
          <div className="flex gap-4">
            <button className="flex items-center gap-2 border-2 border-white/50 hover:border-white px-4 py-2 font-mono text-sm transition-colors text-white">
              <Globe size={16} /> English <ChevronDown size={14} />
            </button>
            <button className="flex items-center gap-2 border-2 border-white/50 hover:border-white px-4 py-2 font-mono text-sm transition-colors text-white uppercase">
              <span>🇮🇳</span> India
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Brands & Legal */}
      <div className="w-full bg-[#111] px-6 py-8">
        <div className="max-w-[1000px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-body text-xs mb-8 text-gray-300">
            <Link to="#" className="flex flex-col hover:underline">
              <span className="text-white font-bold">AbeBooks</span>
              <span>Books, art</span>
              <span>& collectibles</span>
            </Link>
            <Link to="#" className="flex flex-col hover:underline">
              <span className="text-white font-bold">Amazon Web Services</span>
              <span>Scalable Cloud</span>
              <span>Computing Services</span>
            </Link>
            <Link to="#" className="flex flex-col hover:underline">
              <span className="text-white font-bold">Audible</span>
              <span>Download</span>
              <span>Audio Books</span>
            </Link>
            <Link to="#" className="flex flex-col hover:underline">
              <span className="text-white font-bold">IMDb</span>
              <span>Movies, TV</span>
              <span>& Celebrities</span>
            </Link>
            
            <Link to="#" className="flex flex-col hover:underline">
              <span className="text-white font-bold">Shopbop</span>
              <span>Designer</span>
              <span>Fashion Brands</span>
            </Link>
            <Link to="#" className="flex flex-col hover:underline">
              <span className="text-white font-bold">Amazon Business</span>
              <span>Everything For</span>
              <span>Your Business</span>
            </Link>
            <Link to="#" className="flex flex-col hover:underline">
              <span className="text-white font-bold">Amazon Prime Music</span>
              <span>100 million songs, ad-free</span>
              <span>Over 15 million podcast episodes</span>
            </Link>
          </div>

          <div className="flex flex-col items-center gap-2 text-xs font-body text-gray-300">
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="#" className="hover:underline">Conditions of Use & Sale</Link>
              <Link to="#" className="hover:underline">Privacy Notice</Link>
              <Link to="#" className="hover:underline">Interest-Based Ads</Link>
            </div>
            <p className="font-mono opacity-80 mt-2">© 1996-2026, Amazon.com, Inc. or its affiliates</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

