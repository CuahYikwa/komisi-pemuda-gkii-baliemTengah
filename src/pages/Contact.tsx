import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Check,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from 'lucide-react';
import { AnimatedSection } from '../components/AnimatedSection';
import { PageHeader } from '../components/PageHeader';
import { SocialBar } from '../components/SocialBar';
import { useAppData } from '../context/AppDataContext';
import { buildWhatsAppUrl, normalizeWhatsAppDigits } from '../utils/logic';

export function Contact() {
  const { settings } = useAppData();
  const shouldReduceMotion = useReducedMotion();
  const [name, setName] = useState('');
  const [churchOrOrigin, setChurchOrOrigin] = useState('');
  const [subject, setSubject] = useState('Informasi Pelayanan Pemuda');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<{
    url: string;
    previewText: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const waDigits = normalizeWhatsAppDigits(settings.whatsappNumber);
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    settings.mapsQuery || 'Wamena, Jayawijaya, Papua Pegunungan'
  )}&output=embed`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const result = buildWhatsAppUrl(settings.whatsappNumber, {
      name,
      churchOrOrigin,
      subject,
      message,
    });
    if (!result.ok) {
      setErrorMsg(result.error);
      setGeneratedLink(null);
      return;
    }
    setGeneratedLink({ url: result.url, previewText: result.previewText });
  };

  const handleCopy = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink.previewText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore clipboard permissions error
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Hubungi Pengurus"
        title="Kontak & Sekretariat Organisasi"
        description="Sampaikan pertanyaan, undangan pelayanan, atau permohonan informasi kegiatan kepada pengurus Komisi Pemuda Pemudi GKII Baliem Tengah."
        breadcrumb="Kontak"
      />

      <section className="py-12 sm:py-16 bg-[#F6F8FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Contact Info & Map */}
            <AnimatedSection variant="slideLeft" className="lg:col-span-5 space-y-6">
              <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1F3A] text-white space-y-5 shadow-lg">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#DCB458]">
                    Informasi Resmi
                  </p>
                  <h2 className="font-display text-xl font-bold mt-1">
                    {settings.organizationName}
                  </h2>
                </div>

                <div className="space-y-4 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <MapPin
                      className="w-5 h-5 text-[#DCB458] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-white text-xs uppercase tracking-wider mb-0.5">
                        Alamat Sekretariat
                      </p>
                      <p className="leading-relaxed">
                        {settings.secretariatAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MessageCircle
                      className="w-5 h-5 text-[#DCB458] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-white text-xs uppercase tracking-wider mb-0.5">
                        Nomor WhatsApp
                      </p>
                      <a
                        href={`https://wa.me/${waDigits}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#DCB458] transition-colors tabular-nums"
                      >
                        +{waDigits}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail
                      className="w-5 h-5 text-[#DCB458] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-white text-xs uppercase tracking-wider mb-0.5">
                        Email Organisasi
                      </p>
                      <a
                        href={`mailto:${settings.email}`}
                        className="hover:text-[#DCB458] transition-colors"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-[#0B1F3A]">
                    Peta Lokasi Wilayah Baliem Tengah
                  </span>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      settings.mapsQuery
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#A87E26] hover:text-[#0B1F3A]"
                  >
                    <span>Buka Peta</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
                <iframe
                  title="Peta Lokasi Sekretariat GKII Baliem Tengah"
                  src={mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-60 border-0"
                />
              </div>
            </AnimatedSection>

            {/* WhatsApp Message Form */}
            <AnimatedSection variant="slideRight" delay={0.08} className="lg:col-span-7">
              <div className="h-full p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h2 className="font-display text-2xl font-bold text-[#0B1F3A]">
                  Kirim Pesan via WhatsApp
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Isi formulir di bawah ini untuk membuat format pesan otomatis
                  dan langsung terhubung dengan pengurus di WhatsApp.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                      >
                        Nama Lengkap *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Masukkan nama Anda"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C89B3C]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-origin"
                        className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                      >
                        Asal Jemaat / Instansi
                      </label>
                      <input
                        id="contact-origin"
                        type="text"
                        value={churchOrOrigin}
                        onChange={(e) => setChurchOrOrigin(e.target.value)}
                        placeholder="Contoh: Jemaat GKII Lokal"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C89B3C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                    >
                      Perihal
                    </label>
                    <select
                      id="contact-subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C89B3C]"
                    >
                      <option value="Informasi Pelayanan Pemuda">
                        Informasi Pelayanan Pemuda
                      </option>
                      <option value="Undangan Pelayanan / Ibadah">
                        Undangan Pelayanan / Ibadah
                      </option>
                      <option value="Partisipasi Kegiatan & Bakti Sosial">
                        Partisipasi Kegiatan & Bakti Sosial
                      </option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                    >
                      Isi Pesan *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tuliskan pesan atau pertanyaan Anda untuk pengurus..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C89B3C]"
                    />
                  </div>

                  <AnimatePresence>
                    {errorMsg && (
                      <motion.div
                        initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        role="alert"
                        className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700"
                      >
                        {errorMsg}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#122D52] text-white text-sm font-semibold transition-colors shadow-sm"
                  >
                    <Send className="w-4 h-4 text-[#DCB458]" aria-hidden="true" />
                    <span>Siapkan Pesan WhatsApp</span>
                  </motion.button>
                </form>

                <AnimatePresence>
                  {generatedLink && (
                    <motion.div
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.25 }}
                      className="mt-6 p-5 rounded-xl bg-[#F6F8FB] border border-[#C89B3C]/40 space-y-3"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#A87E26]">
                        Pesan Siap Dikirim ke WhatsApp
                      </p>
                      <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans bg-white p-3.5 rounded-lg border border-slate-200">
                        {generatedLink.previewText}
                      </pre>
                      <div className="flex flex-wrap items-center gap-3">
                        <a
                          href={generatedLink.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C89B3C] hover:bg-[#DCB458] text-[#071426] text-xs font-bold transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" aria-hidden="true" />
                          <span>Buka di WhatsApp Sekarang</span>
                          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-[#0B1F3A] hover:bg-slate-50 transition-colors"
                        >
                          {copied && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                          <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedSection>
          </div>

          {/* Media Sosial Organisasi */}
          <AnimatedSection delay={0.12}>
            <h2 className="font-display text-xl font-bold text-[#0B1F3A] mb-5">
              Kanal Media Sosial Resmi
            </h2>
            <SocialBar />
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
