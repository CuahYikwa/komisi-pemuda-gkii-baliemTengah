import { useState } from 'react';
import { Check, Copy, Facebook, MessageCircle, Share2 } from 'lucide-react';

interface NewsShareActionsProps {
  url: string;
  title: string;
  summary: string;
}

export function NewsShareActions({
  url,
  title,
  summary,
}: NewsShareActionsProps) {
  const [feedback, setFeedback] = useState('');
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `${title}\n${url}`
  )}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}`;

  const handleCopy = async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard tidak tersedia.');
      }
      await navigator.clipboard.writeText(url);
      setFeedback('Link berita berhasil disalin.');
    } catch {
      setFeedback('Gagal menyalin otomatis. Silakan salin link berita di atas.');
    }
  };

  const handleShare = async () => {
    if (!navigator.share) {
      await handleCopy();
      return;
    }

    try {
      await navigator.share({ title, text: summary, url });
      setFeedback('Berita siap dibagikan.');
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      setFeedback('Berita tidak dapat dibagikan dari perangkat ini.');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          readOnly
          aria-label="Link berita"
          value={url}
          onFocus={(event) => event.currentTarget.select()}
          className="min-w-0 flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#C89B3C]"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#0B1F3A] text-white text-xs font-semibold hover:bg-[#122D52]"
        >
          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
          Salin link
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-[#0B1F3A] text-xs font-semibold hover:border-[#C89B3C]"
        >
          <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
          Bagikan
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#128C7E] text-white text-xs font-semibold hover:bg-[#0F766E]"
        >
          <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
          WhatsApp
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#1877F2] text-white text-xs font-semibold hover:bg-[#1669D8]"
        >
          <Facebook className="w-3.5 h-3.5" aria-hidden="true" />
          Facebook
        </a>
      </div>
      {feedback && (
        <p
          role="status"
          className="inline-flex items-center gap-1.5 text-xs text-emerald-700"
        >
          <Check className="w-3.5 h-3.5" aria-hidden="true" />
          {feedback}
        </p>
      )}
      <p className="text-xs text-slate-500">
        Pada perangkat yang mendukung, tombol Bagikan menampilkan aplikasi
        sosial yang tersedia. Link juga bisa disalin untuk ditempel ke platform
        lain.
      </p>
    </div>
  );
}
