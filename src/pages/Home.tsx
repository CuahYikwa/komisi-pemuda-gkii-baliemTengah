import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { filterActivities, filterNews, formatDateID } from '../utils/logic';
import { AnimatedSection } from '../components/AnimatedSection';
import { Hero } from '../components/Hero';
import { AnimatedCounter, RevealImage } from '../components/MotionPrimitives';
import { SafeImage } from '../components/SafeImage';
import { SectionTitle } from '../components/SectionTitle';
import { SocialBar } from '../components/SocialBar';
import kopdaImage from '../assets/images/kopda.jpg';

export function Home() {
  const { news, activities, gallery, members, programs, loading } = useAppData();
  const shouldReduceMotion = useReducedMotion();

  const publishedNews = filterNews(news, '', 'Semua', false);
  const leadNews = publishedNews[0];
  const secondaryNews = publishedNews.slice(1, 4);
  const upcomingActivities = filterActivities(activities, 'Semua', 'Semua').slice(
    0,
    3
  );
  const featuredPrograms = programs.slice(0, 4);
  const galleryPreview = gallery.slice(0, 6);

  const stats = [
    {
      label: 'Program Kerja Aktif',
      value: programs.length,
      sub: '8 bidang pelayanan pemuda',
    },
    {
      label: 'Pengurus & Koordinator',
      value: members.length,
      sub: 'Struktur kepengurusan wilayah',
    },
    {
      label: 'Berita Terpublikasi',
      value: publishedNews.length,
      sub: 'Kabar pelayanan & warta jemaat',
    },
    {
      label: 'Dokumentasi Galeri',
      value: gallery.length,
      sub: 'Arsip foto kegiatan Lembah Baliem',
    },
  ];

  return (
    <div>
      <Hero />

      {/* Operational & Organizational Summary Strip with Animated Counters */}
      <section
        id="ringkasan-beranda"
        className="bg-white border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="p-4 rounded-xl border border-transparent hover:border-[#C89B3C]/40 hover:bg-[#F6F8FB]/70 transition-all duration-200 space-y-1"
              >
                <p className="text-xs font-medium text-slate-500">
                  {stat.label}
                </p>
                <p className="font-display text-2xl sm:text-3xl font-bold text-[#0B1F3A] tabular-nums">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="text-xs text-slate-600">{stat.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visi & Misi Section (Balanced 2-Column Split) */}
      <section className="py-16 sm:py-24 bg-[#F6F8FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <AnimatedSection
              variant="slideLeft"
              className="lg:col-span-6 relative rounded-2xl overflow-hidden bg-[#0B1F3A] min-h-[320px] shadow-md group"
            >
              <RevealImage
                src={kopdaImage}
                alt="Persekutuan pemuda-pemudi GKII Baliem Tengah di pegunungan"
                className="w-full h-full lg:h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-[#071426]/92 via-[#071426]/55 to-transparent">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#DCB458]">
                  Identitas Pelayanan
                </p>
                <p className="mt-1 text-sm sm:text-base font-medium text-white">
                  Membangun generasi muda Kristen yang berakar di dalam Firman
                  Tuhan dan berdampak bagi Lembah Baliem.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection
              variant="slideRight"
              className="lg:col-span-6 flex flex-col justify-center"
            >
              <SectionTitle
                eyebrow="Tentang Kami"
                title="Membangun Generasi Muda yang Beriman dan Berdampak"
                description=" Pelayanan pemuda diarahkan untuk membentuk generasi muda yang memiliki hubungan yang kuat dengan Tuhan, karakter yang baik, kehidupan persekutuan yang sehat, serta keberanian untuk mengambil bagian dalam pelayanan gereja dan masyarakat."
              />

             

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/tentang"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#122D52] text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-sm whitespace-nowrap"
                >
                  <span>Profil Lengkap Organisasi</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  to="/struktur"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#C89B3C] text-[#0B1F3A] text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
                >
                  <Users className="w-4 h-4 text-[#A87E26]" aria-hidden="true" />
                  <span>Struktur Pengurus</span>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Program Kerja Unggulan */}
      <section className="py-16 sm:py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <SectionTitle
              eyebrow="Program Kerja"
              title="Delapan Pilar Pelayanan Pemuda"
              description="Rangkaian program pembinaan rohani, pendidikan, kreativitas, olahraga, misi, dan diakonia sosial di wilayah Baliem Tengah."
            />
            <Link
              to="/program"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#0B1F3A] hover:text-[#A87E26] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Lihat Semua Program</span>
              <ArrowRight
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            {featuredPrograms.map((prog, idx) => {
              const isWide = idx === 0 || idx === 3;
              return (
                <AnimatedSection
                  key={prog.id}
                  delay={idx * 0.06}
                  variant="scaleIn"
                  className={isWide ? 'lg:col-span-7' : 'lg:col-span-5'}
                >
                  <article className="group h-full rounded-2xl bg-[#F6F8FB] border border-slate-200 overflow-hidden hover:border-[#C89B3C]/80 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col">
                    <div className="aspect-[16/9] w-full overflow-hidden bg-slate-200 relative">
                      <SafeImage
                        src={prog.imageUrl}
                        alt={prog.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071426]/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                          <span className="font-semibold text-[#A87E26]">
                            {prog.category}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{prog.status}</span>
                        </div>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-[#0B1F3A] group-hover:text-[#1B3F70] transition-colors">
                          {prog.name}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                          {prog.description}
                        </p>
                      </div>
                      <p className="mt-4 pt-4 border-t border-slate-200 text-xs font-medium text-slate-500">
                        Jadwal: {prog.schedule}
                      </p>
                    </div>
                  </article>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Berita Terbaru (3-Tier Editorial Salience) */}
      <section className="py-16 sm:py-24 bg-[#F6F8FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <SectionTitle
              eyebrow="Warta & Publikasi"
              title="Berita Terbaru Organisasi"
              description="Liputan pelayanan, pembinaan pemuda, dan pengumuman resmi dari Komisi Pemuda Pemudi GKII Baliem Tengah."
            />
            <Link
              to="/berita"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#0B1F3A] hover:text-[#A87E26] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Semua Berita</span>
              <ArrowRight
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 h-96 rounded-2xl bg-slate-200 animate-pulse" />
              <div className="lg:col-span-5 space-y-4">
                <div className="h-28 rounded-xl bg-slate-200 animate-pulse" />
                <div className="h-28 rounded-xl bg-slate-200 animate-pulse" />
                <div className="h-28 rounded-xl bg-slate-200 animate-pulse" />
              </div>
            </div>
          ) : publishedNews.length === 0 ? (
            <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center">
              <p className="text-slate-600">
                Belum ada berita yang dipublikasikan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {leadNews && (
                <AnimatedSection variant="blurReveal" className="lg:col-span-7">
                  <Link
                    to={`/berita/${leadNews.id}`}
                    className="group block h-full rounded-2xl bg-white border border-slate-200 overflow-hidden hover:border-[#C89B3C]/80 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                      <SafeImage
                        src={leadNews.imageUrl}
                        alt={leadNews.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 sm:p-8">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <span className="font-semibold text-[#A87E26]">
                          {leadNews.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <time dateTime={leadNews.publishedAt}>
                          {formatDateID(leadNews.publishedAt)}
                        </time>
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0B1F3A] group-hover:text-[#1B3F70] transition-colors leading-snug">
                        {leadNews.title}
                      </h3>
                      <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed line-clamp-3">
                        {leadNews.summary}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B1F3A] group-hover:text-[#A87E26]">
                        <span>Baca Selengkapnya</span>
                        <ArrowRight
                          className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                </AnimatedSection>
              )}

              <div className="lg:col-span-5 flex flex-col gap-5">
                {secondaryNews.map((item, idx) => (
                  <AnimatedSection
                    key={item.id}
                    delay={idx * 0.06}
                    variant="slideRight"
                  >
                    <Link
                      to={`/berita/${item.id}`}
                      className="group flex gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#C89B3C]/80 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                    >
                      <div className="w-28 h-24 sm:w-32 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <SafeImage
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                          <span className="font-semibold text-[#A87E26]">
                            {item.category}
                          </span>
                          <span aria-hidden="true">·</span>
                          <time dateTime={item.publishedAt}>
                            {formatDateID(item.publishedAt)}
                          </time>
                        </div>
                        <h3 className="font-display font-bold text-base text-[#0B1F3A] group-hover:text-[#1B3F70] line-clamp-2 leading-snug">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                          {item.summary}
                        </p>
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Kegiatan Organisasi */}
      <section className="py-16 sm:py-24 bg-[#0B1F3A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <SectionTitle
              eyebrow="Agenda Pelayanan"
              title="Kegiatan Pemuda & Jadwal Terdekat"
              description="Mari ambil bagian dalam ibadah gabungan, retreat, seminar pembinaan, dan pelayanan sosial di wilayah Baliem Tengah."
              light
            />
            <Link
              to="/kegiatan"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#DCB458] hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              <span>Lihat Semua Kegiatan</span>
              <ArrowRight
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingActivities.map((act, idx) => (
              <AnimatedSection key={act.id} delay={idx * 0.06} variant="fadeUp">
                <article className="group h-full rounded-2xl bg-[#122D52]/75 border border-white/10 hover:border-[#C89B3C]/60 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col">
                  <div className="aspect-[16/10] overflow-hidden bg-[#071426]">
                    <SafeImage
                      src={act.imageUrl}
                      alt={act.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-300 mb-2">
                        <span className="font-semibold text-[#DCB458]">
                          {act.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{act.status}</span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-white leading-snug group-hover:text-[#F9E7B2] transition-colors">
                        {act.name}
                      </h3>
                      <p className="mt-2 text-sm text-slate-300 leading-relaxed line-clamp-3">
                        {act.description}
                      </p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-white/10 space-y-1.5 text-xs text-slate-300">
                      <p className="flex items-center gap-2">
                        <Calendar
                          className="w-3.5 h-3.5 text-[#DCB458] shrink-0"
                          aria-hidden="true"
                        />
                        <span>
                          {formatDateID(act.date)}
                          {act.time ? ` · ${act.time}` : ''}
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin
                          className="w-3.5 h-3.5 text-[#DCB458] shrink-0"
                          aria-hidden="true"
                        />
                        <span className="truncate">{act.location}</span>
                      </p>
                    </div>
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Galeri Dokumentasi Preview */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <SectionTitle
              eyebrow="Dokumentasi Foto"
              title="Momen Kebersamaan & Pelayanan"
              description="Potret sukacita pelayanan pemuda-pemudi GKII Baliem Tengah di gereja dan di tengah masyarakat."
            />
            <Link
              to="/galeri"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#0B1F3A] hover:text-[#A87E26] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Buka Galeri Lengkap</span>
              <ArrowRight
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryPreview.map((photo, idx) => (
              <AnimatedSection
                key={photo.id}
                delay={idx * 0.05}
                variant="scaleIn"
              >
                <Link
                  to="/galeri"
                  className="group relative block aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 hover:border-[#C89B3C]/70 hover:shadow-lg transition-all duration-300"
                >
                  <SafeImage
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071426]/85 via-[#071426]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div>
                      <p className="text-[11px] font-medium text-[#DCB458]">
                        {photo.category}
                      </p>
                      <p className="text-sm font-semibold text-white line-clamp-1">
                        {photo.title}
                      </p>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Media Sosial & Undangan Terhubung */}
      <section className="py-16 sm:py-20 bg-[#F6F8FB] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <SectionTitle
              eyebrow="Media Sosial Resmi"
              title="Terhubung Bersama Pemuda GKII Baliem Tengah"
              description="Ikuti informasi pelayanan terbaru, renungan singkat, serta liputan kegiatan melalui kanal resmi organisasi."
            />
          </div>
          <SocialBar />
        </div>
      </section>
    </div>
  );
}
