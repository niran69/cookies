import { Link } from 'react-router-dom';
import { Cookie, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-ink-900 border-t border-gold-400/10 mt-20">
      <div className="section-pad py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-ink-950">
              <Cookie size={22} />
            </span>
            <span className="font-serif text-lg font-bold text-cream-100">
              Design Arena <span className="text-gradient-gold">Cookies</span>
            </span>
          </div>
          <p className="text-cream-200/60 text-sm leading-relaxed">
            Freshly baked premium cookies, crafted with the finest ingredients and delivered to your doorstep.
          </p>
          <div className="flex gap-3 mt-5">
            <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-400/20 text-gold-200 hover:bg-gold-400/10 transition"><Instagram size={16} /></a>
            <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-400/20 text-gold-200 hover:bg-gold-400/10 transition"><Facebook size={16} /></a>
            <a href="#" aria-label="Twitter" className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-400/20 text-gold-200 hover:bg-gold-400/10 transition"><Twitter size={16} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-gold-200 font-serif text-base font-semibold mb-4">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="text-cream-200/60 hover:text-gold-200 transition">Home</Link></li>
            <li><Link to="/menu" className="text-cream-200/60 hover:text-gold-200 transition">Cookies Menu</Link></li>
            <li><Link to="/booking" className="text-cream-200/60 hover:text-gold-200 transition">Place an Order</Link></li>
            <li><Link to="/about" className="text-cream-200/60 hover:text-gold-200 transition">About Us</Link></li>
            <li><Link to="/contact" className="text-cream-200/60 hover:text-gold-200 transition">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold-200 font-serif text-base font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-cream-200/60">
            <li className="flex items-start gap-2"><Phone size={15} className="mt-0.5 text-gold-400 shrink-0" /> +1 555-123-4567</li>
            <li className="flex items-start gap-2"><Mail size={15} className="mt-0.5 text-gold-400 shrink-0" /> hello@designarenacookies.com</li>
            <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 text-gold-400 shrink-0" /> 123 Baker Street, Sweet District</li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold-200 font-serif text-base font-semibold mb-4">Business Hours</h4>
          <ul className="space-y-2 text-sm text-cream-200/60">
            <li>Mon – Fri: 9am – 9pm</li>
            <li>Saturday: 10am – 10pm</li>
            <li>Sunday: 11am – 7pm</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gold-400/10 py-6 section-pad flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-cream-200/40 text-xs">© {new Date().getFullYear()} Design Arena Cookies. All rights reserved.</p>
        <p className="text-cream-200/40 text-xs">Crafted with passion. Delivered with care.</p>
      </div>
    </footer>
  );
}
