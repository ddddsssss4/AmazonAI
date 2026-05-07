import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag, Truck, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

type CheckoutStep = 'cart' | 'details' | 'confirmed';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  paymentMethod: 'card' | 'upi' | 'cod';
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  upiId: string;
}

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', address: '', city: '', pincode: '',
    paymentMethod: 'card', cardNumber: '', cardExpiry: '', cardCvv: '', upiId: ''
  });

  const deliveryCharge = totalPrice > 500 ? 0 : 49;
  const discount = totalPrice * 0.05; // 5% coupon discount placeholder
  const finalTotal = totalPrice + deliveryCharge - discount;
  const orderNumber = `AMZ-${Date.now().toString().slice(-8)}`;

  const handleField = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirmed');
    clearCart();
  };

  if (step === 'confirmed') {
    return (
      <div className="flex-grow w-full max-w-2xl mx-auto px-6 py-16 flex flex-col items-center text-center gap-6">
        <div className="border-2 border-black p-6 bg-green-50 neo-shadow">
          <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
          <h1 className="font-headline text-4xl font-black uppercase mb-2">Order Placed!</h1>
          <p className="font-mono text-gray-600 mb-1">Thank you, {form.name}.</p>
          <p className="font-mono text-sm text-gray-500">Order ID: <span className="font-bold text-black">{orderNumber}</span></p>
        </div>
        <div className="border-2 border-black p-5 w-full text-left bg-white">
          <h2 className="font-mono font-bold uppercase text-sm mb-3">Delivery Details</h2>
          <p className="font-body text-sm text-gray-700">{form.address}, {form.city} - {form.pincode}</p>
          <p className="font-body text-sm text-gray-500 mt-1">Estimated delivery: 3-5 business days</p>
        </div>
        <div className="flex gap-3 w-full">
          <Link
            to="/shop"
            className="flex-1 py-3 border-2 border-black font-mono font-bold uppercase text-center hover:bg-black hover:text-white transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="flex-1 py-3 bg-black text-white border-2 border-black font-mono font-bold uppercase text-center hover:bg-electric-pink transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && step !== 'confirmed') {
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

      {/* Back */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 font-mono text-sm font-bold uppercase hover:text-electric-pink transition-colors mb-6 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Continue Shopping
      </Link>

      <h1 className="font-headline text-4xl font-black uppercase mb-8 border-b-2 border-black pb-4">
        {step === 'cart' ? `Shopping Cart (${totalItems})` : 'Checkout'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left: Cart Items or Checkout Form */}
        <div className="lg:col-span-8">

          {step === 'cart' && (
            <div className="flex flex-col gap-4">
              {items.map(item => {
                const effectivePrice = item.product.discount > 0
                  ? item.product.price * (1 - item.product.discount / 100)
                  : item.product.price;
                return (
                  <div
                    key={`${item.product.id}-${item.selectedColour}`}
                    className="flex gap-4 border-2 border-black p-4 bg-white neo-shadow"
                  >
                    {/* Image */}
                    <Link to={`/product/${item.product.id}`} className="shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-28 h-28 object-cover border-2 border-black"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex flex-col flex-grow gap-1 min-w-0">
                      <Link
                        to={`/product/${item.product.id}`}
                        className="font-headline text-lg font-black uppercase leading-tight hover:text-electric-pink transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="font-mono text-xs text-gray-500 uppercase">{item.product.brand} &bull; {item.selectedColour}</p>
                      {item.product.freeShipping && (
                        <span className="font-mono text-xs font-bold text-green-700">FREE Delivery</span>
                      )}

                      <div className="flex items-center gap-4 mt-auto pt-2 flex-wrap">
                        {/* Qty controls */}
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

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedColour)}
                          className="flex items-center gap-1 font-mono text-xs font-bold text-red-600 hover:text-red-800 uppercase"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Price */}
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
          )}

          {step === 'details' && (
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="flex flex-col gap-6">

              {/* Delivery Address */}
              <div className="border-2 border-black p-5 bg-white">
                <h2 className="font-mono font-bold uppercase text-sm mb-4 pb-2 border-b-2 border-black">Delivery Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name', field: 'name' as const, placeholder: 'John Doe', required: true },
                    { label: 'Email', field: 'email' as const, placeholder: 'john@example.com', required: true },
                    { label: 'Phone', field: 'phone' as const, placeholder: '+91 9876543210', required: true },
                    { label: 'City', field: 'city' as const, placeholder: 'Mumbai', required: true },
                    { label: 'Pincode', field: 'pincode' as const, placeholder: '400001', required: true },
                  ].map(({ label, field, placeholder, required }) => (
                    <div key={field} className="flex flex-col gap-1">
                      <label className="font-mono text-xs uppercase font-bold">{label}</label>
                      <input
                        type="text"
                        required={required}
                        placeholder={placeholder}
                        value={form[field]}
                        onChange={e => handleField(field, e.target.value)}
                        className="border-2 border-black px-3 py-2.5 font-mono text-sm focus:outline-none focus:border-electric-pink"
                      />
                    </div>
                  ))}
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="font-mono text-xs uppercase font-bold">Full Address</label>
                    <input
                      type="text"
                      required
                      placeholder="123, Street Name, Area"
                      value={form.address}
                      onChange={e => handleField('address', e.target.value)}
                      className="border-2 border-black px-3 py-2.5 font-mono text-sm focus:outline-none focus:border-electric-pink"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border-2 border-black p-5 bg-white">
                <h2 className="font-mono font-bold uppercase text-sm mb-4 pb-2 border-b-2 border-black">Payment Method</h2>

                <div className="flex flex-col gap-3 mb-4">
                  {(['card', 'upi', 'cod'] as const).map(method => (
                    <label key={method} className={`flex items-center gap-3 p-3 border-2 cursor-pointer transition-colors ${
                      form.paymentMethod === method ? 'border-electric-pink bg-pink-50' : 'border-black hover:border-gray-400'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={form.paymentMethod === method}
                        onChange={() => handleField('paymentMethod', method)}
                        className="accent-electric-pink"
                      />
                      <span className="font-mono font-bold text-sm uppercase">
                        {method === 'card' ? 'Credit / Debit Card' : method === 'upi' ? 'UPI' : 'Cash on Delivery'}
                      </span>
                    </label>
                  ))}
                </div>

                {form.paymentMethod === 'card' && (
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-xs uppercase font-bold">Card Number</label>
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        value={form.cardNumber}
                        onChange={e => handleField('cardNumber', e.target.value)}
                        className="border-2 border-black px-3 py-2.5 font-mono text-sm focus:outline-none focus:border-electric-pink"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-xs uppercase font-bold">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          placeholder="12/26"
                          maxLength={5}
                          value={form.cardExpiry}
                          onChange={e => handleField('cardExpiry', e.target.value)}
                          className="border-2 border-black px-3 py-2.5 font-mono text-sm focus:outline-none focus:border-electric-pink"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-xs uppercase font-bold">CVV</label>
                        <input
                          type="password"
                          placeholder="***"
                          maxLength={3}
                          value={form.cardCvv}
                          onChange={e => handleField('cardCvv', e.target.value)}
                          className="border-2 border-black px-3 py-2.5 font-mono text-sm focus:outline-none focus:border-electric-pink"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {form.paymentMethod === 'upi' && (
                  <div className="flex flex-col gap-1 pt-2">
                    <label className="font-mono text-xs uppercase font-bold">UPI ID</label>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      value={form.upiId}
                      onChange={e => handleField('upiId', e.target.value)}
                      className="border-2 border-black px-3 py-2.5 font-mono text-sm focus:outline-none focus:border-electric-pink"
                    />
                  </div>
                )}

                {form.paymentMethod === 'cod' && (
                  <p className="font-mono text-sm text-gray-600 pt-2">Pay with cash when your order is delivered.</p>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4 flex flex-col gap-4 lg:sticky lg:top-24">
          <div className="border-2 border-black p-5 bg-white neo-shadow">
            <h2 className="font-mono font-bold uppercase text-sm mb-4 pb-2 border-b-2 border-black">Order Summary</h2>

            <div className="flex flex-col gap-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                <span className="font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-1"><Truck size={13} /> Delivery</span>
                <span className={deliveryCharge === 0 ? 'font-bold text-green-700' : 'font-bold'}>
                  {deliveryCharge === 0 ? 'FREE' : `$${deliveryCharge.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-green-700">
                <span className="flex items-center gap-1"><Tag size={13} /> Discount (5%)</span>
                <span className="font-bold">-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t-2 border-black pt-3 mt-1">
                <span className="font-black uppercase">Total</span>
                <span className="font-black text-xl text-electric-pink">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {deliveryCharge > 0 && (
              <p className="font-mono text-xs text-gray-500 mt-3 border-t border-gray-200 pt-2">
                Add ${(500 - totalPrice).toFixed(2)} more for FREE delivery
              </p>
            )}
          </div>

          {/* CTA Button */}
          {step === 'cart' ? (
            <button
              onClick={() => setStep('details')}
              className="w-full py-4 bg-electric-pink text-white border-2 border-black font-headline text-xl font-black uppercase neo-shadow hover:bg-black transition-colors"
            >
              Proceed to Checkout
            </button>
          ) : (
            <button
              type="submit"
              form="checkout-form"
              className="w-full py-4 bg-black text-white border-2 border-black font-headline text-xl font-black uppercase neo-shadow hover:bg-electric-pink transition-colors"
            >
              Place Order
            </button>
          )}

          {step === 'details' && (
            <button
              onClick={() => setStep('cart')}
              className="w-full py-3 bg-white text-black border-2 border-black font-mono font-bold uppercase text-sm hover:bg-surface-container transition-colors"
            >
              Back to Cart
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
