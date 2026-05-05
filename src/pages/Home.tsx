import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 py-12 md:px-12 flex flex-col gap-16 md:gap-24">
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

      {/* Featured Objects */}
      <section className="flex flex-col gap-8">
        <div className="flex justify-between items-end border-b-2 border-black pb-4">
          <h2 className="font-headline text-[48px] font-black uppercase tracking-tight">Featured Objects</h2>
          <Link to="/shop" className="font-mono font-bold uppercase text-electric-pink hover:underline decoration-2 underline-offset-4 hidden md:block">
            View All Objects -&gt;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
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
          
          {/* Card 2 */}
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

          {/* Card 3 */}
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

          {/* Card 4 */}
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
