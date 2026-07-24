import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Cookie, Users, LogOut, Download, TrendingUp,
  DollarSign, Package, Check, X, Clock, Truck, Edit2, Trash2, Plus, Star,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, type Product, type Order } from '@/lib/supabase';
import { Reveal } from '@/components/Reveal';

type Tab = 'dashboard' | 'orders' | 'products' | 'customers';

export function AdminDashboardPage() {
  const { session, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !session) navigate('/admin/login');
  }, [session, loading, navigate]);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const [{ data: p }, { data: o }] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
      ]);
      if (p) setProducts(p);
      if (o) setOrders(o);
      setDataLoading(false);
    })();
  }, [session]);

  const stats = useMemo(() => {
    const now = new Date();
    const today = now.toDateString();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const monthAgo = new Date(now.getTime() - 30 * 86400000);

    const todays = orders.filter((o) => new Date(o.created_at).toDateString() === today);
    const weeks = orders.filter((o) => new Date(o.created_at) >= weekAgo);
    const months = orders.filter((o) => new Date(o.created_at) >= monthAgo);

    const revenue = (arr: Order[]) => arr.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + Number(o.total), 0);

    return {
      todayCount: todays.length,
      weekCount: weeks.length,
      monthCount: months.length,
      todayRevenue: revenue(todays),
      weekRevenue: revenue(weeks),
      monthRevenue: revenue(months),
      pending: orders.filter((o) => o.status === 'pending').length,
      totalOrders: orders.length,
    };
  }, [orders]);

  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (!error) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    }
  };

  const toggleStock = async (product: Product) => {
    const { error } = await supabase.from('products').update({ in_stock: !product.in_stock }).eq('id', product.id);
    if (!error) {
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, in_stock: !p.in_stock } : p)));
    }
  };

  const toggleFeatured = async (product: Product) => {
    const { error } = await supabase.from('products').update({ featured: !product.featured }).eq('id', product.id);
    if (!error) {
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, featured: !p.featured } : p)));
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const exportCSV = () => {
    const headers = ['Order ID', 'Customer', 'Phone', 'Email', 'Address', 'Date', 'Time', 'Total', 'Status', 'Created'];
    const rows = orders.map((o) => [
      o.id, o.customer_name, o.phone, o.email || '', o.address, o.delivery_date, o.delivery_time,
      o.total, o.status, new Date(o.created_at).toLocaleString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !session) {
    return <div className="min-h-screen flex items-center justify-center text-gold-300">Loading...</div>;
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/15 text-yellow-400',
    confirmed: 'bg-blue-500/15 text-blue-400',
    preparing: 'bg-purple-500/15 text-purple-400',
    out_for_delivery: 'bg-orange-500/15 text-orange-400',
    delivered: 'bg-green-500/15 text-green-400',
    cancelled: 'bg-red-500/15 text-red-400',
  };

  const navItems: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Cookie },
    { id: 'customers', label: 'Customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-ink-950 pt-20 section-pad py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50">Admin Dashboard</h1>
          <p className="text-cream-200/50 text-sm mt-1">Welcome back, {session.user.email}</p>
        </div>
        <button onClick={() => signOut()} className="btn-outline !py-2.5 text-sm">
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto mb-8 pb-1">
        {navItems.map((n) => (
          <button
            key={n.id}
            onClick={() => setTab(n.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
              tab === n.id ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-ink-950' : 'glass text-cream-200/70 hover:text-gold-200'
            }`}
          >
            <n.icon size={16} /> {n.label}
          </button>
        ))}
      </div>

      {dataLoading ? (
        <div className="text-cream-200/50 text-center py-20">Loading data...</div>
      ) : (
        <>
          {/* DASHBOARD TAB */}
          {tab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Today's Orders", value: stats.todayCount, sub: `$${stats.todayRevenue.toFixed(2)}`, icon: ShoppingBag, color: 'text-gold-300' },
                  { label: 'This Week', value: stats.weekCount, sub: `$${stats.weekRevenue.toFixed(2)}`, icon: TrendingUp, color: 'text-green-400' },
                  { label: 'This Month', value: stats.monthCount, sub: `$${stats.monthRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-blue-400' },
                  { label: 'Pending', value: stats.pending, sub: `${stats.totalOrders} total`, icon: Clock, color: 'text-yellow-400' },
                ].map((s, i) => (
                  <Reveal key={s.label} delay={i * 60}>
                    <div className="glass p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ${s.color}`}><s.icon size={20} /></span>
                      </div>
                      <p className="text-2xl font-serif font-bold text-cream-50">{s.value}</p>
                      <p className="text-xs text-cream-200/50 mt-0.5">{s.label}</p>
                      <p className="text-xs text-gold-400/70 mt-1">{s.sub}</p>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={200}>
                <div className="glass p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-serif text-lg font-semibold text-cream-100">Recent Orders</h3>
                    <button onClick={() => setTab('orders')} className="text-gold-300 text-sm hover:text-gold-200">View all →</button>
                  </div>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((o) => (
                      <div key={o.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                        <div>
                          <p className="text-cream-100 text-sm font-medium">{o.customer_name}</p>
                          <p className="text-cream-200/40 text-xs">{new Date(o.created_at).toLocaleDateString()} · {o.delivery_time}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gold-300 font-semibold text-sm">${Number(o.total).toFixed(2)}</span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[o.status]}`}>{o.status.replace(/_/g, ' ')}</span>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && <p className="text-cream-200/40 text-sm text-center py-4">No orders yet.</p>}
                  </div>
                </div>
              </Reveal>
            </div>
          )}

          {/* ORDERS TAB */}
          {tab === 'orders' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-xl font-semibold text-cream-100">All Orders ({orders.length})</h3>
                <button onClick={exportCSV} className="btn-outline !py-2.5 text-sm">
                  <Download size={16} /> Export CSV
                </button>
              </div>
              <div className="space-y-3">
                {orders.map((o, i) => (
                  <Reveal key={o.id} delay={i * 30}>
                    <div className="glass p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-medium text-cream-100">{o.customer_name}</h4>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[o.status]}`}>{o.status.replace(/_/g, ' ')}</span>
                          </div>
                          <p className="text-cream-200/50 text-xs">{o.phone} · {o.address}</p>
                          <p className="text-cream-200/40 text-xs mt-0.5">Delivery: {o.delivery_date} at {o.delivery_time}</p>
                          {o.special_instructions && <p className="text-cream-200/40 text-xs mt-0.5 italic">Note: {o.special_instructions}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gold-300 font-serif font-bold text-lg">${Number(o.total).toFixed(2)}</span>
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                            className="px-3 py-2 rounded-lg glass text-cream-100 text-xs focus:outline-none focus:border-gold-400/40 cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
                {orders.length === 0 && <p className="text-cream-200/40 text-center py-10">No orders yet.</p>}
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {tab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-xl font-semibold text-cream-100">Products ({products.length})</h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p, i) => (
                  <Reveal key={p.id} delay={i * 40}>
                    <div className="glass p-4 flex gap-4">
                      <img src={p.image_url} alt={p.name} className="h-16 w-16 rounded-xl object-cover shrink-0" loading="lazy" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-cream-100 text-sm truncate">{p.name}</h4>
                        <p className="text-gold-300 font-semibold text-sm">${Number(p.price).toFixed(2)}</p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => toggleStock(p)}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${p.in_stock ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}
                          >
                            {p.in_stock ? 'In Stock' : 'Out'}
                          </button>
                          <button
                            onClick={() => toggleFeatured(p)}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${p.featured ? 'bg-gold-400/15 text-gold-300' : 'bg-white/5 text-cream-200/50'}`}
                          >
                            <Star size={11} className="inline" fill={p.featured ? 'currentColor' : 'none'} /> Featured
                          </button>
                          <button onClick={() => deleteProduct(p.id)} className="px-2 py-1 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition" aria-label="Delete">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* CUSTOMERS TAB */}
          {tab === 'customers' && (
            <div>
              <h3 className="font-serif text-xl font-semibold text-cream-100 mb-5">Customer Directory</h3>
              <div className="space-y-3">
                {(() => {
                  const customers = new Map<string, { name: string; phone: string; email: string; orders: number; total: number; lastOrder: string }>();
                  orders.forEach((o) => {
                    const key = o.phone;
                    const existing = customers.get(key);
                    if (existing) {
                      existing.orders++;
                      existing.total += Number(o.total);
                      if (new Date(o.created_at) > new Date(existing.lastOrder)) existing.lastOrder = o.created_at;
                    } else {
                      customers.set(key, {
                        name: o.customer_name,
                        phone: o.phone,
                        email: o.email || '',
                        orders: 1,
                        total: Number(o.total),
                        lastOrder: o.created_at,
                      });
                    }
                  });
                  const list = Array.from(customers.values()).sort((a, b) => b.total - a.total);
                  if (list.length === 0) return <p className="text-cream-200/40 text-center py-10">No customers yet.</p>;
                  return list.map((c, i) => (
                    <Reveal key={c.phone} delay={i * 30}>
                      <div className="glass p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-400/15 text-gold-300 font-serif font-bold">
                            {c.name.charAt(0)}
                          </span>
                          <div>
                            <h4 className="font-medium text-cream-100 text-sm">{c.name}</h4>
                            <p className="text-cream-200/40 text-xs">{c.phone} {c.email && `· ${c.email}`}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gold-300 font-semibold text-sm">${c.total.toFixed(2)}</p>
                          <p className="text-cream-200/40 text-xs">{c.orders} order{c.orders > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </Reveal>
                  ));
                })()}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
