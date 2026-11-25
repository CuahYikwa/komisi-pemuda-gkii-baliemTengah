import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { AnimatedSection } from '../components/AnimatedSection';
import { RevealImage } from '../components/MotionPrimitives';
import { NewsShareActions } from '../components/NewsShareActions';
import { SafeImage } from '../components/SafeImage';
import { useAppData } from '../context/AppDataContext';
import { formatDateID, getRelatedNews } from '../utils/logic';

export function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const { news, loading } = useAppData();
  const shouldReduceMotion = useReducedMotion();

  const article = news.find((n) => n.id === id && n.status === 'published');
  const related = id ? getRelatedNews(news, id, 3) : [];

  if (loading) {
    return (
      <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="h-8 w-40 bg-slate-200 rounded animate-pulse mb-6" />
        <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="pt-32 pb-24 max-w-3xl mx-auto px-4 text-center">
        <h1 className="font-display text-2xl font-bold text-[#0B1F3A]">
          Berita tidak ditemukan
        </h1>
        <p className="mt-2 text-slate-600">
          Artikel yang Anda cari mungkin telah dihapus atau masih berstatus
          draft.
        </p>
        <Link
          to="/berita"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1F3A] text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Kembali ke Daftar Berita</span>
        </Link>
      </div>
    );
  }

  const paragraphs = article.content
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="bg-white">
      {/* Cinematic Dark Hero Header */}
      <div className="relative bg-[#071426] pt-28 pb-12 sm:pt-32 sm:pb-16 text-white overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,155,60,0.14),transparent_55%)]"
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <Link
            to="/berita"
            className="group inline-flex items-center gap-2 text-xs font-semibold text-[#DCB458] hover:text-white transition-colors mb-6"
          >
            <ArrowLeft
              className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
              aria-hidden="true"
            />
            <span>Kembali ke Berita</span>
          </Link>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mb-3"
          >
            <span className="font-semibold uppercase tracking-wider text-[#DCB458]">
              {article.category}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              <time dateTime={article.publishedAt}>
                {formatDateID(article.publishedAt)}
              </time>
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{article.author}</span>
            </span>
          </motion.div>

          <motion.h1
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: 18, filter: 'blur(6px)' }
            }
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-balance"
          >
            {article.title}
          </motion.h1>
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.14 }}
            className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed"
          >
            {article.summary}
          </motion.p>
        </div>
      </div>

      {/* Article Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 mb-10 shadow-md">
          <RevealImage
            src={article.imageUrl}
            alt={article.title}
            priority
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-prose mx-auto space-y-5 text-slate-700 text-base sm:text-[17px] leading-[1.8]">
          {paragraphs.map((p, idx) => (
            <AnimatedSection key={idx} delay={idx * 0.04} variant="fadeUp">
              <p
                className={
                  idx === 0
                    ? 'first-letter:text-4xl first-letter:font-display first-letter:font-bold first-letter:text-[#0B1F3A] first-letter:float-left first-letter:mr-2.5 first-letter:leading-none'
                    : ''
                }
              >
                {p}
              </p>
            </AnimatedSection>
          ))}
        </div>

        <div className="max-w-prose mx-auto mt-10 p-5 rounded-2xl bg-[#F6F8FB] border border-slate-200 space-y-3">
          <h2 className="font-display font-bold text-base text-[#0B1F3A]">
            Bagikan Berita Ini
          </h2>
          <NewsShareActions
            url={window.location.href}
            title={article.title}
            summary={article.summary}
          />
        </div>
      </div>

      {/* Related News */}
      {related.length > 0 && (
        <section className="bg-[#F6F8FB] border-t border-slate-200 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B1F3A] mb-6">
              Berita Terkait Lainnya
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item, idx) => (
                <AnimatedSection key={item.id} delay={idx * 0.05} variant="scaleIn">
                  <Link
                    to={`/berita/${item.id}`}
                    className="group block h-full rounded-2xl bg-white border border-slate-200 overflow-hidden hover:border-[#C89B3C]/80 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                      <SafeImage
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                        <span className="font-semibold text-[#A87E26]">
                          {item.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <time dateTime={item.publishedAt}>
                          {formatDateID(item.publishedAt)}
                        </time>
                      </div>
                      <h3 className="font-display font-bold text-base text-[#0B1F3A] group-hover:text-[#1B3F70] line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
