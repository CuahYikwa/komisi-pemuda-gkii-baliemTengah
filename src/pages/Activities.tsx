import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, CheckCircle2, Clock, MapPin, Search } from 'lucide-react';
import { AnimatedSection } from '../components/AnimatedSection';
import { PageHeader } from '../components/PageHeader';
import { SafeImage } from '../components/SafeImage';
import { useAppData } from '../context/AppDataContext';
import type { ActivityCategory, ActivityStatus } from '../types';
import { filterActivities, formatDateID } from '../utils/logic';

const ACTIVITY_CATEGORIES: Array<ActivityCategory | 'Semua'> = [
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

const STATUS_OPTIONS: Array<ActivityStatus | 'Semua'> = [
  'Semua',
  'Akan Datang',
  'Sedang Berlangsung',
  'Selesai',
];

export function Activities() {
  const { activities, loading } = useAppData();
  const [category, setCategory] = useState<ActivityCategory | 'Semua'>('Semua');
  const [status, setStatus] = useState<ActivityStatus | 'Semua'>('Semua');
  const [query, setQuery] = useState('');

  const filtered = filterActivities(activities, category, status, query);

  return (
    <div>
      <PageHeader
        eyebrow="Agenda & Dokumentasi"
        title="Kegiatan Komisi Pemuda Pemudi"
        description="Jadwal ibadah pemuda, retreat, seminar, KKR, perayaan hari besar gerejawi, olahraga, dan bakti sosial GKII Baliem Tengah."
        breadcrumb="Kegiatan"
      />

      <section className="py-12 sm:py-16 bg-[#F6F8FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Controls */}
          <div className="space-y-4 pb-8 border-b border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="relative w-full lg:w-80 group">
                <label htmlFor="activity-search" className="sr-only">
                  Cari kegiatan
                </label>
                <Search
                  className="w-4 h-4 text-slate-400 group-focus-within:text-[#A87E26] transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="activity-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari nama kegiatan atau lokasi..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C89B3C]"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-slate-500 mr-1">
                  Status:
                </span>
                {STATUS_OPTIONS.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                      status === st
                        ? 'bg-[#C89B3C] text-[#071426] font-semibold shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-[#0B1F3A]/40'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div
              role="tablist"
              aria-label="Filter kategori kegiatan"
              className="flex flex-wrap gap-2"
            >
              {ACTIVITY_CATEGORIES.map((cat) => {
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
                        layoutId="activity-filter-pill"
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 rounded-lg bg-[#0B1F3A] shadow-sm"
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
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
                Belum ada kegiatan yang sesuai filter
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Ubah filter kategori atau status untuk melihat jadwal lainnya.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((act, idx) => (
                <AnimatedSection
                  key={act.id}
                  delay={idx * 0.04}
                  variant="fadeUp"
                >
                  <article className="group h-full rounded-2xl bg-white border border-slate-200 overflow-hidden hover:border-[#C89B3C]/80 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col">
                    <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                      <SafeImage
                        src={act.imageUrl}
                        alt={act.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071426]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 text-xs mb-2.5">
                          <span className="font-semibold text-[#A87E26]">
                            {act.category}
                          </span>
                          <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                            {act.status === 'Selesai' ? (
                              <CheckCircle2
                                className="w-3.5 h-3.5 text-emerald-700"
                                aria-hidden="true"
                              />
                            ) : (
                              <Clock
                                className="w-3.5 h-3.5 text-[#A87E26]"
                                aria-hidden="true"
                              />
                            )}
                            {act.status}
                          </span>
                        </div>
                        <h2 className="font-display text-lg font-bold text-[#0B1F3A] group-hover:text-[#1B3F70] transition-colors leading-snug">
                          {act.name}
                        </h2>
                        <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                          {act.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                        <p className="flex items-center gap-2">
                          <Calendar
                            className="w-3.5 h-3.5 text-[#A87E26] shrink-0"
                            aria-hidden="true"
                          />
                          <span>
                            {formatDateID(act.date)}
                            {act.time ? ` · ${act.time}` : ''}
                          </span>
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin
                            className="w-3.5 h-3.5 text-[#A87E26] shrink-0"
                            aria-hidden="true"
                          />
                          <span>{act.location}</span>
                        </p>
                      </div>
                    </div>
                  </article>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
