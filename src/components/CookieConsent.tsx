import { useEffect, useState } from 'react';
import { Cookie, X } from 'lucide-react';

const CONSENT_KEY = 'dac_cookie_consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ necessary: true, analytics: true, marketing: true }));
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ necessary: true, analytics: false, marketing: false }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] px-4 pb-4 sm:px-6 sm:pb-6 animate-fade-up">
      <div className="mx-auto max-w-3xl glass-gold p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-400/20 text-gold-300">
          <Cookie size={22} />
        </span>
        <p className="text-sm text-cream-200/80 flex-1 leading-relaxed">
          We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
          By clicking "Accept", you consent to our use of cookies. See our privacy policy for details.
        </p>
        <div className="flex gap-3 w-full sm:w-auto">
          <button onClick={decline} className="flex-1 sm:flex-none px-5 py-2.5 rounded-full border border-gold-400/30 text-cream-200 text-sm font-medium hover:bg-white/5 transition">
            Decline
          </button>
          <button onClick={accept} className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 text-ink-950 text-sm font-semibold hover:scale-105 transition">
            Accept
          </button>
          <button onClick={() => setVisible(false)} className="sm:hidden text-cream-200/40" aria-label="Close">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
