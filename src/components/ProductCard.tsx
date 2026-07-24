import { useState } from 'react';
import { Plus, Minus, ShoppingBag, Star } from 'lucide-react';
import type { Product } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { LazyImage } from '@/components/LazyImage';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

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
          <span className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full bg-gold-400/90 text-ink-950 text-xs font-semibold backdrop-blur">
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
        <span className="text-xs font-medium text-gold-400 uppercase tracking-wider mb-1.5">{product.category}</span>
        <h3 className="font-serif text-lg font-semibold text-cream-100 mb-1.5 leading-snug">{product.name}</h3>
        <p className="text-sm text-cream-200/55 leading-relaxed mb-4 flex-1 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-serif font-bold text-gold-300">
  ₹ {product.price.toFixed(2)}
</span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center rounded-full border border-gold-400/20 overflow-hidden">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-9 w-9 items-center justify-center text-gold-200 hover:bg-gold-400/10 transition disabled:opacity-40"
              disabled={!product.in_stock}
              aria-label="Decrease quantity"
            >
              <Minus size={15} />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-cream-100">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="flex h-9 w-9 items-center justify-center text-gold-200 hover:bg-gold-400/10 transition disabled:opacity-40"
              disabled={!product.in_stock}
              aria-label="Increase quantity"
            >
              <Plus size={15} />
            </button>
          </div>
          <button
            onClick={() => {
              addItem(product, qty);
              setQty(1);
            }}
            disabled={!product.in_stock}
            className="flex-1 btn-gold !py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ShoppingBag size={16} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
