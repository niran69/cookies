import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Heart, Award, Sparkles, Cookie } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { LazyImage } from '@/components/LazyImage';

export function AboutPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <LazyImage src="https://images.pexels.com/photos/8805130/pexels-photo-8805130.jpeg" alt="Artisanal cookies" aspectClass="absolute inset-0" className="!opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/70 to-ink-950" />
        </div>
        <div className="relative section-pad text-center max-w-3xl mx-auto">
          <Reveal>
            <span className="text-gold-400 text-sm font-medium uppercase tracking-widest">About Us</span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-cream-50 mt-3 mb-5">
              The Story Behind <span className="text-gradient-gold">Design Arena Cookies</span>
            </h1>
            <p className="text-cream-200/65 text-lg leading-relaxed">
              From a home kitchen to a premium bakery trusted by thousands — our journey has been fueled by one thing: an obsession with making the perfect cookie.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="section-pad py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <Reveal>
            <div className="glass overflow-hidden aspect-[5/4]">
              <LazyImage src="https://images.pexels.com/photos/4109998/pexels-photo-4109998.jpeg" alt="Our bakery kitchen" aspectClass="absolute inset-0" />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <span className="text-gold-400 text-sm font-medium uppercase tracking-widest">Our Journey</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50 mt-3 mb-5">
              From Passion to <span className="text-gradient-gold">Perfection</span>
            </h2>
            <p className="text-cream-200/65 leading-relaxed mb-4">
              Design Arena Cookies was born from a simple kitchen experiment in 2010. What started as weekend baking
              sessions for friends and family quickly became a local sensation. People couldn't stop talking about
              the rich, buttery, perfectly balanced cookies.
            </p>
            <p className="text-cream-200/65 leading-relaxed mb-4">
              Today, we've grown into a premium bakery that serves thousands of happy customers — but we still bake
              every batch by hand, in small quantities, with the same love and attention that started it all.
            </p>
            <p className="text-cream-200/65 leading-relaxed">
              Our name reflects our philosophy: cookies are our canvas, and every batch is a work of art.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="section-pad py-16">
        <Reveal>
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="text-gold-400 text-sm font-medium uppercase tracking-widest">Our Mission</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50 mt-3">
              What We <span className="text-gradient-gold">Stand For</span>
            </h2>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { icon: Leaf, title: 'Quality Ingredients', desc: 'We source the finest ingredients worldwide — Belgian chocolate, Iranian pistachios, French butter, and pure vanilla.' },
            { icon: Heart, title: 'Made with Love', desc: 'Every cookie is handcrafted in small batches. No mass production, no shortcuts — just genuine artisanal care.' },
            { icon: Award, title: 'Uncompromising Standards', desc: "We never ship a cookie we wouldn't eat ourselves. Quality control is baked into every step of our process." },
            { icon: Sparkles, title: 'Innovation', desc: 'From gold leaf saffron cookies to salted caramel truffles, we constantly push the boundaries of cookie artistry.' },
          ].map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <div className="glass p-6 h-full hover:border-gold-400/20 transition">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/15 text-gold-300 mb-4">
                  <v.icon size={24} />
                </span>
                <h3 className="font-serif text-lg font-semibold text-cream-100 mb-2">{v.title}</h3>
                <p className="text-sm text-cream-200/55 leading-relaxed">{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Quality Commitment */}
      <section className="section-pad py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <Reveal delay={150}>
            <span className="text-gold-400 text-sm font-medium uppercase tracking-widest">Our Commitment</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50 mt-3 mb-5">
              Only the <span className="text-gradient-gold">Finest Ingredients</span>
            </h2>
            <p className="text-cream-200/65 leading-relaxed mb-4">
              We believe that extraordinary cookies start with extraordinary ingredients. That's why we partner
              with ethical suppliers across the globe to bring you the very best.
            </p>
            <ul className="space-y-3">
              {[
                'Belgian couverture chocolate — 70% cocoa minimum',
                'Iranian pistachios, hand-selected for quality',
                'French-style cultured butter for rich flavor',
                'Madagascar bourbon vanilla — never artificial',
                'Organic flour and unrefined cane sugar',
                'No preservatives, no artificial flavors, ever',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-cream-200/70 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-400/15 text-gold-300 shrink-0">
                    <Cookie size={13} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass overflow-hidden aspect-square"><LazyImage src="https://images.pexels.com/photos/2305345/pexels-photo-2305345.jpeg" alt="Premium chocolate" aspectClass="absolute inset-0" /></div>
              <div className="glass overflow-hidden aspect-square mt-8"><LazyImage src="https://images.pexels.com/photos/8805130/pexels-photo-8805130.jpeg" alt="Fresh cookies" aspectClass="absolute inset-0" /></div>
              <div className="glass overflow-hidden aspect-square"><LazyImage src="https://images.pexels.com/photos/4109998/pexels-photo-4109998.jpeg" alt="Baking ingredients" aspectClass="absolute inset-0" /></div>
              <div className="glass overflow-hidden aspect-square mt-8"><LazyImage src="https://images.pexels.com/photos/2305345/pexels-photo-2305345.jpeg" alt="Cookie assortment" aspectClass="absolute inset-0" /></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad py-16">
        <Reveal>
          <div className="glass p-10 sm:p-16 text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50 mb-4">
              Taste the <span className="text-gradient-gold">Difference</span>
            </h2>
            <p className="text-cream-200/65 mb-8">Experience cookies crafted with passion, quality, and a whole lot of love.</p>
            <Link to="/menu" className="btn-gold text-base">Explore Our Cookies <ArrowRight size={18} /></Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
