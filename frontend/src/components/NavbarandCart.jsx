// frontend/src/components/NavbarAndCart.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  X,
  Menu,
  Shield,
  Trash2,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  PackageCheck,
  CreditCard,
  Loader2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const CHAPTER_LINKS = [
  { numeral: 'I', title: 'The Weight of Silence', slug: 'chapter-1-the-weight-of-silence' },
  { numeral: 'II', title: 'Beneath the Surface', slug: 'chapter-2-beneath-the-surface' },
  { numeral: 'III', title: 'Solitude in Motion', slug: 'chapter-3-solitude-in-motion' },
  { numeral: 'IV', title: 'Scars as Seamlines', slug: 'chapter-4-scars-as-seamlines' },
  { numeral: 'V', title: 'Dawn After the Storm', slug: 'chapter-5-dawn-after-the-storm' },
];

export function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chapterDropdownOpen, setChapterDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-[#080808]/95 backdrop-blur-xl border-b border-neutral-800/90 h-16 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
          : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent border-b border-neutral-800/40 h-20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex flex-col group">
          <span className="text-lg md:text-xl tracking-[0.28em] font-semibold text-[#f4f4f0] group-hover:text-[#a38f78] transition-colors duration-300">
            QUIET BATTLES™
          </span>
          <span className="text-[9px] tracking-[0.38em] text-[#a38f78] uppercase transition-transform duration-300 group-hover:translate-x-1">
            Wear Your Battles
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center space-x-10 text-xs tracking-[0.22em] uppercase">
          <Link
            to="/"
            className={`relative py-1 transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#a38f78] after:origin-left after:transition-transform after:duration-300 ${
              location.pathname === '/'
                ? 'text-[#a38f78] after:scale-x-100'
                : 'text-neutral-300 hover:text-white after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            Manifesto
          </Link>

          <Link
            to="/series/series-01-the-gentle-armor"
            className={`relative py-1 transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#a38f78] after:origin-left after:transition-transform after:duration-300 ${
              location.pathname.includes('/series')
                ? 'text-[#a38f78] after:scale-x-100'
                : 'text-neutral-300 hover:text-white after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            The Archive (Series 01)
          </Link>

          {/* Chapters Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setChapterDropdownOpen(true)}
            onMouseLeave={() => setChapterDropdownOpen(false)}
          >
            <button
              onClick={() => setChapterDropdownOpen(!chapterDropdownOpen)}
              className={`flex items-center gap-1.5 uppercase tracking-[0.22em] hover:text-[#a38f78] transition-colors duration-300 cursor-pointer py-2 ${
                location.pathname.includes('/chapter') ? 'text-[#a38f78]' : 'text-neutral-300'
              }`}
            >
              Chapters (I–V)
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${
                  chapterDropdownOpen ? 'rotate-180 text-[#a38f78]' : ''
                }`}
              />
            </button>

            <div
              className={`absolute left-0 top-full w-80 bg-[#0e0e0e]/95 backdrop-blur-xl border border-neutral-800 shadow-2xl py-2 z-50 transition-all duration-300 origin-top ${
                chapterDropdownOpen
                  ? 'opacity-100 scale-y-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
              }`}
            >
              <div className="px-5 py-2.5 border-b border-neutral-800/80 text-[10px] tracking-[0.28em] text-[#a38f78] flex items-center justify-between">
                <span>SERIES 01 // THE GENTLE ARMOR™</span>
                <Sparkles size={11} />
              </div>
              {CHAPTER_LINKS.map((ch) => (
                <Link
                  key={ch.slug}
                  to={`/chapter/${ch.slug}`}
                  onClick={() => setChapterDropdownOpen(false)}
                  className="group/item flex items-center justify-between px-5 py-3 text-[11px] tracking-[0.15em] text-neutral-300 hover:bg-[#171717] hover:text-white transition-all duration-200 border-b border-neutral-900/80 last:border-none"
                >
                  <div>
                    <span className="text-[#a38f78] font-mono mr-2">0{ch.numeral}</span>
                    <span className="group-hover/item:translate-x-1 inline-block transition-transform duration-200">
                      {ch.title}
                    </span>
                  </div>
                  <span className="text-[9px] text-neutral-600 group-hover/item:text-[#a38f78] transition-colors">
                    ENTER →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <Link
            to="/admin"
            className="flex items-center gap-1.5 px-3.5 py-1.5 border border-neutral-700/80 text-neutral-300 hover:border-[#a38f78] hover:bg-[#a38f78]/10 hover:text-[#a38f78] transition-all duration-300"
          >
            <Shield size={13} />
            CMS Admin
          </Link>
        </nav>

        {/* Right Nav Icons */}
        <div className="flex items-center space-x-5">
          <button
            onClick={() => setIsCartOpen(true)}
            className="group relative flex items-center gap-2.5 text-xs tracking-[0.2em] uppercase text-neutral-200 hover:text-[#a38f78] transition-colors duration-300 cursor-pointer"
          >
            <ShoppingBag
              size={18}
              className="group-hover:-translate-y-0.5 transition-transform duration-300"
            />
            <span className="hidden sm:inline">Archive Bag</span>
            <span className="w-5 h-5 rounded-full bg-[#a38f78] text-black font-bold text-[11px] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              {cartCount}
            </span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-neutral-300 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c0c0c]/98 backdrop-blur-xl border-b border-neutral-800 px-6 py-6 flex flex-col space-y-3 text-xs tracking-[0.22em] uppercase">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-neutral-200">
            01 // Manifesto (Home)
          </Link>
          <Link
            to="/series/series-01-the-gentle-armor"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1.5 text-neutral-200"
          >
            02 // The Archive — Series 01
          </Link>
          <div className="pt-2 pb-1 text-[10px] tracking-[0.3em] text-[#a38f78]">
            Series 01 Chapters:
          </div>
          {CHAPTER_LINKS.map((ch) => (
            <Link
              key={ch.slug}
              to={`/chapter/${ch.slug}`}
              onClick={() => setMobileMenuOpen(false)}
              className="pl-3 py-1 text-[11px] text-neutral-400 hover:text-white"
            >
              Chapter {ch.numeral}: {ch.title}
            </Link>
          ))}
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="pt-3 text-[#a38f78] font-semibold"
          >
            04 // CMS Admin Portal
          </Link>
        </div>
      )}
    </header>
  );
}

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, cartTotal, clearCart } = useCart();
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Form State
  const [recipient, setRecipient] = useState({
    name: 'Satjot Singh Saini',
    email: 'editorial.collector@quietbattles.com',
    address: 'Sector 1, HSR Layout',
    city: 'Bengaluru, Karnataka',
    postalCode: '560102',
  });

  const handleSimulatePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      const generatedId = `QB-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);

      // Safe cart clear fallback
      if (typeof clearCart === 'function') {
        clearCart();
      } else {
        cart.forEach((item) => removeFromCart(item._id, item.size));
      }
    }, 1800);
  };

  const handleCloseAll = () => {
    setCheckoutModalOpen(false);
    setOrderComplete(false);
    setIsCartOpen(false);
  };

  return (
    <>
      {/* 1. SLIDE-OUT CART DRAWER */}
      <div
        className={`fixed inset-0 z-50 flex justify-end transition-all duration-500 ${
          isCartOpen && !checkoutModalOpen
            ? 'pointer-events-auto visible'
            : 'pointer-events-none invisible'
        }`}
      >
        <div
          className={`fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-500 ${
            isCartOpen && !checkoutModalOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsCartOpen(false)}
        />

        <div
          className={`relative w-full max-w-md bg-[#0f0f0f] border-l border-neutral-800 h-full flex flex-col justify-between p-6 z-10 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isCartOpen && !checkoutModalOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
              <div>
                <h3 className="text-sm tracking-[0.25em] uppercase text-white">Your Archive Bag</h3>
                <p className="text-[11px] text-[#a38f78] mt-1 tracking-widest">WEAR YOUR BATTLES™</p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-neutral-400 hover:text-white hover:rotate-90 transition-all duration-300 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-5 max-h-[65vh] overflow-y-auto pr-2">
              {cart.length === 0 ? (
                <p className="text-xs text-neutral-500 py-16 text-center tracking-[0.25em] uppercase">
                  Your archive bag is currently empty.
                </p>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item._id}-${item.size}`}
                    className="flex gap-4 pb-5 border-b border-neutral-800/80 group"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-24 object-cover bg-neutral-900 border border-neutral-800 group-hover:border-[#a38f78] transition-colors"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs tracking-[0.15em] uppercase text-white font-medium">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-[#a38f78] mt-1 uppercase tracking-wider">
                          Size: {item.size} &nbsp;|&nbsp; Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-neutral-200">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => removeFromCart(item._id, item.size)}
                          className="text-neutral-500 hover:text-red-400 transition cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {cart.length > 0 && (
            <div className="pt-6 border-t border-neutral-800">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs tracking-[0.2em] uppercase text-neutral-400">Subtotal</span>
                <span className="text-base font-semibold text-white">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <button
                onClick={() => setCheckoutModalOpen(true)}
                className="w-full py-4 bg-[#f4f4f0] text-black text-xs tracking-[0.25em] uppercase font-semibold hover:bg-[#a38f78] hover:text-white transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                Proceed to Acquisition <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. LUXURY ACQUISITION & CHECKOUT MODAL */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="bg-[#111111] border border-neutral-800 max-w-xl w-full p-6 sm:p-8 relative shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setCheckoutModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            {!orderComplete ? (
              <form onSubmit={handleSimulatePayment} className="space-y-6">
                <div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#a38f78] flex items-center gap-1.5">
                    <Lock size={12} /> Encrypted Acquisition Portal
                  </span>
                  <h3 className="text-2xl font-serif-editorial text-white mt-1">
                    Acquisition & Dispatch Manifest
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Complete recipient details for insured archival garment packaging and transit.
                  </p>
                </div>

                {/* Recipient Details */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={recipient.name}
                      onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-neutral-800 px-3.5 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                      Dispatch Notification Email
                    </label>
                    <input
                      type="email"
                      required
                      value={recipient.email}
                      onChange={(e) => setRecipient({ ...recipient, email: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-neutral-800 px-3.5 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    required
                    value={recipient.address}
                    onChange={(e) => setRecipient({ ...recipient, address: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-neutral-800 px-3.5 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                      City / State
                    </label>
                    <input
                      type="text"
                      required
                      value={recipient.city}
                      onChange={(e) => setRecipient({ ...recipient, city: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-neutral-800 px-3.5 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={recipient.postalCode}
                      onChange={(e) => setRecipient({ ...recipient, postalCode: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-neutral-800 px-3.5 py-2.5 text-xs text-white focus:border-[#a38f78] outline-none"
                    />
                  </div>
                </div>

                {/* Gateway Selection Mock */}
                <div className="pt-2">
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-2">
                    Payment Gateway (Sandbox Environment)
                  </label>
                  <div className="p-3.5 bg-[#0a0a0a] border border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-xs text-neutral-200">
                      <CreditCard size={15} className="text-[#a38f78]" />
                      <span>Razorpay / Stripe Testnet (Simulated Instant Clearance)</span>
                    </div>
                    <span className="text-[10px] tracking-widest uppercase text-emerald-400 bg-emerald-950/60 px-2 py-0.5 border border-emerald-800">
                      Active
                    </span>
                  </div>
                </div>

                {/* Total Line & Action */}
                <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 block">
                      Total Acquisition Value
                    </span>
                    <span className="text-xl font-serif-editorial text-white">
                      ₹{cartTotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full sm:w-auto px-8 py-4 bg-[#a38f78] text-black font-semibold text-xs tracking-[0.25em] uppercase hover:bg-[#f4f4f0] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Authorizing Acquisition...
                      </>
                    ) : (
                      'Authorize & Acquire Artifacts'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Order Confirmation Receipt Screen */
              <div className="text-center py-6 space-y-5 animate-fade-in">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-950/80 border border-emerald-600 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={30} />
                </div>

                <div>
                  <span className="text-[10px] tracking-[0.35em] uppercase text-[#a38f78]">
                    ACQUISITION CONFIRMED // DISPATCH SLIP GENERATED
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif-editorial text-white mt-2">
                    Artifact Allocation Secured
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 max-w-md mx-auto leading-relaxed">
                    Your order has been recorded into the QUIET BATTLES™ archive registry. Complimentary insured dispatch will be prepared for delivery to {recipient.city}.
                  </p>
                </div>

                <div className="bg-[#0a0a0a] border border-neutral-800 p-4 max-w-sm mx-auto text-left space-y-1.5 text-xs text-neutral-300">
                  <div className="flex justify-between">
                    <span className="text-neutral-500 uppercase tracking-wider text-[10px]">
                      Reference Code:
                    </span>
                    <span className="font-mono text-[#a38f78] font-bold">{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 uppercase tracking-wider text-[10px]">
                      Recipient:
                    </span>
                    <span className="text-white">{recipient.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 uppercase tracking-wider text-[10px]">
                      Status:
                    </span>
                    <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">
                      Authorized / In Vault
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleCloseAll}
                    className="px-8 py-3.5 bg-[#f4f4f0] text-black text-xs tracking-[0.25em] uppercase font-semibold hover:bg-[#a38f78] hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
                  >
                    <PackageCheck size={15} /> Return to Archive
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}