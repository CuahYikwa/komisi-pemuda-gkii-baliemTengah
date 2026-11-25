import { Building2, Users } from 'lucide-react';
import { AnimatedSection } from '../components/AnimatedSection';
import { PageHeader } from '../components/PageHeader';
import { useAppData } from '../context/AppDataContext';

export function Churches() {
  const { churches, loading } = useAppData();
  const sortedChurches = [...churches].sort((a, b) => a.order - b.order);
  const knownYouthCount = churches.reduce(
    (total, church) => total + (church.youthCount ?? 0),
    0
  );
  const reportedChurches = churches.filter(
    (church) => church.youthCount !== null
  ).length;

  return (
    <div>
      <PageHeader
        eyebrow="Seksi Pemuda"
        title={
          loading
            ? 'Jemaat dalam Pelayanan Pemuda'
            : `${churches.length} Jemaat dalam Pelayanan Pemuda`
        }
        description="Komisi Pemuda hadir melalui jaringan pelayanan di berbagai jemaat dan pos pelayanan untuk membangun persekutuan serta mengembangkan potensi generasi muda."
        breadcrumb="Jemaat"
      />

      <section className="py-14 sm:py-20 bg-[#F6F8FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!loading && (
            <AnimatedSection variant="fadeUp">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1F3A] text-white flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#DCB458]">
                    <Building2 className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-300">Jemaat & Pos Pelayanan</p>
                    <p className="font-display text-2xl font-bold mt-0.5">
                      {churches.length}
                    </p>
                  </div>
                </div>
                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F9F1DC] flex items-center justify-center text-[#A87E26]">
                    <Users className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Jumlah Pemuda Tercatat</p>
                    <p className="font-display text-2xl font-bold text-[#0B1F3A] mt-0.5">
                      {knownYouthCount}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Data tersedia dari {reportedChurches} jemaat
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-28 rounded-2xl bg-slate-200 animate-pulse"
                />
              ))}
            </div>
          ) : churches.length === 0 ? (
            <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center text-slate-600">
              Belum ada data jemaat yang ditambahkan.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedChurches.map((church, index) => (
                <AnimatedSection key={church.id} delay={Math.min(index * 0.025, 0.3)} variant="fadeUp">
                  <article className="h-full p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#C89B3C]/70 hover:shadow-md transition-all">
                    <div className="flex items-start gap-4">
                      <span className="w-11 h-11 rounded-xl bg-[#0B1F3A] text-[#DCB458] flex items-center justify-center font-display font-bold text-sm shrink-0">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-display font-bold text-base text-[#0B1F3A] leading-snug">
                          {church.name}
                        </h2>
                        <p className="mt-2 text-xs text-slate-500 inline-flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#A87E26]" aria-hidden="true" />
                          {church.youthCount === null
                            ? 'Jumlah pemuda belum didata'
                            : `${church.youthCount} pemuda`}
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
