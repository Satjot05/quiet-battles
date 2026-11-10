// frontend/src/pages/AdminDashboard.jsx
import { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Edit3,
  Database,
  Save,
  CheckCircle2,
  Layers,
  BookOpen,
  Package,
  Lock,
  LogOut,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { API_BASE } from "./StoreFrontPages";

export function AdminDashboard() {
  // 1. IN-MEMORY AUTH STATE (Wipes automatically on F5 refresh)
  const [adminToken, setAdminToken] = useState('');
  const [adminUser, setAdminUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loginPopup, setLoginPopup] = useState(false);

  // 2. CINEMATIC TRANSITION STATES
  const [gateReady, setGateReady] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [dashboardReady, setDashboardReady] = useState(false);

  // 3. CMS DATA & TAB STATES
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  // Active item currently being created or edited
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState(null);

  // Mobile Editor Auto-Scroll Reference
  const editorRef = useRef(null);

  // Trigger entrance animation when Login Gate mounts
  useEffect(() => {
    document.title = 'QUIET BATTLES™ | Editorial Control Center';
    if (!adminToken) {
      setGateReady(false);
      const timer = requestAnimationFrame(() => setGateReady(true));
      return () => cancelAnimationFrame(timer);
    }
  }, [adminToken]);

  // Load CMS data & trigger Dashboard staggered entrance after login
  useEffect(() => {
    if (adminToken) {
      loadAllData();
      const timer = setTimeout(() => setDashboardReady(true), 60);
      return () => clearTimeout(timer);
    } else {
      setDashboardReady(false);
    }
  }, [adminToken]);

  // Auto-scroll to the Edit Form on mobile screens when an item is selected
  useEffect(() => {
    if (
      (selectedProduct || selectedChapter || selectedSeries) &&
      window.innerWidth < 768 &&
      editorRef.current
    ) {
      setTimeout(() => {
        editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  }, [selectedProduct, selectedChapter, selectedSeries]);

  const loadAllData = async () => {
    try {
      const prodRes = await fetch(`${API_BASE}/products`);
      const prodData = await prodRes.json();
      setProducts(prodData);

      const serRes = await fetch(`${API_BASE}/series`);
      const serData = await serRes.json();
      setSeriesList(serData);

      if (serData.length > 0) {
        const chRes = await fetch(`${API_BASE}/series/${serData[0].slug}`);
        const chData = await chRes.json();
        setChapters(chData.chapters || []);
      }
    } catch (err) {
      console.error('Failed to load CMS data:', err);
    }
  };

  // Handle Admin Login with 2-Stage Vault Unlock Transition
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);

    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setIsAuthenticating(false);
        setAuthError(data.error || 'Authentication failed');
        return;
      }

      // Stage 1: Trigger smooth exit animation on the Login Card
      setIsUnlocking(true);

      // Stage 2: After 650ms transition completes, mount the Dashboard
      setTimeout(() => {
        setAdminToken(data.token);
        setAdminUser(data.user || { username, role: 'Editorial Director' });
        setPassword('');
        setShowPassword(false);
        setIsAuthenticating(false);
        setIsUnlocking(false);

        // Trigger Welcome Toast Popup
        setLoginPopup(true);
        setTimeout(() => setLoginPopup(false), 4500);
      }, 650);
    } catch (err) {
      setIsAuthenticating(false);
      setAuthError('Could not connect to authentication server.');
    }
  };

  // Handle Admin Logout with smooth fade back to Login Gate
  const handleLogout = () => {
    setDashboardReady(false);
    setTimeout(() => {
      setAdminToken('');
      setAdminUser(null);
      setUsername('');
      setPassword('');
      setShowPassword(false);
      setLoginPopup(false);
    }, 350);
  };

  const triggerNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  // 1. SAVE PRODUCT (Protected by x-admin-token)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const isEditing = Boolean(selectedProduct._id);
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing
      ? `${API_BASE}/admin/products/${selectedProduct._id}`
      : `${API_BASE}/admin/products`;

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken,
      },
      body: JSON.stringify(selectedProduct),
    });

    if (res.ok) {
      triggerNotification(
        isEditing ? 'Product updated in MongoDB!' : 'New Product created in MongoDB!'
      );
      await loadAllData();
      setSelectedProduct(null);
    }
  };

  // 2. SAVE CHAPTER (Protected by x-admin-token)
  const handleSaveChapter = async (e) => {
    e.preventDefault();
    const isEditing = Boolean(selectedChapter._id);
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing
      ? `${API_BASE}/admin/chapters/${selectedChapter._id}`
      : `${API_BASE}/admin/chapters`;

    const payload = {
      ...selectedChapter,
      linkedProduct:
        typeof selectedChapter.linkedProduct === 'object' && selectedChapter.linkedProduct !== null
          ? selectedChapter.linkedProduct._id
          : selectedChapter.linkedProduct,
    };

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      triggerNotification(
        isEditing ? 'Chapter narrative updated!' : 'New Chapter added to Series!'
      );
      await loadAllData();
      setSelectedChapter(null);
    }
  };

  // 3. SAVE SERIES (Protected by x-admin-token)
  const handleSaveSeries = async (e) => {
    e.preventDefault();
    const isEditing = Boolean(selectedSeries._id);
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing
      ? `${API_BASE}/admin/series/${selectedSeries._id}`
      : `${API_BASE}/admin/series`;

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken,
      },
      body: JSON.stringify(selectedSeries),
    });

    if (res.ok) {
      triggerNotification(
        isEditing ? 'Archive Series updated!' : 'New Archive Series created!'
      );
      await loadAllData();
      setSelectedSeries(null);
    }
  };

  // ============================================================================
  // VIEW 1: IF NOT LOGGED IN -> RENDER ANIMATED LUXURY ADMIN LOGIN GATE
  // ============================================================================
  if (!adminToken) {
    return (
      <div className="pt-28 pb-20 px-5 sm:px-6 min-h-[88vh] flex items-center justify-center relative overflow-hidden bg-film-grain">
        {/* Ambient Radial Spotlight Behind Login Vault */}
        <div
          className={`pointer-events-none absolute w-[320px] sm:w-[520px] h-[320px] sm:h-[520px] rounded-full bg-[#a38f78]/10 blur-[120px] transition-all duration-1000 ${
            isUnlocking
              ? 'scale-150 opacity-0'
              : gateReady
              ? 'scale-100 opacity-100'
              : 'scale-75 opacity-0'
          }`}
        />

        {/* Animated Login Vault Card */}
        <div
          className={`relative z-10 w-full max-w-md bg-[#111111]/95 backdrop-blur-xl border p-6 sm:p-10 shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isUnlocking
              ? 'opacity-0 scale-105 -translate-y-6 blur-xs border-[#a38f78]'
              : gateReady
              ? 'opacity-100 scale-100 translate-y-0 border-neutral-800 hover:border-neutral-700'
              : 'opacity-0 scale-95 translate-y-10 border-neutral-900'
          }`}
        >
          {/* Top Accent Line */}
          <div
            className={`h-[2px] bg-gradient-to-r from-transparent via-[#a38f78] to-transparent mb-6 transition-all duration-1000 ${
              gateReady ? 'w-full opacity-100' : 'w-0 opacity-0'
            }`}
          />

          <div className="flex items-center justify-between text-xs tracking-[0.3em] uppercase text-[#a38f78] mb-3">
            <span className="flex items-center gap-2">
              <Lock size={14} className={isUnlocking ? 'animate-bounce' : ''} />
              {isUnlocking ? 'Vault Unlocked' : 'Restricted Portal'}
            </span>
            <Sparkles size={13} className="opacity-70" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif-editorial text-white">
            QUIET BATTLES™ CMS
          </h1>
          <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
            Authenticate with authorized credentials to manage archive series, editorial chapters,
            and garment inventory.
          </p>

          {authError && (
            <div className="mt-5 p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2 animate-pulse">
              <AlertCircle size={15} /> {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-5">
            <div>
              <label className="block text-[11px] tracking-[0.2em] uppercase text-neutral-400 mb-2">
                Admin Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="off"
                disabled={isAuthenticating}
                className="w-full bg-[#0a0a0a] border border-neutral-800 px-4 py-3 text-xs text-white focus:border-[#a38f78] transition-colors outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.2em] uppercase text-neutral-400 mb-2">
                Security Passkey
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isAuthenticating}
                  className="w-full bg-[#0a0a0a] border border-neutral-800 pl-4 pr-11 py-3 text-xs text-white focus:border-[#a38f78] transition-colors outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-[#a38f78] transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className={`w-full py-4 text-xs tracking-[0.22em] sm:tracking-[0.25em] uppercase font-semibold transition-all duration-500 flex items-center justify-center gap-2.5 cursor-pointer ${
                isUnlocking
                  ? 'bg-[#a38f78] text-black shadow-[0_0_30px_rgba(163,143,120,0.5)]'
                  : 'bg-[#f4f4f0] text-black hover:bg-[#a38f78] hover:text-white'
              }`}
            >
              {isUnlocking ? (
                <>
                  <ShieldCheck size={16} /> Access Granted — Initializing...
                </>
              ) : isAuthenticating ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Verifying Credentials...
                </>
              ) : (
                'Unlock Control Center'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW 2: AUTHENTICATED -> RENDER STAGGERED ANIMATED CMS DASHBOARD
  // ============================================================================
  return (
    <div
      className={`pt-24 sm:pt-28 pb-20 sm:pb-24 px-5 sm:px-6 max-w-7xl mx-auto relative bg-film-grain transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        dashboardReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* LOGIN WELCOME POPUP BANNER (Responsive for Phone & Desktop) */}
      <div
        className={`fixed top-20 sm:top-24 left-4 right-4 sm:left-auto sm:right-6 z-50 sm:max-w-sm bg-[#141414]/95 backdrop-blur-xl border border-[#a38f78] p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex items-start gap-3.5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          loginPopup
            ? 'opacity-100 translate-y-0 sm:translate-x-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 sm:translate-y-0 sm:translate-x-12 pointer-events-none'
        }`}
      >
        <div className="p-2 bg-[#a38f78]/15 text-[#a38f78] rounded-xs shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div className="flex-1">
          <h4 className="text-xs tracking-[0.2em] uppercase text-white font-semibold">
            Access Granted // Vault Unlocked
          </h4>
          <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
            Welcome, <span className="text-[#a38f78] font-medium">{adminUser?.username}</span> (
            {adminUser?.role}). Live database write permissions are now active.
          </p>
        </div>
        <button
          onClick={() => setLoginPopup(false)}
          className="text-neutral-500 hover:text-white cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Header Banner (Stagger Step 1) */}
      <div
        style={{ transitionDelay: '80ms' }}
        className={`flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-neutral-800 gap-4 transition-all duration-700 ${
          dashboardReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div>
          <span className="text-xs tracking-[0.35em] uppercase text-[#a38f78] flex items-center gap-2">
            <Database size={15} /> Requirement E // Authenticated CMS Portal
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif-editorial text-white mt-2">
            QUIET BATTLES™ Control Center
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full md:w-auto">
          {successMsg && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-950/90 border border-emerald-700 text-emerald-300 text-xs tracking-wider uppercase animate-pulse">
              <CheckCircle2 size={15} /> {successMsg}
            </div>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 border border-neutral-700 text-neutral-300 hover:border-red-500 hover:bg-red-950/30 hover:text-red-400 text-xs tracking-[0.2em] uppercase flex items-center gap-2 transition-all duration-300 cursor-pointer"
          >
            <LogOut size={14} /> Lock Vault
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Stagger Step 2) */}
      <div
        style={{ transitionDelay: '180ms' }}
        className={`flex flex-wrap gap-3 sm:gap-4 mt-8 border-b border-neutral-800 pb-4 transition-all duration-700 ${
          dashboardReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <button
          onClick={() => {
            setActiveTab('products');
            setSelectedProduct(null);
          }}
          className={`px-4 sm:px-5 py-2.5 text-xs tracking-[0.18em] sm:tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            activeTab === 'products'
              ? 'bg-[#f4f4f0] text-black font-semibold scale-[1.02] shadow-[0_0_20px_rgba(244,244,240,0.15)]'
              : 'bg-[#121212] text-neutral-300 border border-neutral-800 hover:border-[#a38f78]'
          }`}
        >
          <Package size={15} /> 1. Products ({products.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('chapters');
            setSelectedChapter(null);
          }}
          className={`px-4 sm:px-5 py-2.5 text-xs tracking-[0.18em] sm:tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            activeTab === 'chapters'
              ? 'bg-[#f4f4f0] text-black font-semibold scale-[1.02] shadow-[0_0_20px_rgba(244,244,240,0.15)]'
              : 'bg-[#121212] text-neutral-300 border border-neutral-800 hover:border-[#a38f78]'
          }`}
        >
          <BookOpen size={15} /> 2. Chapters ({chapters.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('series');
            setSelectedSeries(null);
          }}
          className={`px-4 sm:px-5 py-2.5 text-xs tracking-[0.18em] sm:tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            activeTab === 'series'
              ? 'bg-[#f4f4f0] text-black font-semibold scale-[1.02] shadow-[0_0_20px_rgba(244,244,240,0.15)]'
              : 'bg-[#121212] text-neutral-300 border border-neutral-800 hover:border-[#a38f78]'
          }`}
        >
          <Layers size={15} /> 3. Series ({seriesList.length})
        </button>
      </div>

      {/* Main Content Workspace (Stagger Step 3) */}
      <div
        style={{ transitionDelay: '280ms' }}
        className={`transition-all duration-700 ${
          dashboardReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="mt-8 grid md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xs tracking-[0.25em] uppercase text-[#a38f78]">
                  Catalog Inventory
                </h2>
                <button
                  onClick={() =>
                    setSelectedProduct({
                      name: '',
                      sku: 'QB-S01-NEW',
                      tagline: '',
                      price: 4500,
                      description: '',
                      fabricDetails: ['100% Combed Organic Cotton', 'Oversized Boxy Fit'],
                      sizes: ['S', 'M', 'L', 'XL'],
                      images: [
                        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=80',
                      ],
                    })
                  }
                  className="text-xs tracking-[0.2em] uppercase text-black bg-[#f4f4f0] px-3 py-1.5 flex items-center gap-1 hover:bg-[#a38f78] hover:text-white transition-all duration-300 cursor-pointer"
                >
                  <Plus size={13} /> Add Garment
                </button>
              </div>

              <div className="space-y-3">
                {products.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => setSelectedProduct(p)}
                    className={`p-4 border bg-[#111111] cursor-pointer transition-all duration-300 flex items-center justify-between hover:translate-x-1 ${
                      selectedProduct?._id === p._id
                        ? 'border-[#a38f78] bg-[#161616] shadow-lg'
                        : 'border-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0]}
                        alt={p.name}
                        className="w-12 h-14 object-cover border border-neutral-800 shrink-0"
                      />
                      <div>
                        <h4 className="text-xs tracking-[0.15em] uppercase text-white font-medium">
                          {p.name}
                        </h4>
                        <p className="text-[11px] text-[#a38f78] mt-1">
                          ₹{p.price?.toLocaleString('en-IN')} &nbsp;//&nbsp; {p.sku}
                        </p>
                      </div>
                    </div>
                    <Edit3 size={15} className="text-neutral-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            <div
              ref={editorRef}
              className="md:col-span-7 bg-[#111111] border border-neutral-800 p-5 sm:p-8 shadow-2xl scroll-mt-24"
            >
              {selectedProduct ? (
                <form
                  key={selectedProduct._id || 'new-product'}
                  onSubmit={handleSaveProduct}
                  className="space-y-5"
                >
                  <h3 className="text-xs tracking-[0.25em] uppercase text-[#a38f78] border-b border-neutral-800 pb-3">
                    {selectedProduct._id
                      ? `Editing Product: ${selectedProduct.name}`
                      : 'Create New Product'}
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={selectedProduct.name}
                        onChange={(e) =>
                          setSelectedProduct({ ...selectedProduct, name: e.target.value })
                        }
                        className="w-full bg-[#0a0a0a] border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                        SKU Code
                      </label>
                      <input
                        type="text"
                        value={selectedProduct.sku}
                        onChange={(e) =>
                          setSelectedProduct({ ...selectedProduct, sku: e.target.value })
                        }
                        className="w-full bg-[#0a0a0a] border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                        Price (₹ INR)
                      </label>
                      <input
                        type="number"
                        value={selectedProduct.price}
                        onChange={(e) =>
                          setSelectedProduct({
                            ...selectedProduct,
                            price: Number(e.target.value),
                          })
                        }
                        className="w-full bg-[#0a0a0a] border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={selectedProduct.tagline || ''}
                        onChange={(e) =>
                          setSelectedProduct({ ...selectedProduct, tagline: e.target.value })
                        }
                        className="w-full bg-[#0a0a0a] border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                      Primary Image URL
                    </label>
                    <input
                      type="text"
                      value={selectedProduct.images?.[0] || ''}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          images: [e.target.value, ...(selectedProduct.images?.slice(1) || [])],
                        })
                      }
                      className="w-full bg-[#0a0a0a] border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                      Full Description
                    </label>
                    <textarea
                      rows={4}
                      value={selectedProduct.description}
                      onChange={(e) =>
                        setSelectedProduct({ ...selectedProduct, description: e.target.value })
                      }
                      className="w-full bg-[#0a0a0a] border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto justify-center px-8 py-3.5 bg-[#a38f78] text-black font-semibold text-xs tracking-[0.2em] uppercase hover:bg-[#f4f4f0] transition-all duration-300 flex items-center gap-2 cursor-pointer"
                  >
                    <Save size={15} /> Save Product to Database
                  </button>
                </form>
              ) : (
                <div className="h-64 flex items-center justify-center text-center text-xs tracking-[0.25em] uppercase text-neutral-500">
                  ← Select a Product to edit or click "+ Add Garment"
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CHAPTERS & STORYTELLING MANAGEMENT */}
        {activeTab === 'chapters' && (
          <div className="mt-8 grid md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xs tracking-[0.25em] uppercase text-[#a38f78]">
                  Series Chapters
                </h2>
                <button
                  onClick={() =>
                    setSelectedChapter({
                      seriesId: seriesList[0]?._id,
                      chapterNumber: chapters.length + 1,
                      romanNumeral: 'VI',
                      title: '',
                      slug: `chapter-${chapters.length + 1}-new-story`,
                      subtitle: '',
                      heroImage:
                        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80',
                      pullQuote: '',
                      storyParagraphs: ['Enter chapter story paragraph here...'],
                      linkedProduct: products[0]?._id || '',
                    })
                  }
                  className="text-xs tracking-[0.2em] uppercase text-black bg-[#f4f4f0] px-3 py-1.5 flex items-center gap-1 hover:bg-[#a38f78] hover:text-white transition-all duration-300 cursor-pointer"
                >
                  <Plus size={13} /> New Chapter
                </button>
              </div>

              <div className="space-y-3">
                {chapters.map((ch) => (
                  <div
                    key={ch._id}
                    onClick={() => setSelectedChapter(ch)}
                    className={`p-4 border bg-[#111111] cursor-pointer transition-all duration-300 flex items-center justify-between hover:translate-x-1 ${
                      selectedChapter?._id === ch._id
                        ? 'border-[#a38f78] bg-[#161616] shadow-lg'
                        : 'border-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] tracking-[0.25em] uppercase text-[#a38f78]">
                        Chapter {ch.romanNumeral}
                      </span>
                      <h4 className="text-xs tracking-[0.12em] uppercase text-white font-medium mt-0.5">
                        {ch.title}
                      </h4>
                    </div>
                    <Edit3 size={15} className="text-neutral-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            <div
              ref={editorRef}
              className="md:col-span-7 bg-[#111111] border border-neutral-800 p-5 sm:p-8 shadow-2xl scroll-mt-24"
            >
              {selectedChapter ? (
                <form
                  key={selectedChapter._id || 'new-chapter'}
                  onSubmit={handleSaveChapter}
                  className="space-y-5"
                >
                  <h3 className="text-xs tracking-[0.25em] uppercase text-[#a38f78] border-b border-neutral-800 pb-3">
                    {selectedChapter._id
                      ? `Editing Chapter ${selectedChapter.romanNumeral}: ${selectedChapter.title}`
                      : 'Create New Chapter'}
                  </h3>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                        Chapter #
                      </label>
                      <input
                        type="number"
                        value={selectedChapter.chapterNumber}
                        onChange={(e) =>
                          setSelectedChapter({
                            ...selectedChapter,
                            chapterNumber: Number(e.target.value),
                          })
                        }
                        className="w-full bg-[#0a0a0a] border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                        Roman Numeral
                      </label>
                      <input
                        type="text"
                        value={selectedChapter.romanNumeral}
                        onChange={(e) =>
                          setSelectedChapter({
                            ...selectedChapter,
                            romanNumeral: e.target.value,
                          })
                        }
                        className="w-full bg-[#0a0a0a] border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={selectedChapter.slug}
                        onChange={(e) =>
                          setSelectedChapter({ ...selectedChapter, slug: e.target.value })
                        }
                        className="w-full bg-[#0a0a0a] border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                        Chapter Title
                      </label>
                      <input
                        type="text"
                        value={selectedChapter.title}
                        onChange={(e) =>
                          setSelectedChapter({ ...selectedChapter, title: e.target.value })
                        }
                        className="w-full bg-[#0a0a0a] border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                        Connected Product Artifact
                      </label>
                      <select
                        value={
                          typeof selectedChapter.linkedProduct === 'object'
                            ? selectedChapter.linkedProduct?._id
                            : selectedChapter.linkedProduct || ''
                        }
                        onChange={(e) =>
                          setSelectedChapter({
                            ...selectedChapter,
                            linkedProduct: e.target.value,
                          })
                        }
                        className="w-full bg-[#0a0a0a] border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                      >
                        {products.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name} (₹{p.price})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={selectedChapter.subtitle || ''}
                      onChange={(e) =>
                        setSelectedChapter({ ...selectedChapter, subtitle: e.target.value })
                      }
                      className="w-full bg-[#0a0a0a] border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                      Hero Image URL
                    </label>
                    <input
                      type="text"
                      value={selectedChapter.heroImage || ''}
                      onChange={(e) =>
                        setSelectedChapter({ ...selectedChapter, heroImage: e.target.value })
                      }
                      className="w-full bg-[#0a0a0a] border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                      Editorial Pull Quote
                    </label>
                    <input
                      type="text"
                      value={selectedChapter.pullQuote || ''}
                      onChange={(e) =>
                        setSelectedChapter({ ...selectedChapter, pullQuote: e.target.value })
                      }
                      className="w-full bg-[#0a0a0a] border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                      Story Paragraphs (Separate paragraphs with a blank line)
                    </label>
                    <textarea
                      rows={5}
                      value={(selectedChapter.storyParagraphs || []).join('\n\n')}
                      onChange={(e) =>
                        setSelectedChapter({
                          ...selectedChapter,
                          storyParagraphs: e.target.value.split('\n\n'),
                        })
                      }
                      className="w-full bg-[#0a0a0a] border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto justify-center px-8 py-3.5 bg-[#a38f78] text-black font-semibold text-xs tracking-[0.2em] uppercase hover:bg-[#f4f4f0] transition-all duration-300 flex items-center gap-2 cursor-pointer"
                  >
                    <Save size={15} /> Save Chapter Story
                  </button>
                </form>
              ) : (
                <div className="h-64 flex items-center justify-center text-center text-xs tracking-[0.25em] uppercase text-neutral-500">
                  ← Select a Chapter to edit its story & connected garment
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SERIES MANAGEMENT */}
        {activeTab === 'series' && (
          <div className="mt-8 grid md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xs tracking-[0.25em] uppercase text-[#a38f78]">
                  Archive Collections
                </h2>
                <button
                  onClick={() =>
                    setSelectedSeries({
                      seriesCode: `SERIES 0${seriesList.length + 1}`,
                      title: 'NEW ARCHIVE SERIES™',
                      slug: `series-0${seriesList.length + 1}-new`,
                      subtitle: '',
                      description: '',
                      heroImage:
                        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80',
                      releaseSeason: 'ARCHIVE EDITION // 2026',
                    })
                  }
                  className="text-xs tracking-[0.2em] uppercase text-black bg-[#f4f4f0] px-3 py-1.5 flex items-center gap-1 hover:bg-[#a38f78] hover:text-white transition-all duration-300 cursor-pointer"
                >
                  <Plus size={13} /> New Series
                </button>
              </div>

              <div className="space-y-3">
                {seriesList.map((s) => (
                  <div
                    key={s._id}
                    onClick={() => setSelectedSeries(s)}
                    className={`p-4 border bg-[#111111] cursor-pointer transition-all duration-300 flex items-center justify-between hover:translate-x-1 ${
                      selectedSeries?._id === s._id
                        ? 'border-[#a38f78] bg-[#161616] shadow-lg'
                        : 'border-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] tracking-[0.25em] uppercase text-[#a38f78]">
                        {s.seriesCode}
                      </span>
                      <h4 className="text-xs tracking-[0.15em] uppercase text-white font-medium mt-0.5">
                        {s.title}
                      </h4>
                    </div>
                    <Edit3 size={15} className="text-neutral-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            <div
              ref={editorRef}
              className="md:col-span-7 bg-[#111111] border border-neutral-800 p-5 sm:p-8 shadow-2xl scroll-mt-24"
            >
              {selectedSeries ? (
                <form
                  key={selectedSeries._id || 'new-series'}
                  onSubmit={handleSaveSeries}
                  className="space-y-5"
                >
                  <h3 className="text-xs tracking-[0.25em] uppercase text-[#a38f78] border-b border-neutral-800 pb-3">
                    {selectedSeries._id
                      ? `Editing ${selectedSeries.seriesCode}: ${selectedSeries.title}`
                      : 'Create New Archive Series'}
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                        Series Code
                      </label>
                      <input
                        type="text"
                        value={selectedSeries.seriesCode}
                        onChange={(e) =>
                          setSelectedSeries({ ...selectedSeries, seriesCode: e.target.value })
                        }
                        className="w-full bg-[#0a0a0a] border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                        Series Title
                      </label>
                      <input
                        type="text"
                        value={selectedSeries.title}
                        onChange={(e) =>
                          setSelectedSeries({ ...selectedSeries, title: e.target.value })
                        }
                        className="w-full bg-[#0a0a0a] border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                      Subtitle Quote
                    </label>
                    <input
                      type="text"
                      value={selectedSeries.subtitle || ''}
                      onChange={(e) =>
                        setSelectedSeries({ ...selectedSeries, subtitle: e.target.value })
                      }
                      className="w-full bg-[#0a0a0a] border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                      Hero Image URL
                    </label>
                    <input
                      type="text"
                      value={selectedSeries.heroImage || ''}
                      onChange={(e) =>
                        setSelectedSeries({ ...selectedSeries, heroImage: e.target.value })
                      }
                      className="w-full bg-[#0a0a0a] border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                      Series Manifesto Description
                    </label>
                    <textarea
                      rows={4}
                      value={selectedSeries.description || ''}
                      onChange={(e) =>
                        setSelectedSeries({ ...selectedSeries, description: e.target.value })
                      }
                      className="w-full bg-[#0a0a0a] border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto justify-center px-8 py-3.5 bg-[#a38f78] text-black font-semibold text-xs tracking-[0.2em] uppercase hover:bg-[#f4f4f0] transition-all duration-300 flex items-center gap-2 cursor-pointer"
                  >
                    <Save size={15} /> Save Series Collection
                  </button>
                </form>
              ) : (
                <div className="h-64 flex items-center justify-center text-center text-xs tracking-[0.25em] uppercase text-neutral-500">
                  ← Select a Series to edit or click "+ New Series"
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}