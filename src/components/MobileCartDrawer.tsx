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
          <div key={item.product.id} className="mb-4 border-b border-gold-400/20 pb-4">
            <div className="flex justify-between text-sm text-white mb-2">
              <span>{item.product.name}</span>
              <span>₹ {(item.product.price * item.quantity).toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQty(item.product.id, item.quantity - 1)}
                className="border border-gold-400/40 rounded-full h-7 w-7 flex items-center justify-center"
              >
                <Minus size={14} />
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() => updateQty(item.product.id, item.quantity + 1)}
                className="border border-gold-400/40 rounded-full h-7 w-7 flex items-center justify-center"
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