import { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { openWhatsApp } from '@/lib/whatsapp';

export function WhatsAppButton() {
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowLabel(true), 2500);
    const t2 = setTimeout(() => setShowLabel(false), 8000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-10 flex items-center gap-3">
      {showLabel && (
        <div className="hidden sm:flex items-center gap-2 glass px-4 py-2.5 rounded-full animate-fade-in">
          <span className="text-sm text-cream-100">Order on WhatsApp</span>
          <button
            onClick={() => setShowLabel(false)}
            className="text-cream-200/50 hover:text-cream-100"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <button
        onClick={() =>
          openWhatsApp('Hello Design Arena Cookies! I would like to place an order.')
        }
        className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-[#25D366]/30 hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label="Order on WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        <MessageCircle size={28} fill="currentColor" className="relative" />
      </button>
    </div>
  );
}