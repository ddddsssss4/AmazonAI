import { ShoppingBag, ChevronDown } from 'lucide-react';

export default function Product() {
  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
      {/* Left: Product Image */}
      <div className="lg:col-span-7 flex flex-col gap-8">
        <div className="w-full aspect-square bg-surface-container border-2 border-black neo-shadow-lg overflow-hidden relative group">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVbQCzN_XfpVSWMXBWs7o9dEZ7CSnsrVAh-NtWFHmKr2pdZq-iad5u-HpJ0ffsTg62oyKVjtpn3wJTvgPGmQj3PJIbfyU9Uf-ajJv39PtSeP1eZsI42Ttn4o9mZT_AcEcbBcsrOS_OtHcaXfranycl9SI8uGDjVNK3IioEPfQqQs2RzozjZIEybvqIYE8YwtqC6R4KDigriDuRqbA4A5EFo-rfLBUQ0gLcTmGxbm3tDXuazMZLVfFK8zto6f6rrYcdWMXBKT9oLQH2" alt="Acoustic Over-Ear Headphones" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute top-4 left-4 font-mono text-sm bg-black text-white px-3 py-1 border-2 border-black font-bold uppercase">NEW DROP</div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <button className="aspect-square bg-surface-container border-2 border-black neo-shadow overflow-hidden neo-hover-sink">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsdfZsOoD3WGzo7pHnNAbToZwxFXGwTfBoymNINrgx8gPOx3br0M5GGNAAZmbGFhyqAh1tTly-Wst-QJNmktD1EjHiNDY2Yu_P1Z00HaKawmJOcT3zVtjKpa5QKzEx9WkYFvdpHKS8O-cGlJbWl3EU-XqUzErgIQqsTnDSFljJv_6ZW-CY3ZCD-Ie4ppWCrgFk453Io4Ig8hOYERCQDQmn2SqwWwWZX4mt65Bo7thsayb57DWbj-fWO5FpaWNi943j-UVfzCtP3BpJ" alt="Acoustic Over-Ear Side View" className="w-full h-full object-cover" />
          </button>
          <button className="aspect-square bg-surface-container border-2 border-black neo-shadow overflow-hidden neo-hover-sink">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtDK5FrGk9PyElHbpPW7jNjJmgduPagL0hEbuRKBLLqtwXga2YU_kRhP18mkc0B-CBG0m16YSZqUugJd-G1vqd6Zvlq2AIXj70IFClTFq8E8APH0ZTr8DWQPPr1vNgVTN-4scAkhUsRRB2nW5HMc2NQjsq4EaIlMsp9IXufzqnxc_g2xsBxt3wgGySMI9vHeisfTC7CWCsf8IafhKiwf28uLsl1rMe0cFwVcWnEbIf_61jrBU7yQfzD3e8PuiLeDakm4z5PhAU-mZe" alt="Acoustic Over-Ear Detail" className="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      {/* Right: Product Info */}
      <div className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-24 self-start">
        <div className="flex flex-col gap-4">
          <h1 className="font-headline text-[48px] uppercase font-black text-black leading-tight">Acoustic Over-Ear</h1>
          <p className="font-body text-lg text-gray-700">Unapologetic High-Fidelity. Engineered for isolation and total sonic immersion.</p>
          <div className="font-headline text-[32px] font-black text-electric-pink mt-2">$599.00</div>
        </div>

        {/* Color Selection */}
        <div className="flex flex-col gap-4 border-t-2 border-black pt-6">
          <span className="font-mono text-sm uppercase font-bold text-gray-800">Color: Void Black</span>
          <div className="flex gap-4">
            <button className="w-12 h-12 rounded-none border-2 border-black bg-black neo-shadow flex-shrink-0 hover:-translate-y-1 transition-transform focus:ring-4 ring-offset-2 outline-none focus:border-electric-pink"></button>
            <button className="w-12 h-12 rounded-none border-2 border-black bg-white neo-shadow flex-shrink-0 hover:-translate-y-1 transition-transform focus:ring-4 ring-offset-2 outline-none focus:border-electric-pink"></button>
            <button className="w-12 h-12 rounded-none border-2 border-black bg-gray-200 neo-shadow flex-shrink-0 hover:-translate-y-1 transition-transform focus:ring-4 ring-offset-2 outline-none focus:border-electric-pink"></button>
          </div>
        </div>

        {/* Action */}
        <div className="pt-6">
          <button className="w-full py-4 bg-black text-white font-headline text-[24px] font-black uppercase border-2 border-black neo-shadow-pink-lg neo-hover-sink-pink transition-all flex items-center justify-center gap-4 group">
            <ShoppingBag size={28} className="group-hover:text-electric-pink transition-colors" /> Add to Bag
          </button>
        </div>

        {/* Accordions */}
        <div className="flex flex-col gap-4 mt-8">
          <details className="group bg-white border-2 border-black neo-shadow" open>
            <summary className="flex justify-between items-center p-4 cursor-pointer font-mono text-sm uppercase font-bold hover:bg-gray-100 transition-colors list-none select-none">
              <span>Technical Specs</span>
              <ChevronDown className="group-open:-rotate-180 transition-transform" />
            </summary>
            <div className="p-4 border-t-2 border-black bg-white font-body text-base flex flex-col gap-4">
              <div className="flex justify-between border-b-2 border-gray-200 pb-2">
                <span className="text-gray-600">Drivers</span>
                <span className="font-bold">50mm Beryllium</span>
              </div>
              <div className="flex justify-between border-b-2 border-gray-200 pb-2">
                <span className="text-gray-600">Frequency</span>
                <span className="font-bold">5Hz - 40kHz</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-gray-600">Battery</span>
                <span className="font-bold">40 Hours (ANC On)</span>
              </div>
            </div>
          </details>
          
          <details className="group bg-white border-2 border-black neo-shadow">
            <summary className="flex justify-between items-center p-4 cursor-pointer font-mono text-sm uppercase font-bold hover:bg-gray-100 transition-colors list-none select-none">
              <span>Sustainability</span>
              <ChevronDown className="group-open:-rotate-180 transition-transform" />
            </summary>
            <div className="p-4 border-t-2 border-black bg-white font-body text-base text-gray-700 leading-relaxed">
              Constructed from 85% recycled industrial aluminum. Packaging is 100% biodegradable engineered cardboard. Zero plastics used in shipping.
            </div>
          </details>

          <details className="group bg-white border-2 border-black neo-shadow">
            <summary className="flex justify-between items-center p-4 cursor-pointer font-mono text-sm uppercase font-bold hover:bg-gray-100 transition-colors list-none select-none">
              <span>Reviews (128)</span>
              <ChevronDown className="group-open:-rotate-180 transition-transform" />
            </summary>
            <div className="p-4 border-t-2 border-black bg-white flex flex-col gap-6">
              <div className="flex flex-col gap-2 pb-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold font-headline uppercase text-lg">Unit 01</span>
                  <div className="font-mono font-bold text-electric-pink">5.0</div>
                </div>
                <p className="font-body text-gray-700">Heavy, loud, perfect. The isolation is complete.</p>
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* Completes the Set */}
      <section className="col-span-1 lg:col-span-12 w-full mt-16 lg:mt-24 pt-16 border-t-2 border-black bg-surface">
        <div className="flex flex-col gap-12">
          <h2 className="font-headline text-[48px] uppercase font-black text-black">Completes The Set</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border-2 border-black neo-shadow flex flex-col group">
              <div className="aspect-video w-full border-b-2 border-black overflow-hidden bg-surface-container">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3N7SuYGEyjgUwAk-iBz-5zqtZw2xhZ_-z1E2z9lvC9TM5QIKOUc-8X7gsf3_SgBbr9kUiH3D-0cbAjeeKTXOjDaCAOqPFrymacdP4eZsaOkbnvUH5ayTrqKcYMLhFAGHqiyIq90SiaqOwluf4L8xr6xDFC4WSXE-M4Lb3VfZUZ1g55-IJU-VdnXccGFqTb52jDKjyH9f5KU4JyuEGryaS4U7_G4IG2bVdoX65xkkzeU6UTweHj95gONLiIlQw1JPDmbWYFQ48kU0P" alt="Aluminum Stand" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="p-6 flex flex-col gap-2 flex-grow">
                <h3 className="font-headline text-xl uppercase font-black">Aluminum Stand</h3>
                <p className="font-mono text-sm text-gray-600 font-bold mt-auto pt-4">$89.00</p>
              </div>
              <button className="w-full py-4 bg-white hover:bg-black hover:text-white border-t-2 border-black font-mono font-bold uppercase transition-colors">
                Add +
              </button>
            </div>

            <div className="bg-white border-2 border-black neo-shadow flex flex-col group">
              <div className="aspect-video w-full border-b-2 border-black overflow-hidden bg-surface-container">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbxG4OPm9IVzfwUn--sPqwC1UXQ4vldnImCtpo0UoitGFdjfHG0ovvBK-Cscw5NjiK9Mo62mvumgTP_AiqH5dg69fToVnD9R4hywziC8hsFdQjhGYbhGeq3Ari5kpBpkt19e2Unw9aqLZxrO6sK5a0J2p2tN6KydQoxuP7NDORglyk_bsxGdmxJgK8YnsvRVVfRmxpL3ZyFUoHzHpPbNKPOwQTNobDHC5hhXNGCs0Ag9_PqAJuVJwr5PzaDGJ4NQZqCBHwjQZmnvWY" alt="Hard Shell Case" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="p-6 flex flex-col gap-2 flex-grow">
                <h3 className="font-headline text-xl uppercase font-black">Hard Shell Case</h3>
                <p className="font-mono text-sm text-gray-600 font-bold mt-auto pt-4">$45.00</p>
              </div>
              <button className="w-full py-4 bg-white hover:bg-black hover:text-white border-t-2 border-black font-mono font-bold uppercase transition-colors">
                Add +
              </button>
            </div>

            <div className="bg-white border-2 border-black neo-shadow flex flex-col group">
              <div className="aspect-video w-full border-b-2 border-black overflow-hidden bg-surface-container">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx2R15gSp93mOVC0laLAax63wb62Po0P8eRWyqOFe7jaf1hu7DFZ9yiNdWaOLpQ9qmvWAyhUWPne1_aGslPNU9IfnJl7aDA6IAbEfnN8IuUnNns9DvihfdObitPAWHu8XLcj7oY1Tvm8-M-fvi-sZV_bl8zTqHaWDmnBAx9U5JndDs8wBZYaTfFcyjkoK8UR9p0SUpUvI-acwW-4LKClfBZSqyzdmgG_goUjQMzhRiL6ahlZPdWDQG7ZdopL_yDhyzBAlAilGaQdOd" alt="Hi-Fi Audio Cable" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="p-6 flex flex-col gap-2 flex-grow">
                <h3 className="font-headline text-xl uppercase font-black">Hi-Fi Audio Cable</h3>
                <p className="font-mono text-sm text-gray-600 font-bold mt-auto pt-4">$65.00</p>
              </div>
              <button className="w-full py-4 bg-white hover:bg-black hover:text-white border-t-2 border-black font-mono font-bold uppercase transition-colors">
                Add +
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
