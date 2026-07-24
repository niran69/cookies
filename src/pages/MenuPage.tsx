import { useEffect, useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { supabase, type Product } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { Reveal } from '@/components/Reveal';

const categories = ['All', 'Chocolate', 'Nutty', 'Fruit', 'Premium', 'Combo'] as const;

export function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<(typeof categories)[number]>('All');

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: true });
      if (data) setProducts(data);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = category === 'All' || p.category === category;
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [products, search, category]);

  return (
    <div className="pt-24 min-h-screen">
      {/* Header */}
      <section className="section-pad py-10 text-center">
        <Reveal>
          <span className="text-gold-400 text-sm font-medium uppercase tracking-widest">Our Collection</span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-cream-50 mt-3 mb-4">
            The <span className="text-gradient-gold">Cookies Menu</span>
          </h1>
          <p className="text-cream-200/55 max-w-lg mx-auto">
            Explore our full range of artisanal cookies. Filter by category, search your favorites, and add to cart in seconds.
          </p>
        </Reveal>
      </section>

      {/* Search & Filter */}
      <section className="section-pad pb-6 sticky top-20 z-30 bg-ink-950/80 backdrop-blur-xl py-4 border-y border-gold-400/10">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-400/50" />
            <input
              type="text"
              placeholder="Search cookies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full glass text-cream-100 placeholder:text-cream-200/30 focus:outline-none focus:border-gold-400/40 transition"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
            <SlidersHorizontal size={16} className="text-gold-400/50 shrink-0 hidden sm:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-ink-950'
                    : 'glass text-cream-200/70 hover:text-gold-200 hover:border-gold-400/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-pad py-10">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-cream-200/50 text-lg">No cookies found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
