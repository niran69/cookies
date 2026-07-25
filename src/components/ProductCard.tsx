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
      </div>

      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs font-medium text-gold-400 uppercase tracking-wider mb-1.5">
          {product.category}
        </span>

        <h3 className="font-serif text-lg font-semibold text-cream-100 mb-1.5">
          {product.name}
        </h3>

        <p className="text-sm text-cream-200/55 mb-4 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-serif font-bold text-gold-300">
            ₹ {product.price.toFixed(2)}
          </span>

          {currentQty > 0 && (
            <span className="text-sm text-gold-400 font-semibold">
              In Cart: {currentQty}
            </span>
          )}
        </div>

        {/* ✅ CART CONTROLS */}
        {currentQty > 0 ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                updateQty(product.id, currentQty - 1)
              }
              className="flex h-9 w-9 items-center justify-center border border-gold-400/30 rounded-full"
            >
              <Minus size={15} />
            </button>

            <span className="w-8 text-center">
              {currentQty}
            </span>

            <button
              onClick={() =>
                updateQty(product.id, currentQty + 1)
              }
              className="flex h-9 w-9 items-center justify-center border border-gold-400/30 rounded-full"
            >
              <Plus size={15} />
            </button>

            <button
              onClick={() => removeItem(product.id)}
              className="ml-2 text-red-400"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => addItem(product, 1)}
            className="btn-gold !py-2.5 text-sm"
          >
            <ShoppingBag size={16} /> Add
          </button>
        )}
      </div>
    </div>
  );
}