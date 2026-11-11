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
  AlertTriangle,
  Truck,
  Award,
  Flame
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const API_BASE = import.meta.env.VITE_API_URL || "https://quiet-battles-api.onrender.com/api";
const ROMAN_NUMERALS = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

// ============================================================================
// CURATED STREETWEAR IMAGERY MATCHED TO EXACT GARMENTS & STORIES
// ============================================================================
const MATCHED_STREETWEAR_ASSETS = {
  heroMain: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1800&q=85", // Heavyweight dark hoodie aesthetic
  seriesBanner: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85", // Dark editorial streetwear lookbook
  chapters: {
    1: {
      cover: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85", // Heavyweight Black Hoodie
      productImg: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85",
      altImg: "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1000&q=85",
      categoryTag: "500 GSM Heavyweight Hoodie",
      fitSpec: "Boxy Drop-Shoulder Hoodie"
    },
    2: {
      cover: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85", // Dark Oversized Streetwear Tee
      productImg: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85",
      altImg: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85",
      categoryTag: "320 GSM Oversized Boxy Tee",
      fitSpec: "Heavyweight Boxy T-Shirt"
    },
    3: {
      cover: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85", // Heavyweight Crewneck Sweatshirt
      productImg: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=85",
      altImg: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85",
      categoryTag: "480 GSM Structured Crewneck",
      fitSpec: "Ribbed Collar Sweatshirt"
    },
    4: {
      cover: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1200&q=85", // Tactical Cargo Pants
      productImg: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=85",
      altImg: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=85",
      categoryTag: "Ripstop Tactical Cargo Pant",
      fitSpec: "Multi-Pocket Utility Trousers"
    },
    5: {
      cover: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=85", // Structured Outerwear Jacket
      productImg: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=85",
      altImg: "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=1000&q=85",
      categoryTag: "Weatherproof Technical Overcoat",
      fitSpec: "Structured Storm Jacket"
    }
  }
};

// Helper to match product or chapter to curated streetwear imagery so photos always match the text
function getMatchedProductVisuals(product, index = 0) {
  const name = (product?.name || product?.title || '').toLowerCase();
  let slot = (index % 5) + 1;

  if (name.includes('hoodie') || name.includes('silence') || name.includes('stoic')) slot = 1;
  else if (name.includes('tee') || name.includes('t-shirt') || name.includes('solitude') || name.includes('shirt')) slot = 2;
  else if (name.includes('crew') || name.includes('monastic') || name.includes('sweater') || name.includes('fleece')) slot = 3;
  else if (name.includes('cargo') || name.includes('pant') || name.includes('trouser') || name.includes('struggle')) slot = 4;
  else if (name.includes('jacket') || name.includes('coat') || name.includes('parka') || name.includes('ascension') || name.includes('shell')) slot = 5;

  const matched = MATCHED_STREETWEAR_ASSETS.chapters[slot];
  return {
    primaryImage: matched.productImg,
    secondaryImage: matched.altImg,
    categoryTag: matched.categoryTag,
    fitSpec: matched.fitSpec
  };
}

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
    '500 GSM ORGANIC FRENCH TERRY HOODIES',
    'OVERSIZED BOXY DROP-SHOULDER TEES',
    'LIMITED BATCH STREETWEAR — CRAFTED FOR ENDURANCE',
    'FREE EXPRESS WORLDWIDE SHIPPING OVER $200',
    'EVERY GARMENT INCLUDES AN ARCHIVAL STORY CHAPTER',
  ];

  return (
    <div className="w-full overflow-hidden bg-[#111111] border-y border-neutral-800 py-4 select-none">
      <div className="animate-marquee flex items-center">
        {[...items, ...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center shrink-0">
            <span className="text-xs sm:text-sm font-medium tracking-[0.22em] uppercase text-neutral-200 px-6 sm:px-8">
              {text}
            </span>
            <span className="text-[#a38f78] text-sm">✦</span>
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
        alert(data.error || 'Failed to place order.');
      }
    } catch {
      alert('Network error connecting to checkout server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#0f0f0f] border-l border-neutral-800 h-full flex flex-col justify-between p-6 sm:p-8 shadow-2xl overflow-y-auto">
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
            <span className="text-sm font-semibold tracking-[0.2em] uppercase text-[#a38f78] flex items-center gap-2.5">
              <ShoppingBag size={16} /> Shopping Bag ({cart.length})
            </span>
            <button
              onClick={() => {
                setIsBagOpen(false);
                setIsCheckingOut(false);
                setOrderConfirmed(null);
              }}
              className="text-neutral-400 hover:text-white cursor-pointer p-1"
            >
              <X size={20} />
            </button>
          </div>

          {orderConfirmed ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 rounded-full border-2 border-[#a38f78] text-[#a38f78] flex items-center justify-center mx-auto">
                <Check size={24} />
              </div>
              <h3 className="text-2xl font-serif-editorial text-white">Order Confirmed</h3>
              <p className="text-sm text-[#a38f78] font-mono">Order ID: {orderConfirmed}</p>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Thank you for your order. Your heavyweight garments are being prepared for dispatch and a confirmation receipt has been sent to your email.
              </p>
              <button
                onClick={() => {
                  setOrderConfirmed(null);
                  setIsCheckingOut(false);
                  setIsBagOpen(false);
                }}
                className="mt-6 px-7 py-3.5 bg-[#f4f4f0] text-black text-xs uppercase tracking-widest font-bold hover:bg-[#a38f78] hover:text-white transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : isCheckingOut ? (
            <form onSubmit={handleSubmitOrder} className="py-6 space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">Shipping Details</h4>
              <input
                required
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#161616] border border-neutral-700 px-4 py-3.5 text-sm text-white focus:border-[#a38f78] outline-none"
              />
              <input
                required
                type="email"
                placeholder="Email Address (for order tracking)"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#161616] border border-neutral-700 px-4 py-3.5 text-sm text-white focus:border-[#a38f78] outline-none"
              />
              <input
                required
                type="text"
                placeholder="Street Address & Apartment"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-[#161616] border border-neutral-700 px-4 py-3.5 text-sm text-white focus:border-[#a38f78] outline-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="bg-[#161616] border border-neutral-700 px-4 py-3.5 text-sm text-white focus:border-[#a38f78] outline-none"
                />
                <input
                  required
                  type="text"
                  placeholder="Postal / ZIP Code"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="bg-[#161616] border border-neutral-700 px-4 py-3.5 text-sm text-white focus:border-[#a38f78] outline-none"
                />
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-between text-sm font-medium text-neutral-200">
                <span>Total (Free Express Shipping)</span>
                <span className="text-white font-bold text-base">${totalAmount} USD</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#a38f78] text-black text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#f4f4f0] transition-colors cursor-pointer"
              >
                {submitting ? 'Processing Order...' : `Complete Purchase — $${totalAmount} USD`}
              </button>
              <button
                type="button"
                onClick={() => setIsCheckingOut(false)}
                className="w-full text-center text-xs uppercase tracking-widest text-neutral-400 hover:text-white pt-2 cursor-pointer"
              >
                ← Back to Bag
              </button>
            </form>
          ) : (
            <div className="divide-y divide-neutral-800 my-4 max-h-[55vh] overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <ShoppingBag size={32} className="mx-auto text-neutral-600" />
                  <p className="text-sm tracking-widest uppercase text-neutral-400">Your Shopping Bag is Empty</p>
                  <p className="text-xs text-neutral-500">Explore Series 01 heavyweight hoodies, tees, and outerwear.</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={`${item.productId}-${item.size}-${idx}`} className="py-4 flex gap-4 items-center">
                    <img src={item.image} alt={item.name} className="w-18 h-22 object-cover bg-neutral-900 border border-neutral-800 shrink-0" />
                    <div className="flex-1">
                      <h5 className="text-sm font-semibold text-white line-clamp-1">{item.name}</h5>
                      <p className="text-xs text-[#a38f78] font-medium mt-1">Size: {item.size} • ${item.price} USD</p>
                      <div className="flex items-center gap-3 mt-2.5 text-sm text-neutral-200">
                        <button onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)} className="px-2.5 py-0.5 bg-neutral-900 border border-neutral-700 hover:border-white cursor-pointer">-</button>
                        <span className="font-mono text-xs">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)} className="px-2.5 py-0.5 bg-neutral-900 border border-neutral-700 hover:border-white cursor-pointer">+</button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.productId, item.size)} className="text-neutral-400 hover:text-red-400 p-2 cursor-pointer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {!orderConfirmed && !isCheckingOut && cart.length > 0 && (
          <div className="pt-6 border-t border-neutral-800 space-y-4">
            <div className="flex justify-between text-sm uppercase tracking-wider">
              <span className="text-neutral-300">Subtotal</span>
              <span className="text-white font-bold text-base">${totalAmount} USD</span>
            </div>
            <p className="text-xs text-neutral-400">Taxes & worldwide express shipping included.</p>
            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full py-4 bg-[#f4f4f0] text-black text-xs uppercase tracking-[0.22em] font-bold hover:bg-[#a38f78] hover:text-white transition-all cursor-pointer"
            >
              Proceed to Checkout (${totalAmount} USD)
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
    setSaveStatus({ text: 'VERIFYING CLEARANCE...', type: 'info' });

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
        setSaveStatus({ text: data.error || 'INVALID CREDENTIALS', type: 'error' });
      }
    } catch {
      setSaveStatus({ text: 'SERVER CONNECTION FAILED', type: 'error' });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveStatus({ text: 'SAVING TO MONGODB ATLAS...', type: 'info' });

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
        setSaveStatus({ text: 'SAVED SUCCESSFULLY TO LIVE DATABASE', type: 'success' });
        setTimeout(() => setSaveStatus({ text: '', type: '' }), 3000);
        refreshAllData();
      } else {
        setSaveStatus({ text: `ERROR: ${data.error || 'UPDATE FAILED'}`, type: 'error' });
      }
    } catch (err) {
      setSaveStatus({ text: `NETWORK ERROR: ${err.message}`, type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[88vh] bg-[#0c0c0c] border border-neutral-800 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden">
        
        <div className="px-6 py-4 bg-[#080808] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-[#a38f78] animate-pulse" />
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#a38f78] font-bold">
              QUIET BATTLES™ // STORE & INVENTORY CMS
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline font-mono text-[10px] tracking-[0.2em] uppercase text-neutral-400 border border-neutral-800 px-3 py-1">
              {loggedIn ? 'ADMIN UNLOCKED' : 'LOCKED'}
            </span>
            <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors cursor-pointer p-1">
              <X size={20} />
            </button>
          </div>
        </div>

        {!loggedIn ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md p-8 sm:p-10 bg-[#121212] border border-neutral-800 shadow-2xl space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full border border-[#a38f78]/60 mx-auto flex items-center justify-center text-[#a38f78] mb-3">
                  <Lock size={20} />
                </div>
                <h3 className="font-serif-editorial text-2xl text-white tracking-wider">CMS ADMIN PORTAL</h3>
                <p className="text-xs text-neutral-400">
                  Sign in to manage garment pricing, inventory, chapters, and customer orders.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-300">Admin Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#181818] border border-neutral-700 px-4 py-3 text-sm text-white focus:border-[#a38f78] outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-300">Admin Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#181818] border border-neutral-700 px-4 py-3 text-sm text-white focus:border-[#a38f78] outline-none pr-10"
                      placeholder="Enter password (quietbattles2026)"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {saveStatus.text && (
                  <p className={`text-xs font-mono text-center ${saveStatus.type === 'error' ? 'text-red-400' : 'text-[#a38f78]'}`}>
                    {saveStatus.text}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-[#f4f4f0] text-black text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#a38f78] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  <Unlock size={15} /> Unlock CMS Dashboard
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            <div className="w-full md:w-80 bg-[#090909] border-r border-neutral-800 flex flex-col shrink-0">
              <div className="grid grid-cols-4 border-b border-neutral-800 p-2 gap-1 bg-[#0d0d0d]">
                {[
                  { id: 'products', label: 'Garments', icon: Package },
                  { id: 'chapters', label: 'Stories', icon: BookOpen },
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
                      className={`py-2.5 px-1 text-[11px] font-medium tracking-wider uppercase flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                        active ? 'border-[#a38f78] bg-[#1a1816] text-[#a38f78]' : 'border-transparent text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Icon size={14} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {loading ? (
                  <div className="p-8 text-center text-xs text-neutral-500 animate-pulse">Loading database...</div>
                ) : activeTab === 'orders' ? (
                  orders.length === 0 ? (
                    <div className="p-8 text-center text-xs text-neutral-500">No customer orders yet.</div>
                  ) : (
                    orders.map((ord) => (
                      <div
                        key={ord._id}
                        onClick={() => setEditingItem(ord)}
                        className={`p-3.5 border transition-all cursor-pointer ${
                          editingItem?._id === ord._id ? 'border-[#a38f78] bg-[#161616] text-white' : 'border-neutral-900 bg-[#0d0d0d] text-neutral-300'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[#a38f78] font-mono font-bold">{ord.orderNumber}</span>
                          <span className="text-white font-semibold">${ord.totalAmount} USD</span>
                        </div>
                        <p className="text-xs text-neutral-300 mt-1">{ord.customer?.name}</p>
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
                          isSelected ? 'border-[#a38f78] bg-[#181614] text-white' : 'border-neutral-900 bg-[#0d0d0d] text-neutral-300 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <h5 className="text-sm font-medium truncate max-w-[170px] text-white">
                            {item.name || item.title}
                          </h5>
                          {item.price && <span className="text-xs text-[#a38f78] font-semibold">${item.price}</span>}
                        </div>
                        <p className="font-mono text-[10px] text-neutral-500 truncate mt-1">{item.slug || item._id}</p>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-3 border-t border-neutral-800 bg-[#080808] flex justify-between items-center">
                <button onClick={refreshAllData} className="text-xs text-neutral-400 hover:text-[#a38f78] flex items-center gap-1.5 cursor-pointer">
                  <RotateCcw size={12} /> Refresh Data
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('qb_admin_token');
                    setLoggedIn(false);
                  }}
                  className="text-xs text-neutral-500 hover:text-red-400 cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#0e0e0e]">
              {editingItem ? (
                activeTab === 'orders' ? (
                  <div className="space-y-6 max-w-2xl">
                    <div className="border-b border-neutral-800 pb-4">
                      <span className="font-mono text-xs uppercase text-[#a38f78]">CUSTOMER ORDER // {editingItem.orderNumber}</span>
                      <h3 className="text-2xl font-serif-editorial text-white mt-1">{editingItem.customer?.name}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm bg-[#141414] p-5 border border-neutral-800">
                      <div>
                        <span className="text-neutral-500 block text-xs">City & Postal Code</span>
                        <span className="text-white mt-1 block">{editingItem.customer?.city}, {editingItem.customer?.postalCode}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-xs">Customer Email</span>
                        <span className="text-white mt-1 block">{editingItem.customer?.email}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-neutral-500 block text-xs">Shipping Address</span>
                        <span className="text-white mt-1 block">{editingItem.customer?.address}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs uppercase tracking-wider text-neutral-400">Ordered Items</h4>
                      <div className="divide-y divide-neutral-800 border border-neutral-800 bg-[#141414]">
                        {editingItem.items?.map((it, idx) => (
                          <div key={idx} className="p-4 flex justify-between items-center text-sm">
                            <div>
                              <p className="font-semibold text-white">{it.name}</p>
                              <p className="text-xs text-[#a38f78]">Size: {it.size} × {it.quantity}</p>
                            </div>
                            <span className="font-bold text-white">${it.price * it.quantity} USD</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-neutral-800 pb-4">
                      <div>
                        <span className="font-mono text-xs uppercase text-[#a38f78]">EDITING {activeTab.toUpperCase()}</span>
                        <h3 className="text-2xl font-serif-editorial text-white mt-0.5">{editingItem.name || editingItem.title}</h3>
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-[#a38f78] text-black text-xs uppercase tracking-widest font-bold hover:bg-[#f4f4f0] transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Save size={15} /> Save Changes
                      </button>
                    </div>

                    {saveStatus.text && (
                      <div className={`p-3.5 text-xs font-medium border flex items-center gap-2 ${
                        saveStatus.type === 'error' ? 'bg-red-950/40 border-red-800 text-red-300' : 'bg-[#1a1714] border-[#a38f78] text-[#a38f78]'
                      }`}>
                        {saveStatus.type === 'error' ? <AlertTriangle size={15} /> : <CheckCircle2 size={15} />}
                        <span>{saveStatus.text}</span>
                      </div>
                    )}

                    {activeTab === 'products' && (
                      <div className="space-y-4 text-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-neutral-300 block mb-1.5">Product Name</label>
                            <input
                              type="text"
                              value={editingItem.name || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                              className="w-full bg-[#161616] border border-neutral-700 px-3.5 py-2.5 text-sm text-white focus:border-[#a38f78] outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-[#a38f78] block mb-1.5">SKU Code</label>
                            <input
                              required
                              type="text"
                              value={editingItem.sku || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, sku: e.target.value })}
                              className="w-full bg-[#161616] border border-neutral-700 px-3.5 py-2.5 text-sm text-[#a38f78] font-mono focus:border-[#a38f78] outline-none"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-neutral-300 block mb-1.5">Price (USD)</label>
                            <input
                              type="number"
                              value={editingItem.price || 0}
                              onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                              className="w-full bg-[#161616] border border-neutral-700 px-3.5 py-2.5 text-sm text-white focus:border-[#a38f78] outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-neutral-300 block mb-1.5">Fabric Weight</label>
                            <input
                              type="text"
                              value={editingItem.weight || '500 GSM Heavyweight Cotton'}
                              onChange={(e) => setEditingItem({ ...editingItem, weight: e.target.value })}
                              className="w-full bg-[#161616] border border-neutral-700 px-3.5 py-2.5 text-sm text-white focus:border-[#a38f78] outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-neutral-300 block mb-1.5">Material & Fabric</label>
                          <input
                            type="text"
                            value={editingItem.material || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, material: e.target.value })}
                            className="w-full bg-[#161616] border border-neutral-700 px-3.5 py-2.5 text-sm text-white focus:border-[#a38f78] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-neutral-300 block mb-1.5">Product Description</label>
                          <textarea
                            rows={4}
                            value={editingItem.description || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                            className="w-full bg-[#161616] border border-neutral-700 px-3.5 py-2.5 text-sm text-white focus:border-[#a38f78] outline-none leading-relaxed"
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === 'chapters' && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-neutral-300 block mb-1.5">Chapter Title</label>
                          <input
                            type="text"
                            value={editingItem.title || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                            className="w-full bg-[#161616] border border-neutral-700 px-3.5 py-2.5 text-sm text-white focus:border-[#a38f78] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-neutral-300 block mb-1.5">Subtitle</label>
                          <input
                            type="text"
                            value={editingItem.subtitle || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                            className="w-full bg-[#161616] border border-neutral-700 px-3.5 py-2.5 text-sm text-white focus:border-[#a38f78] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-neutral-300 block mb-1.5">Story Narrative</label>
                          <textarea
                            rows={7}
                            value={editingItem.narrative || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, narrative: e.target.value })}
                            className="w-full bg-[#161616] border border-neutral-700 px-3.5 py-2.5 text-sm text-white focus:border-[#a38f78] outline-none leading-relaxed"
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === 'series' && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-neutral-300 block mb-1.5">Collection Title</label>
                          <input
                            type="text"
                            value={editingItem.title || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                            className="w-full bg-[#161616] border border-neutral-700 px-3.5 py-2.5 text-sm text-white focus:border-[#a38f78] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-neutral-300 block mb-1.5">Collection Manifesto</label>
                          <textarea
                            rows={6}
                            value={editingItem.manifesto || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, manifesto: e.target.value })}
                            className="w-full bg-[#161616] border border-neutral-700 px-3.5 py-2.5 text-sm text-white focus:border-[#a38f78] outline-none leading-relaxed"
                          />
                        </div>
                      </div>
                    )}
                  </form>
                )
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <Package size={28} className="text-neutral-600" />
                  <h4 className="text-sm font-semibold uppercase tracking-widest text-neutral-300">Select an Item to Edit</h4>
                  <p className="text-xs text-neutral-500 max-w-xs">
                    Click any garment, chapter story, or customer order on the left to update live store data.
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
// 3. HOMEPAGE — CUSTOMER-FIRST E-COMMERCE + NARRATIVE ARCHIVE
// ============================================================================
export function HomePage() {
  const [seriesData, setSeriesData] = useState(null);
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const [quickSizes, setQuickSizes] = useState({});
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    document.title = 'QUIET BATTLES™ | Heavyweight Luxury Streetwear & Story-Driven Apparel';

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

  const scrollToShop = () => {
    const el = document.getElementById('direct-shop-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#0a0a0a]">
      {/* 1. CUSTOMER-CLEAR HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-neutral-800">
        <img
          src={MATCHED_STREETWEAR_ASSETS.heroMain}
          alt="Quiet Battles Heavyweight Streetwear Hoodie"
          className="absolute inset-0 w-full h-full object-cover opacity-45 animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/65 to-black/75" />

        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 text-center pt-20 pb-12">
          <Reveal delay={100}>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 border border-[#a38f78]/60 bg-black/70 backdrop-blur-md mb-6">
              <Sparkles size={14} className="text-[#a38f78]" />
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#a38f78]">
                Luxury Heavyweight Streetwear • Series 01 Drop
              </span>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif-editorial tracking-wide text-white leading-[1.1]">
              WEAR YOUR BATTLES.
            </h1>
            <p className="mt-3 text-sm sm:text-lg font-medium tracking-[0.18em] uppercase text-[#a38f78]">
              500 GSM Heavyweight Hoodies, Boxy Tees & Tactical Outerwear
            </p>
          </Reveal>

          <Reveal delay={350}>
            <p className="mt-6 text-base sm:text-lg text-neutral-200 max-w-2xl mx-auto leading-relaxed font-normal px-2">
              Premium small-batch streetwear built like armor. Every garment is crafted from ultra-dense 500 GSM organic cotton and paired with a written story chapter honoring quiet human resilience.
            </p>
          </Reveal>

          {/* Clear Customer Trust Badges */}
          <Reveal delay={450}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-neutral-300">
              <span className="flex items-center gap-2"><Award size={16} className="text-[#a38f78]" /> 500 GSM Organic Cotton</span>
              <span className="flex items-center gap-2"><Flame size={16} className="text-[#a38f78]" /> Boxy Drop-Shoulder Fit</span>
              <span className="flex items-center gap-2"><Truck size={16} className="text-[#a38f78]" /> Free Worldwide Express Shipping</span>
            </div>
          </Reveal>

          <Reveal delay={550}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 px-2">
              <button
                onClick={scrollToShop}
                className="w-full sm:w-auto justify-center group px-9 py-4 bg-[#f4f4f0] text-black text-xs sm:text-sm tracking-[0.2em] uppercase font-bold hover:bg-[#a38f78] hover:text-white transition-all duration-300 flex items-center gap-3 cursor-pointer shadow-xl"
              >
                Shop Series 01 Apparel
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
              </button>
              <Link
                to={`/series/${primarySeries?.slug || 'series-01'}`}
                className="w-full sm:w-auto text-center px-9 py-4 border border-neutral-600 bg-black/60 text-white text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold hover:border-[#a38f78] hover:text-[#a38f78] transition-all"
              >
                Explore Story Chapters (I–V)
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <EditorialMarquee />

      {/* 2. DIRECT SHOPPING GRID — CUSTOMERS CAN IMMEDIATELY SEE & BUY GARMENTS */}
      <section id="direct-shop-grid" className="py-20 sm:py-24 px-5 sm:px-6 max-w-7xl mx-auto border-b border-neutral-900">
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#a38f78]">
                READY TO SHIP // SERIES 01 GARMENT COLLECTION
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif-editorial mt-2 text-white">
                Shop Heavyweight Apparel
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 mt-2 max-w-2xl">
                Every piece is pigment-dyed, pre-shrunk, and engineered with an oversized architectural silhouette. Select your size below for immediate dispatch or click any garment for full specs.
              </p>
            </div>
            <Link
              to="/series/series-01"
              className="mt-4 md:mt-0 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#a38f78] hover:text-white flex items-center gap-2"
            >
              View Full Lookbook & Stories <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => {
            const visuals = getMatchedProductVisuals(product, idx);
            const selectedSize = quickSizes[product._id] || 'L';
            const isJustAdded = addedId === product._id;

            return (
              <Reveal key={product._id || idx} delay={idx * 100}>
                <div className="group bg-[#121212] border border-neutral-800 hover:border-[#a38f78] transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-xl">
                  <div>
                    {/* Product Image with Category Badge */}
                    <Link to={`/product/${product._id || product.slug}`} className="block relative h-80 sm:h-96 overflow-hidden bg-[#181818]">
                      <img
                        src={visuals.primaryImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 bg-black/85 border border-neutral-700 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#a38f78]">
                        {visuals.categoryTag}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/85 px-3 py-1 text-sm font-bold text-white border border-neutral-800">
                        ${product.price} USD
                      </div>
                    </Link>

                    {/* Readable Product Info */}
                    <div className="p-6">
                      <div className="flex justify-between items-start gap-2">
                        <Link to={`/product/${product._id || product.slug}`}>
                          <h3 className="text-xl font-serif-editorial text-white group-hover:text-[#a38f78] transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                      </div>
                      <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 mt-1">
                        {product.weight || '480 GSM Heavyweight'} • {visuals.fitSpec}
                      </p>
                      <p className="text-sm text-neutral-300 mt-3 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Quick Size Selector & 1-Click Add to Bag */}
                  <div className="px-6 pb-6 pt-3 border-t border-neutral-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">Quick Size:</span>
                      <div className="flex gap-1.5">
                        {['S', 'M', 'L', 'XL'].map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setQuickSizes({ ...quickSizes, [product._id]: sz })}
                            className={`w-8 h-7 text-xs font-bold border transition-colors cursor-pointer ${
                              selectedSize === sz
                                ? 'bg-[#f4f4f0] text-black border-[#f4f4f0]'
                                : 'bg-[#181818] text-neutral-300 border-neutral-700 hover:border-neutral-500'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          addToCart({ ...product, images: [visuals.primaryImage] }, selectedSize);
                          setAddedId(product._id);
                          setTimeout(() => setAddedId(null), 1800);
                        }}
                        className="py-3 px-4 bg-[#a38f78] text-black text-xs uppercase tracking-wider font-bold hover:bg-[#f4f4f0] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {isJustAdded ? <><Check size={14} /> Added</> : <><ShoppingBag size={14} /> Add to Bag</>}
                      </button>

                      <Link
                        to={`/product/${product._id || product.slug}`}
                        className="py-3 px-4 border border-neutral-700 text-neutral-200 text-xs uppercase tracking-wider font-semibold hover:border-white hover:text-white text-center transition-colors"
                      >
                        Full Details
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* 3. HOW QUIET BATTLES WORKS (CLEAR 3-PILLAR EXPLANATION FOR NEW VISITORS) */}
      <section className="py-20 px-5 sm:px-6 max-w-6xl mx-auto border-b border-neutral-900">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-[0.28em] uppercase text-[#a38f78]">
              WHY QUIET BATTLES™ // MORE THAN CLOTHING
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-editorial mt-3 text-white">
              Heavyweight Streetwear Backed by Story.
            </h2>
            <p className="text-base text-neutral-300 mt-4 leading-relaxed">
              We don’t release random seasonal clothes. Every drop is a limited-edition collection where each hoodie, tee, and jacket is connected to a written chapter about overcoming personal adversity.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          <Reveal delay={100} className="bg-[#121212] border border-neutral-800 p-7 space-y-3">
            <span className="text-2xl font-serif-editorial text-[#a38f78]">01 // The Story Chapter</span>
            <h3 className="text-lg font-bold text-white">Written for Silent Battles</h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Each garment begins as an editorial essay exploring solitude, discipline, and mental resilience—giving meaning to what you wear every day.
            </p>
          </Reveal>

          <Reveal delay={200} className="bg-[#121212] border border-neutral-800 p-7 space-y-3">
            <span className="text-2xl font-serif-editorial text-[#a38f78]">02 // 500 GSM Armor</span>
            <h3 className="text-lg font-bold text-white">Ultra-Heavyweight Fabrics</h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Crafted from 480–500 GSM organic ring-spun cotton with reverse flatlock seams, boxy dropped shoulders, and cold-dyed vintage washes.
            </p>
          </Reveal>

          <Reveal delay={300} className="bg-[#121212] border border-neutral-800 p-7 space-y-3">
            <span className="text-2xl font-serif-editorial text-[#a38f78]">03 // Archival Numbering</span>
            <h3 className="text-lg font-bold text-white">Small-Batch Exclusivity</h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Every piece features an internal woven story label and archival SKU code. Once a Series batch sells out, it is never restocked.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 4. RESTORED EDITORIAL CHAPTERS SHOWCASE (CHAPTERS I–V WITH MATCHED PHOTOS) */}
      {primarySeries && (
        <section className="py-20 sm:py-24 px-5 sm:px-6 max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
              <div>
                <span className="text-xs font-bold tracking-[0.28em] uppercase text-[#a38f78]">
                  SERIES 01 STORYBOOK // THE 5 CHAPTERS
                </span>
                <h2 className="text-3xl sm:text-5xl font-serif-editorial mt-2 text-white">
                  Read the Stories Behind the Garments
                </h2>
              </div>
              <Link
                to={`/series/${primarySeries.slug || 'series-01'}`}
                className="mt-4 md:mt-0 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#a38f78] flex items-center gap-2"
              >
                Explore Complete Series 01 <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>

          {chapters.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {chapters.map((ch, idx) => {
                const slot = (idx % 5) + 1;
                const matched = MATCHED_STREETWEAR_ASSETS.chapters[slot];
                const roman = ROMAN_NUMERALS[ch.chapterNumber] || ROMAN_NUMERALS[idx + 1] || `${idx + 1}`;

                return (
                  <Reveal key={ch._id || idx} delay={idx * 100}>
                    <Link
                      to={`/chapter/${ch.slug}`}
                      className="group relative h-96 bg-[#121212] border border-neutral-800 hover:border-[#a38f78] transition-all duration-500 flex flex-col justify-end overflow-hidden p-6 hover:-translate-y-1.5 shadow-xl"
                    >
                      <img
                        src={matched.cover}
                        alt={ch.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                      <div className="relative z-10 space-y-2">
                        <span className="inline-block text-[11px] font-bold tracking-[0.25em] uppercase text-[#a38f78] bg-black/80 px-2.5 py-1 border border-[#a38f78]/40">
                          Chapter {roman}
                        </span>
                        <h4 className="text-xl font-serif-editorial text-white group-hover:text-[#a38f78] transition-colors">
                          {ch.title}
                        </h4>
                        <p className="text-xs text-neutral-200 line-clamp-2 leading-relaxed">
                          {ch.subtitle || ch.narrative}
                        </p>
                        <p className="pt-2 text-[11px] font-semibold uppercase tracking-wider text-[#a38f78] flex items-center gap-1">
                          Read & Shop Garment <ArrowRight size={12} />
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

// ============================================================================
// 4. SERIES ARCHIVE PAGE (LOOKBOOK + STORY + GARMENTS)
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

  if (loading) return <div className="pt-36 text-center text-sm tracking-widest uppercase text-neutral-400">Loading Series 01 Collection...</div>;

  const series = data?.series || data;
  const chapters = data?.chapters || series?.chapters || [];

  if (!series || !series.title) return <div className="pt-36 text-center text-neutral-300">Series not found.</div>;

  return (
    <div className="pt-20 bg-[#0a0a0a]">
      <section className="relative py-20 sm:py-24 px-5 sm:px-6 border-b border-neutral-800 text-center max-w-4xl mx-auto">
        <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#a38f78]">
          SERIES 0{series.seriesNumber || 1} // COMPLETE COLLECTION & LOOKBOOK
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif-editorial text-white mt-4">{series.title}</h1>
        <p className="text-base sm:text-lg text-neutral-200 mt-6 leading-relaxed">
          {series.manifesto}
        </p>
      </section>

      <section className="py-16 px-5 sm:px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {chapters.map((ch, idx) => {
            const slot = (idx % 5) + 1;
            const matched = MATCHED_STREETWEAR_ASSETS.chapters[slot];
            const roman = ROMAN_NUMERALS[ch.chapterNumber] || `${idx + 1}`;
            const linkedProd = ch.linkedProduct;

            return (
              <div key={ch._id || idx} className="bg-[#121212] border border-neutral-800 hover:border-[#a38f78] transition-all flex flex-col justify-between overflow-hidden shadow-lg">
                <div>
                  <Link to={`/chapter/${ch.slug}`} className="block relative h-80 overflow-hidden">
                    <img src={matched.cover} alt={ch.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    <span className="absolute top-3 left-3 bg-black/85 border border-neutral-700 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#a38f78]">
                      Chapter {roman}
                    </span>
                  </Link>
                  <div className="p-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#a38f78]">{matched.categoryTag}</span>
                    <Link to={`/chapter/${ch.slug}`}>
                      <h3 className="text-2xl font-serif-editorial text-white mt-1 hover:text-[#a38f78] transition-colors">{ch.title}</h3>
                    </Link>
                    <p className="text-sm text-neutral-300 mt-3 line-clamp-3 leading-relaxed">
                      {ch.subtitle || ch.narrative}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-3">
                  <Link
                    to={`/chapter/${ch.slug}`}
                    className="text-xs font-bold uppercase tracking-wider text-white hover:text-[#a38f78] flex items-center gap-1.5"
                  >
                    Read Chapter {roman} <ArrowRight size={14} />
                  </Link>
                  {linkedProd && (
                    <Link
                      to={`/product/${linkedProd._id || linkedProd.slug}`}
                      className="px-4 py-2 bg-[#f4f4f0] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#a38f78] hover:text-white transition-colors"
                    >
                      Buy Garment (${linkedProd.price})
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// 5. CHAPTER DETAIL PAGE (HIGH-CONTRAST READABLE STORY + CONNECTED GARMENT)
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

  if (!chapter) return <div className="pt-36 text-center text-sm tracking-widest uppercase text-neutral-400">Loading Chapter Story...</div>;

  const slot = ((chapter.chapterNumber || 1) - 1) % 5 + 1;
  const matched = MATCHED_STREETWEAR_ASSETS.chapters[slot];
  const roman = ROMAN_NUMERALS[chapter.chapterNumber] || 'I';
  const product = chapter.linkedProduct;
  const paragraphs = chapter.narrative ? chapter.narrative.split('\n\n') : [chapter.subtitle];

  return (
    <div className="pt-20 bg-[#0a0a0a]">
      {/* Story Hero */}
      <section className="relative h-[60vh] flex items-end overflow-hidden border-b border-neutral-800">
        <img src={matched.cover} alt={chapter.title} className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-12 w-full">
          <Link to="/series/series-01" className="text-xs font-bold tracking-widest uppercase text-[#a38f78] hover:text-white flex items-center gap-2">
            <ArrowLeft size={14} /> Back to Series 01 Collection
          </Link>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#a38f78] mt-4">
            CHAPTER {roman} // PAIRED WITH: {matched.categoryTag.toUpperCase()}
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif-editorial text-white mt-2">{chapter.title}</h1>
          <p className="text-base sm:text-xl text-neutral-200 mt-3 font-medium">{chapter.subtitle}</p>
        </div>
      </section>

      {/* High-Readability Narrative Body */}
      <section className="py-16 px-6 max-w-3xl mx-auto space-y-6 text-base sm:text-lg text-[#e5e5e0] leading-[1.85]">
        {paragraphs.map((p, idx) => (
          <p key={idx} className={idx === 0 ? "first-letter:text-4xl first-letter:font-serif-editorial first-letter:text-[#a38f78] first-letter:mr-2 first-letter:float-left" : ""}>
            {p}
          </p>
        ))}
      </section>

      {/* Connected Garment Showcase Card */}
      {product && (
        <section className="py-12 px-6 max-w-5xl mx-auto pb-24">
          <div className="bg-[#121212] border-2 border-[#a38f78]/50 p-6 sm:p-10 grid md:grid-cols-12 gap-8 items-center shadow-2xl">
            <div className="md:col-span-5 h-80 overflow-hidden border border-neutral-800 relative">
              <img src={matched.productImg} alt={product.name} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-black/85 px-3 py-1 text-xs font-bold text-[#a38f78] uppercase">
                {matched.categoryTag}
              </span>
            </div>
            <div className="md:col-span-7 space-y-4">
              <span className="text-xs font-bold tracking-widest uppercase text-[#a38f78]">
                Official Chapter {roman} Garment
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-editorial text-white">{product.name}</h3>
              <p className="text-xl font-bold text-white">${product.price} USD <span className="text-xs font-normal text-neutral-400 ml-2">({product.edition || 'Limited Archive Edition'})</span></p>
              <p className="text-sm sm:text-base text-neutral-200 leading-relaxed">{product.description}</p>
              <div className="pt-2">
                <Link
                  to={`/product/${product._id || product.slug}`}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#f4f4f0] text-black text-xs sm:text-sm uppercase tracking-widest font-bold hover:bg-[#a38f78] hover:text-white transition-all cursor-pointer"
                >
                  Select Size & Buy Garment <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ============================================================================
// 6. PRODUCT DETAIL PAGE (MATCHED GALLERY + READABLE SPECS + SIZE MATRIX)
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
          if (data.sizes?.length > 0) setSelectedSize(data.sizes[2] || data.sizes[0]);
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <div className="pt-36 text-center text-sm tracking-widest uppercase text-neutral-400 animate-pulse">Loading Garment Details...</div>;

  const visuals = getMatchedProductVisuals(product, 0);
  const images = [visuals.primaryImage, visuals.secondaryImage];

  return (
    <div className="pt-28 pb-24 px-5 sm:px-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link to="/" className="text-xs font-semibold uppercase tracking-widest text-neutral-400 hover:text-[#a38f78] flex items-center gap-2">
          <ArrowLeft size={14} /> Back to Shop
        </Link>
      </div>

      <div className="grid md:grid-cols-12 gap-10 lg:gap-12">
        {/* Left Column: Matched Streetwear Gallery */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-[#121212] border border-neutral-800 h-[460px] sm:h-[560px] overflow-hidden relative">
            <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
            <span className="absolute top-4 left-4 bg-black/85 border border-neutral-700 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#a38f78]">
              {visuals.categoryTag}
            </span>
          </div>
          <div className="flex gap-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-24 h-28 border-2 cursor-pointer overflow-hidden transition-all ${
                  activeImage === idx ? 'border-[#a38f78] opacity-100' : 'border-neutral-800 opacity-50 hover:opacity-80'
                }`}
              >
                <img src={img} alt="Garment view" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Clear E-Commerce Purchase Controls */}
        <div className="md:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#a38f78]">
              SKU: {product.sku || 'QB-S01'} • IN STOCK & READY TO SHIP
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif-editorial text-white mt-2">{product.name}</h1>
            <p className="text-2xl sm:text-3xl text-white font-bold mt-3">${product.price} USD</p>
            <p className="text-xs text-neutral-400 mt-1">Free worldwide express shipping included.</p>
          </div>

          <p className="text-base text-neutral-200 leading-relaxed">
            {product.description}
          </p>

          {/* Size Selection */}
          <div className="pt-4 border-t border-neutral-800">
            <div className="flex justify-between text-xs font-semibold tracking-wider uppercase mb-3">
              <span className="text-neutral-200">Select Garment Size (US/EU)</span>
              <button onClick={() => setSizeGuideOpen(true)} className="text-[#a38f78] hover:underline flex items-center gap-1.5 cursor-pointer">
                <Ruler size={14} /> View Size Chart
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3.5 text-sm font-bold tracking-wider uppercase border cursor-pointer transition-all ${
                    selectedSize === size
                      ? 'bg-[#f4f4f0] text-black border-[#f4f4f0]'
                      : 'bg-[#141414] border-neutral-700 text-neutral-200 hover:border-[#a38f78]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Bag Button */}
          <button
            onClick={() => {
              addToCart({ ...product, images: [visuals.primaryImage] }, selectedSize);
              setAdded(true);
              setTimeout(() => setAdded(false), 2000);
            }}
            className="w-full py-4.5 bg-[#a38f78] text-black text-sm uppercase tracking-[0.2em] font-bold hover:bg-[#f4f4f0] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xl"
          >
            {added ? <><Check size={18} /> Added to Shopping Bag</> : <><ShoppingBag size={18} /> Add to Bag — ${product.price} USD</>}
          </button>

          {/* Readable Garment Specifications Box */}
          <div className="p-5 bg-[#121212] border border-neutral-800 space-y-3 text-sm text-neutral-300">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#a38f78]">Garment Specifications</h4>
            <p><span className="text-white font-semibold">Category:</span> {visuals.fitSpec}</p>
            <p><span className="text-white font-semibold">Material:</span> {product.material}</p>
            <p><span className="text-white font-semibold">Silhouette:</span> {product.fit}</p>
            <p><span className="text-white font-semibold">Fabric Weight:</span> {product.weight}</p>
            <p><span className="text-white font-semibold">Craftsmanship:</span> {product.origin}</p>
          </div>
        </div>
      </div>

      {/* Full Measurement Matrix Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="bg-[#121212] border border-neutral-700 max-w-lg w-full p-6 sm:p-8 relative shadow-2xl">
            <button onClick={() => setSizeGuideOpen(false)} className="absolute top-5 right-5 text-neutral-400 hover:text-white cursor-pointer">
              <X size={20} />
            </button>
            <h4 className="text-lg font-serif-editorial text-white uppercase tracking-wider mb-2">Size & Fit Measurement Chart</h4>
            <p className="text-sm text-neutral-300 mb-5">
              All QUIET BATTLES™ garments are cut with a relaxed, boxy drop-shoulder streetwear fit. Take your normal size for the intended oversized drape.
            </p>
            <table className="w-full text-left text-xs sm:text-sm border-collapse border border-neutral-800">
              <thead>
                <tr className="bg-[#1a1a1a] text-[#a38f78]">
                  <th className="p-3 border border-neutral-800">Size</th>
                  <th className="p-3 border border-neutral-800">Chest (in)</th>
                  <th className="p-3 border border-neutral-800">Length (in)</th>
                  <th className="p-3 border border-neutral-800">Shoulder (in)</th>
                </tr>
              </thead>
              <tbody className="text-neutral-200">
                <tr><td className="p-3 border border-neutral-800 font-bold">S</td><td className="p-3 border border-neutral-800">44"</td><td className="p-3 border border-neutral-800">27.5"</td><td className="p-3 border border-neutral-800">21.5"</td></tr>
                <tr><td className="p-3 border border-neutral-800 font-bold">M</td><td className="p-3 border border-neutral-800">46"</td><td className="p-3 border border-neutral-800">28.5"</td><td className="p-3 border border-neutral-800">22.5"</td></tr>
                <tr><td className="p-3 border border-neutral-800 font-bold">L</td><td className="p-3 border border-neutral-800">48"</td><td className="p-3 border border-neutral-800">29.5"</td><td className="p-3 border border-neutral-800">23.5"</td></tr>
                <tr><td className="p-3 border border-neutral-800 font-bold">XL</td><td className="p-3 border border-neutral-800">51"</td><td className="p-3 border border-neutral-800">30.5"</td><td className="p-3 border border-neutral-800">24.5"</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}