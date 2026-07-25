import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function MobileCartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, updateQty, removeItem, subtotal } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 lg:hidden">
      <div className="absolute right-0 top-0 h-full w-80 bg-ink-950 p-6 overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-white">Your Cart</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {items.map((item) => (
          <div key={item.product.id} className="mb-6 border-b border-gold-400/20 pb-4">

            {/* ✅ IMAGE + NAME */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={item.product.image_url}
                alt={item.product.name}
                className="h-12 w-12 rounded-lg object-cover"
              />

              <div className="flex-1">
                <p className="text-white text-sm font-medium">
                  {item.product.name}
                </p>
                <p className="text-gold-400 text-sm">
                  ₹ {item.product.price.toFixed(2)}
                </p>
              </div>
            </div>

            {/* ✅ QUANTITY CONTROLS */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQty(item.product.id, item.quantity - 1)}
                className="h-7 w-7 flex items-center justify-center rounded-full border border-gold-400/40 text-gold-300"
              >
                <Minus size={14} />
              </button>

              <span className="text-white">
                {item.quantity}
              </span>

              <button
                onClick={() => updateQty(item.product.id, item.quantity + 1)}
                className="h-7 w-7 flex items-center justify-center rounded-full border border-gold-400/40 text-gold-300"
              >
                <Plus size={14} />
              </button>

              <button
                onClick={() => removeItem(item.product.id)}
                className="text-red-400 ml-auto"
              >
                <Trash2 size={16} />
              </button>
            </div>

          </div>
        ))}

        <div className="mt-6 border-t border-gold-400/20 pt-4 text-white">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹ {subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}