import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { AnimatedSection } from '../components/AnimatedSection';
import { PageHeader } from '../components/PageHeader';
import { SafeImage } from '../components/SafeImage';
import { useAppData } from '../context/AppDataContext';
import type { ActivityCategory } from '../types';
import { filterGallery, formatDateID } from '../utils/logic';

const CATEGORIES: Array<ActivityCategory | 'Semua'> = [
  'Semua',
  'Ibadah Pemuda',
  'Retreat',
  'Seminar',
  'KKR',
  'Perayaan Hari Besar Gerejawi',
  'Olahraga',
  'Bakti Sosial',
  'Kegiatan Lainnya',
];

export function Gallery() {
  const { gallery, loading } = useAppData();
  const [category, setCategory] = useState<ActivityCategory | 'Semua'>('Semua');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [slideshow, setSlideshow] = useState(false);

  const filtered = filterGallery(gallery, category);
  const activePhoto =
    lightboxIdx !== null && filtered[lightboxIdx] ? filtered[lightboxIdx] : null;

  useEffect(() => {
    if (!slideshow || lightboxIdx === null || filtered.length <= 1) return;
    const timer = window.setInterval(() => {
      setLightboxIdx((prev) =>
        prev === null ? 0 : (prev + 1) % filtered.length
      );
      setZoom(1);
    }, 3500);
    return () => window.clearInterval(timer);
  }, [slideshow, lightboxIdx, filtered.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape') {
        setLightboxIdx(null);
        setSlideshow(false);
        setZoom(1);
      } else if (e.key === 'ArrowRight') {
        setLightboxIdx((prev) =>
          prev === null ? 0 : (prev + 1) % filtered.length
        );
        setZoom(1);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIdx((prev) =>
          prev === null
            ? 0
            : (prev - 1 + filtered.length) % filtered.length
        );
        setZoom(1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIdx, filtered.length]);

  const openLightbox = (idx: number) => {
    setLightboxIdx(idx);
    setZoom(1);
    setSlideshow(false);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Arsip Dokumentasi"
        title="Galeri Foto Pelayanan Pemuda"
        description="Kumpulan foto kegiatan ibadah, retreat, bakti sosial, musik gerejawi, dan kebersamaan pemuda-pemudi GKII Baliem Tengah."
        breadcrumb="Galeri"
      />

      <section className="py-12 sm:py-16 bg-[#F6F8FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Animated Category Filter */}
          <div
            role="tablist"
            aria-label="Filter kategori galeri"
            className="flex flex-wrap gap-2 pb-8"
          >
            {CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setCategory(cat);
                    setLightboxIdx(null);
                  }}
                  className={`relative px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-[#0B1F3A]/40'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="gallery-filter-pill"
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 rounded-lg bg-[#0B1F3A] shadow-sm"
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="h-64 rounded-2xl bg-slate-200 animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center">
              <p className="font-display font-semibold text-[#0B1F3A]">
                Belum ada foto pada kategori ini
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Foto yang diunggah melalui panel admin akan langsung tampil di
                halaman ini.
              </p>
            </div>
          ) : (
            /* Masonry Grid with Staggered Reveal */
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
              {filtered.map((photo, idx) => (
                <AnimatedSection
                  key={photo.id}
                  delay={Math.min(idx * 0.04, 0.25)}
                  variant="scaleIn"
                  className="break-inside-avoid"
                >
                  <figure className="rounded-2xl bg-white border border-slate-200 hover:border-[#C89B3C]/80 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <button
                      type="button"
                      onClick={() => openLightbox(idx)}
                      aria-label={`Buka foto ${photo.title}`}
                      className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B3C]"
                    >
                      <div className="relative overflow-hidden bg-slate-100">
                        <SafeImage
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#071426]/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3">
                          <span className="px-2.5 py-1 rounded-md bg-[#071426]/80 text-[#DCB458] text-[11px] font-semibold backdrop-blur-xs">
                            Perbesar Foto
                          </span>
                        </div>
                      </div>
                      <figcaption className="p-4">
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                          <span className="font-semibold text-[#A87E26]">
                            {photo.category}
                          </span>
                          <span aria-hidden="true">·</span>
                          <time dateTime={photo.takenAt}>
                            {formatDateID(photo.takenAt)}
                          </time>
                        </div>
                        <p className="font-display font-bold text-sm sm:text-base text-[#0B1F3A] group-hover:text-[#1B3F70] transition-colors leading-snug">
                          {photo.title}
                        </p>
                        {photo.caption && (
                          <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                            {photo.caption}
                          </p>
                        )}
                      </figcaption>
                    </button>
                  </figure>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Smooth Animated Lightbox with Zoom & Slideshow */}
      <AnimatePresence>
        {activePhoto && lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Pratinjau foto ${activePhoto.title}`}
            className="fixed inset-0 z-50 bg-[#071426]/95 backdrop-blur-md flex flex-col"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-white/10 text-white">
              <div className="min-w-0">
                <p className="text-xs text-[#DCB458] font-medium">
                  {activePhoto.category} · {formatDateID(activePhoto.takenAt)}
                </p>
                <h2 className="font-display font-bold text-sm sm:text-base truncate">
                  {activePhoto.title}
                </h2>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setZoom((z) => Math.max(1, Number((z - 0.35).toFixed(2))))
                  }
                  aria-label="Perkecil foto"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setZoom((z) =>
                      Math.min(2.75, Number((z + 0.35).toFixed(2)))
                    )
                  }
                  aria-label="Perbesar foto"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  aria-label="Reset zoom"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSlideshow((s) => !s)}
                  aria-label={
                    slideshow ? 'Hentikan slideshow' : 'Putar slideshow'
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    slideshow
                      ? 'bg-[#C89B3C] text-[#071426]'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {slideshow ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">
                    {slideshow ? 'Jeda' : 'Slideshow'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLightboxIdx(null);
                    setSlideshow(false);
                    setZoom(1);
                  }}
                  aria-label="Tutup lightbox"
                  className="p-2 rounded-lg bg-white/10 hover:bg-red-600 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Image Stage with Smooth Slideshow Crossfade */}
            <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-auto">
              {filtered.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setLightboxIdx(
                      (lightboxIdx - 1 + filtered.length) % filtered.length
                    );
                    setZoom(1);
                  }}
                  aria-label="Foto sebelumnya"
                  className="absolute left-3 sm:left-6 z-10 p-3 rounded-full bg-[#0B1F3A]/80 hover:bg-[#C89B3C] text-white hover:text-[#071426] border border-white/15 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <div className="max-w-5xl max-h-[75vh] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activePhoto.id}
                    src={activePhoto.imageUrl}
                    alt={activePhoto.title}
                    referrerPolicy="no-referrer"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: zoom }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="max-h-[72vh] w-auto object-contain rounded-xl shadow-2xl"
                  />
                </AnimatePresence>
              </div>

              {filtered.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setLightboxIdx((lightboxIdx + 1) % filtered.length);
                    setZoom(1);
                  }}
                  aria-label="Foto berikutnya"
                  className="absolute right-3 sm:right-6 z-10 p-3 rounded-full bg-[#0B1F3A]/80 hover:bg-[#C89B3C] text-white hover:text-[#071426] border border-white/15 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Caption Bar */}
            <div className="px-4 sm:px-6 py-4 border-t border-white/10 text-center text-slate-300 text-xs sm:text-sm">
              <p>{activePhoto.caption || activePhoto.title}</p>
              <p className="text-xs text-slate-500 mt-1 tabular-nums">
                Foto {lightboxIdx + 1} dari {filtered.length} · Zoom{' '}
                {Math.round(zoom * 100)}%
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
