// frontend/src/App.jsx
import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, ShoppingBag, ChevronDown, ArrowRight } from 'lucide-react';
import { CartProvider, useCart } from './context/CartContext';
import {
  HomePage,
  SeriesArchivePage,
  ChapterDetailPage,
  ProductDetailPage,
  ArchiveBagDrawer,
  CmsAdminModal,
  API_BASE
} from './pages/StoreFrontPages';

const FALLBACK_CHAPTERS = [
  { chapterNumber: 1, roman: 'I', title: 'The Weight of Silence', slug: 'chapter-1-the-weight-of-silence' },
  { chapterNumber: 2, roman: 'II', title: 'The Armor of Solitude', slug: 'chapter-2-the-armor-of-solitude' },
  { chapterNumber: 3, roman: 'III', title: 'The Monastic Uniform', slug: 'chapter-3-the-monastic-uniform' },
  { chapterNumber: 4, roman: 'IV', title: 'The Anatomy of Struggle', slug: 'chapter-4-the-anatomy-of-struggle' },
  { chapterNumber: 5, roman: 'V', title: 'The Stoic Ascension', slug: 'chapter-5-the-stoic-ascension' },
];

const ROMAN_MAP = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function Navigation({ onOpenAdmin }) {
  const { totalCount, setIsBagOpen } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chapters, setChapters] = useState(FALLBACK_CHAPTERS);
  const dropdownRef = useRef(null);

  // Fetch live chapters from MongoDB Atlas if available
  useEffect(() => {
    fetch(`${API_BASE}/chapters`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((ch, idx) => ({
            ...ch,
            roman: ROMAN_MAP[ch.chapterNumber] || ROMAN_MAP[idx + 1] || `${idx + 1}`,
            slug: ch.slug || `chapter-${idx + 1}`
          }));
          setChapters(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#0a0a0a]/85 backdrop-blur-md border-b border-neutral-900/80 px-5 sm:px-8 py-3.5 flex justify-between items-center transition-all duration-300">
      
      {/* 1. BRAND LOCKUP */}
      <Link to="/" className="group flex flex-col items-start select-none">
        <span className="text-sm sm:text-base font-serif-editorial tracking-[0.28em] text-[#f4f4f0] group-hover:text-[#a38f78] transition-colors duration-300">
          QUIET BATTLES™
        </span>
        <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.35em] text-neutral-500 uppercase -mt-0.5 group-hover:text-neutral-300 transition-colors duration-300">
          Wear Your Battles
        </span>
      </Link>

      {/* 2. CENTER EDITORIAL NAV LINKS */}
      <nav className="hidden md:flex items-center gap-9 text-[11px] tracking-[0.25em] uppercase">
        
        {/* Manifesto Link */}
        <Link
          to="/"
          className="relative py-1 text-neutral-400 hover:text-[#f4f4f0] transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#a38f78] hover:after:w-full after:transition-all after:duration-300"
        >
          Manifesto
        </Link>

        {/* The Archive Series Link */}
        <Link
          to="/series/series-01"
          className="relative py-1 text-neutral-400 hover:text-[#f4f4f0] transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#a38f78] hover:after:w-full after:transition-all after:duration-300"
        >
          The Archive (Series 01)
        </Link>

        {/* Chapters Dropdown */}
        <div
          ref={dropdownRef}
          className="relative group"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative py-1 text-neutral-400 hover:text-[#f4f4f0] transition-colors duration-300 flex items-center gap-1.5 cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#a38f78] group-hover:after:w-full after:transition-all after:duration-300"
          >
            <span>Chapters (I–V)</span>
            <ChevronDown
              size={12}
              className={`text-[#a38f78] transition-transform duration-300 ${
                isDropdownOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'
              }`}
            />
          </button>

          {/* Floating Dropdown Menu */}
          <div
            className={`absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-72 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isDropdownOpen
                ? 'opacity-100 translate-y-0 pointer-events-auto visible'
                : 'opacity-0 -translate-y-2 pointer-events-none invisible'
            }`}
          >
            <div className="bg-[#0e0e0e]/95 backdrop-blur-xl border border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.9)] divide-y divide-neutral-900 overflow-hidden">
              <div className="px-4 py-2.5 bg-[#090909] border-b border-neutral-900 flex justify-between items-center">
                <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#a38f78]">
                  Series 01 Chronicles
                </span>
                <span className="text-[9px] font-mono text-neutral-600">5 Texts</span>
              </div>

              {chapters.map((ch, idx) => (
                <Link
                  key={ch._id || ch.slug || idx}
                  to={`/chapter/${ch.slug}`}
                  onClick={() => setIsDropdownOpen(false)}
                  className="group/item flex items-center justify-between px-4 py-3 hover:bg-[#151515] transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif-editorial text-xs text-[#a38f78] w-5 text-right font-bold group-hover/item:text-white transition-colors">
                      {ch.roman || ROMAN_MAP[idx + 1]}
                    </span>
                    <span className="font-serif-editorial text-xs text-neutral-300 group-hover/item:text-[#f4f4f0] group-hover/item:translate-x-1 transition-all duration-200 line-clamp-1">
                      {ch.title}
                    </span>
                  </div>
                  <ArrowRight
                    size={11}
                    className="text-neutral-600 group-hover/item:text-[#a38f78] group-hover/item:translate-x-1 transition-all duration-200 shrink-0"
                  />
                </Link>
              ))}

              <Link
                to="/series/series-01"
                onClick={() => setIsDropdownOpen(false)}
                className="block px-4 py-2.5 bg-[#080808] text-center font-mono text-[9px] tracking-[0.25em] uppercase text-neutral-400 hover:text-[#a38f78] transition-colors"
              >
                Inspect Complete Series Vault →
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 3. RIGHT CONTROLS: CMS ADMIN & ARCHIVE BAG */}
      <div className="flex items-center gap-3 sm:gap-5">
        
        {/* CMS Admin Button */}
        <button
          onClick={onOpenAdmin}
          className="group text-[10px] tracking-[0.22em] uppercase text-neutral-400 hover:text-[#a38f78] border border-neutral-800 hover:border-[#a38f78]/60 hover:shadow-[0_0_15px_rgba(163,143,120,0.2)] px-3 sm:px-3.5 py-1.5 transition-all duration-300 flex items-center gap-1.5 cursor-pointer bg-[#0c0c0c]"
        >
          <Shield size={12} className="text-[#a38f78] group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-mono">CMS Admin</span>
        </button>

        {/* Archive Bag Trigger */}
        <button
          onClick={() => setIsBagOpen(true)}
          className="group text-[10px] tracking-[0.22em] uppercase text-[#f4f4f0] hover:text-[#a38f78] flex items-center gap-2 transition-colors duration-300 cursor-pointer pl-1"
        >
          <ShoppingBag size={14} className="text-[#a38f78] group-hover:scale-110 transition-transform duration-300" />
          <span className="hidden sm:inline font-mono">Archive Bag</span>
          <span className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 text-[9px] flex items-center justify-center text-[#a38f78] font-bold group-hover:border-[#a38f78] group-hover:bg-[#1a1714] transition-all duration-300 font-mono">
            {totalCount}
          </span>
        </button>
      </div>
    </header>
  );
}

function AppLayout() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f4f4f0] flex flex-col font-sans selection:bg-[#a38f78] selection:text-black">
      <ScrollToTop />
      <Navigation onOpenAdmin={() => setIsAdminOpen(true)} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/series/:slug" element={<SeriesArchivePage />} />
          <Route path="/chapter/:slug" element={<ChapterDetailPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </main>

      <ArchiveBagDrawer />
      <CmsAdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

      <footer className="border-t border-neutral-900 bg-[#0c0c0c] py-12 px-6 text-center text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-mono">
        <p>© 2026 QUIET BATTLES™ // ARCHITECTURAL STREETWEAR // ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Router>
        <AppLayout />
      </Router>
    </CartProvider>
  );
}