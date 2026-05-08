import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Mic, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAgent } from '../contexts/ElevenLabsAgentContext';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const { isListening } = useAgent();
  const [voiceGuideOpen, setVoiceGuideOpen] = useState(true);

  const deliveryCharge = totalPrice > 500 ? 0 : 49;
  const discount = totalPrice * 0.05;
  const finalTotal = totalPrice + deliveryCharge - discount;

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="flex-grow w-full max-w-xl mx-auto px-6 py-24 flex flex-col items-center text-center gap-6">
        <ShoppingBag size={72} className="text-gray-300" />
        <h1 className="font-headline text-4xl font-black uppercase">Your cart is empty</h1>
        <p className="font-mono text-gray-500">Add some products to get started.</p>
        <Link
          to="/shop"
          className="px-8 py-3 bg-black text-white border-2 border-black font-mono font-bold uppercase hover:bg-electric-pink transition-colors neo-shadow"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 font-mono text-sm font-bold uppercase hover:text-electric-pink transition-colors mb-6 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Continue Shopping
      </Link>

      <h1 className="font-headline text-4xl font-black uppercase mb-4 border-b-2 border-black pb-4">
        Shopping Cart ({totalItems})
      </h1>

      {/* Voice Command Guide */}
      {isListening && (
        <div className="mb-6 border-2 border-black bg-white neo-shadow">
          <button
            onClick={() => setVoiceGuideOpen(p => !p)}
            className="w-full flex items-center justify-between px-4 py-3 font-mono font-bold text-sm uppercase hover:bg-surface-container transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-pink opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-electric-pink"></span>
              </span>
              <Mic size={14} />
              Voice Commands
            </span>
            {voiceGuideOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {voiceGuideOpen && (
            <div className="border-t-2 border-black px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              <div className="sm:col-span-2 font-mono text-xs text-gray-500 uppercase font-bold mb-1">On this page, say:</div>
              {[
                { say: '"Proceed to checkout"', does: 'Go to checkout form' },
                { say: '"Help me checkout"', does: 'Navigate to checkout and agent will guide you' },
                { say: '"Remove the keyboard"', does: 'Remove item from cart' },
              ].map(({ say, does }) => (
                <div key={say} className="flex flex-col gap-0.5">
                  <span className="font-mono text-xs font-black text-black bg-surface-container px-2 py-1 border border-black">{say}</span>
                  <span className="font-mono text-xs text-gray-500 pl-1">{does}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const effectivePrice = item.product.discount > 0
              ? item.product.price * (1 - item.product.discount / 100)
              : item.product.price;
            return (
              <div
                key={`${item.product.id}-${item.selectedColour}`}
                className="flex gap-4 border-2 border-black p-4 bg-white neo-shadow"
              >
                <Link to={`/product/${item.product.id}`} className="shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-28 h-28 object-cover border-2 border-black"
                  />
                </Link>

                <div className="flex flex-col flex-grow gap-1 min-w-0">
                  <Link
                    to={`/product/${item.product.id}`}
                    className="font-headline text-lg font-black uppercase leading-tight hover:text-electric-pink transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  <p className="font-mono text-xs text-gray-500 uppercase">{item.product.brand} • {item.selectedColour}</p>
                  {item.product.freeShipping && (
                    <span className="font-mono text-xs font-bold text-green-700">FREE Delivery</span>
                  )}

                  <div className="flex items-center gap-4 mt-auto pt-2 flex-wrap">
                    <div className="flex items-center border-2 border-black">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedColour, item.quantity - 1)}
                        className="px-3 py-1.5 font-mono font-bold hover:bg-black hover:text-white transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 py-1.5 font-mono font-bold text-sm border-x-2 border-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedColour, item.quantity + 1)}
                        className="px-3 py-1.5 font-mono font-bold hover:bg-black hover:text-white transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedColour)}
                      className="flex items-center gap-1 font-mono text-xs font-bold text-red-600 hover:text-red-800 uppercase"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>

                <div className="shrink-0 text-right flex flex-col justify-between items-end">
                  <span className="font-headline text-xl font-black">
                    ${(effectivePrice * item.quantity).toFixed(2)}
                  </span>
                  {item.product.discount > 0 && (
                    <span className="font-mono text-xs text-gray-400 line-through">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  )}
                  <span className="font-mono text-xs text-gray-500">
                    ${effectivePrice.toFixed(2)} each
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="border-2 border-black p-5 bg-white sticky top-24">
            <h2 className="font-mono font-bold uppercase text-sm mb-4 pb-2 border-b-2 border-black">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between font-mono text-sm">
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-mono text-sm">
                <span>Delivery</span>
                <span className={deliveryCharge === 0 ? 'text-green-700 font-bold' : ''}>
                  {deliveryCharge === 0 ? 'FREE' : `$${deliveryCharge.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-mono text-sm text-green-600">
                <span>Discount (5%)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-black pt-2 flex justify-between font-headline text-lg font-black">
                <span>TOTAL</span>
                <span className="text-electric-pink">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
            {totalPrice < 500 && (
              <p className="font-mono text-xs text-gray-500 mb-4">Add ${(500 - totalPrice).toFixed(2)} more for FREE delivery</p>
            )}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-electric-pink text-white font-headline font-black uppercase border-2 border-black neo-shadow-pink-lg neo-hover-sink-pink transition-all"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
