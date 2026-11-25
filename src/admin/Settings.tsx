import React, { useEffect, useState } from 'react';
import { Check, KeyRound } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { getAdminEmail } from '../services/auth';

export function Settings() {
  const { settings, updateSettings } = useAppData();
  const { showToast } = useToast();

  const [organizationName, setOrganizationName] = useState(
    settings.organizationName
  );
  const [tagline, setTagline] = useState(settings.tagline);
  const [heroDescription, setHeroDescription] = useState(
    settings.heroDescription
  );
  const [secretariatAddress, setSecretariatAddress] = useState(
    settings.secretariatAddress
  );
  const [email, setEmail] = useState(settings.email);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [serviceSchedule, setServiceSchedule] = useState(
    settings.serviceSchedule
  );
  const [mapsQuery, setMapsQuery] = useState(settings.mapsQuery);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    setOrganizationName(settings.organizationName);
    setTagline(settings.tagline);
    setHeroDescription(settings.heroDescription);
    setSecretariatAddress(settings.secretariatAddress);
    setEmail(settings.email);
    setWhatsappNumber(settings.whatsappNumber);
    setServiceSchedule(settings.serviceSchedule);
    setMapsQuery(settings.mapsQuery);
  }, [settings]);

  const handleSaveSite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({
        ...settings,
        organizationName: organizationName.trim(),
        tagline: tagline.trim(),
        heroDescription: heroDescription.trim(),
        secretariatAddress: secretariatAddress.trim(),
        email: email.trim(),
        whatsappNumber: whatsappNumber.trim(),
        serviceSchedule: serviceSchedule.trim(),
        mapsQuery: mapsQuery.trim(),
      });
      setSavedNotice(true);
      showToast('Pengaturan website berhasil disimpan ke Firebase.');
      setTimeout(() => setSavedNotice(false), 2500);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Gagal menyimpan pengaturan.',
        'error'
      );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-bold text-[#0B1F3A]">
          Pengaturan Website
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          Perbarui identitas website, kontak sekretariat, jadwal ibadah, dan
          preferensi lokal yang disimpan di LocalStorage.
        </p>
      </div>

      <form
        onSubmit={handleSaveSite}
        className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5 max-w-4xl"
      >
        <h3 className="font-display font-bold text-base text-[#0B1F3A] border-b border-slate-100 pb-3">
          Profil & Informasi Sekretariat
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="set-org"
              className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
            >
              Nama Organisasi
            </label>
            <input
              id="set-org"
              type="text"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="set-sched"
              className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
            >
              Jadwal Ibadah Rutin
            </label>
            <input
              id="set-sched"
              type="text"
              value={serviceSchedule}
              onChange={(e) => setServiceSchedule(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="set-tag"
            className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
          >
            Tagline Hero
          </label>
          <input
            id="set-tag"
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="set-desc"
            className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
          >
            Deskripsi Hero
          </label>
          <textarea
            id="set-desc"
            rows={2}
            value={heroDescription}
            onChange={(e) => setHeroDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="set-addr"
            className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
          >
            Alamat Sekretariat
          </label>
          <textarea
            id="set-addr"
            rows={2}
            value={secretariatAddress}
            onChange={(e) => setSecretariatAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="set-email"
              className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
            >
              Email Organisasi
            </label>
            <input
              id="set-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="set-wa"
              className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
            >
              Nomor WhatsApp
            </label>
            <input
              id="set-wa"
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm tabular-nums"
            />
          </div>
          <div>
            <label
              htmlFor="set-map"
              className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
            >
              Lokasi Google Maps
            </label>
            <input
              id="set-map"
              type="text"
              value={mapsQuery}
              onChange={(e) => setMapsQuery(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#122D52] text-white text-sm font-semibold"
          >
            Simpan Pengaturan
          </button>
          {savedNotice && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <Check className="w-4 h-4" />
              Pengaturan tersimpan
            </span>
          )}
        </div>
      </form>

      <section className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 max-w-4xl">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <KeyRound className="w-4 h-4 text-[#A87E26]" aria-hidden="true" />
          <h3 className="font-display font-bold text-base text-[#0B1F3A]">
            Akun Admin Firebase
          </h3>
        </div>
        <p className="text-xs text-slate-600">
          Anda masuk sebagai <strong>{getAdminEmail() || 'admin'}</strong>.
          Pengelolaan akun dan kata sandi dilakukan melalui Firebase
          Authentication oleh pengelola proyek.
        </p>
      </section>
    </div>
  );
}
