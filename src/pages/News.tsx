import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Search } from 'lucide-react';
import { AnimatedSection } from '../components/AnimatedSection';
import { PageHeader } from '../components/PageHeader';
import { SafeImage } from '../components/SafeImage';
import { useAppData } from '../context/AppDataContext';
import type { NewsCategory } from '../types';
import { filterNews, formatDateID } from '../utils/logic';

const CATEGORIES: Array<NewsCategory | 'Semua'> = [
  'Semua',
  'Pelayanan',
  'Ibadah',
  'Pembinaan',
  'Sosial',
  'Pengumuman',
];

export function News() {
  const { news, loading } = useAppData();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<NewsCategory | 'Semua'>('Semua');

  const filtered = filterNews(news, query, category, false);

  return (
    <div>
      <PageHeader
        eyebrow="Warta Pelayanan"
        title="Berita & Informasi Terbaru"
        description="Kabar terbaru seputar kegiatan, pembinaan rohani, pelayanan sosial, dan pengumuman resmi Komisi Pemuda Pemudi GKII Baliem Tengah."
        breadcrumb="Berita"
      />

      <section className="py-12 sm:py-16 bg-[#F6F8FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Animated Category Filter */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-8 border-b border-slate-200">
            <div
              role="tablist"
              aria-label="Filter kategori berita"
              className="flex flex-wrap gap-2"
            >
              {CATEGORIES.map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCategory(cat)}
                    className={`relative px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-[#0B1F3A]/40'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="news-filter-pill"
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 rounded-lg bg-[#0B1F3A] shadow-sm"
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:w-80 group">
              <label htmlFor="news-search" className="sr-only">
                Cari berita
              </label>
              <Search
                className="w-4 h-4 text-slate-400 group-focus-within:text-[#A87E26] transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="news-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari judul atau kata kunci..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C89B3C] focus:border-[#C89B3C] transition-shadow"
              />
            </div>
          </div>

          {loading ? (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-80 rounded-2xl bg-slate-200 animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-8 p-12 rounded-2xl bg-white border border-slate-200 text-center">
              <p className="font-display font-semibold text-[#0B1F3A]">
                Tidak ada berita yang cocok
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Coba ubah kata kunci pencarian atau pilih kategori lain.
              </p>
              {(query || category !== 'Semua') && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setCategory('Semua');
                  }}
                  className="mt-4 px-4 py-2 rounded-lg bg-[#0B1F3A] text-white text-xs font-semibold"
                >
                  Reset Filter
                </button>
              )}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, idx) => (
                <AnimatedSection
                  key={item.id}
                  delay={idx * 0.04}
                  variant="fadeUp"
                >
                  <Link
                    to={`/berita/${item.id}`}
                    className="group h-full rounded-2xl bg-white border border-slate-200 overflow-hidden hover:border-[#C89B3C]/80 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                      <SafeImage
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071426]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
                          <span className="font-semibold text-[#A87E26]">
                            {item.category}
                          </span>
                          <span aria-hidden="true">·</span>
                          <time dateTime={item.publishedAt}>
                            {formatDateID(item.publishedAt)}
                          </time>
                        </div>
                        <h2 className="font-display text-lg font-bold text-[#0B1F3A] group-hover:text-[#1B3F70] transition-colors leading-snug">
                          {item.title}
                        </h2>
                        <p className="mt-2.5 text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {item.summary}
                        </p>
                      </div>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B1F3A] group-hover:text-[#A87E26]">
                        <span>Baca Berita</span>
                        <ArrowRight
                          className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
