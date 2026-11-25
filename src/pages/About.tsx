import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Compass,
  HeartHandshake,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AnimatedSection } from "../components/AnimatedSection";
import { RevealImage } from "../components/MotionPrimitives";
import { PageHeader } from "../components/PageHeader";
import { SafeImage } from "../components/SafeImage";
import { SectionTitle } from "../components/SectionTitle";
import { useAppData } from "../context/AppDataContext";
import kopdaImage from "../assets/images/kopda.jpg";

const MISSIONS = [
  {
    title: "Mewujudkan Gereja yang Bertumbuh Menjadi Gereja yang Sehat",
    desc: "Berfokus pada pembentukan gereja lokal yang sehat, peningkatan kualitas gembala, serta memobilisasi jemaat yang berkomitmen.",
  },
  {
    title: "Mencapai Gereja yang Bertambah dalam Jumlah",
    desc: "Menekankan pengabaran Injil sebagai DNA organisasi untuk menambah jiwa baru dan membentuk gereja-gereja baru.",
  },
];

const GOALS = [
  {
    title: "Pemuda yang Berakar dalam Firman",
    desc: "Membentuk kebiasaan doa, pembacaan Alkitab, dan kehidupan rohani yang konsisten di tengah tantangan era modern.",
    icon: BookOpen,
  },
  {
    title: "Kesatuan Lintas Jemaat Lokal",
    desc: "Memperkuat jejaring komunikasi, persekutuan, dan kolaborasi antar-pemuda jemaat GKII se-Wilayah Baliem Tengah.",
    icon: Users,
  },
  {
    title: "Kaderisasi Kepemimpinan Gereja",
    desc: "Menyiapkan pemimpin muda yang berintegritas, terlatih dalam organisasi, dan siap meneruskan tongkat estafet pelayanan.",
    icon: Compass,
  },
  {
    title: "Kepedulian Nyata bagi Sesama",
    desc: "Menghadirkan kasih Kristus melalui pelayanan diakonia, pendidikan anak, dan aksi kemanusiaan di Lembah Baliem.",
    icon: HeartHandshake,
  },
];

const VALUES = [
  {
    name: "Beriman & Takut Akan Tuhan",
    desc: "Menjadikan Alkitab dan doa sebagai fondasi setiap keputusan organisasi.",
  },
  {
    name: "Persatuan dalam Kasih",
    desc: "Menjaga kerukunan, saling menghormati, dan merangkul seluruh pemuda-pemudi tanpa sekat.",
  },
  {
    name: "Kerendahan Hati dalam Melayani",
    desc: "Melayani dengan tulus sebagai pelayan Kristus bagi gereja dan masyarakat.",
  },
  {
    name: "Integritas & Tanggung Jawab",
    desc: "Menjunjung kejujuran, transparansi, dan kedisiplinan dalam menjalankan amanah pelayanan.",
  },
];

export function About() {
  const { gallery } = useAppData();

  return (
    <div>
      <PageHeader
        eyebrow="Profil Organisasi"
        title="Tentang Komisi Pemuda Pemudi GKII Baliem Tengah"
        description="Komisi Pemuda merupakan wadah pelayanan bagi kaum muda di bawah naungan GEREJA KEMAH INJIL INDONESIA ( GKII ) Daerah Baliem Tengah yang hadir untuk membina, memperlengkapi, dan mengembangkan generasi muda Kristen dalam iman, karakter, persekutuan, dan kepemimpinan."
        breadcrumb="Tentang Kami"
      />

      {/* Sejarah Singkat & Identitas */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <AnimatedSection
              variant="slideLeft"
              className="lg:col-span-6 space-y-6">
              <SectionTitle
                eyebrow="Sejarah & Panggilan"
                title="Bertumbuh, Bertambah, dan Berdampak"
              />
              <div className="space-y-4 text-base text-slate-600 leading-relaxed max-w-prose">
                <p>
                  <strong className="text-[#0B1F3A]">
                    Komisi Pemuda Pemudi GKII Baliem Tengah
                  </strong>{" "}
                  merupakan wadah pelayanan kategorial generasi muda di bawah
                  naungan Gereja Kemah Injil Indonesia (GKII) Wilayah Baliem
                  Tengah, Kabupaten Jayawijaya, Provinsi Papua Pegunungan.
                </p>
                <p>
                  Lahir dari semangat kebangunan rohani dan kerinduan para
                  pelopor gereja di Lembah Baliem agar kaum muda tetap teguh
                  memegang pengajaran Injil, organisasi ini terus berkembang
                  menghimpun pelajar, mahasiswa, dan pemuda pekerja dari
                  berbagai jemaat lokal.
                </p>
                <p>
                  Hingga saat ini, Komisi Pemuda Pemudi GKII Baliem Tengah
                  berkomitmen membina generasi muda Kristen yang tidak hanya
                  giat beribadah, tetapi juga berkarakter unggul, terampil, dan
                  hadir membawa damai sejahtera di tengah gereja dan masyarakat.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection
              variant="slideRight"
              delay={0.08}
              className="lg:col-span-6">
              <div className="h-full rounded-2xl overflow-hidden border border-slate-200 bg-[#0B1F3A] flex flex-col shadow-md">
                <div className="flex-1 min-h-[260px] overflow-hidden">
                  <RevealImage
                    src={kopdaImage}
                    alt="Ibadah dan persekutuan pemuda GKII"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 bg-[#0B1F3A] text-white">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#DCB458]">
                    Identitas Organisasi
                  </p>
                  <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-slate-400 text-xs">Nama Resmi</dt>
                      <dd className="font-semibold mt-0.5">
                        Komisi Pemuda Pemudi GKII Baliem Tengah
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400 text-xs">Naungan Gereja</dt>
                      <dd className="font-semibold mt-0.5">
                        Gereja Kemah Injil Indonesia (GKII)
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400 text-xs">
                        Wilayah Pelayanan
                      </dt>
                      <dd className="font-semibold mt-0.5">
                        Lembah Baliem, Papua Pegunungan
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400 text-xs">Semboyan</dt>
                      <dd className="font-semibold mt-0.5 text-[#DCB458]">
                        GROWING TOGETHER
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="py-16 sm:py-20 bg-[#F6F8FB] border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <AnimatedSection variant="scaleIn" className="lg:col-span-5">
              <div className="h-full p-8 rounded-2xl bg-[#0B1F3A] text-white flex flex-col justify-between shadow-md">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#DCB458]">
                    VISI GKII
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-300">
                    Visi Pelayanan
                  </p>
                  <h2 className="mt-4 font-display text-2xl sm:text-3xl font-bold leading-snug text-balance">
                    Menjadi gereja yang bertumbuh, bertambah, dan berdampak.
                  </h2>
                </div>
                <p className="mt-8 pt-6 border-t border-white/15 text-sm text-slate-300 leading-relaxed">
                  Visi ini menjadi arah dalam membangun kehidupan gereja yang
                  sehat, bertumbuh secara rohani, berkembang dalam pelayanan,
                  dan memberikan dampak nyata bagi masyarakat.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection
              variant="blurReveal"
              delay={0.08}
              className="lg:col-span-7">
              <div className="h-full p-8 rounded-2xl bg-white border border-slate-200">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A87E26]">
                  MISI GKII
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-[#0B1F3A]">
                  Arah Pelayanan
                </h2>
                <ol className="mt-6 space-y-4">
                  {MISSIONS.map((m, idx) => (
                    <li
                      key={m.title}
                      className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0">
                      <span className="w-8 h-8 rounded-lg bg-[#0B1F3A] text-[#DCB458] font-mono text-xs font-bold flex items-center justify-center shrink-0 tabular-nums">
                        0{idx + 1}
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-[#0B1F3A] leading-relaxed">
                          {m.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                          {m.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Tujuan & Nilai Pelayanan */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Tujuan & Nilai"
            title="Arah Tujuan dan Nilai-Nilai Pelayanan"
            description="Prinsip rohani dan etos organisasi yang memandu seluruh pengurus serta anggota pemuda-pemudi GKII Baliem Tengah."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {GOALS.map((goal, idx) => {
              const Icon = goal.icon;
              return (
                <AnimatedSection
                  key={goal.title}
                  delay={idx * 0.05}
                  variant="fadeUp">
                  <div className="h-full p-6 rounded-2xl bg-[#F6F8FB] border border-slate-200 hover:border-[#C89B3C]/70 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                    <div className="w-11 h-11 rounded-xl bg-[#0B1F3A] text-[#DCB458] flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#0B1F3A]">
                      {goal.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {goal.desc}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

          <div className="mt-14 pt-12 border-t border-slate-200">
            <h3 className="font-display text-xl font-bold text-[#0B1F3A] mb-6 flex items-center gap-2">
              <ShieldCheck
                className="w-5 h-5 text-[#A87E26]"
                aria-hidden="true"
              />
              <span>Nilai-Nilai Pelayanan</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {VALUES.map((val, idx) => (
                <AnimatedSection
                  key={val.name}
                  delay={idx * 0.04}
                  variant="scaleIn">
                  <div className="h-full p-5 rounded-xl bg-white border border-slate-200 hover:border-[#C89B3C]/60 transition-colors">
                    <h4 className="font-display font-bold text-sm text-[#0B1F3A]">
                      {val.name}
                    </h4>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* Dokumentasi Organisasi Preview */}
          <div className="mt-16 pt-12 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#A87E26]">
                  Dokumentasi Organisasi
                </p>
                <h3 className="font-display text-2xl font-bold text-[#0B1F3A] mt-1">
                  Jejak Pelayanan di Lembah Baliem
                </h3>
              </div>
              <Link
                to="/galeri"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-[#0B1F3A] hover:text-[#A87E26]">
                <span>Buka Galeri Foto</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {gallery.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 group">
                  <SafeImage
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
