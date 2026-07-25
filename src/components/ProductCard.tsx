import { Plus, Minus, ShoppingBag, Star, Trash2 } from 'lucide-react';
import type { Product } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { LazyImage } from '@/components/LazyImage';

export function ProductCard({ product }: { product: Product }) {
  const { addItem, updateQty, removeItem, items } = useCart();

  const existingItem = items.find(
    (i) => i.product.id === product.id
  );

  const currentQty = existingItem ? existingItem.quantity : 0;

  return (
    <div className="group glass overflow-hidden flex flex-col transition-all duration-500 hover:border-gold-400/30 hover:shadow-2xl hover:shadow-gold-600/10 hover:-translate-y-1">
      
      <div className="relative overflow-hidden aspect-[4/3]">
        <LazyImage
          src={product.image_url}
          alt={product.name}
          aspectClass="absolute inset-0"
          className="transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />

        {product.featured && (
          <span className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full bg-gold-400/90 text-ink-950 text-xs font-semibold">
            <Star size={11} fill="currentColor" /> Featured
          </span>
        )}

        {!product.in_stock && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-red-500/90 text-white text-xs font-semibold">
            Out of Stock
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs font-medium text-gold-400 uppercase tracking-wider mb-1.5">
          {product.category}
        </span>

        <h3 className="font-serif text-lg font-semibold text-cream-100 mb-1.5 leading-snug">
          {product.name}
        </h3>

        <p className="text-sm text-cream-200/55 leading-relaxed mb-4 flex-1 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-serif font-bold text-gold-300">
            ₹ {product.price.toFixed(2)}
          </span>

          {currentQty > 0 && (
            <span className="text-xs text-gold-400 font-semibold animate-pulse">
              In Cart: {currentQty}
            </span>
          )}
        </div>

        {/* ✅ PREMIUM CART CONTROLS */}
        {currentQty > 0 ? (
          <div className="flex items-center justify-between bg-black/40 border border-gold-400/20 rounded-full px-4 py-2">

            <div className="flex items-center gap-3">

              <button
                onClick={() => updateQty(product.id, currentQty - 1)}
                className="h-8 w-8 flex items-center justify-center rounded-full border border-gold-400/40 text-gold-300 hover:bg-gold-400/10 transition"
              >
                <Minus size={14} />
              </button>

              <span className="text-gold-200 font-semibold text-sm w-6 text-center">
                {currentQty}
              </span>

              <button
                onClick={() => updateQty(product.id, currentQty + 1)}
                className="h-8 w-8 flex items-center justify-center rounded-full border border-gold-400/40 text-gold-300 hover:bg-gold-400/10 transition"
              >
                <Plus size={14} />
              </button>

            </div>

            <button
              onClick={() => removeItem(product.id)}
              className="text-red-400 hover:text-red-300 transition"
            >
              <Trash2 size={16} />
            </button>

          </div>
        ) : (
          <button
            onClick={() => addItem(product, 1)}
            className="flex-1 bg-gradient-to-r from-gold-400 to-gold-600 text-black py-2.5 rounded-full text-sm font-semibold hover:scale-[1.02] transition-all duration-300"
          >
            <ShoppingBag size={16} className="inline mr-2" />
            Add
          </button>
        )}
      </div>
    </div>
  );
}