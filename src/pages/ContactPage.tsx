import { useState } from 'react';
import { MessageCircle, Mail, Phone, MapPin, Clock, Send, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { openWhatsApp, sanitizeText, validateEmail } from '@/lib/whatsapp';
import { Reveal } from '@/components/Reveal';

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async () => {
    const e: Record<string, string> = {};
    if (!sanitizeText(form.name)) e.name = 'Name is required';
    if (!sanitizeText(form.email)) e.email = 'Email is required';
    else if (!validateEmail(form.email)) e.email = 'Enter a valid email';
    if (!sanitizeText(form.message)) e.message = 'Message is required';
    if (honeypot) e.bot = 'Spam detected';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: sanitizeText(form.name),
        email: sanitizeText(form.email),
        phone: sanitizeText(form.phone) || null,
        message: sanitizeText(form.message),
      });
      if (error) throw error;
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setErrors({ submit: 'Failed to send message. Please try again or reach us on WhatsApp.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen section-pad py-10">
      <Reveal>
        <div className="text-center mb-12">
          <span className="text-gold-400 text-sm font-medium uppercase tracking-widest">Get in Touch</span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-cream-50 mt-3 mb-4">
            Contact <span className="text-gradient-gold">Us</span>
          </h1>
          <p className="text-cream-200/55 max-w-lg mx-auto">
            Have a question, custom request, or just want to say hello? We'd love to hear from you.
          </p>
        </div>
      </Reveal>

      <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Contact info */}
        <Reveal>
          <div className="space-y-5">
            <div className="glass p-6 flex items-start gap-4 hover:border-gold-400/20 transition">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366] shrink-0"><MessageCircle size={24} /></span>
              <div>
                <h3 className="font-serif text-base font-semibold text-cream-100 mb-1">WhatsApp</h3>
                <p className="text-cream-200/55 text-sm mb-2">Fastest way to reach us — order or inquire instantly.</p>
                <button onClick={() => openWhatsApp('Hello Design Arena Cookies! I have a question.')} className="text-gold-300 text-sm font-medium hover:text-gold-200">+1 555-123-4567 →</button>
              </div>
            </div>

            <div className="glass p-6 flex items-start gap-4 hover:border-gold-400/20 transition">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/15 text-gold-300 shrink-0"><Mail size={24} /></span>
              <div>
                <h3 className="font-serif text-base font-semibold text-cream-100 mb-1">Email</h3>
                <p className="text-cream-200/55 text-sm mb-2">For detailed inquiries and corporate orders.</p>
                <a href="mailto:hello@designarenacookies.com" className="text-gold-300 text-sm font-medium hover:text-gold-200">hello@designarenacookies.com</a>
              </div>
            </div>

            <div className="glass p-6 flex items-start gap-4 hover:border-gold-400/20 transition">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/15 text-gold-300 shrink-0"><MapPin size={24} /></span>
              <div>
                <h3 className="font-serif text-base font-semibold text-cream-100 mb-1">Location</h3>
                <p className="text-cream-200/55 text-sm">123 Baker Street, Sweet District, City 12345</p>
              </div>
            </div>

            <div className="glass p-6 flex items-start gap-4 hover:border-gold-400/20 transition">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/15 text-gold-300 shrink-0"><Clock size={24} /></span>
              <div>
                <h3 className="font-serif text-base font-semibold text-cream-100 mb-1">Business Hours</h3>
                <ul className="text-cream-200/55 text-sm space-y-1">
                  <li>Mon – Fri: 9:00 AM – 9:00 PM</li>
                  <li>Saturday: 10:00 AM – 10:00 PM</li>
                  <li>Sunday: 11:00 AM – 7:00 PM</li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Contact form */}
        <Reveal delay={150}>
          <div className="glass p-6 sm:p-8">
            {success ? (
              <div className="text-center py-10">
                <span className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-[#25D366] text-white mb-5"><Check size={32} /></span>
                <h3 className="font-serif text-2xl font-bold text-cream-50 mb-2">Message Sent!</h3>
                <p className="text-cream-200/55 text-sm mb-6">We'll get back to you as soon as possible.</p>
                <button onClick={() => setSuccess(false)} className="btn-outline">Send Another</button>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-xl font-semibold text-cream-100 mb-5">Send Us a Message</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-cream-200/60 mb-1.5">Name</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Your name" />
                    {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-cream-200/60 mb-1.5">Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="you@example.com" />
                    {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-cream-200/60 mb-1.5">Phone (optional)</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} placeholder="+1 555 000 0000" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-cream-200/60 mb-1.5">Message</label>
                    <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${inputCls} resize-none`} rows={4} placeholder="How can we help you?" />
                    {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
                  </div>
                  <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                  {errors.submit && <p className="text-sm text-red-400 flex items-center gap-1.5"><AlertCircle size={15} /> {errors.submit}</p>}
                  <button onClick={handleSubmit} disabled={submitting} className="w-full btn-gold disabled:opacity-50">
                    <Send size={18} /> {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </>
            )}
          </div>
        </Reveal>
      </div>

      {/* Map */}
      <Reveal>
        <div className="mt-10 glass overflow-hidden max-w-5xl mx-auto">
          <iframe
            title="Our Location"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-0.01,51.49,0.01,51.51&layer=mapnik"
            className="w-full h-[300px] border-0 grayscale-[30%] opacity-80"
            loading="lazy"
          />
        </div>
      </Reveal>
    </div>
  );
}

const inputCls = 'w-full px-4 py-3 rounded-xl glass text-cream-100 placeholder:text-cream-200/30 focus:outline-none focus:border-gold-400/40 transition text-sm';
