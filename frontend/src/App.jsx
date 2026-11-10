// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, ShoppingBag } from 'lucide-react';
import { CartProvider, useCart } from './context/CartContext';
import {
  HomePage,
  SeriesArchivePage,
  ChapterDetailPage,
  ProductDetailPage,
  ArchiveBagDrawer,
  CmsAdminModal
} from './pages/StoreFrontPages';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Navigation({ onOpenAdmin }) {
  const { totalCount, setIsBagOpen } = useCart();

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-900/80 px-5 sm:px-8 py-4 flex justify-between items-center transition-all duration-300">
      <Link to="/" className="flex items-center gap-2 group">
        <span className="text-sm sm:text-base font-serif-editorial tracking-[0.25em] text-[#f4f4f0] group-hover:text-[#a38f78] transition-colors">
          QUIET BATTLES™
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.25em] uppercase text-neutral-400">
        <Link to="/" className="hover:text-[#f4f4f0] transition-colors">Manifesto</Link>
        <Link to="/series/series-01" className="hover:text-[#f4f4f0] transition-colors">The Archive (Series 01)</Link>
        <Link to="/chapter/chapter-1-the-weight-of-silence" className="hover:text-[#f4f4f0] transition-colors">Chapters (I–V)</Link>
      </nav>

      <div className="flex items-center gap-4 sm:gap-6">
        <button
          onClick={onOpenAdmin}
          className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 hover:text-[#a38f78] border border-neutral-800 hover:border-[#a38f78]/60 px-3 py-1.5 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Shield size={12} />
          <span className="hidden sm:inline">CMS Admin</span>
        </button>

        <button
          onClick={() => setIsBagOpen(true)}
          className="text-[10px] tracking-[0.22em] uppercase text-[#f4f4f0] hover:text-[#a38f78] flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ShoppingBag size={14} className="text-[#a38f78]" />
          <span>Archive Bag</span>
          <span className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 text-[9px] flex items-center justify-center text-[#a38f78] font-bold">
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

      <footer className="border-t border-neutral-900 bg-[#0c0c0c] py-12 px-6 text-center text-[10px] tracking-[0.3em] uppercase text-neutral-500">
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