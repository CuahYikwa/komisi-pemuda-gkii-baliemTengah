import React, { useEffect, useState } from 'react';
import { Check, ExternalLink } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';

export function SocialManager() {
  const { settings, updateSettings } = useAppData();
  const { showToast } = useToast();
  const [facebook, setFacebook] = useState(settings.socialLinks.facebook);
  const [instagram, setInstagram] = useState(settings.socialLinks.instagram);
  const [tiktok, setTiktok] = useState(settings.socialLinks.tiktok);
  const [youtube, setYoutube] = useState(settings.socialLinks.youtube);
  const [whatsapp, setWhatsapp] = useState(settings.socialLinks.whatsapp);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFacebook(settings.socialLinks.facebook);
    setInstagram(settings.socialLinks.instagram);
    setTiktok(settings.socialLinks.tiktok);
    setYoutube(settings.socialLinks.youtube);
    setWhatsapp(settings.socialLinks.whatsapp);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({
        ...settings,
        whatsappNumber: whatsapp.trim() || settings.whatsappNumber,
        socialLinks: {
          facebook: facebook.trim(),
          instagram: instagram.trim(),
          tiktok: tiktok.trim(),
          youtube: youtube.trim(),
          whatsapp: whatsapp.trim(),
        },
      });
      setSaved(true);
      showToast('Tautan media sosial resmi berhasil diperbarui.');
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Gagal menyimpan tautan sosial.',
        'error'
      );
    }
  };

  const fields = [
    {
      id: 'soc-fb',
      label: 'URL Facebook Resmi',
      value: facebook,
      setter: setFacebook,
      placeholder: 'https://facebook.com/...',
    },
    {
      id: 'soc-ig',
      label: 'URL Instagram Resmi',
      value: instagram,
      setter: setInstagram,
      placeholder: 'https://instagram.com/...',
    },
    {
      id: 'soc-tt',
      label: 'URL TikTok Resmi',
      value: tiktok,
      setter: setTiktok,
      placeholder: 'https://tiktok.com/@...',
    },
    {
      id: 'soc-yt',
      label: 'URL YouTube Resmi',
      value: youtube,
      setter: setYoutube,
      placeholder: 'https://youtube.com/@...',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[#0B1F3A]">
          Kelola Media Sosial Organisasi
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          Ganti tautan placeholder dengan akun media sosial resmi Komisi Pemuda
          Pemudi GKII Baliem Tengah.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5 max-w-3xl"
      >
        {fields.map((f) => (
          <div key={f.id}>
            <label
              htmlFor={f.id}
              className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
            >
              {f.label}
            </label>
            <div className="flex gap-2">
              <input
                id={f.id}
                type="url"
                value={f.value}
                onChange={(e) => f.setter(e.target.value)}
                placeholder={f.placeholder}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
              {f.value && (
                <a
                  href={f.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Uji tautan ${f.label}`}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-[#0B1F3A] flex items-center"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}

        <div>
          <label
            htmlFor="soc-wa"
            className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
          >
            Nomor WhatsApp Pengurus (Format 628... atau 08...)
          </label>
          <input
            id="soc-wa"
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="6281234567890"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm tabular-nums"
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#122D52] text-white text-sm font-semibold"
          >
            Simpan Media Sosial
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <Check className="w-4 h-4" />
              Tersimpan di LocalStorage
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
