import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, MessageCircle, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatWhatsAppOrder, openWhatsApp, sanitizeText, validateEmail, validatePhone, type OrderDetails } from '@/lib/whatsapp';
import { Reveal } from '@/components/Reveal';

const DELIVERY_FEE = 50;

export function BookingPage() {
  const { items, updateQty, removeItem, clear, subtotal, count } = useCart();
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

  const validate = (): boolean => {
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

  const handleSubmit = async () => {
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
      <div className="pt-32 min-h-screen flex items-center justify-center section-pad">
        <Reveal>
          <div className="glass-gold p-10 text-center max-w-lg">
            <span className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-[#25D366] text-white mb-6">
              <Check size={32} />
            </span>
            <h2 className="font-serif text-3xl font-bold text-cream-50 mb-3">Order Sent!</h2>
            <p className="text-cream-200/65 mb-6">
              WhatsApp should now be open with your order details.
              Just hit send to confirm your order.
            </p>
            <Link to="/" className="btn-gold">Back Home</Link>
          </div>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen section-pad py-10">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">

        {/* Delivery Form */}
        <div className="glass p-6 space-y-4">
          <h3 className="font-serif text-xl font-semibold text-cream-100">Delivery Details</h3>

          <input
            type="text"
            placeholder="Full Name"
            className={inputCls}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="tel"
            placeholder="Phone Number"
            className={inputCls}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email (optional)"
            className={inputCls}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="text"
            placeholder="Delivery Address"
            className={inputCls}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <input
            type="date"
            className={inputCls}
            value={form.deliveryDate}
            onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
          />

          <input
            type="time"
            className={inputCls}
            value={form.deliveryTime}
            onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
          />

          <textarea
            placeholder="Special Instructions"
            rows={3}
            className={inputCls}
            value={form.instructions}
            onChange={(e) => setForm({ ...form, instructions: e.target.value })}
          />
        </div>

        {/* Order Summary */}
        <div className="glass-gold p-6 sticky top-24">
          <h3 className="font-serif text-xl font-semibold text-cream-100 mb-4">Order Summary</h3>

          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm mb-2">
              <span>{item.product.name} x{item.quantity}</span>
              <span>₹ {(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <div className="border-t pt-4 mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹ {DELIVERY_FEE.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-gold-300">
              <span>Total</span>
              <span>₹ {total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full mt-6 bg-[#25D366] text-white py-4 rounded-full font-semibold"
          >
            {submitting ? 'Sending...' : 'Confirm Order via WhatsApp'}
          </button>
        </div>

      </div>
    </div>
  );
}

const inputCls =
  'w-full px-4 py-3 rounded-xl bg-black/40 text-white border border-gold-400/20 focus:outline-none';