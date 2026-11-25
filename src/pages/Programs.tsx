import { useState } from 'react';
import { motion } from 'motion/react';
import { CalendarClock, CheckCircle2, Clock } from 'lucide-react';
import { AnimatedSection } from '../components/AnimatedSection';
import { PageHeader } from '../components/PageHeader';
import { SafeImage } from '../components/SafeImage';
import { useAppData } from '../context/AppDataContext';
import type { ProgramCategory } from '../types';
import { filterPrograms } from '../utils/logic';

const CATEGORIES: Array<ProgramCategory | 'Semua'> = [
  'Semua',
  'Program Kerohanian',
  'Program Pembinaan Pemuda',
  'Program Pendidikan',
  'Program Olahraga',
  'Program Sosial',
  'Program Kreativitas dan Seni',
  'Program Penginjilan dan Misi',
  'Program Kebersamaan',
];

export function Programs() {
  const { programs, loading } = useAppData();
  const [selectedCategory, setSelectedCategory] = useState<
    ProgramCategory | 'Semua'
  >('Semua');

  const filtered = filterPrograms(programs, selectedCategory);

  return (
    <div>
      <PageHeader
        eyebrow="Rencana Pelayanan"
        title="Program Kerja Komisi Pemuda Pemudi"
        description="Delapan bidang program kerja terstruktur untuk menumbuhkan iman, membangun kapasitas pemuda, dan melayani jemaat serta masyarakat."
        breadcrumb="Program Kerja"
      />

      <section className="py-12 sm:py-16 bg-[#F6F8FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Animated Category Filter Tabs */}
          <div
            role="tablist"
            aria-label="Filter kategori program kerja"
            className="flex flex-wrap gap-2 pb-8"
          >
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-[#0B1F3A]/40'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="program-filter-pill"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-80 rounded-2xl bg-slate-200 animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center">
              <p className="font-display font-semibold text-[#0B1F3A]">
                Belum ada program pada kategori ini
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Pilih kategori lain untuk melihat program kerja lainnya.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((prog, idx) => (
                <AnimatedSection
                  key={prog.id}
                  delay={idx * 0.04}
                  variant="scaleIn"
                >
                  <article className="group h-full rounded-2xl bg-white border border-slate-200 overflow-hidden hover:border-[#C89B3C]/80 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col">
                    <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                      <SafeImage
                        src={prog.imageUrl}
                        alt={prog.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071426]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                          <span className="font-semibold text-[#A87E26]">
                            {prog.category}
                          </span>
                          <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                            {prog.status === 'Selesai' ? (
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
                            {prog.status}
                          </span>
                        </div>
                        <h2 className="font-display text-lg font-bold text-[#0B1F3A] group-hover:text-[#1B3F70] transition-colors leading-snug">
                          {prog.name}
                        </h2>
                        <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                          {prog.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                        <CalendarClock
                          className="w-4 h-4 text-[#A87E26] shrink-0"
                          aria-hidden="true"
                        />
                        <span>{prog.schedule || 'Menyesuaikan agenda'}</span>
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
