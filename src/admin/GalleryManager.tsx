import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ImagePlus, Trash2 } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { SafeImage } from '../components/SafeImage';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { compressImageFile } from '../services/storage';
import type { ActivityCategory, GalleryPhoto } from '../types';
import { filterGallery, formatDateID, validateImageFile } from '../utils/logic';

const CATEGORIES: ActivityCategory[] = [
  'Ibadah Pemuda',
  'Retreat',
  'Seminar',
  'KKR',
  'Perayaan Hari Besar Gerejawi',
  'Olahraga',
  'Bakti Sosial',
  'Kegiatan Lainnya',
];

interface StagedPhoto {
  title: string;
  caption: string;
  imageUrl: string;
}

export function GalleryManager() {
  const { gallery, addGalleryPhotos, removeGalleryPhoto } = useAppData();
  const { showToast } = useToast();
  const [category, setCategory] = useState<ActivityCategory>('Ibadah Pemuda');
  const [takenAt, setTakenAt] = useState(new Date().toISOString().slice(0, 10));
  const [staged, setStaged] = useState<StagedPhoto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<GalleryPhoto | null>(null);

  const sorted = filterGallery(gallery, 'Semua');

  const handleFilesSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setError(null);
    setUploading(true);
    setProgress(10);

    const nextStaged: StagedPhoto[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const check = validateImageFile(file);
      if (!check.valid) {
        setError(check.error);
        showToast(check.error, 'error');
        continue;
      }
      try {
        const compressed = await compressImageFile(file, 1400, 0.8);
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[_-]+/g, ' ');
        nextStaged.push({
          title: cleanName || 'Dokumentasi Pemuda',
          caption: '',
          imageUrl: compressed,
        });
      } catch {
        setError(`Gagal memproses file ${file.name}.`);
      }
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }
    setStaged((prev) => [...prev, ...nextStaged]);
    if (nextStaged.length > 0) {
      showToast(`${nextStaged.length} foto siap untuk disimpan.`);
    }
    setUploading(false);
    e.target.value = '';
  };

  const handleSaveAll = async () => {
    if (staged.length === 0) return;
    const now = new Date().toISOString();
    const records: GalleryPhoto[] = staged.map((s, idx) => ({
      id: `gal-${Date.now()}-${idx}`,
      title: s.title.trim() || 'Dokumentasi Pelayanan',
      category,
      caption: s.caption.trim() || s.title.trim(),
      takenAt,
      imageUrl: s.imageUrl,
      createdAt: now,
    }));
    try {
      await addGalleryPhotos(records);
      showToast(`${records.length} foto berhasil disimpan ke Firebase.`);
      setStaged([]);
      setProgress(0);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Gagal menyimpan foto galeri.',
        'error'
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[#0B1F3A]">
          Kelola Galeri Foto
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          Unggah beberapa foto sekaligus. Gambar otomatis dikompresi agar
          ringan dan tetap tersimpan saat halaman dimuat ulang.
        </p>
      </div>

      {/* Multi-upload Box */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="gal-cat"
              className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
            >
              Kategori Kegiatan
            </label>
            <select
              id="gal-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value as ActivityCategory)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="gal-date"
              className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
            >
              Tanggal Dokumentasi
            </label>
            <input
              id="gal-date"
              type="date"
              value={takenAt}
              onChange={(e) => setTakenAt(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
        </div>

        <label className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#C89B3C] bg-[#F6F8FB] cursor-pointer transition-colors text-center">
          <ImagePlus className="w-8 h-8 text-[#A87E26] mb-2" aria-hidden="true" />
          <span className="font-display font-semibold text-sm text-[#0B1F3A]">
            {uploading
              ? `Mengompresi foto (${progress}%)...`
              : 'Klik untuk memilih satu atau banyak foto (JPG, PNG, WEBP)'}
          </span>
          <span className="text-xs text-slate-500 mt-1">
            Pratinjau foto akan muncul sebelum disimpan ke Firebase
          </span>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFilesSelected}
            className="sr-only"
          />
        </label>

        {uploading && (
          <div className="space-y-1">
            <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-[#C89B3C] transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Animated Staged Previews */}
        {staged.length > 0 && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-[#0B1F3A]">
                Pratinjau Sebelum Disimpan ({staged.length} foto)
              </p>
              <button
                type="button"
                onClick={handleSaveAll}
                className="px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#122D52] text-white text-xs font-semibold"
              >
                Simpan {staged.length} Foto ke Galeri
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {staged.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="p-3 rounded-xl border border-slate-200 bg-[#F6F8FB] space-y-2"
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-200">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      setStaged((prev) =>
                        prev.map((p, i) =>
                          i === idx ? { ...p, title: e.target.value } : p
                        )
                      )
                    }
                    placeholder="Judul foto"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setStaged((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="text-xs text-red-600 font-semibold hover:underline"
                  >
                    Batalkan foto ini
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Existing Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sorted.map((photo) => (
          <motion.div
            key={photo.id}
            layout
            className="rounded-2xl bg-white border border-slate-200 hover:border-[#C89B3C]/60 overflow-hidden flex flex-col transition-colors"
          >
            <div className="aspect-[4/3] bg-slate-100">
              <SafeImage
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-[#A87E26]">
                  {photo.category} · {formatDateID(photo.takenAt)}
                </p>
                <p className="font-display font-bold text-sm text-[#0B1F3A] truncate mt-0.5">
                  {photo.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteTarget(photo)}
                aria-label={`Hapus foto ${photo.title}`}
                className="p-2 rounded-lg text-red-600 hover:bg-red-50 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Foto Galeri?"
        message={`Foto "${deleteTarget?.title || ''}" akan dihapus dari arsip galeri browser ini.`}
        confirmLabel="Hapus Foto"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            const title = deleteTarget.title;
            void removeGalleryPhoto(deleteTarget.id, title).then(() => {
              showToast(`Foto "${title}" dihapus dari galeri.`);
            }).catch((err: unknown) => {
              showToast(
                err instanceof Error ? err.message : 'Gagal menghapus foto.',
                'error'
              );
            });
          }
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
