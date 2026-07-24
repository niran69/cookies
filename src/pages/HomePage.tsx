import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Star, Truck, ShieldCheck, Award, ChevronDown, Clock, Gift, Cookie,
} from 'lucide-react';
import { supabase, type Product, type Testimonial, type Offer } from '@/lib/supabase';
import { Reveal } from '@/components/Reveal';
import { LazyImage } from '@/components/LazyImage';
import { ProductCard } from '@/components/ProductCard';
import { openWhatsApp } from '@/lib/whatsapp';

const faqs = [
  { q: 'How do I place an order?', a: 'Simply browse our menu, add your favorite cookies to the cart, head to the Order page, fill in your details, and tap "Confirm Order via WhatsApp". Your order details will be sent to us instantly on WhatsApp.' },
  { q: 'What are the delivery fees?', a: 'Delivery fees are calculated based on your location. Standard delivery starts at $3.00 and is shown in your order summary before you confirm.' },
  { q: 'How fresh are the cookies?', a: 'Every cookie is baked fresh on the day of delivery. We never use preservatives — just premium ingredients and artisanal craftsmanship.' },
  { q: 'Can I customize my order?', a: 'Absolutely! Use the special instructions field on the order page to request gift wrapping, custom assortments, or dietary preferences.' },
  { q: 'Do you offer corporate gifting?', a: 'Yes, our Combo Packs and Royal Assortment are perfect for corporate events. Contact us via WhatsApp for bulk pricing and custom branding.' },
];

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    (async () => {
      const [{ data: prods }, { data: tests }, { data: offers }] = await Promise.all([
        supabase.from('products').select('*').eq('featured', true).limit(6),
        supabase.from('testimonials').select('*').eq('approved', true).eq('featured', true).limit(4),
        supabase.from('offers').select('*').eq('active', true).maybeSingle(),
      ]);
      if (prods) setProducts(prods);
      if (tests) setTestimonials(tests);
      if (offers) setOffer(offers as Offer);
    })();
  }, []);

  return (
    <div className="pt-20">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <LazyImage
            src="https://images.pexels.com/photos/2305345/pexels-photo-2305345.jpeg"
            alt="Freshly baked premium cookies"
            aspectClass="absolute inset-0"
            className="!opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/50" />
        </div>

        <div className="relative section-pad py-20 max-w-4xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold text-gold-200 text-sm font-medium mb-6">
              <Cookie size={15} /> Artisanally Crafted · Freshly Baked Daily
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] text-cream-50 mb-6">
              Freshly Baked <span className="text-gradient-gold">Premium Cookies</span> Delivered to Your Doorstep
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-lg text-cream-200/70 max-w-xl mb-8 leading-relaxed">
              Indulge in handcrafted cookies made with the world's finest ingredients — Belgian chocolate,
              Iranian pistachios, and a touch of 24k gold. Order in seconds via WhatsApp.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="flex flex-wrap gap-4">
              <Link to="/menu" className="btn-gold text-base">
                Explore Cookies <ArrowRight size={18} />
              </Link>
              <Link to="/booking" className="btn-outline text-base">
                Order Now
              </Link>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="flex flex-wrap items-center gap-6 mt-12">
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map((i) => <Star key={i} size={16} className="text-gold-400" fill="currentColor" />)}
                <span className="text-cream-200/60 text-sm ml-1.5">4.9/5 · 2,000+ reviews</span>
              </div>
              <div className="h-5 w-px bg-gold-400/20" />
              <span className="text-cream-200/60 text-sm">Trusted by 10,000+ customers</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="section-pad py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Award, title: 'Premium Ingredients', desc: 'Belgian chocolate, Iranian pistachios & more' },
            { icon: Truck, title: 'Fresh Delivery', desc: 'Baked & delivered same day' },
            { icon: ShieldCheck, title: '100% Secure', desc: 'Safe & encrypted ordering' },
            { icon: Clock, title: 'Fast Turnaround', desc: 'Order to door in under 2 hours' },
          ].map((b, i) => (
            <Reveal key={b.title} delay={i * 80}>
              <div className="glass p-5 sm:p-6 flex flex-col items-center text-center h-full hover:border-gold-400/20 transition">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/15 text-gold-300 mb-3">
                  <b.icon size={24} />
                </span>
                <h3 className="font-serif text-base font-semibold text-cream-100 mb-1">{b.title}</h3>
                <p className="text-xs text-cream-200/55 leading-relaxed">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="section-pad py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="relative">
              <div className="glass overflow-hidden aspect-[5/4]">
                <LazyImage
                  src="https://images.pexels.com/photos/4109998/pexels-photo-4109998.jpeg"
                  alt="Our cookie crafting process"
                  aspectClass="absolute inset-0"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 sm:-right-6 glass-gold px-6 py-4 max-w-[200px]">
                <p className="font-serif text-3xl font-bold text-gold-300">15+</p>
                <p className="text-xs text-cream-200/70 mt-1">Years of artisanal baking excellence</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <span className="text-gold-400 text-sm font-medium uppercase tracking-widest">Our Story</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50 mt-3 mb-5">
              A Passion for <span className="text-gradient-gold">Perfect Cookies</span>
            </h2>
            <p className="text-cream-200/65 leading-relaxed mb-4">
              Design Arena Cookies began with a simple belief: that a cookie can be extraordinary. What started
              in a home kitchen has grown into a premium bakery trusted by thousands — but our commitment to
              quality has never changed.
            </p>
            <p className="text-cream-200/65 leading-relaxed mb-6">
              Every cookie is handcrafted in small batches using only the finest ingredients sourced from around
              the world. No shortcuts, no preservatives — just pure, indulgent flavor baked fresh for you.
            </p>
            <Link to="/about" className="btn-outline">
              Read Our Full Story <ArrowRight size={17} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* FEATURED COOKIES */}
      <section className="section-pad py-16">
        <Reveal>
          <div className="text-center mb-12">
            <span className="text-gold-400 text-sm font-medium uppercase tracking-widest">Featured Collection</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream-50 mt-3">
              Our Most Loved <span className="text-gradient-gold">Cookies</span>
            </h2>
            <p className="text-cream-200/55 max-w-lg mx-auto mt-4">Handpicked favorites that keep our customers coming back for more.</p>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/menu" className="btn-gold">
            View Full Menu <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* OFFER BANNER */}
      {offer && (
        <section className="section-pad py-10">
          <Reveal>
            <div className="relative glass-gold overflow-hidden p-8 sm:p-12 text-center">
              <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gold-400/10 blur-3xl" />
              <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-gold-400/10 blur-3xl" />
              <div className="relative">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400 text-ink-950 text-xs font-bold uppercase tracking-wide mb-4">
                  <Gift size={13} /> {offer.badge}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-cream-50 mb-3">{offer.title}</h2>
                <p className="text-cream-200/70 max-w-xl mx-auto mb-6">{offer.description}</p>
                <button onClick={() => openWhatsApp('Hello! I would like to claim the weekend special offer (WEEKEND15).')} className="btn-gold">
                  Claim Offer on WhatsApp <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="section-pad py-16">
        <Reveal>
          <div className="text-center mb-12">
            <span className="text-gold-400 text-sm font-medium uppercase tracking-widest">Testimonials</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream-50 mt-3">
              Loved by <span className="text-gradient-gold">Cookie Lovers</span>
            </h2>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 100}>
              <div className="glass p-6 sm:p-7 h-full flex flex-col">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} size={16} className="text-gold-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-cream-200/75 leading-relaxed italic mb-5 flex-1">"{t.message}"</p>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400/20 text-gold-300 font-serif font-bold">
                    {t.name.charAt(0)}
                  </span>
                  <span className="text-cream-100 font-medium text-sm">{t.name}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad py-16 max-w-3xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <span className="text-gold-400 text-sm font-medium uppercase tracking-widest">FAQ</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50 mt-3">
              Frequently Asked <span className="text-gradient-gold">Questions</span>
            </h2>
          </div>
        </Reveal>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="glass overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="font-serif text-base sm:text-lg font-semibold text-cream-100">{f.q}</span>
                  <ChevronDown
                    size={20}
                    className={`text-gold-400 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                <div className={`overflow-hidden transition-all duration-400 ${openFaq === i ? 'max-h-60' : 'max-h-0'}`}>
                  <p className="px-6 pb-5 text-cream-200/60 text-sm leading-relaxed">{f.a}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad py-16">
        <Reveal>
          <div className="glass p-10 sm:p-16 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream-50 mb-4">
              Ready to <span className="text-gradient-gold">Indulge?</span>
            </h2>
            <p className="text-cream-200/65 max-w-lg mx-auto mb-8">
              Your perfect cookie experience is just a tap away. Place your order on WhatsApp and we'll handle the rest.
            </p>
            <Link to="/booking" className="btn-gold text-base">
              Place Your Order <ArrowRight size={18} />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
