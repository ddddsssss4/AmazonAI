export default function Footer() {
  return (
    <footer className="bg-white border-t-2 border-black mt-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full p-12 max-w-[1600px] mx-auto">
        <div className="flex flex-col gap-4">
          <div className="text-lg font-headline font-black uppercase">
            AMAZON GLASS - EDGE
          </div>
          <p className="font-body max-w-sm mt-4 text-sm text-gray-800">
            We design tools for modern life. Unapologetic aesthetics meeting brutal functionality.
          </p>
          <p className="font-mono text-xs opacity-60 mt-auto pt-8">
            © 2026 AMAZON GLASS - EDGE. NO REGRETS.
          </p>
        </div>
        <div className="flex flex-col md:items-end justify-between gap-8 h-full">
          <nav className="flex flex-col gap-4 md:text-right font-headline font-bold uppercase text-sm">
            <a href="#" className="opacity-80 hover:opacity-100 hover:-skew-x-6 transition-transform hover:underline decoration-electric-pink decoration-4 underline-offset-4">Terms of Service</a>
            <a href="#" className="opacity-80 hover:opacity-100 hover:-skew-x-6 transition-transform hover:underline decoration-electric-pink decoration-4 underline-offset-4">Privacy Protocol</a>
            <a href="#" className="opacity-80 hover:opacity-100 hover:-skew-x-6 transition-transform hover:underline decoration-electric-pink decoration-4 underline-offset-4">Shipping Logistics</a>
            <a href="#" className="opacity-80 hover:opacity-100 hover:-skew-x-6 transition-transform hover:underline decoration-electric-pink decoration-4 underline-offset-4">Return Portal</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
