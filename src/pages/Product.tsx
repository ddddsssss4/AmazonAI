import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ChevronDown, ArrowLeft, Star, Volume2, Loader, Check } from 'lucide-react';
import { getProductById, ALL_PRODUCTS } from '../data/products';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useCart } from '../contexts/CartContext';
import { useAgent } from '../contexts/ElevenLabsAgentContext';

export default function Product() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const product = getProductById(Number(id)) ?? ALL_PRODUCTS[1]; // fallback to headphones

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColour, setSelectedColour] = useState(product.colours[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { speak, isSpeaking, isLoading, error: speakError } = useTextToSpeech();
  const { addToCart } = useCart();
  const { setCurrentProduct } = useAgent();

  // Tell the voice agent which product is being viewed
  useEffect(() => {
    setCurrentProduct(product);
    return () => setCurrentProduct(null); // clear on unmount
  }, [product, setCurrentProduct]);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColour.name);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // pick 3 related products from the same category (excluding self)
  const related = ALL_PRODUCTS.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const discountedPrice = product.discount > 0
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : null;

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 mb-24">
      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 font-mono text-sm font-bold uppercase hover:text-electric-pink transition-colors mb-8 group"
        aria-label="Go back"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Image gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="w-full aspect-square bg-surface-container border-2 border-black neo-shadow-lg overflow-hidden relative group">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.badge && (
              <div className="absolute top-4 left-4 font-mono text-sm bg-black text-white px-3 py-1 border-2 border-black font-bold uppercase">
                {product.badge}
              </div>
            )}
            {product.discount > 0 && (
              <div className="absolute top-4 right-4 font-mono text-sm bg-electric-pink text-white px-3 py-1 border-2 border-black font-bold">
                -{product.discount}%
              </div>
            )}
          </div>
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square w-24 bg-surface-container border-2 overflow-hidden transition-all ${
                    selectedImage === i
                      ? 'border-black neo-shadow'
                      : 'border-gray-300 hover:border-black'
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product info */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24 self-start">
          <div className="flex flex-col gap-3">
            <p className="font-mono text-sm uppercase font-bold text-gray-500">{product.brand} &mdash; {product.category}</p>
            <h1 className="font-headline text-[40px] md:text-[48px] uppercase font-black text-black leading-tight text-balance">
              {product.name}
            </h1>
            <div className="flex items-start gap-4">
              <p className="font-body text-lg text-gray-700 leading-relaxed flex-1">{product.longDescription}</p>
              <button
                onClick={() => speak(product.longDescription)}
                disabled={isLoading}
                className="flex-shrink-0 mt-1 p-2 hover:bg-surface-container border-2 border-black transition-colors disabled:opacity-50 group"
                title="Listen to product description"
                aria-label={isSpeaking ? "Stop listening" : "Listen to description"}
              >
                {isLoading ? (
                  <Loader size={20} className="animate-spin" />
                ) : (
                  <Volume2 size={20} className={`${isSpeaking ? 'text-electric-pink' : 'text-black'} group-hover:text-electric-pink transition-colors`} />
                )}
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < product.rating ? 'fill-electric-pink text-electric-pink' : 'text-gray-300'}
                />
              ))}
              <span className="font-mono text-sm text-gray-600 font-bold">{product.rating}.0</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-2">
              <div className="font-headline text-[32px] font-black text-electric-pink">
                ${discountedPrice ?? product.price.toFixed(2)}
              </div>
              {discountedPrice && (
                <div className="font-mono text-lg text-gray-400 line-through">${product.price.toFixed(2)}</div>
              )}
            </div>

            {product.freeShipping && (
              <span className="inline-block font-mono text-xs font-bold text-green-700 bg-green-100 border border-green-400 px-2 py-1 w-fit">
                FREE SHIPPING
              </span>
            )}
          </div>

          {/* Colour */}
          <div className="flex flex-col gap-3 border-t-2 border-black pt-5">
            <span className="font-mono text-sm uppercase font-bold text-gray-800">
              Colour: {selectedColour.name}
            </span>
            <div className="flex gap-3">
              {product.colours.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColour(c)}
                  title={c.name}
                  aria-label={`Select colour ${c.name}`}
                  style={{ background: c.hex }}
                  className={`w-11 h-11 border-2 transition-all ${
                    selectedColour.name === c.name
                      ? 'border-electric-pink scale-110 neo-shadow'
                      : 'border-black hover:-translate-y-1'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Quantity + Add to Bag */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm uppercase font-bold text-gray-800">Qty:</span>
              <div className="flex items-center border-2 border-black">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-2 font-mono font-bold text-lg hover:bg-black hover:text-white transition-colors"
                  aria-label="Decrease quantity"
                >-</button>
                <span className="px-5 py-2 font-mono font-bold text-lg border-x-2 border-black">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-2 font-mono font-bold text-lg hover:bg-black hover:text-white transition-colors"
                  aria-label="Increase quantity"
                >+</button>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 font-headline text-[22px] font-black uppercase border-2 border-black transition-all flex items-center justify-center gap-4 group ${
                added
                  ? 'bg-green-600 text-white'
                  : 'bg-black text-white neo-shadow-pink-lg neo-hover-sink-pink'
              }`}
            >
              {added ? (
                <><Check size={26} /> Added to Bag</>
              ) : (
                <><ShoppingBag size={26} className="group-hover:text-electric-pink transition-colors" /> Add to Bag</>
              )}
            </button>
          </div>

          {/* Accordions */}
          <div className="flex flex-col gap-3 mt-4">
            {/* Specs */}
            <details className="group bg-white border-2 border-black neo-shadow" open>
              <summary className="flex justify-between items-center p-4 cursor-pointer font-mono text-sm uppercase font-bold hover:bg-gray-100 transition-colors list-none select-none">
                <span>Technical Specs</span>
                <ChevronDown className="group-open:-rotate-180 transition-transform" />
              </summary>
              <div className="p-4 border-t-2 border-black bg-white font-body text-base flex flex-col gap-3">
                {product.specs.map((spec, i) => (
                  <div
                    key={spec.label}
                    className={`flex justify-between pb-3 ${i < product.specs.length - 1 ? 'border-b-2 border-gray-100' : ''}`}
                  >
                    <span className="text-gray-600">{spec.label}</span>
                    <span className="font-bold text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </details>

            {/* Sustainability */}
            <details className="group bg-white border-2 border-black neo-shadow">
              <summary className="flex justify-between items-center p-4 cursor-pointer font-mono text-sm uppercase font-bold hover:bg-gray-100 transition-colors list-none select-none">
                <span>Sustainability</span>
                <ChevronDown className="group-open:-rotate-180 transition-transform" />
              </summary>
              <div className="p-4 border-t-2 border-black bg-white font-body text-base text-gray-700 leading-relaxed">
                {product.sustainability}
              </div>
            </details>

            {/* Shipping */}
            <details className="group bg-white border-2 border-black neo-shadow">
              <summary className="flex justify-between items-center p-4 cursor-pointer font-mono text-sm uppercase font-bold hover:bg-gray-100 transition-colors list-none select-none">
                <span>Shipping & Returns</span>
                <ChevronDown className="group-open:-rotate-180 transition-transform" />
              </summary>
              <div className="p-4 border-t-2 border-black bg-white font-body text-base text-gray-700 leading-relaxed">
                {product.freeShipping
                  ? 'Free standard shipping (5–7 days). Express available at checkout. Free returns within 30 days — no questions asked.'
                  : 'Standard shipping from $4.99 (5–7 days). Express available at checkout. Returns accepted within 30 days for unopened items.'}
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Related / Completes the Set */}
      {related.length > 0 && (
        <section className="w-full mt-20 pt-12 border-t-2 border-black">
          <h2 className="font-headline text-[40px] uppercase font-black text-black mb-10">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map(item => {
              const relatedDiscounted = item.discount > 0
                ? (item.price * (1 - item.discount / 100)).toFixed(2)
                : null;
              return (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="bg-white border-2 border-black neo-shadow flex flex-col group hover:-translate-y-1 transition-transform"
                >
                  <div className="aspect-video w-full border-b-2 border-black overflow-hidden bg-surface-container relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {item.discount > 0 && (
                      <span className="absolute top-2 right-2 bg-electric-pink text-white font-mono text-xs font-bold px-2 py-1">
                        -{item.discount}%
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col gap-1 flex-grow">
                    <h3 className="font-headline text-lg uppercase font-black">{item.name}</h3>
                    <p className="font-mono text-sm text-gray-500">{item.brand}</p>
                    <div className="flex items-baseline gap-2 mt-auto pt-3">
                      <span className="font-mono font-bold text-electric-pink">
                        ${relatedDiscounted ?? item.price.toFixed(2)}
                      </span>
                      {relatedDiscounted && (
                        <span className="font-mono text-xs text-gray-400 line-through">${item.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  <div className="px-5 pb-5">
                    <span className="block w-full py-3 text-center bg-white hover:bg-black hover:text-white border-2 border-black font-mono font-bold uppercase transition-colors text-sm">
                      View Product
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
