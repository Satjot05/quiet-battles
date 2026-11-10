// frontend/src/pages/StorefrontPages.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  BookOpen,
  Layers,
  Ruler,
  X,
  ChevronDown,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const API_BASE = import.meta.env.VITE_API_URL || "https://quiet-battles-api.onrender.com/api";

// ============================================================================
// REUSABLE SCROLL-REVEAL ANIMATION WRAPPER (IntersectionObserver)
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
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ============================================================================
// INFINITE LUXURY MARQUEE BANNER
// ============================================================================
function EditorialMarquee() {
  const items = [
    'QUIET BATTLES™ ARCHIVE',
    'WEAR YOUR BATTLES',
    'SERIES 01 — THE GENTLE ARMOR™',
    '480 GSM ARCHITECTURAL SILHOUETTES',
    'CRAFTED FOR SOLITUDE & ENDURANCE',
  ];

  return (
    <div className="w-full overflow-hidden bg-[#0e0e0e] border-y border-neutral-800/90 py-3.5 select-none">
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
// SCOPE A: HOMEPAGE DEVELOPMENT
// ============================================================================
export function HomePage() {
  const [seriesData, setSeriesData] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    document.title = 'QUIET BATTLES™ | Wear Your Battles — Narrative Luxury Streetwear';

    fetch(`${API_BASE}/series/series-01-the-gentle-armor`)
      .then((res) => res.json())
      .then((data) => setSeriesData(data))
      .catch((err) => console.error('API Error:', err));

    fetch(`${API_BASE}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('API Error:', err));
  }, []);

  const primarySeries = seriesData?.series;
  const chapters = seriesData?.chapters || [];

  return (
    <div className="bg-film-grain">
      {/* 1. CINEMATIC HERO SECTION WITH KEN BURNS MOTION */}
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
              <span className="text-[9px] sm:text-[10px] tracking-[0.35em] sm:tracking-[0.4em] uppercase text-[#a38f78]">
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
                to={`/series/${primarySeries?.slug || 'series-01-the-gentle-armor'}`}
                className="w-full sm:w-auto justify-center group px-8 sm:px-9 py-4 bg-[#f4f4f0] text-black text-xs tracking-[0.25em] uppercase font-semibold hover:bg-[#a38f78] hover:text-white transition-all duration-500 flex items-center gap-3 shadow-[0_0_30px_rgba(244,244,240,0.15)]"
              >
                Enter The Archive
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1.5 transition-transform duration-300"
                />
              </Link>
              <Link
                to="/chapter/chapter-1-the-weight-of-silence"
                className="w-full sm:w-auto text-center px-8 sm:px-9 py-4 border border-neutral-700 bg-black/40 backdrop-blur-xs text-neutral-200 text-xs tracking-[0.25em] uppercase hover:border-[#a38f78] hover:text-[#a38f78] transition-all duration-300"
              >
                Read Chapter I Story
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-neutral-500 animate-float">
          <span className="text-[9px] tracking-[0.35em] uppercase">Scroll to Explore</span>
          <ChevronDown size={16} className="text-[#a38f78]" />
        </div>
      </section>

      {/* INFINITE EDITORIAL TICKER */}
      <EditorialMarquee />

      {/* 2. BRAND INTRODUCTION / MANIFESTO */}
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

          <Reveal
            delay={200}
            className="md:col-span-7 space-y-5 text-sm text-neutral-300 leading-relaxed font-light"
          >
            <p className="text-sm sm:text-base text-neutral-200">
              QUIET BATTLES™ rejects seasonal fast fashion. Instead, our archive is organized into
              <span className="text-[#a38f78] font-medium"> Series</span> and
              <span className="text-[#a38f78] font-medium"> Chapters</span>. Every garment begins as
              a written meditation on human endurance—translated into 480 GSM organic cotton,
              exposed reverse seamlines, and protective silhouettes.
            </p>
            <p className="text-neutral-400">
              When you wear a piece from our Archive, you aren’t wearing a seasonal trend. You are
              wearing a documented chapter of lived resilience.
            </p>

            {/* 3 Pillar Highlights */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-neutral-800/80">
              <div>
                <span className="text-lg sm:text-xl font-serif-editorial text-[#a38f78]">01</span>
                <p className="text-[10px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white mt-1">
                  Narrative First
                </p>
              </div>
              <div>
                <span className="text-lg sm:text-xl font-serif-editorial text-[#a38f78]">
                  480 GSM
                </span>
                <p className="text-[10px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white mt-1">
                  Heavy Armor
                </p>
              </div>
              <div>
                <span className="text-lg sm:text-xl font-serif-editorial text-[#a38f78]">
                  5 Chapters
                </span>
                <p className="text-[10px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white mt-1">
                  Per Series
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. FEATURED COLLECTION: SERIES 01 - THE GENTLE ARMOR */}
      {primarySeries && (
        <section className="py-20 sm:py-28 px-5 sm:px-6 max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-14">
              <div>
                <span className="text-xs tracking-[0.35em] uppercase text-[#a38f78]">
                  {primarySeries.seriesCode} // Demonstration Collection
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif-editorial mt-2 text-white">
                  {primarySeries.title}
                </h2>
              </div>
              <Link
                to={`/series/${primarySeries.slug}`}
                className="group mt-4 md:mt-0 text-xs tracking-[0.25em] uppercase text-[#a38f78] flex items-center gap-2"
              >
                Explore Full Series Archive
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1.5 transition-transform duration-300"
                />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="group grid md:grid-cols-12 gap-8 md:gap-10 bg-[#101010] border border-neutral-800 hover:border-[#a38f78]/60 transition-all duration-700 p-5 sm:p-8 md:p-12 items-center shadow-2xl">
              <div className="md:col-span-6 overflow-hidden border border-neutral-800 relative h-[260px] sm:h-[360px] md:h-[440px]">
                <img
                  src={primarySeries.heroImage}
                  alt={primarySeries.title}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-black/85 backdrop-blur-md px-3 py-1.5 border border-neutral-700">
                  <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#a38f78]">
                    {primarySeries.releaseSeason}
                  </span>
                </div>
              </div>

              <div className="md:col-span-6 space-y-5 sm:space-y-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 text-[10px] tracking-[0.25em] uppercase bg-neutral-900 border border-neutral-700 text-[#a38f78]">
                  <Shield size={12} /> 5 Chapters // 5 Connected Artifacts
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-serif-editorial text-white leading-snug">
                  “{primarySeries.subtitle}”
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {primarySeries.description}
                </p>
                <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link
                    to={`/series/${primarySeries.slug}`}
                    className="text-center px-7 sm:px-8 py-4 bg-[#f4f4f0] text-black text-xs tracking-[0.22em] uppercase font-semibold hover:bg-[#a38f78] hover:text-white transition-all duration-300"
                  >
                    Open Series 01 Vault
                  </Link>
                  {products[0] && (
                    <Link
                      to={`/product/${products[0]._id}`}
                      className="text-center px-7 sm:px-8 py-4 border border-neutral-700 text-neutral-200 text-xs tracking-[0.22em] uppercase hover:border-[#a38f78] hover:text-[#a38f78] transition-all duration-300"
                    >
                      Inspect Flagship Garment
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          {/* 5-Chapter Interactive Preview Strip */}
          {chapters.length > 0 && (
            <div className="mt-16 sm:mt-20">
              <Reveal>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
                  <p className="text-xs tracking-[0.3em] uppercase text-neutral-400">
                    The 5 Chapters of Series 01 // Interactive Index
                  </p>
                  <span className="text-[11px] tracking-[0.2em] uppercase text-[#a38f78]">
                    Select a Chapter to Read
                  </span>
                </div>
              </Reveal>

              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
                {chapters.map((ch, idx) => (
                  <Reveal key={ch._id} delay={idx * 100}>
                    <Link
                      to={`/chapter/${ch.slug}`}
                      className="group relative h-72 sm:h-80 bg-[#111111] border border-neutral-800 hover:border-[#a38f78] transition-all duration-500 flex flex-col justify-end overflow-hidden p-5 hover:-translate-y-2 shadow-lg"
                    >
                      <img
                        src={ch.heroImage}
                        alt={ch.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover opacity-35 grayscale-[60%] group-hover:grayscale-0 group-hover:opacity-65 group-hover:scale-110 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

                      <div className="relative z-10">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-[#a38f78] block">
                          Chapter {ch.romanNumeral}
                        </span>
                        <h4 className="text-lg font-serif-editorial text-white mt-1 group-hover:text-[#a38f78] transition-colors">
                          {ch.title}
                        </h4>
                        <p className="text-[11px] text-neutral-400 mt-1.5 line-clamp-2">
                          {ch.subtitle}
                        </p>
                        <span className="mt-4 pt-3 border-t border-neutral-800/80 text-[10px] tracking-[0.22em] uppercase text-neutral-200 flex items-center justify-between">
                          <span>Enter Chapter</span>
                          <ArrowRight
                            size={13}
                            className="text-[#a38f78] group-hover:translate-x-1 transition-transform"
                          />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

// ============================================================================
// SCOPE B: THE ARCHIVE & SERIES LANDING PAGE (5 CHAPTERS)
// ============================================================================
export function SeriesArchivePage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/series/${slug || 'series-01-the-gentle-armor'}`)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        if (resData?.series) {
          document.title = `QUIET BATTLES™ | ${resData.series.seriesCode} – ${resData.series.title}`;
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-36 text-center text-xs tracking-[0.3em] uppercase text-neutral-500 animate-pulse">
        Unlocking Archive Series...
      </div>
    );
  }

  if (!data || !data.series) {
    return <div className="pt-36 text-center text-neutral-400">Series not found.</div>;
  }

  const { series, chapters } = data;

  return (
    <div className="pt-20 bg-film-grain">
      {/* Series Header Banner with Background Image */}
      <section className="relative py-20 sm:py-28 px-5 sm:px-6 border-b border-neutral-800 overflow-hidden">
        <img
          src={series.heroImage}
          alt={series.title}
          className="absolute inset-0 w-full h-full object-cover opacity-20 animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-black/90" />

        <Reveal className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="text-xs tracking-[0.38em] uppercase text-[#a38f78]">
            THE ARCHIVE // {series.seriesCode}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif-editorial text-white mt-4">
            {series.title}
          </h1>
          <p className="text-base sm:text-lg italic text-[#a38f78] mt-4 font-serif-editorial">
            “{series.subtitle}”
          </p>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mx-auto mt-6 leading-relaxed font-light">
            {series.description}
          </p>
        </Reveal>
      </section>

      <EditorialMarquee />

      {/* Five Chapters Grid */}
      <section className="py-16 sm:py-24 px-5 sm:px-6 max-w-7xl mx-auto">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-10 sm:mb-12 border-b border-neutral-800 pb-4">
            <span className="text-xs tracking-[0.25em] uppercase text-neutral-400 flex items-center gap-2">
              <Layers size={15} className="text-[#a38f78]" />
              Archive Index — {chapters.length} Chapters Recorded
            </span>
            <span className="text-xs tracking-[0.2em] uppercase text-[#a38f78]">
              Select a Chapter to Experience
            </span>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-9">
          {chapters.map((ch, idx) => (
            <Reveal key={ch._id} delay={idx * 100}>
              <Link
                to={`/chapter/${ch.slug}`}
                className="group bg-[#111111] border border-neutral-800 hover:border-[#a38f78] transition-all duration-500 flex flex-col justify-between overflow-hidden hover:-translate-y-2 shadow-xl h-full"
              >
                <div>
                  <div className="relative h-64 sm:h-80 overflow-hidden bg-neutral-900">
                    <img
                      src={ch.heroImage}
                      alt={ch.title}
                      loading="lazy"
                      className="w-full h-full object-cover grayscale-[45%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md px-3.5 py-1.5 border border-neutral-700">
                      <span className="text-[11px] tracking-[0.25em] uppercase text-[#a38f78]">
                        Chapter {ch.romanNumeral}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7">
                    <h3 className="text-xl sm:text-2xl font-serif-editorial text-white group-hover:text-[#a38f78] transition-colors">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                      {ch.subtitle}
                    </p>
                  </div>
                </div>

                <div className="px-6 sm:px-7 py-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px] tracking-[0.2em] uppercase text-neutral-300 bg-[#0d0d0d]">
                  <span className="truncate pr-2">
                    Artifact: {ch.linkedProduct ? ch.linkedProduct.name : 'Unassigned'}
                  </span>
                  <ArrowRight
                    size={14}
                    className="text-[#a38f78] shrink-0 group-hover:translate-x-1.5 transition-transform"
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// SCOPE C: CHAPTER DEVELOPMENT (STORYTELLING + READING BAR + CONNECTED PRODUCT)
// ============================================================================
export function ChapterDetailPage() {
  const { slug } = useParams();
  const [chapter, setChapter] = useState(null);
  const [allChapters, setAllChapters] = useState([]);
  const [readProgress, setReadProgress] = useState(0);

  // Reading Progress Bar Calculation
  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setReadProgress(progress);
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/chapters/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setChapter(data);
        if (data?.title) {
          document.title = `QUIET BATTLES™ | Chapter ${data.romanNumeral}: ${data.title}`;
        }
        if (data?.seriesId?.slug) {
          fetch(`${API_BASE}/series/${data.seriesId.slug}`)
            .then((r) => r.json())
            .then((sData) => setAllChapters(sData.chapters || []));
        }
      })
      .catch((err) => console.error(err));
  }, [slug]);

  if (!chapter) {
    return (
      <div className="pt-36 text-center text-xs tracking-[0.3em] uppercase text-neutral-500 animate-pulse">
        Loading Chapter Narrative...
      </div>
    );
  }

  const product = chapter.linkedProduct;
  const currentIndex = allChapters.findIndex((c) => c.slug === chapter.slug);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex > -1 && currentIndex < allChapters.length - 1
      ? allChapters[currentIndex + 1]
      : null;

  return (
    <div className="pt-20 bg-film-grain">
      {/* Top Fixed Editorial Reading Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-[3px] z-50 bg-transparent">
        <div
          className="h-full bg-[#a38f78] transition-all duration-150 shadow-[0_0_12px_#a38f78]"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* 1. Chapter Hero with Slow Ken Burns Motion */}
      <section className="relative h-[65vh] sm:h-[75vh] flex items-end overflow-hidden border-b border-neutral-800">
        <img
          src={chapter.heroImage}
          alt={chapter.title}
          className="absolute inset-0 w-full h-full object-cover opacity-45 animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 pb-12 sm:pb-16 w-full">
          <Reveal>
            <Link
              to={`/series/${chapter.seriesId?.slug || 'series-01-the-gentle-armor'}`}
              className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#a38f78] hover:text-white transition-colors"
            >
              <ArrowLeft size={13} /> Back to {chapter.seriesId?.title || 'Series 01'}
            </Link>
            <p className="text-xs tracking-[0.35em] uppercase text-neutral-400 mt-4 sm:mt-5">
              CHAPTER {chapter.romanNumeral} OF V // NARRATIVE ARCHIVE
            </p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif-editorial text-white mt-2">
              {chapter.title}
            </h1>
            <p className="text-xs sm:text-base text-neutral-300 mt-3">{chapter.subtitle}</p>
          </Reveal>
        </div>
      </section>

      {/* 2. Editorial Pull Quote & Narrative Paragraphs */}
      <section className="py-16 sm:py-24 px-5 sm:px-6 max-w-3xl mx-auto">
        {chapter.pullQuote && (
          <Reveal>
            <blockquote className="border-l-2 border-[#a38f78] pl-5 sm:pl-7 py-3 my-6 sm:my-8 text-xl sm:text-2xl md:text-3xl font-serif-editorial italic text-[#f4f4f0] leading-relaxed bg-[#111111]/60 pr-4 sm:pr-6">
              “{chapter.pullQuote}”
            </blockquote>
          </Reveal>
        )}

        <div className="space-y-6 sm:space-y-7 text-sm sm:text-base text-neutral-300 leading-relaxed font-light mt-10 sm:mt-12">
          {chapter.storyParagraphs?.map((paragraph, idx) => (
            <Reveal key={idx} delay={idx * 100}>
              <p
                className={
                  idx === 0
                    ? 'first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-serif-editorial first-letter:text-[#a38f78] first-letter:mr-3 sm:first-letter:mr-4 first-letter:float-left first-letter:leading-none'
                    : ''
                }
              >
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 3. Visual Mood Gallery */}
      {chapter.moodGallery && chapter.moodGallery.length > 0 && (
        <section className="py-10 sm:py-12 px-5 sm:px-6 max-w-6xl mx-auto">
          <Reveal>
            <p className="text-xs tracking-[0.3em] uppercase text-[#a38f78] mb-6">
              Visual Study // Chapter {chapter.romanNumeral} Lookbook
            </p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {chapter.moodGallery.map((imgUrl, index) => (
              <Reveal key={index} delay={index * 150}>
                <div className="overflow-hidden border border-neutral-800 group h-[260px] sm:h-[340px] md:h-[420px]">
                  <img
                    src={imgUrl}
                    alt={`Mood ${index + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* 4. Connected Chapter Artifact (Links Chapter -> Product) */}
      {product && (
        <section className="py-16 sm:py-20 px-5 sm:px-6 max-w-5xl mx-auto">
          <Reveal>
            <div className="group bg-[#111111] border border-neutral-800 hover:border-[#a38f78] transition-all duration-500 p-6 sm:p-8 md:p-12 grid md:grid-cols-12 gap-6 sm:gap-8 items-center shadow-2xl">
              <div className="md:col-span-5 overflow-hidden border border-neutral-800 h-64 sm:h-80">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="md:col-span-7 space-y-4">
                <span className="text-[11px] tracking-[0.3em] uppercase text-[#a38f78] flex items-center gap-2">
                  <BookOpen size={14} /> Connected Chapter {chapter.romanNumeral} Artifact
                </span>
                <h3 className="text-2xl md:text-3xl font-serif-editorial text-white">
                  {product.name}
                </h3>
                <p className="text-xs tracking-[0.2em] uppercase text-neutral-400">
                  ₹{product.price?.toLocaleString('en-IN')} &nbsp;//&nbsp; SKU: {product.sku}
                </p>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {product.description}
                </p>
                <div className="pt-3 sm:pt-4">
                  <Link
                    to={`/product/${product._id}`}
                    className="w-full sm:w-auto justify-center inline-flex items-center gap-3 px-8 py-4 bg-[#f4f4f0] text-black text-xs tracking-[0.25em] uppercase font-semibold hover:bg-[#a38f78] hover:text-white transition-all duration-300"
                  >
                    Inspect & Acquire Artifact <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* 5. Sequential Chapter Pagination (Previous / Next Chapter) */}
      <section className="py-12 px-5 sm:px-6 max-w-5xl mx-auto border-t border-neutral-900">
        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
          {prevChapter ? (
            <Link
              to={`/chapter/${prevChapter.slug}`}
              className="group p-5 sm:p-6 bg-[#111111] border border-neutral-800 hover:border-[#a38f78] transition-all duration-300 flex flex-col items-start"
            >
              <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 flex items-center gap-2">
                <ArrowLeft
                  size={13}
                  className="text-[#a38f78] group-hover:-translate-x-1 transition-transform"
                />
                Previous Chapter
              </span>
              <span className="text-base sm:text-lg font-serif-editorial text-white mt-2 group-hover:text-[#a38f78] transition-colors">
                Chapter {prevChapter.romanNumeral}: {prevChapter.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}

          {nextChapter && (
            <Link
              to={`/chapter/${nextChapter.slug}`}
              className="group p-5 sm:p-6 bg-[#111111] border border-neutral-800 hover:border-[#a38f78] transition-all duration-300 flex flex-col items-end text-right"
            >
              <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 flex items-center gap-2">
                Next Chapter
                <ArrowRight
                  size={13}
                  className="text-[#a38f78] group-hover:translate-x-1 transition-transform"
                />
              </span>
              <span className="text-base sm:text-lg font-serif-editorial text-white mt-2 group-hover:text-[#a38f78] transition-colors">
                Chapter {nextChapter.romanNumeral}: {nextChapter.title}
              </span>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// SCOPE D: PRODUCT PAGE (GALLERY, SIZES, SIZE GUIDE MODAL, ADD TO CART)
// ============================================================================
export function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('L');
  const [activeImage, setActiveImage] = useState(0);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setActiveImage(0);
        if (data?.name) {
          document.title = `QUIET BATTLES™ | ${data.name}`;
        }
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) {
    return (
      <div className="pt-36 text-center text-xs tracking-[0.3em] uppercase text-neutral-500 animate-pulse">
        Loading Garment Specifications...
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, selectedSize);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 sm:pb-24 px-5 sm:px-6 max-w-7xl mx-auto bg-film-grain">
      <div className="grid md:grid-cols-12 gap-8 md:gap-12">
        {/* Left: Product Image Gallery with Responsive Mobile Height */}
        <Reveal className="md:col-span-7 space-y-4">
          <div className="bg-[#111111] border border-neutral-800 overflow-hidden h-[340px] sm:h-[450px] md:h-[540px] group">
            <img
              src={product.images?.[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {product.images?.length > 1 && (
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-24 sm:w-24 sm:h-28 shrink-0 border overflow-hidden cursor-pointer transition-all duration-300 ${
                    activeImage === idx
                      ? 'border-[#a38f78] scale-105'
                      : 'border-neutral-800 opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </Reveal>

        {/* Right: Specifications, Size Selection & Add to Cart */}
        <Reveal delay={150} className="md:col-span-5 flex flex-col justify-between">
          <div className="space-y-5 sm:space-y-6">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-[#a38f78]">
                ARCHIVE ARTIFACT // {product.sku}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif-editorial text-white mt-2">
                {product.name}
              </h1>
              <p className="text-xl sm:text-2xl text-neutral-200 mt-3 font-light">
                ₹{product.price?.toLocaleString('en-IN')}
              </p>
            </div>

            {product.tagline && (
              <p className="text-xs tracking-[0.2em] uppercase text-[#a38f78] border-y border-neutral-800 py-3.5">
                “{product.tagline}”
              </p>
            )}

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="pt-2">
              <div className="flex justify-between items-center text-xs tracking-[0.2em] uppercase mb-3">
                <span className="text-neutral-300">Select Size</span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-[#a38f78] hover:underline flex items-center gap-1 cursor-pointer uppercase tracking-wider"
                >
                  <Ruler size={13} /> Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                {(product.sizes || ['S', 'M', 'L', 'XL']).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3.5 text-xs tracking-[0.2em] uppercase border transition-all duration-200 cursor-pointer ${
                      selectedSize === size
                        ? 'bg-[#f4f4f0] text-black border-[#f4f4f0] font-bold scale-[1.03]'
                        : 'bg-transparent text-neutral-300 border-neutral-700 hover:border-[#a38f78]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAdd}
              className="w-full py-4 bg-[#a38f78] text-black font-semibold text-xs tracking-[0.22em] sm:tracking-[0.25em] uppercase hover:bg-[#f4f4f0] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-4 shadow-[0_0_25px_rgba(163,143,120,0.25)]"
            >
              {addedFeedback ? (
                <>
                  <Check size={16} /> Added to Archive Bag
                </>
              ) : (
                `Add to Archive Bag — ₹${product.price?.toLocaleString('en-IN')}`
              )}
            </button>

            {/* Fabric & Construction Details */}
            {product.fabricDetails?.length > 0 && (
              <div className="pt-6 border-t border-neutral-800">
                <h4 className="text-xs tracking-[0.25em] uppercase text-neutral-400 mb-3">
                  Material & Construction Specifications
                </h4>
                <ul className="space-y-2.5 text-xs text-neutral-300">
                  {product.fabricDetails.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a38f78] shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {/* Size Guide Modal (Mobile-Safe Horizontal Scroll) */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#111111] border border-[#a38f78]/50 max-w-lg w-full p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setSizeGuideOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#a38f78]">
              QUIET BATTLES™ // SPECIFICATIONS
            </span>
            <h3 className="text-xl sm:text-2xl font-serif-editorial text-white mt-1">
              Garment Measurement Matrix
            </h3>
            <p className="text-xs text-neutral-400 mt-2">
              All silhouettes are cut with a relaxed, drop-shoulder architectural drape. Take your
              normal size for the intended oversized fit.
            </p>
            <div className="overflow-x-auto mt-5">
              <table className="w-full text-left text-xs text-neutral-300 border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 text-[#a38f78] uppercase tracking-wider">
                    <th className="py-2.5 pr-3">Size</th>
                    <th className="py-2.5 px-3">Chest (in)</th>
                    <th className="py-2.5 px-3">Length (in)</th>
                    <th className="py-2.5 pl-3">Shoulder (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  <tr>
                    <td className="py-2.5 pr-3 font-semibold text-white">S</td>
                    <td className="py-2.5 px-3">44"</td>
                    <td className="py-2.5 px-3">27.5"</td>
                    <td className="py-2.5 pl-3">21.5"</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-3 font-semibold text-white">M</td>
                    <td className="py-2.5 px-3">46"</td>
                    <td className="py-2.5 px-3">28.5"</td>
                    <td className="py-2.5 pl-3">22.5"</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-3 font-semibold text-white">L</td>
                    <td className="py-2.5 px-3">48"</td>
                    <td className="py-2.5 px-3">29.5"</td>
                    <td className="py-2.5 pl-3">23.5"</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-3 font-semibold text-white">XL</td>
                    <td className="py-2.5 px-3">50"</td>
                    <td className="py-2.5 px-3">30.5"</td>
                    <td className="py-2.5 pl-3">24.5"</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}