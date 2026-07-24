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
  const [honeypot, setHoneypot] = useState('');

  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!sanitizeText(form.name)) e.name = 'Name is required';
    if (!sanitizeText(form.phone)) e.phone = 'Phone is required';
    else if (!validatePhone(form.phone)) e.phone = 'Enter a valid phone number';
    if (form.email && !validateEmail(form.email)) e.email = 'Enter a valid email';
    if (!sanitizeText(form.address)) e.address = 'Address is required';
    if (!form.deliveryDate) e.deliveryDate = 'Date is required';
    if (!form.deliveryTime) e.deliveryTime = 'Time is required';
    if (items.length === 0) e.cart = 'Your cart is empty';
    if (honeypot) e.bot = 'Spam detected';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
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

      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          customer_name: details.customerName,
          phone: details.phone,
          email: details.email || null,
          address: details.address,
          delivery_date: details.deliveryDate,
          delivery_time: details.deliveryTime,
          special_instructions: details.specialInstructions || null,
          delivery_fee: DELIVERY_FEE,
          total,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      if (order) {
        const orderItems = items.map((item) => ({
          order_id: order.id,
          product_id: item.product.id,
          product_name: item.product.name,
          unit_price: item.product.price,
          quantity: item.quantity,
          subtotal: item.product.price * item.quantity,
        }));
        await supabase.from('order_items').insert(orderItems);
      }

      const message = formatWhatsAppOrder(items, details);
      openWhatsApp(message);
      setSuccess(true);
      clear();
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again or order directly via WhatsApp.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center section-pad">
        <Reveal>
          <div className="glass-gold p-10 sm:p-14 text-center max-w-lg">
            <span className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-[#25D366] text-white mb-6">
              <Check size={32} />
            </span>
            <h2 className="font-serif text-3xl font-bold text-cream-50 mb-3">Order Sent!</h2>
            <p className="text-cream-200/65 mb-6">
              Your order has been submitted and WhatsApp should now be open with your order details.
              Just hit send and we'll confirm your delivery right away!
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link to="/menu" className="btn-gold">Order More</Link>
              <Link to="/" className="btn-outline">Back Home</Link>
            </div>
          </div>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen section-pad py-10">
      <Reveal>
        <div className="text-center mb-10">
          <span className="text-gold-400 text-sm font-medium uppercase tracking-widest">Checkout</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cream-50 mt-3">
            Complete Your <span className="text-gradient-gold">Order</span>
          </h1>
        </div>
      </Reveal>

      {items.length === 0 ? (
        <Reveal>
          <div className="glass p-12 text-center max-w-md mx-auto">
            <ShoppingBag size={40} className="text-gold-400/40 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-semibold text-cream-100 mb-2">Your cart is empty</h3>
            <p className="text-cream-200/55 text-sm mb-6">Add some delicious cookies to get started!</p>
            <Link to="/menu" className="btn-gold">Browse Menu</Link>
          </div>
        </Reveal>
      ) : (
        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-3 space-y-6">
            <Reveal>
              <div className="glass p-6">
                <h3 className="font-serif text-lg font-semibold text-cream-100 mb-4">Your Cookies ({count})</h3>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4">
                      <img src={item.product.image_url} alt={item.product.name} className="h-16 w-16 rounded-xl object-cover" loading="lazy" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-cream-100 text-sm truncate">{item.product.name}</h4>
                        <p className="text-gold-300 text-sm font-semibold">₹ {item.product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center rounded-full border border-gold-400/20 overflow-hidden">
                        <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="h-8 w-8 flex items-center justify-center text-gold-200 hover:bg-gold-400/10"><Minus size={14} /></button>
                        <span className="w-8 text-center text-sm text-cream-100">{item.quantity}</span>
                        <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="h-8 w-8 flex items-center justify-center text-gold-200 hover:bg-gold-400/10"><Plus size={14} /></button>
                      </div>
                      <span className="text-cream-100 font-semibold text-sm w-16 text-right">₹ {(item.product.price * item.quantity).toFixed(2)}</span>
                      <button onClick={() => removeItem(item.product.id)} className="text-red-400/60 hover:text-red-400 transition"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="glass p-6">
                <h3 className="font-serif text-lg font-semibold text-cream-100 mb-4">Delivery Details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full Name" error={errors.name}>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Ravi Kumar" />
                  </Field>
                  <Field label="Phone Number" error={errors.phone}>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} placeholder="+91 98765 43210" />
                  </Field>
                  <Field label="Email (optional)" error={errors.email}>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="example@gmail.com" />
                  </Field>
                  <Field label="Delivery Address" error={errors.address}>
                    <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} placeholder="Flat No, Area, City, State, PIN Code" />
                  </Field>
                  <Field label="Preferred Date" error={errors.deliveryDate}>
                    <input type="date" value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} className={inputCls} />
                  </Field>
                  <Field label="Preferred Time" error={errors.deliveryTime}>
                    <input type="time" value={form.deliveryTime} onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })} className={inputCls} />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Special Instructions (optional)">
                      <textarea value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} className={`${inputCls} resize-none`} rows={3} placeholder="Any delivery instructions..." />
                    </Field>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-2">
            <Reveal delay={150}>
              <div className="glass-gold p-6 sticky top-24">
                <h3 className="font-serif text-lg font-semibold text-cream-100 mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-cream-200/70">{item.product.name} x{item.quantity}</span>
                      <span className="text-cream-100">₹ {(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gold-400/15 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-cream-200/60">Subtotal</span>
                    <span className="text-cream-100">₹ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cream-200/60">Delivery Fee</span>
                    <span className="text-cream-100">₹ {DELIVERY_FEE.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cream-200/60">Est. Delivery Time</span>
                    <span className="text-cream-100">30–60 mins</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gold-400/15">
                    <span className="font-serif text-lg font-bold text-cream-50">Total</span>
                    <span className="font-serif text-lg font-bold text-gold-300">₹ {total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full mt-6 flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-[#25D366] text-white font-semibold text-base shadow-lg shadow-[#25D366]/30"
                >
                  <MessageCircle size={20} fill="currentColor" />
                  {submitting ? 'Sending...' : 'Confirm Order via WhatsApp'}
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls =
  'w-full px-4 py-3 rounded-xl glass text-cream-100 placeholder:text-cream-200/30 focus:outline-none focus:border-gold-400/40 transition text-sm';

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-cream-200/60 mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}