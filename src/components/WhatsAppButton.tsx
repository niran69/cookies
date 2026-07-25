import { useState } from 'react';
import { MessageCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { openWhatsApp } from '@/lib/whatsapp';

export function WhatsAppButton() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`fixed bottom-6 right-0 z-50 flex items-center transition-all duration-300 ${
        collapsed ? 'translate-x-16' : 'translate-x-0'
      }`}
    >
      {/* Arrow Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="bg-gold-500 text-black h-10 w-10 flex items-center justify-center rounded-l-full shadow-lg"
      >
        {collapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* WhatsApp Button */}
      <button
        onClick={() =>
          openWhatsApp(
            'Hello Design Arena Cookies! I would like to place an order.'
          )
        }
        className="h-14 w-14 flex items-center justify-center bg-[#25D366] text-white rounded-full shadow-xl hover:scale-110 transition-all"
      >
        <MessageCircle size={26} />
      </button>
    </div>
  );
}