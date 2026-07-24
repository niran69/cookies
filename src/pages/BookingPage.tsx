import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import {
  formatWhatsAppOrder,
  openWhatsApp,
  sanitizeText,
  validateEmail,
  validatePhone,
  type OrderDetails,
} from '@/lib/whatsapp';

const DELIVERY_FEE = 50;

export function BookingPage() {
  const { items, clear, subtotal } = useCart();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    deliveryDate: '',
    deliveryTime: '',
    instructions: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0);

  const validate = () => {
    if (!sanitizeText(form.name)) return false;
    if (!sanitizeText(form.phone)) return false;
    if (!validatePhone(form.phone)) return false;
    if (form.email && !validateEmail(form.email)) return false;
    if (!sanitizeText(form.address)) return false;
    if (!form.deliveryDate) return false;
    if (!form.deliveryTime) return false;
    if (items.length === 0) return false;
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) {
      alert('Please fill all required fields correctly.');
      return;
    }

    setSubmitting(true);

    const details: OrderDetails = {
      customerName: sanitizeText(form.name),
      phone: sanitizeText(form.phone),
      email: sanitizeText(form.email),
      address: sanitizeText(form.address),
      deliveryDate: form.deliveryDate,
      deliveryTime: form.deliveryTime,
      specialInstructions: sanitizeText(form.instructions),
      deliveryFee: DELIVERY_FEE,
      total,
    };

    const message = formatWhatsAppOrder(items, details);
    openWhatsApp(message);

    setSuccess(true);
    clear();
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center px-4">
        <div className="bg-black/60 border border-gold-400/20 p-8 rounded-2xl text-center max-w-md w-full">
          <Check size={40} className="mx-auto text-green-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Order Sent!</h2>
          <p className="text-gray-300 mb-6">
            WhatsApp should now be open with your order details.
          </p>
          <Link to="/" className="bg-gold-500 px-6 py-3 rounded-full text-black font-semibold">
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen px-4 pb-20">

      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-2">

        {/* Delivery Form */}
        <div className="bg-black/40 border border-gold-400/20 p-6 rounded-2xl space-y-4">
          <h3 className="text-xl font-semibold text-white">Delivery Details</h3>

          <input type="text" placeholder="Full Name"
            className={inputCls}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input type="tel" placeholder="Phone Number"
            className={inputCls}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <input type="email" placeholder="Email (optional)"
            className={inputCls}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input type="text" placeholder="Delivery Address"
            className={inputCls}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <input type="date"
            className={inputCls}
            value={form.deliveryDate}
            onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
          />

          <input type="time"
            className={inputCls}
            value={form.deliveryTime}
            onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
          />

          <textarea rows={3}
            placeholder="Special Instructions"
            className={inputCls}
            value={form.instructions}
            onChange={(e) => setForm({ ...form, instructions: e.target.value })}
          />
        </div>

        {/* Order Summary */}
        <div className="bg-[#1a120a] border border-gold-400/20 p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-white mb-4">Order Summary</h3>

          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm text-gray-300 mb-2">
              <span>{item.product.name} x{item.quantity}</span>
              <span>₹ {(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <div className="border-t border-gold-400/20 pt-4 mt-4 space-y-2 text-gray-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹ {DELIVERY_FEE.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-gold-400 text-lg">
              <span>Total</span>
              <span>₹ {total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full mt-6 bg-green-500 hover:bg-green-600 transition py-4 rounded-full font-semibold text-white"
          >
            {submitting ? 'Sending...' : 'Confirm Order via WhatsApp'}
          </button>
        </div>

      </div>
    </div>
  );
}

const inputCls =
  'w-full px-4 py-3 rounded-xl bg-black/50 border border-gold-400/20 text-white focus:outline-none';