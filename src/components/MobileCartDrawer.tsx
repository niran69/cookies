import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';

export function MobileCartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  if (!open) return null;

  const handleAddCookies = () => {
    onClose();
    navigate('/menu');
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 lg:hidden">
      <div className="absolute right-0 top-0 h-full w-80 bg-ink-950 p-6 overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-white">Your Cart</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* ✅ EMPTY STATE IMPROVED */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-24 text-center px-4">

            <div className="h-20 w-20 rounded-full bg-gold-400/10 flex items-center justify-center mb-6">
              <ShoppingBag size={32} className="text-gold-400" />
            </div>

            <h3 className="text-white text-lg font-semibold mb-2">
              Your Cart is Empty
            </h3>

            <p className="text-cream-200/60 text-sm mb-6">
              Looks like you haven't added any delicious cookies yet.
            </p>

            <button
              onClick={handleAddCookies}
              className="bg-gradient-to-r from-gold-400 to-gold-600 text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
            >
              Browse Cookies
            </button>

          </div>
        ) : (
          <>
            {items.map((item) => (
              <div key={item.product.id} className="mb-6 border-b border-gold-400/20 pb-4">

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

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQty(item.product.id, item.quantity - 1)}
                    className="h-7 w-7 flex items-center justify-center rounded-full border border-gold-400/40 text-gold-300 hover:bg-gold-400/10 transition"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="text-white">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQty(item.product.id, item.quantity + 1)}
                    className="h-7 w-7 flex items-center justify-center rounded-full border border-gold-400/40 text-gold-300 hover:bg-gold-400/10 transition"
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
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>₹ {subtotal.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}