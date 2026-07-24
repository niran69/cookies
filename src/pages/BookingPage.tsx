import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, MessageCircle, ShoppingBag, Check, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!sanitizeText(form.name)) e.name = 'Name is required';
    if (!sanitizeText(form.phone)) e.phone = 'Phone is required';
    else if (!validatePhone(form.phone)) e.phone = 'Enter valid phone';
    if (form.email && !validateEmail(form.email)) e.email = 'Invalid email';
    if (!sanitizeText(form.address)) e.address = 'Address required';
    if (!form.deliveryDate) e.deliveryDate = 'Date required';
    if (!form.deliveryTime) e.deliveryTime = 'Time required';
    if (items.length === 0) e.cart = 'Cart empty';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);

    try {
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

      setSuccess(true);
      clear();
    } catch {
      setErrors({ submit: 'Something went wrong' });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <div className="glass-gold p-10 text-center max-w-lg">
          <Check size={40} className="mx-auto mb-4 text-green-400" />
          <h2 className="text-2xl font-bold text-white mb-3">Order Sent!</h2>
          <Link to="/" className="btn-gold mt-4">Back Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen section-pad py-10">
      <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">

        {/* LEFT SIDE */}
        <div className="lg:col-span-3 space-y-6">

          {/* CART ITEMS */}
          <div className="glass p-6">
            <h3 className="font-serif text-lg font-semibold text-cream-100 mb-4">
              Your Cookies ({count})
            </h3>

            {items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-4 mb-4">
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="h-16 w-16 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <h4 className="text-white">{item.product.name}</h4>
                  <p className="text-gold-400">
                    ₹ {item.product.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.product.id, item.quantity - 1)}>
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQty(item.product.id, item.quantity + 1)}>
                    <Plus size={16} />
                  </button>
                </div>

                <button onClick={() => removeItem(item.product.id)}>
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>

          {/* DELIVERY FORM */}
          <div className="glass p-6 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-cream-100">
              Delivery Details
            </h3>

            <input type="text" placeholder="Full Name"
              className={inputCls}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input type="tel" placeholder="Phone"
              className={inputCls}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <input type="text" placeholder="Address"
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
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2">
          <div className="glass-gold p-6 sticky top-24">
            <h3 className="font-serif text-lg font-semibold text-white mb-4">
              Order Summary
            </h3>

            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between mb-2">
                <span>{item.product.name} x{item.quantity}</span>
                <span>₹ {(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="border-t pt-4 mt-4">
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
              className="w-full mt-6 bg-green-500 text-white py-4 rounded-full"
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