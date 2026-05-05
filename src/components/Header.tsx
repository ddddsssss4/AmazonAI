import { ShoppingCart, User, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  return (
    <header className="bg-white border-b-2 border-black neo-shadow sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-full">
        <Link to="/" className="text-2xl font-headline font-black uppercase flex items-center gap-2">
          <span className="bg-black text-white px-2 py-1 text-lg">AE</span>
          AMAZON GLASS - EDGE
        </Link>
        <nav className="hidden md:flex gap-8 items-center font-headline font-black uppercase text-sm tracking-tighter">
          <Link to="/shop" className={`hover:text-electric-pink hover:bg-electric-pink hover:text-white transition-all px-2 py-1 ${location.pathname === '/shop' ? 'text-electric-pink border-b-4 border-electric-pink' : ''}`}>Shop</Link>
          <Link to="/" className="hover:text-electric-pink hover:bg-electric-pink hover:text-white transition-all px-2 py-1">Drops</Link>
          <Link to="/" className="hover:text-electric-pink hover:bg-electric-pink hover:text-white transition-all px-2 py-1">Support</Link>
          <Link to="/product" className={`hover:text-electric-pink hover:bg-electric-pink hover:text-white transition-all px-2 py-1 ${location.pathname === '/product' ? 'text-electric-pink border-b-4 border-electric-pink' : ''}`}>Product</Link>
        </nav>
        <div className="flex gap-4 items-center">
          {location.pathname === '/shop' && (
            <div className="hidden md:flex relative neo-border h-10">
              <input className="w-48 px-3 py-1 border-none focus:ring-0 font-mono text-sm bg-white text-black outline-none placeholder:text-gray-500" placeholder="SEARCH..." type="text" />
              <button className="bg-black text-white px-3 flex items-center justify-center hover:bg-electric-pink transition-colors">
                <Search size={18} />
              </button>
            </div>
          )}
          <button className="hover:bg-electric-pink hover:text-white transition-all p-2 border-2 border-transparent hover:border-black flex items-center justify-center">
            <ShoppingCart size={24} strokeWidth={2} />
          </button>
          <button className="hover:bg-electric-pink hover:text-white transition-all p-2 border-2 border-transparent hover:border-black flex items-center justify-center">
            <User size={24} strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  );
}
