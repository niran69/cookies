import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Cookie, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { MobileCartDrawer } from '@/components/MobileCartDrawer';

const links = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Cookies Menu' },
  { to: '/booking', label: 'Order Now' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/license', label: 'License' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-ink-950 border-b border-gold-400/10 py-3'
            : 'py-5'
        }`}
      >
        <nav className="section-pad flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-ink-950 shadow-lg shadow-gold-600/30 group-hover:scale-110 transition-transform">
              <Cookie size={22} />
            </span>
            <span className="font-serif text-lg sm:text-xl font-bold tracking-wide text-cream-100">
              Design Arena <span className="text-gradient-gold">Cookies</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  location.pathname === l.to
                    ? 'text-gold-300 bg-gold-400/10'
                    : 'text-cream-200/70 hover:text-gold-200 hover:bg-white/5'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Cart + Mobile Buttons */}
          <div className="flex items-center gap-3">

            {/* Desktop Cart */}
            <Link
              to="/booking"
              className="hidden lg:flex relative items-center gap-2 px-4 py-2 rounded-full border border-gold-400/30 text-gold-200 hover:bg-gold-400/10 transition-all"
            >
              <ShoppingBag size={18} />
              <span className="text-sm font-medium">Cart</span>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-ink-950 text-xs font-bold">
                  {count}
                </span>
              )}
            </Link>

            {/* ✅ Mobile Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="lg:hidden relative flex items-center justify-center h-10 w-10 rounded-full border border-gold-400/20 text-gold-200"
            >
              <ShoppingBag size={18} />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-ink-950 text-xs font-bold">
                  {count}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/20 text-gold-200"
            >
              <Menu size={20} />
            </button>

          </div>
        </nav>
      </header>

      {/* ✅ Mobile Menu Overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-[99999] bg-black">
          <div
            className="absolute inset-0"
            onClick={() => setOpen(false)}
          />

          <div className="relative flex flex-col gap-5 pt-28 px-6">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-6 right-6 text-cream-200"
            >
              <X size={28} />
            </button>

            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-lg font-medium text-cream-200"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Mobile Cart Drawer */}
      <MobileCartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
}