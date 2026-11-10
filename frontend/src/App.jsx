import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { Navbar, CartDrawer } from "./components/NavbarandCart";
import { 
  HomePage, 
  SeriesArchivePage, 
  ChapterDetailPage, 
  ProductDetailPage 
} from "./pages/StoreFrontPages";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] font-sans antialiased selection:bg-[#f5f5f5] selection:text-[#0a0a0a]">
          <Navbar />
          <CartDrawer />
          <main>
            <Routes>
              {/* Public Storefront Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/series/:slug" element={<SeriesArchivePage />} />
              <Route path="/chapter/:slug" element={<ChapterDetailPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />

              {/* Administrative CMS Vault */}
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Catch-all fallback */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;