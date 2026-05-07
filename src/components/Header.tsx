import { ShoppingCart, Search, MapPin, Menu, ChevronDown, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const location = useLocation();
  const { totalItems } = useCart();

  return (
    <header className="bg-white border-b-2 border-black neo-shadow sticky top-0 z-50 flex flex-col">
      {/* Top Row - Main Nav */}
      <div className="flex flex-wrap xl:flex-nowrap items-center w-full px-4 py-3 gap-y-4 gap-x-6">
        
        {/* Logo and Mobile Right Icons */}
        <div className="flex items-center justify-between w-full xl:w-auto shrink-0">
          <Link to="/" className="text-2xl md:text-3xl font-headline font-black uppercase flex items-end gap-1 whitespace-nowrap">
            <div className="flex items-center gap-1">
               <span className="bg-black text-white px-2 py-1 text-xl leading-none">A</span>
               <span className="tracking-tighter leading-none">AMAZON</span>
            </div>
            <span className="text-base leading-none mb-[2px]">.IN</span>
          </Link>
          
          {/* Mobile Right Icons */}
          <div className="flex xl:hidden items-center gap-6">
            <Link to="/" className="font-mono uppercase font-bold hover:text-electric-pink text-sm flex items-center gap-1">
              Sign In <ChevronRight size={16} strokeWidth={3} />
            </Link>
            <Link to="/cart" className="relative hover:text-electric-pink flex items-center">
              <ShoppingCart size={28} strokeWidth={2.5} />
              <span className="absolute -top-2 -right-2 bg-electric-pink text-white text-[10px] w-5 h-5 flex items-center justify-center neo-border font-bold">{totalItems}</span>
            </Link>
          </div>
        </div>
        
        {/* Delivery Location (Hidden on smaller screens to save space) */}
        <button className="hidden md:flex items-center gap-2 hover:text-electric-pink transition-colors font-mono uppercase text-left shrink-0">
          <MapPin size={24} strokeWidth={2.5} />
          <div className="flex flex-col leading-none gap-1">
            <span className="text-[11px] font-bold text-gray-500">Delivering to Pune 411001</span>
            <span className="text-sm font-black">Update location</span>
          </div>
        </button>

        {/* Search Bar - Takes up remaining space */}
        <div className="flex w-full xl:w-auto xl:flex-grow relative neo-border h-12 shadow-[4px_4px_0px_0px_#FF2D92] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#FF2D92] transition-all bg-white group focus-within:shadow-[2px_2px_0px_0px_#FF2D92] focus-within:translate-x-[2px] focus-within:translate-y-[2px] shrink-0 xl:shrink">
          {/* Category Dropdown */}
          <div className="hidden md:flex items-center px-4 bg-surface-container border-r-2 border-black font-mono text-sm font-bold uppercase cursor-pointer hover:bg-gray-200 text-gray-700 transition-colors">
            All <ChevronDown size={14} className="ml-2" strokeWidth={3} />
          </div>
          <input 
            className="flex-grow min-w-0 px-4 py-2 border-none focus:ring-0 font-body text-base bg-white text-black outline-none placeholder:text-gray-500" 
            placeholder="Search Amazon.in" 
            type="text" 
          />
          <button className="bg-electric-pink text-black px-6 flex items-center justify-center border-l-2 border-black hover:bg-black hover:text-white transition-colors shrink-0">
            <Search size={22} strokeWidth={3} />
          </button>
        </div>

        {/* Right side icons/actions */}
        <div className="hidden xl:flex gap-6 items-center shrink-0">
          {/* Language */}
          <button className="flex items-center gap-1 font-mono font-bold uppercase text-sm hover:text-electric-pink transition-colors px-2">
            <span className="text-lg leading-none">🇮🇳</span> 
            EN <ChevronDown size={14} strokeWidth={3} />
          </button>

          {/* Account */}
          <Link to="/" className="flex flex-col leading-none font-mono hover:text-electric-pink transition-colors text-left uppercase gap-1 px-2">
            <span className="text-[11px] font-bold text-gray-500">Hello, sign in</span>
            <span className="text-sm font-black flex items-center gap-1">Account & Lists <ChevronDown size={14} strokeWidth={3} /></span>
          </Link>

          {/* Orders */}
          <Link to="/" className="flex flex-col leading-none font-mono hover:text-electric-pink transition-colors text-left uppercase gap-1 px-2">
            <span className="text-[11px] font-bold text-gray-500">Returns</span>
            <span className="text-sm font-black">& Orders</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="flex items-end gap-1 font-headline uppercase font-black hover:text-electric-pink transition-colors text-lg pt-3 px-2">
            <div className="relative flex">
              <ShoppingCart size={36} strokeWidth={2.5} />
              <span className="absolute -top-3 -right-2 bg-electric-pink text-white text-xs w-6 h-6 flex items-center justify-center neo-border font-mono font-bold">{totalItems}</span>
            </div>
            <span className="leading-none mb-1">Cart</span>
          </Link>
        </div>
      </div>

      {/* Bottom Row - Sub Nav */}
      <div className="border-t-2 border-black flex items-center justify-between bg-surface-container overflow-hidden">
        <div className="flex items-center overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full xl:w-auto flex-grow">
          {/* Main Subnav Links */}
          <div className="flex items-center font-mono font-bold uppercase text-[13px] h-10 w-max">
            <button className="flex items-center gap-2 hover:bg-black hover:text-white px-4 h-full border-r-2 border-transparent hover:border-black transition-colors">
              <Menu size={20} strokeWidth={3} /> All
            </button>
            
            <Link to="/shop" className="hover:bg-electric-pink hover:text-white px-3 h-full flex items-center border-r-2 border-transparent transition-colors">Fresh <ChevronDown size={14} className="ml-1" strokeWidth={3} /></Link>
            <Link to="/shop" className="hover:bg-electric-pink hover:text-white px-3 h-full flex items-center border-r-2 border-transparent transition-colors">MX Player</Link>
            <Link to="/shop" className="hover:bg-electric-pink hover:text-white px-3 h-full flex items-center border-r-2 border-transparent transition-colors">Sell</Link>
            <Link to="/shop" className="hover:bg-electric-pink hover:text-white px-3 h-full flex items-center border-r-2 border-transparent transition-colors">Bestsellers</Link>
            <Link to="/shop" className="hover:bg-electric-pink hover:text-white px-3 h-full flex items-center border-r-2 border-transparent transition-colors">Mobiles</Link>
            <Link to="/shop" className="hover:bg-electric-pink hover:text-white px-3 h-full flex items-center border-r-2 border-transparent transition-colors">Today's Deals</Link>
            <Link to="/shop" className="hover:bg-electric-pink hover:text-white px-3 h-full flex items-center border-r-2 border-transparent transition-colors">Customer Service</Link>
            <Link to="/shop" className="hover:bg-electric-pink hover:text-white px-3 h-full flex items-center border-r-2 border-transparent transition-colors">New Releases</Link>
            <Link to="/shop" className="hover:bg-electric-pink hover:text-white px-3 h-full flex items-center border-r-2 border-transparent transition-colors">Prime <ChevronDown size={14} className="ml-1" strokeWidth={3} /></Link>
            <Link to="/shop" className="hover:bg-electric-pink hover:text-white px-3 h-full flex items-center border-r-2 border-transparent transition-colors">Amazon Pay</Link>
            <Link to="/shop" className="hover:bg-electric-pink hover:text-white px-3 h-full flex items-center border-r-2 border-transparent transition-colors">Electronics</Link>
            <Link to="/shop" className="hover:bg-electric-pink hover:text-white px-3 h-full flex items-center border-r-2 border-transparent transition-colors">Fashion</Link>
            <Link to="/shop" className="hover:bg-electric-pink hover:text-white px-3 h-full flex items-center border-r-2 border-transparent transition-colors">Home & Kitchen</Link>
            <Link to="/shop" className="hover:bg-electric-pink hover:text-white px-3 h-full flex items-center border-r-2 border-transparent transition-colors">Computers</Link>
            <Link to="/shop" className="hover:bg-electric-pink hover:text-white px-3 h-full flex items-center border-r-2 border-transparent transition-colors">Books</Link>
            <Link to="/shop" className="hover:bg-electric-pink hover:text-white px-3 h-full flex items-center border-r-2 border-transparent transition-colors pr-6 lg:pr-3">Toys & Games</Link>
          </div>
        </div>
        
        {/* Right Promo Banner */}
        <Link to="/shop" className="hidden lg:flex items-center gap-2 px-4 shrink-0 font-headline font-black uppercase hover:bg-black hover:text-white h-10 border-l-2 border-black transition-colors group">
          <span className="text-electric-pink group-hover:text-white text-[15px] leading-none pt-[2px]">Great Summer Sale</span>
          <span className="flex items-center text-sm leading-none border-l-2 border-black pl-2 group-hover:border-white h-full">
            <span className="pt-[2px]">Date Revealed</span> <ChevronRight size={16} strokeWidth={3} className="ml-1" />
          </span>
        </Link>
      </div>
    </header>
  );
}
