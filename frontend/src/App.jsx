import { useState } from 'react';
import { useCart } from './context/CartContext';
import { ArchiveBagDrawer, CmsAdminModal } from './pages/StoreFrontPages';

// Inside your main App component or Navbar:
export default function App() {
  const { totalCount, setIsBagOpen } = useCart();
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <>
      {/* 1. Header with dynamic triggers */}
      <header className="fixed top-0 left-0 w-full z-40 bg-black/80 backdrop-blur-md border-b border-neutral-900 px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-base font-serif-editorial tracking-[0.25em] text-white">
          QUIET BATTLES™
        </Link>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsAdminOpen(true)}
            className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 hover:text-[#a38f78] border border-neutral-800 px-3 py-1.5"
          >
            CMS Admin
          </button>

          <button
            onClick={() => setIsBagOpen(true)}
            className="text-[10px] tracking-[0.2em] uppercase text-white flex items-center gap-2 hover:text-[#a38f78]"
          >
            Archive Bag ({totalCount})
          </button>
        </div>
      </header>

      {/* 2. Global Drawers and Modals */}
      <ArchiveBagDrawer />
      <CmsAdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

      {/* ... Your Routes ... */}
    </>
  );
}