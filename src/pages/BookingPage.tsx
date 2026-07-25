import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, Check } from 'lucide-react';
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

  const total = subtotal + (items.length ? DELIVERY_FEE : 0);

  const validate = () => {
    if (!sanitizeText(form.name)) return false;
    if (!sanitizeText(form.phone)) return false;
    if (!validatePhone(form.phone)) return false;
    if (form.email && !validateEmail(form.email)) return false;
    if (!sanitizeText(form.address)) return false;
    if (!form.deliveryDate) return false;
    if (!form.deliveryTime) return false;
    if (!items.length) return false;
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) {
      alert('Please fill all required fields.');
      return;
    }

    setSubmitting(true);

    const details: OrderDetails = {
      customerName: form.name,
      phone: form.phone,
      email: form.email,
      address: form.address,
      deliveryDate: form.deliveryDate,
      deliveryTime: form.deliveryTime,
      specialInstructions: form.instructions,
      deliveryFee: DELIVERY_FEE,
      total,
    };

    const message = formatWhatsAppOrder(items, details);
    openWhatsApp(message);

    clear();
    setSuccess(true);
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <div className="glass-gold p-10 text-center max-w-lg rounded-2xl">
          <Check size={40} className="mx-auto mb-4 text-green-400" />
          <h2 className="text-2xl font-bold text-white mb-3">
            Order Sent!
          </h2>
          <Link to="/" className="btn-gold mt-4">
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen section-pad py-10">
      <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">

        {/* LEFT SIDE */}
        <div className="lg:col-span-3 space-y-6">

          {/* CART ITEMS PREMIUM */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="font-serif text-lg font-semibold text-cream-100 mb-6">
              Your Cookies ({count})
            </h3>

            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between bg-black/40 border border-gold-400/20 rounded-xl p-4 mb-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="h-14 w-14 rounded-lg object-cover"
                  />

                  <div>
                    <h4 className="text-cream-100 text-sm font-medium">
                      {item.product.name}
                    </h4>
                    <p className="text-gold-400 text-sm">
                      ₹ {item.product.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">

                  <div className="flex items-center gap-3 bg-black/60 border border-gold-400/30 rounded-full px-3 py-1.5">
                    <button
                      onClick={() =>
                        updateQty(item.product.id, item.quantity - 1)
                      }
                      className="h-7 w-7 flex items-center justify-center rounded-full border border-gold-400/40 text-gold-300 hover:bg-gold-400/10 transition"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="text-gold-200 font-semibold text-sm w-5 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQty(item.product.id, item.quantity + 1)
                      }
                      className="h-7 w-7 flex items-center justify-center rounded-full border border-gold-400/40 text-gold-300 hover:bg-gold-400/10 transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>
              </div>
            ))}
          </div>

          {/* DELIVERY FORM */}
          <div className="glass p-6 rounded-2xl space-y-4">
            <h3 className="font-serif text-lg font-semibold text-cream-100">
              Delivery Details
            </h3>

            <input
              type="text"
              placeholder="Full Name"
              className={inputCls}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="tel"
              placeholder="Phone"
              className={inputCls}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <input
              type="text"
              placeholder="Address"
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
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2">
          <div className="glass-gold p-6 sticky top-24 rounded-2xl">
            <h3 className="font-serif text-lg font-semibold text-white mb-4">
              Order Summary
            </h3>

            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span>{item.product.name} x{item.quantity}</span>
                  <span>₹ {(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gold-400/20 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>₹ {DELIVERY_FEE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gold-400 mt-2">
                <span>Total</span>
                <span>₹ {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full mt-6 bg-green-500 hover:bg-green-600 transition text-white py-4 rounded-full font-semibold"
            >
              Confirm Order via WhatsApp
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

const inputCls =
  'w-full px-4 py-3 rounded-xl bg-black/40 text-white border border-gold-400/20 focus:outline-none';