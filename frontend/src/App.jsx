// frontend/src/App.jsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Navbar, CartDrawer } from './components/NavbarAndCart';
import {
  HomePage,
  SeriesArchivePage,
  ChapterDetailPage,
  ProductDetailPage,
} from './pages/StorefrontPages';
import { AdminDashboard } from './pages/AdminDashboard';

// Automatically scrolls to the top of the window whenever the route changes
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-[#0a0a0a] text-[#f4f4f0] flex flex-col justify-between">
          <Navbar />
          <CartDrawer />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/series/:slug" element={<SeriesArchivePage />} />
              <Route path="/chapter/:slug" element={<ChapterDetailPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>

          <footer className="border-t border-neutral-900 py-12 px-6 text-center text-xs tracking-[0.25em] uppercase text-neutral-500">
            QUIET BATTLES™ — WEAR YOUR BATTLES // DEMO ASSESSMENT BUILD
          </footer>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}