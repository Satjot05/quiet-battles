// frontend/src/pages/StoreFrontPages.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Ruler,
  X,
  ChevronDown,
  Shield,
  Sparkles,
  ShoppingBag,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Save,
  Package,
  BookOpen,
  Layers,
  RotateCcw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const API_BASE = import.meta.env.VITE_API_URL || "https://quiet-battles-api.onrender.com/api";
const ROMAN_NUMERALS = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

// ============================================================================
// ANIMATION & MARQUEE HELPERS
// ============================================================================
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}

function EditorialMarquee() {
  const items = [
    'QUIET BATTLES™ ARCHIVE',
    'WEAR YOUR BATTLES',
    'SERIES 01 — THE ARCHITECTURE OF RESILIENCE',
    '500 GSM ARCHITECTURAL SILHOUETTES',
    'CRAFTED FOR SOLITUDE & ENDURANCE',
  ];

  return (
    <div className="w-full overflow-hidden bg-[#0c0c0c] border-y border-neutral-800/80 py-3.5 select-none">
      <div className="animate-marquee flex items-center">
        {[...items, ...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center shrink-0">
            <span className="text-[10px] sm:text-[11px] tracking-[0.35em] uppercase text-neutral-400 px-6 sm:px-8">
              {text}
            </span>
            <span className="text-[#a38f78] text-xs">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 1. SLIDE-OUT ARCHIVE BAG & CHECKOUT DRAWER
// ============================================================================
export function ArchiveBagDrawer() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalAmount, isBagOpen, setIsBagOpen } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: ''
  });

  if (!isBagOpen) return null;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items: cart,
          totalAmount
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrderConfirmed(data.orderNumber || 'QB-CONFIRMED');
        clearCart();
      } else {
        alert(data.error || 'Failed to place archive order.');
      }
    } catch {
      alert('Network error connecting to archive dispatch node.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#0f0f0f] border-l border-neutral-800 h-full flex flex-col justify-between p-6 sm:p-8 shadow-2xl overflow-y-auto">
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
            <span className="text-xs tracking-[0.3em] uppercase text-[#a38f78] flex items-center gap-2">
              <ShoppingBag size={14} /> Archive Bag ({cart.length})
            </span>
            <button
              onClick={() => {
                setIsBagOpen(false);
                setIsCheckingOut(false);
                setOrderConfirmed(null);
              }}
              className="text-neutral-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {orderConfirmed ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-full border border-[#a38f78] text-[#a38f78] flex items-center justify-center mx-auto">
                <Check size={20} />
              </div>
              <h3 className="text-xl font-serif-editorial text-white">Acquisition Dispatched</h3>
              <p className="text-xs text-neutral-400 font-mono">ORDER_REF: {orderConfirmed}</p>
              <p className="text-xs text-neutral-300 font-light">
                Your archival garment is allocated for packaging. A dispatch manifest has been directed to your email.
              </p>
              <button
                onClick={() => {
                  setOrderConfirmed(null);
                  setIsCheckingOut(false);
                  setIsBagOpen(false);
                }}
                className="mt-6 px-6 py-3 bg-[#f4f4f0] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#a38f78] hover:text-white transition-colors cursor-pointer"
              >
                Return to Storefront
              </button>
            </div>
          ) : isCheckingOut ? (
            <form onSubmit={handleSubmitOrder} className="py-6 space-y-4">
              <h4 className="text-xs uppercase tracking-[0.25em] text-white">Collector Dispatch Coordinates</h4>
              <input
                required
                type="text"
                placeholder="Full Legal Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#151515] border border-neutral-800 px-4 py-3 text-xs text-white focus:border-[#a38f78] outline-none"
              />
              <input
                required
                type="email"
                placeholder="Direct Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#151515] border border-neutral-800 px-4 py-3 text-xs text-white focus:border-[#a38f78] outline-none"
              />
              <input
                required
                type="text"
                placeholder="Destination Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-[#151515] border border-neutral-800 px-4 py-3 text-xs text-white focus:border-[#a38f78] outline-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="bg-[#151515] border border-neutral-800 px-4 py-3 text-xs text-white focus:border-[#a38f78] outline-none"
                />
                <input
                  required
                  type="text"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="bg-[#151515] border border-neutral-800 px-4 py-3 text-xs text-white focus:border-[#a38f78] outline-none"
                />
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-between text-xs tracking-wider uppercase text-neutral-300">
                <span>Total Commitment</span>
                <span className="text-white font-medium">${totalAmount} USD</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#a38f78] text-black text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#f4f4f0] transition-colors cursor-pointer"
              >
                {submitting ? 'Confirming Dispatch...' : `Confirm Archival Order — $${totalAmount} USD`}
              </button>
              <button
                type="button"
                onClick={() => setIsCheckingOut(false)}
                className="w-full text-center text-[10px] uppercase tracking-widest text-neutral-500 hover:text-neutral-300 pt-1 cursor-pointer"
              >
                ← Back to Garment List
              </button>
            </form>
          ) : (
            <div className="divide-y divide-neutral-900 my-4 max-h-[55vh] overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="py-20 text-center text-xs tracking-widest uppercase text-neutral-600">
                  Your Archive Bag is Empty
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={`${item.productId}-${item.size}-${idx}`} className="py-4 flex gap-4 items-center">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover bg-neutral-900 border border-neutral-800 shrink-0" />
                    <div className="flex-1">
                      <h5 className="text-xs uppercase font-serif-editorial text-white line-clamp-1">{item.name}</h5>
                      <p className="text-[10px] text-[#a38f78] tracking-wider uppercase mt-0.5">Size {item.size} // ${item.price} USD</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
                        <button onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)} className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 hover:text-white cursor-pointer">-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)} className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 hover:text-white cursor-pointer">+</button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.productId, item.size)} className="text-neutral-500 hover:text-red-400 p-2 cursor-pointer">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {!orderConfirmed && !isCheckingOut && cart.length > 0 && (
          <div className="pt-6 border-t border-neutral-800 space-y-4">
            <div className="flex justify-between text-xs tracking-widest uppercase">
              <span className="text-neutral-400">Subtotal</span>
              <span className="text-white font-medium">${totalAmount} USD</span>
            </div>
            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full py-4 bg-[#f4f4f0] text-black text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#a38f78] hover:text-white transition-all cursor-pointer"
            >
              Proceed to Dispatch (${totalAmount} USD)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 2. RESTORED CINEMATIC CMS ADMIN CONSOLE (VAULT HUD)
// ============================================================================
export function CmsAdminModal({ isOpen, onClose }) {
  const [token, setToken] = useState(localStorage.getItem('qb_admin_token') || '');
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem('qb_admin_token')));
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [series, setSeries] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [saveStatus, setSaveStatus] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const refreshAllData = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE}/products`).then((r) => r.json()).catch(() => []),
      fetch(`${API_BASE}/series`).then((r) => r.json()).catch(() => []),
      fetch(`${API_BASE}/chapters`).then((r) => r.json()).catch(() => []),
      fetch(`${API_BASE}/orders`, {
        headers: { 'Authorization': `Bearer ${token || 'qb-editorial-cms-token-2026'}` }
      }).then((r) => r.json()).catch(() => [])
    ]).then(([prodData, seriesData, chapData, orderData]) => {
      setProducts(Array.isArray(prodData) ? prodData : []);
      setSeries(Array.isArray(seriesData) ? seriesData : []);
      setChapters(Array.isArray(chapData) ? chapData : []);
      setOrders(Array.isArray(orderData) ? orderData : []);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (isOpen) refreshAllData();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setSaveStatus({ text: 'VERIFYING BIOMETRIC CLEARANCE...', type: 'info' });

    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        localStorage.setItem('qb_admin_token', data.token);
        setToken(data.token);
        setLoggedIn(true);
        setSaveStatus({ text: '', type: '' });
        refreshAllData();
      } else {
        setSaveStatus({ text: data.error || 'INVALID CLEARANCE PROTOCOL', type: 'error' });
      }
    } catch {
      setSaveStatus({ text: 'VAULT SECURE LINK OFFLINE', type: 'error' });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveStatus({ text: 'COMMITTING MUTATION TO ARCHIVE VAULT...', type: 'info' });

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || 'qb-editorial-cms-token-2026'}`,
      'x-admin-token': token || 'qb-editorial-cms-token-2026'
    };

    const targetId = editingItem._id || editingItem.slug;
    const url = `${API_BASE}/${activeTab}/${targetId}`;

    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(editingItem)
      });
      const data = await res.json();
      if (res.ok) {
        setSaveStatus({ text: 'MUTATION DEPLOYED TO ATLAS CORE', type: 'success' });
        setTimeout(() => setSaveStatus({ text: '', type: '' }), 3000);
        refreshAllData();
      } else {
        setSaveStatus({ text: `REJECTED: ${data.error || 'SCHEMA VIOLATION'}`, type: 'error' });
      }
    } catch (err) {
      setSaveStatus({ text: `NETWORK ERROR: ${err.message}`, type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[88vh] bg-[#0c0c0c] border border-neutral-800 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden">
        
        {/* HUD Top Bar */}
        <div className="px-6 py-4 bg-[#080808] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-[#a38f78] animate-pulse" />
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#a38f78] font-bold">
              QUIET BATTLES™ // ARCHIVAL CMS CONTROL DECK
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline font-mono text-[9px] tracking-[0.25em] uppercase text-neutral-500 border border-neutral-900 px-2.5 py-1">
              STATUS: {loggedIn ? 'UNRESTRICTED CLEARANCE' : 'SECURE VAULT GATE'}
            </span>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-white transition-colors cursor-pointer p-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* VAULT LOGIN GATEWAY */}
        {!loggedIn ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-film-grain">
            <div className="w-full max-w-md p-8 sm:p-10 bg-[#101010] border border-neutral-800 shadow-2xl space-y-6 relative">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full border border-[#a38f78]/60 mx-auto flex items-center justify-center text-[#a38f78] mb-3">
                  <Lock size={18} />
                </div>
                <h3 className="font-serif-editorial text-2xl text-white tracking-wider">RESTRICTED VAULT</h3>
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-400">
                  Authentication Required for Archive Modification
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">Master Identifier</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#161616] border border-neutral-800 px-4 py-3 text-xs text-white font-mono focus:border-[#a38f78] outline-none"
                    placeholder="ADMIN_ID"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">Security Clearance Key</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#161616] border border-neutral-800 px-4 py-3 text-xs text-white font-mono focus:border-[#a38f78] outline-none pr-10"
                      placeholder="••••••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {saveStatus.text && (
                  <p className={`font-mono text-[10px] tracking-wider text-center ${
                    saveStatus.type === 'error' ? 'text-red-400' : 'text-[#a38f78]'
                  }`}>
                    {saveStatus.text}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-[#f4f4f0] text-black font-mono text-xs uppercase tracking-[0.3em] font-semibold hover:bg-[#a38f78] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  <Unlock size={14} /> Validate Clearance
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* UNLOCKED HUD DASHBOARD */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation & Directory */}
            <div className="w-full md:w-80 bg-[#090909] border-r border-neutral-800 flex flex-col shrink-0">
              {/* Category Switcher Tabs */}
              <div className="grid grid-cols-4 border-b border-neutral-800 p-2 gap-1 bg-[#0d0d0d]">
                {[
                  { id: 'products', label: 'Items', icon: Package },
                  { id: 'chapters', label: 'Texts', icon: BookOpen },
                  { id: 'series', label: 'Series', icon: Layers },
                  { id: 'orders', label: 'Orders', icon: ShoppingBag }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setEditingItem(null);
                        setSaveStatus({ text: '', type: '' });
                      }}
                      className={`py-2 px-1 text-[10px] font-mono tracking-wider uppercase flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                        active
                          ? 'border-[#a38f78] bg-[#1a1816] text-[#a38f78]'
                          : 'border-transparent text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      <Icon size={13} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {loading ? (
                  <div className="p-8 text-center font-mono text-[10px] tracking-widest uppercase text-neutral-600 animate-pulse">
                    FETCHING ATLAS CLUSTER...
                  </div>
                ) : activeTab === 'orders' ? (
                  orders.length === 0 ? (
                    <div className="p-8 text-center font-mono text-[10px] uppercase text-neutral-600">NO ORDERS LOGGED</div>
                  ) : (
                    orders.map((ord) => (
                      <div
                        key={ord._id}
                        onClick={() => setEditingItem(ord)}
                        className={`p-3.5 border transition-all cursor-pointer ${
                          editingItem?._id === ord._id
                            ? 'border-[#a38f78] bg-[#141414] text-white'
                            : 'border-neutral-900 bg-[#0b0b0b] text-neutral-400 hover:border-neutral-800'
                        }`}
                      >
                        <div className="flex justify-between items-center font-mono text-[10px]">
                          <span className="text-[#a38f78] font-bold">{ord.orderNumber}</span>
                          <span className="text-white">${ord.totalAmount} USD</span>
                        </div>
                        <p className="text-xs text-neutral-300 mt-1 truncate">{ord.customer?.name || 'Collector'}</p>
                        <p className="text-[10px] text-neutral-600 truncate mt-0.5">{ord.customer?.email}</p>
                      </div>
                    ))
                  )
                ) : (
                  (activeTab === 'products' ? products : activeTab === 'chapters' ? chapters : series).map((item) => {
                    const isSelected = editingItem?._id === item._id;
                    return (
                      <div
                        key={item._id}
                        onClick={() => {
                          const cloned = { ...item };
                          if (activeTab === 'products' && !cloned.sku) {
                            cloned.sku = `QB-${(cloned.slug || 'GARMENT').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}`;
                          }
                          setEditingItem(cloned);
                        }}
                        className={`p-3.5 border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#a38f78] bg-[#161514] text-white shadow-[inset_0_0_12px_rgba(163,143,120,0.1)]'
                            : 'border-neutral-900 bg-[#0c0c0c] text-neutral-400 hover:border-neutral-800 hover:text-neutral-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <h5 className="font-serif-editorial text-xs truncate max-w-[170px] text-neutral-200">
                            {item.name || item.title}
                          </h5>
                          {item.sku && (
                            <span className="font-mono text-[9px] text-[#a38f78] px-1 bg-[#1a1816] border border-[#a38f78]/30">
                              {item.sku}
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-[9px] text-neutral-600 truncate mt-1">
                          SLUG: {item.slug || item._id}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Refresh Footer */}
              <div className="p-3 border-t border-neutral-800 bg-[#080808] flex justify-between items-center">
                <button
                  onClick={refreshAllData}
                  className="font-mono text-[9px] tracking-widest uppercase text-neutral-500 hover:text-[#a38f78] flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw size={11} /> Sync Atlas
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('qb_admin_token');
                    setLoggedIn(false);
                  }}
                  className="font-mono text-[9px] tracking-widest uppercase text-neutral-600 hover:text-red-400 cursor-pointer"
                >
                  Deauthorize
                </button>
              </div>
            </div>

            {/* Editing Cockpit */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#0e0e0e]">
              {editingItem ? (
                activeTab === 'orders' ? (
                  /* ORDER MANIFEST INSPECTOR */
                  <div className="space-y-6 max-w-2xl">
                    <div className="border-b border-neutral-800 pb-4">
                      <span className="font-mono text-[10px] tracking-widest uppercase text-[#a38f78]">
                        DISPATCH MANIFEST // {editingItem.orderNumber}
                      </span>
                      <h3 className="font-serif-editorial text-2xl text-white mt-1">
                        Acquisition from {editingItem.customer?.name}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 font-mono text-xs bg-[#121212] p-5 border border-neutral-800">
                      <div>
                        <span className="text-neutral-500 block text-[9px] uppercase">Destination City</span>
                        <span className="text-white mt-0.5 block">{editingItem.customer?.city}, {editingItem.customer?.postalCode}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[9px] uppercase">Email Contact</span>
                        <span className="text-white mt-0.5 block truncate">{editingItem.customer?.email}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-neutral-500 block text-[9px] uppercase">Fulfillment Address</span>
                        <span className="text-white mt-0.5 block">{editingItem.customer?.address}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">Allocated Garments</h4>
                      <div className="divide-y divide-neutral-900 border border-neutral-800 bg-[#121212]">
                        {editingItem.items?.map((it, idx) => (
                          <div key={idx} className="p-3.5 flex justify-between items-center text-xs">
                            <div>
                              <p className="font-serif-editorial text-white">{it.name}</p>
                              <p className="font-mono text-[10px] text-[#a38f78]">Size {it.size} × {it.quantity}</p>
                            </div>
                            <span className="font-mono text-neutral-300">${it.price * it.quantity} USD</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-800 flex justify-between font-mono text-xs uppercase">
                      <span className="text-neutral-500">Gross Settlement:</span>
                      <span className="text-[#a38f78] font-bold text-sm">${editingItem.totalAmount} USD</span>
                    </div>
                  </div>
                ) : (
                  /* PRODUCT / CHAPTER / SERIES EDITOR */
                  <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-neutral-800 pb-4">
                      <div>
                        <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#a38f78]">
                          SCHEMA: {activeTab.toUpperCase()}
                        </span>
                        <h3 className="font-serif-editorial text-2xl text-white mt-0.5">
                          {editingItem.name || editingItem.title}
                        </h3>
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-[#a38f78] text-black font-mono text-xs uppercase tracking-widest font-semibold hover:bg-[#f4f4f0] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                      >
                        <Save size={14} /> Commit Changes
                      </button>
                    </div>

                    {saveStatus.text && (
                      <div className={`p-3 font-mono text-xs tracking-wider border flex items-center gap-2 ${
                        saveStatus.type === 'error'
                          ? 'bg-red-950/30 border-red-800 text-red-300'
                          : 'bg-[#1a1714] border-[#a38f78] text-[#a38f78]'
                      }`}>
                        {saveStatus.type === 'error' ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                        <span>{saveStatus.text}</span>
                      </div>
                    )}

                    {/* PRODUCT FORM SPECIFICATIONS */}
                    {activeTab === 'products' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="font-mono text-[9px] tracking-wider uppercase text-neutral-400 block mb-1">
                              Garment Name
                            </label>
                            <input
                              type="text"
                              value={editingItem.name || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                              className="w-full bg-[#141414] border border-neutral-800 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#a38f78]"
                            />
                          </div>

                          <div>
                            <label className="font-mono text-[9px] tracking-wider uppercase text-[#a38f78] block mb-1">
                              Archival SKU (Unique Code)
                            </label>
                            <input
                              required
                              type="text"
                              value={editingItem.sku || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, sku: e.target.value })}
                              className="w-full bg-[#141414] border border-neutral-800 px-3.5 py-2.5 text-xs text-[#a38f78] font-mono outline-none focus:border-[#a38f78]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="font-mono text-[9px] tracking-wider uppercase text-neutral-400 block mb-1">
                              Price (USD)
                            </label>
                            <input
                              type="number"
                              value={editingItem.price || 0}
                              onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                              className="w-full bg-[#141414] border border-neutral-800 px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-[#a38f78]"
                            />
                          </div>
                          <div>
                            <label className="font-mono text-[9px] tracking-wider uppercase text-neutral-400 block mb-1">
                              Fabric Density / Weight
                            </label>
                            <input
                              type="text"
                              value={editingItem.weight || '480 GSM Heavyweight'}
                              onChange={(e) => setEditingItem({ ...editingItem, weight: e.target.value })}
                              className="w-full bg-[#141414] border border-neutral-800 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#a38f78]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-mono text-[9px] tracking-wider uppercase text-neutral-400 block mb-1">
                            Textile Composition
                          </label>
                          <input
                            type="text"
                            value={editingItem.material || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, material: e.target.value })}
                            className="w-full bg-[#141414] border border-neutral-800 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#a38f78]"
                          />
                        </div>

                        <div>
                          <label className="font-mono text-[9px] tracking-wider uppercase text-neutral-400 block mb-1">
                            Architectural Silhouette / Cut
                          </label>
                          <input
                            type="text"
                            value={editingItem.fit || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, fit: e.target.value })}
                            className="w-full bg-[#141414] border border-neutral-800 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#a38f78]"
                          />
                        </div>

                        <div>
                          <label className="font-mono text-[9px] tracking-wider uppercase text-neutral-400 block mb-1">
                            Garment Narrative / Design Ethos
                          </label>
                          <textarea
                            rows={4}
                            value={editingItem.description || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                            className="w-full bg-[#141414] border border-neutral-800 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#a38f78]"
                          />
                        </div>
                      </div>
                    )}

                    {/* CHAPTER FORM SPECIFICATIONS */}
                    {activeTab === 'chapters' && (
                      <div className="space-y-4">
                        <div>
                          <label className="font-mono text-[9px] tracking-wider uppercase text-neutral-400 block mb-1">
                            Chapter Title
                          </label>
                          <input
                            type="text"
                            value={editingItem.title || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                            className="w-full bg-[#141414] border border-neutral-800 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#a38f78]"
                          />
                        </div>

                        <div>
                          <label className="font-mono text-[9px] tracking-wider uppercase text-neutral-400 block mb-1">
                            Thematic Subtitle
                          </label>
                          <input
                            type="text"
                            value={editingItem.subtitle || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                            className="w-full bg-[#141414] border border-neutral-800 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#a38f78]"
                          />
                        </div>

                        <div>
                          <label className="font-mono text-[9px] tracking-wider uppercase text-neutral-400 block mb-1">
                            Archival Essay / Written Narrative
                          </label>
                          <textarea
                            rows={7}
                            value={editingItem.narrative || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, narrative: e.target.value })}
                            className="w-full bg-[#141414] border border-neutral-800 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#a38f78] font-light leading-relaxed"
                          />
                        </div>
                      </div>
                    )}

                    {/* SERIES FORM SPECIFICATIONS */}
                    {activeTab === 'series' && (
                      <div className="space-y-4">
                        <div>
                          <label className="font-mono text-[9px] tracking-wider uppercase text-neutral-400 block mb-1">
                            Series Title
                          </label>
                          <input
                            type="text"
                            value={editingItem.title || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                            className="w-full bg-[#141414] border border-neutral-800 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#a38f78]"
                          />
                        </div>

                        <div>
                          <label className="font-mono text-[9px] tracking-wider uppercase text-neutral-400 block mb-1">
                            Series Manifesto
                          </label>
                          <textarea
                            rows={6}
                            value={editingItem.manifesto || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, manifesto: e.target.value })}
                            className="w-full bg-[#141414] border border-neutral-800 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#a38f78] font-light leading-relaxed"
                          />
                        </div>
                      </div>
                    )}
                  </form>
                )
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <div className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-600">
                    <Layers size={18} />
                  </div>
                  <h4 className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400">
                    NO ACTIVE SELECTION IN BUFFER
                  </h4>
                  <p className="font-mono text-[10px] text-neutral-600 max-w-xs">
                    Choose an archive artifact, chapter narrative, or incoming order from the register column to mutate its values.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 3. HOMEPAGE
// ============================================================================
export function HomePage() {
  const [seriesData, setSeriesData] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    document.title = 'QUIET BATTLES™ | Wear Your Battles — Narrative Luxury Streetwear';

    fetch(`${API_BASE}/series/series-01`)
      .then((res) => res.json())
      .then((data) => setSeriesData(data))
      .catch((err) => console.error('API Error:', err));

    fetch(`${API_BASE}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => console.error('API Error:', err));
  }, []);

  const primarySeries = seriesData?.series || seriesData;
  const chapters = seriesData?.chapters || primarySeries?.chapters || [];

  const seriesHeroImage =
    primarySeries?.heroImage ||
    chapters[0]?.coverImage ||
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1800&q=80";

  return (
    <div className="bg-film-grain">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1800&q=80"
          alt="Quiet Battles Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-40 animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/55 to-black/70" />

        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 text-center pt-16">
          <Reveal delay={100}>
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 border border-[#a38f78]/40 bg-black/50 backdrop-blur-xs mb-6">
              <Sparkles size={12} className="text-[#a38f78]" />
              <span className="text-[9px] sm:text-[10px] tracking-[0.35em] uppercase text-[#a38f78]">
                Archive Drop 01 // Narrative Streetwear
              </span>
            </div>
          </Reveal>

          <Reveal delay={250}>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif-editorial tracking-wide text-[#f4f4f0] leading-[1.08]">
              WEAR YOUR BATTLES.
            </h1>
          </Reveal>

          <Reveal delay={400}>
            <p className="mt-6 sm:mt-7 text-xs sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed font-light px-2">
              Not every war is fought on a battlefield. Some are waged in silence at 3:00 AM. We
              craft architectural, heavyweight garments that honor the resilience you carry within.
            </p>
          </Reveal>

          <Reveal delay={550}>
            <div className="mt-9 sm:mt-11 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 px-2">
              <Link
                to={`/series/${primarySeries?.slug || 'series-01'}`}
                className="w-full sm:w-auto justify-center group px-8 sm:px-9 py-4 bg-[#f4f4f0] text-black text-xs tracking-[0.25em] uppercase font-semibold hover:bg-[#a38f78] hover:text-white transition-all duration-500 flex items-center gap-3 shadow-[0_0_30px_rgba(244,244,240,0.15)]"
              >
                Enter The Archive
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1.5 transition-transform duration-300"
                />
              </Link>
              <Link
                to={`/chapter/${chapters[0]?.slug || 'chapter-1-the-weight-of-silence'}`}
                className="w-full sm:w-auto text-center px-8 sm:px-9 py-4 border border-neutral-700 bg-black/40 backdrop-blur-xs text-neutral-200 text-xs tracking-[0.25em] uppercase hover:border-[#a38f78] hover:text-[#a38f78] transition-all duration-300"
              >
                Read Chapter I Story
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-neutral-500 animate-float">
          <span className="text-[9px] tracking-[0.35em] uppercase">Scroll to Explore</span>
          <ChevronDown size={16} className="text-[#a38f78]" />
        </div>
      </section>

      <EditorialMarquee />

      <section className="py-20 sm:py-28 px-5 sm:px-6 max-w-6xl mx-auto border-b border-neutral-900">
        <div className="grid md:grid-cols-12 gap-10 md:gap-12 items-center">
          <Reveal className="md:col-span-5">
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#a38f78]">
              01 // The Brand Philosophy
            </span>
            <h2 className="text-3xl md:text-4xl font-serif-editorial mt-3 text-white leading-snug">
              Clothing as Psychological Architecture.
            </h2>
            <div className="w-16 h-[1px] bg-[#a38f78] mt-6" />
          </Reveal>

          <Reveal delay={200} className="md:col-span-7 space-y-5 text-sm text-neutral-300 leading-relaxed font-light">
            <p className="text-sm sm:text-base text-neutral-200">
              QUIET BATTLES™ rejects seasonal fast fashion. Instead, our archive is organized into
              <span className="text-[#a38f78] font-medium"> Series</span> and
              <span className="text-[#a38f78] font-medium"> Chapters</span>. Every garment begins as
              a written meditation on human endurance—translated into 500 GSM organic cotton,
              exposed reverse seamlines, and protective silhouettes.
            </p>
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-neutral-800/80">
              <div>
                <span className="text-lg sm:text-xl font-serif-editorial text-[#a38f78]">01</span>
                <p className="text-[10px] tracking-widest uppercase text-white mt-1">Narrative First</p>
              </div>
              <div>
                <span className="text-lg sm:text-xl font-serif-editorial text-[#a38f78]">500 GSM</span>
                <p className="text-[10px] tracking-widest uppercase text-white mt-1">Heavy Armor</p>
              </div>
              <div>
                <span className="text-lg sm:text-xl font-serif-editorial text-[#a38f78]">5 Chapters</span>
                <p className="text-[10px] tracking-widest uppercase text-white mt-1">Per Series</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {primarySeries && (
        <section className="py-20 sm:py-28 px-5 sm:px-6 max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-14">
              <div>
                <span className="text-xs tracking-[0.35em] uppercase text-[#a38f78]">
                  SERIES 0{primarySeries.seriesNumber || 1} // ARCHIVE COLLECTION
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif-editorial mt-2 text-white">
                  {primarySeries.title}
                </h2>
              </div>
              <Link
                to={`/series/${primarySeries.slug || 'series-01'}`}
                className="group mt-4 md:mt-0 text-xs tracking-[0.25em] uppercase text-[#a38f78] flex items-center gap-2"
              >
                Explore Full Series Archive <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="group grid md:grid-cols-12 gap-8 md:gap-10 bg-[#101010] border border-neutral-800 hover:border-[#a38f78]/60 transition-all duration-700 p-5 sm:p-8 md:p-12 items-center shadow-2xl">
              <div className="md:col-span-6 overflow-hidden border border-neutral-800 relative h-[260px] sm:h-[360px] md:h-[440px]">
                <img
                  src={seriesHeroImage}
                  alt={primarySeries.title}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
              </div>

              <div className="md:col-span-6 space-y-5 sm:space-y-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 text-[10px] tracking-[0.25em] uppercase bg-neutral-900 border border-neutral-700 text-[#a38f78]">
                  <Shield size={12} /> {chapters.length || 5} Chapters // Connected Garments
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-serif-editorial text-white leading-snug">
                  “The Architecture of Resilience”
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
                  {primarySeries.manifesto || primarySeries.description}
                </p>
                <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link
                    to={`/series/${primarySeries.slug || 'series-01'}`}
                    className="text-center px-7 sm:px-8 py-4 bg-[#f4f4f0] text-black text-xs tracking-[0.22em] uppercase font-semibold hover:bg-[#a38f78] hover:text-white transition-all duration-300"
                  >
                    Open Series 01 Vault
                  </Link>
                  {products[0] && (
                    <Link
                      to={`/product/${products[0]._id || products[0].slug}`}
                      className="text-center px-7 sm:px-8 py-4 border border-neutral-700 text-neutral-200 text-xs tracking-[0.22em] uppercase hover:border-[#a38f78] hover:text-[#a38f78] transition-all duration-300"
                    >
                      Inspect Flagship Garment
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          {chapters.length > 0 && (
            <div className="mt-16 sm:mt-20">
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
                {chapters.map((ch, idx) => {
                  const roman = ROMAN_NUMERALS[ch.chapterNumber] || ROMAN_NUMERALS[idx + 1] || `${idx + 1}`;
                  const img = ch.coverImage || ch.heroImage || (ch.linkedProduct?.images && ch.linkedProduct.images[0]);
                  return (
                    <Reveal key={ch._id || idx} delay={idx * 100}>
                      <Link
                        to={`/chapter/${ch.slug}`}
                        className="group relative h-72 sm:h-80 bg-[#111111] border border-neutral-800 hover:border-[#a38f78] transition-all duration-500 flex flex-col justify-end overflow-hidden p-5 hover:-translate-y-2 shadow-lg"
                      >
                        <img
                          src={img}
                          alt={ch.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover opacity-35 grayscale-[60%] group-hover:grayscale-0 group-hover:opacity-65 group-hover:scale-110 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                        <div className="relative z-10">
                          <span className="text-[10px] tracking-[0.3em] uppercase text-[#a38f78] block">Chapter {roman}</span>
                          <h4 className="text-lg font-serif-editorial text-white mt-1 group-hover:text-[#a38f78] transition-colors">{ch.title}</h4>
                          <p className="text-[11px] text-neutral-400 mt-1.5 line-clamp-2">{ch.subtitle || ch.narrative}</p>
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

// ============================================================================
// 4. SERIES ARCHIVE PAGE
// ============================================================================
export function SeriesArchivePage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch(`${API_BASE}/series/${slug || 'series-01'}`)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-36 text-center text-xs tracking-widest uppercase text-neutral-500">Unlocking Archive Series...</div>;

  const series = data?.series || data;
  const chapters = data?.chapters || series?.chapters || [];

  if (!series || !series.title) return <div className="pt-36 text-center text-neutral-400">Series not found.</div>;

  return (
    <div className="pt-20 bg-film-grain">
      <section className="relative py-20 sm:py-28 px-5 sm:px-6 border-b border-neutral-800 text-center">
        <span className="text-xs tracking-[0.38em] uppercase text-[#a38f78]">THE ARCHIVE // SERIES 0{series.seriesNumber || 1}</span>
        <h1 className="text-3xl sm:text-5xl font-serif-editorial text-white mt-4">{series.title}</h1>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mx-auto mt-6 leading-relaxed font-light">{series.manifesto}</p>
      </section>

      <section className="py-16 px-5 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {chapters.map((ch, idx) => {
            const roman = ROMAN_NUMERALS[ch.chapterNumber] || `${idx + 1}`;
            const img = ch.coverImage || ch.heroImage || (ch.linkedProduct?.images && ch.linkedProduct.images[0]);
            return (
              <Link key={ch._id || idx} to={`/chapter/${ch.slug}`} className="group bg-[#111111] border border-neutral-800 hover:border-[#a38f78] transition-all p-4">
                <img src={img} alt={ch.title} className="w-full h-64 object-cover" />
                <span className="text-[10px] tracking-widest uppercase text-[#a38f78] block mt-4">Chapter {roman}</span>
                <h3 className="text-xl font-serif-editorial text-white mt-1">{ch.title}</h3>
                <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{ch.subtitle || ch.narrative}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// 5. CHAPTER DETAIL PAGE
// ============================================================================
export function ChapterDetailPage() {
  const { slug } = useParams();
  const [chapter, setChapter] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    fetch(`${API_BASE}/chapters/${slug}`)
      .then((res) => res.json())
      .then((data) => setChapter(data))
      .catch((err) => console.error(err));
  }, [slug]);

  if (!chapter) return <div className="pt-36 text-center text-xs tracking-widest uppercase text-neutral-500">Loading Chapter Narrative...</div>;

  const roman = ROMAN_NUMERALS[chapter.chapterNumber] || 'I';
  const heroImage = chapter.coverImage || chapter.heroImage;
  const product = chapter.linkedProduct;
  const paragraphs = chapter.narrative ? chapter.narrative.split('\n\n') : [chapter.subtitle];

  return (
    <div className="pt-20 bg-film-grain">
      <section className="relative h-[65vh] flex items-end overflow-hidden border-b border-neutral-800">
        <img src={heroImage} alt={chapter.title} className="absolute inset-0 w-full h-full object-cover opacity-45 animate-ken-burns" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-12 w-full">
          <Link to="/series/series-01" className="text-xs tracking-widest uppercase text-[#a38f78] hover:text-white flex items-center gap-2">
            <ArrowLeft size={13} /> Back to Series 01
          </Link>
          <p className="text-xs tracking-[0.35em] uppercase text-neutral-400 mt-4">CHAPTER {roman} // NARRATIVE ARCHIVE</p>
          <h1 className="text-3xl sm:text-5xl font-serif-editorial text-white mt-2">{chapter.title}</h1>
          <p className="text-xs sm:text-base text-neutral-300 mt-3">{chapter.subtitle}</p>
        </div>
      </section>

      <section className="py-16 px-6 max-w-3xl mx-auto space-y-6 text-sm text-neutral-300 font-light leading-relaxed">
        {paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </section>

      {product && (
        <section className="py-16 px-6 max-w-5xl mx-auto">
          <div className="bg-[#111111] border border-neutral-800 p-8 grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 h-72 overflow-hidden border border-neutral-800">
              <img src={product.images?.[0] || heroImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="md:col-span-7 space-y-4">
              <span className="text-[11px] tracking-widest uppercase text-[#a38f78]">Connected Chapter {roman} Artifact</span>
              <h3 className="text-2xl font-serif-editorial text-white">{product.name}</h3>
              <p className="text-xs uppercase text-neutral-400">${product.price} USD // {product.edition}</p>
              <p className="text-xs text-neutral-400">{product.description}</p>
              <Link
                to={`/product/${product._id || product.slug}`}
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#f4f4f0] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#a38f78] hover:text-white transition-all cursor-pointer"
              >
                Inspect & Acquire Artifact <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ============================================================================
// 6. PRODUCT DETAIL PAGE
// ============================================================================
export function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('L');
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${API_BASE}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setProduct(data);
          if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <div className="pt-36 text-center text-xs tracking-widest uppercase text-neutral-500 animate-pulse">Loading Garment Specifications...</div>;

  const images = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1000'];

  return (
    <div className="pt-28 pb-24 px-6 max-w-7xl mx-auto bg-film-grain">
      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-7 space-y-4">
          <div className="bg-[#111111] border border-neutral-800 h-[450px] overflow-hidden">
            <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-24 border cursor-pointer ${activeImage === idx ? 'border-[#a38f78]' : 'border-neutral-800 opacity-60'}`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-5 space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#a38f78]">ARCHIVE ARTIFACT // {product.sku || 'QB-S01'}</span>
          <h1 className="text-3xl font-serif-editorial text-white">{product.name}</h1>
          <p className="text-2xl text-neutral-200 font-light">${product.price} USD</p>
          <p className="text-xs text-neutral-300 leading-relaxed font-light">{product.description}</p>

          <div className="pt-4 border-t border-neutral-800">
            <div className="flex justify-between text-xs tracking-widest uppercase mb-3">
              <span className="text-neutral-400">Select Size</span>
              <button onClick={() => setSizeGuideOpen(true)} className="text-[#a38f78] flex items-center gap-1 cursor-pointer">
                <Ruler size={13} /> Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-xs tracking-widest uppercase border cursor-pointer ${
                    selectedSize === size ? 'bg-[#f4f4f0] text-black border-[#f4f4f0] font-bold' : 'border-neutral-800 text-neutral-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              addToCart(product, selectedSize);
              setAdded(true);
              setTimeout(() => setAdded(false), 2000);
            }}
            className="w-full py-4 bg-[#a38f78] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#f4f4f0] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {added ? <Check size={16} /> : `Add to Archive Bag — $${product.price} USD`}
          </button>

          <div className="pt-6 border-t border-neutral-800 text-xs space-y-2 text-neutral-400">
            <p><span className="text-white">Material:</span> {product.material}</p>
            <p><span className="text-white">Fit:</span> {product.fit}</p>
            <p><span className="text-white">Weight:</span> {product.weight}</p>
            <p><span className="text-white">Origin:</span> {product.origin}</p>
          </div>
        </div>
      </div>

      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#111111] border border-neutral-800 max-w-md w-full p-6 relative">
            <button onClick={() => setSizeGuideOpen(false)} className="absolute top-4 right-4 text-neutral-400 cursor-pointer"><X size={18} /></button>
            <h4 className="text-sm font-serif-editorial text-white uppercase tracking-widest mb-4">Measurement Matrix</h4>
            <p className="text-xs text-neutral-400">Oversized dropped-shoulder cut. Choose your standard size.</p>
          </div>
        </div>
      )}
    </div>
  );
}