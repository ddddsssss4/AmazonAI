import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAgent } from '../contexts/ElevenLabsAgentContext';

type PaymentMethod = 'card' | 'upi' | 'cod';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  paymentMethod: PaymentMethod;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart, totalPrice } = useCart();
  const { registerCheckoutCallbacks, isListening } = useAgent();
  const [voiceGuideOpen, setVoiceGuideOpen] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'cod',
  });

  const formRef = useRef(form);
  formRef.current = form;

  const deliveryCharge = totalPrice > 500 ? 0 : 49;
  const discount = totalPrice * 0.05;
  const finalTotal = totalPrice + deliveryCharge - discount;
  const orderNumber = `AMZ-${Date.now().toString().slice(-8)}`;

  const handleField = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = (e?: React.FormEvent) => {
    e?.preventDefault();
    setOrderPlaced(true);
    clearCart();
  };

  // Register callbacks for voice agent
  useEffect(() => {
    registerCheckoutCallbacks({
      fillForm: (data) => {
        setForm(prev => ({ ...prev, ...data }));
      },
      proceedToCheckout: () => {
        // Already on checkout page
      },
      placeOrder: () => {
        handlePlaceOrder();
      },
      getCartSummary: () => ({
        items,
        total: finalTotal,
      }),
    });
  }, [registerCheckoutCallbacks, items, finalTotal]);

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
  }, [items, navigate, orderPlaced]);

  // Order Confirmed View
  if (orderPlaced) {
    return (
      <main className="min-h-[70vh] py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="border-2 border-black p-8 sm:p-12 bg-white text-center neo-shadow">
          <CheckCircle size={64} className="mx-auto mb-6 text-green-600" />
          <h1 className="font-headline text-3xl sm:text-4xl font-black uppercase mb-4">Order Confirmed!</h1>
          <p className="font-mono text-gray-600 mb-2">Thank you for your purchase</p>
          <p className="font-mono text-sm text-gray-500 mb-6">Order #{orderNumber}</p>
          <div className="border-2 border-black p-4 mb-8 bg-surface-container inline-block">
            <p className="font-headline text-2xl font-black text-electric-pink">${finalTotal.toFixed(2)}</p>
            <p className="font-mono text-xs text-gray-500 uppercase">Total Paid</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="px-8 py-3 bg-black text-white font-mono font-bold uppercase border-2 border-black hover:bg-white hover:text-black transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Link to="/shop" className="inline-flex items-center gap-2 font-mono text-sm font-bold uppercase mb-6 hover:text-electric-pink transition-colors">
        <ArrowLeft size={16} /> Continue Shopping
      </Link>

      <h1 className="font-headline text-4xl font-black uppercase mb-6 border-b-2 border-black pb-4">
        Checkout
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
              Fill form with voice
            </span>
            {voiceGuideOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {voiceGuideOpen && (
            <div className="border-t-2 border-black px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              <div className="sm:col-span-2 font-mono text-xs text-gray-500 uppercase font-bold mb-1">Say your details:</div>
              {[
                { say: '"My name is Sarah Khan"', does: 'Fills Full Name' },
                { say: '"Email is sarah@gmail.com"', does: 'Fills Email' },
                { say: '"Phone number 9876543210"', does: 'Fills Phone' },
                { say: '"City is Mumbai"', does: 'Fills City' },
                { say: '"Pincode 400001"', does: 'Fills Pincode' },
                { say: '"Address is 45 Park Street"', does: 'Fills Address' },
                { say: '"Pay by card" / "UPI" / "cash on delivery"', does: 'Selects payment' },
                { say: '"Place my order"', does: 'Confirms order' },
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
        {/* Form */}
        <div className="lg:col-span-8">
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="border-2 border-black p-6 bg-white neo-shadow">
            <h2 className="font-mono font-bold uppercase text-sm mb-4 pb-2 border-b-2 border-black">Delivery Address</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleField('name', e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 border-2 border-black font-mono text-sm focus:outline-none focus:ring-2 focus:ring-electric-pink"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleField('email', e.target.value)}
                  placeholder="john@example.com"
                  required
                  className="w-full px-4 py-3 border-2 border-black font-mono text-sm focus:outline-none focus:ring-2 focus:ring-electric-pink"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleField('phone', e.target.value)}
                  placeholder="+91 9876543210"
                  required
                  className="w-full px-4 py-3 border-2 border-black font-mono text-sm focus:outline-none focus:ring-2 focus:ring-electric-pink"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => handleField('city', e.target.value)}
                  placeholder="Mumbai"
                  required
                  className="w-full px-4 py-3 border-2 border-black font-mono text-sm focus:outline-none focus:ring-2 focus:ring-electric-pink"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">Pincode</label>
                <input
                  type="text"
                  value={form.pincode}
                  onChange={(e) => handleField('pincode', e.target.value)}
                  placeholder="400001"
                  required
                  className="w-full px-4 py-3 border-2 border-black font-mono text-sm focus:outline-none focus:ring-2 focus:ring-electric-pink"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-mono text-xs font-bold uppercase mb-1">Full Address</label>
              <textarea
                value={form.address}
                onChange={(e) => handleField('address', e.target.value)}
                placeholder="123, Street Name, Area"
                required
                rows={3}
                className="w-full px-4 py-3 border-2 border-black font-mono text-sm focus:outline-none focus:ring-2 focus:ring-electric-pink resize-none"
              />
            </div>

            <h2 className="font-mono font-bold uppercase text-sm mb-4 pb-2 border-b-2 border-black">Payment Method</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { id: 'card', label: 'Credit/Debit Card' },
                { id: 'upi', label: 'UPI' },
                { id: 'cod', label: 'Cash on Delivery' },
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => handleField('paymentMethod', method.id)}
                  className={`px-4 py-2 border-2 border-black font-mono text-sm font-bold uppercase transition-colors ${
                    form.paymentMethod === method.id
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-surface-container'
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="border-2 border-black p-5 bg-white sticky top-24">
            <h2 className="font-mono font-bold uppercase text-sm mb-4 pb-2 border-b-2 border-black">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between font-mono text-sm">
                <span>Subtotal ({items.length} items)</span>
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

            <button
              type="submit"
              form="checkout-form"
              className="w-full py-4 bg-black text-white font-headline font-black uppercase border-2 border-black hover:bg-gray-900 transition-colors mb-3"
            >
              Place Order
            </button>
            <Link
              to="/cart"
              className="block w-full py-3 text-center bg-white text-black font-mono font-bold uppercase border-2 border-black hover:bg-surface-container transition-colors"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
