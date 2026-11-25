import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Edit2, Plus, Trash2, Upload, X } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { SafeImage } from '../components/SafeImage';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { compressImageFile } from '../services/storage';
import retreatImage from '../assets/images/youth_fellowship_retreat_1795265001584.jpg';
import type { ActivityCategory, ActivityItem, ActivityStatus } from '../types';
import { filterActivities, formatDateID, validateImageFile } from '../utils/logic';

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

const STATUSES: ActivityStatus[] = [
  'Akan Datang',
  'Sedang Berlangsung',
  'Selesai',
];

const DEFAULT_IMG = retreatImage;

export function ActivityManager() {
  const { activities, upsertActivity, removeActivity } = useAppData();
  const { showToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<ActivityItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ActivityItem | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('Ibadah Pemuda');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('17.00 WIT');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ActivityStatus>('Akan Datang');
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMG);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const sorted = filterActivities(activities, 'Semua', 'Semua');

  const openNew = () => {
    setEditing(null);
    setName('');
    setCategory('Ibadah Pemuda');
    setDate(new Date().toISOString().slice(0, 10));
    setTime('17.00 WIT');
    setLocation('');
    setDescription('');
    setStatus('Akan Datang');
    setImageUrl(DEFAULT_IMG);
    setError(null);
    setIsFormOpen(true);
  };

  const openEdit = (item: ActivityItem) => {
    setEditing(item);
    setName(item.name);
    setCategory(item.category);
    setDate(item.date);
    setTime(item.time || '');
    setLocation(item.location);
    setDescription(item.description);
    setStatus(item.status);
    setImageUrl(item.imageUrl);
    setError(null);
    setIsFormOpen(true);
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const check = validateImageFile(file);
    if (!check.valid) {
      setError(check.error);
      showToast(check.error, 'error');
      return;
    }
    try {
      setUploadProgress(45);
      const compressed = await compressImageFile(file);
      setUploadProgress(100);
      setImageUrl(compressed);
      setError(null);
      showToast('Foto kegiatan berhasil dikompresi.');
      window.setTimeout(() => setUploadProgress(null), 600);
    } catch (err) {
      setUploadProgress(null);
      const msg = err instanceof Error ? err.message : 'Gagal memproses foto.';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3 || location.trim().length < 2) {
      setError('Mohon isi nama kegiatan dan lokasi dengan lengkap.');
      return;
    }
    try {
      await upsertActivity({
        id: editing ? editing.id : `act-${Date.now()}`,
        name: name.trim(),
        category,
        date,
        time: time.trim(),
        location: location.trim(),
        description: description.trim(),
        status,
        imageUrl: imageUrl || DEFAULT_IMG,
        updatedAt: new Date().toISOString(),
      });
      showToast(
        editing
          ? 'Perubahan kegiatan berhasil disimpan.'
          : 'Kegiatan baru berhasil ditambahkan.'
      );
      setIsFormOpen(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal menyimpan kegiatan.';
      setError(message);
      showToast(message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-[#0B1F3A]">
            Kelola Kegiatan Pemuda
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Tambahkan jadwal ibadah, retreat, seminar, olahraga, atau bakti
            sosial.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#122D52] text-white text-sm font-semibold whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4 text-[#DCB458]" aria-hidden="true" />
          <span>Tambah Kegiatan</span>
        </button>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.form
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5 shadow-sm"
          >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-display font-bold text-lg text-[#0B1F3A]">
              {editing ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
            </h3>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              aria-label="Tutup form kegiatan"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              <div>
                <label
                  htmlFor="act-name"
                  className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                >
                  Nama Kegiatan *
                </label>
                <input
                  id="act-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Ibadah Gabungan Pemuda..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C89B3C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="act-cat"
                    className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                  >
                    Kategori
                  </label>
                  <select
                    id="act-cat"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as ActivityCategory)
                    }
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
                    htmlFor="act-status"
                    className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                  >
                    Status Kegiatan
                  </label>
                  <select
                    id="act-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ActivityStatus)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="act-date"
                    className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                  >
                    Tanggal
                  </label>
                  <input
                    id="act-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="act-time"
                    className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                  >
                    Waktu
                  </label>
                  <input
                    id="act-time"
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="17.00 WIT"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="act-loc"
                    className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                  >
                    Lokasi *
                  </label>
                  <input
                    id="act-loc"
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Gedung Gereja / Wamena"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="act-desc"
                  className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                >
                  Deskripsi Kegiatan
                </label>
                <textarea
                  id="act-desc"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-3">
              <p className="text-xs font-semibold text-[#0B1F3A]">
                Foto Kegiatan
              </p>
              <div className="aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <SafeImage
                  src={imageUrl}
                  alt="Pratinjau foto kegiatan"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#F6F8FB] border border-slate-200 hover:border-[#0B1F3A] text-xs font-semibold text-[#0B1F3A] cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-[#A87E26]" aria-hidden="true" />
                <span>Pilih Foto</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImage}
                  className="sr-only"
                />
              </label>
              {uploadProgress !== null && (
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-[#C89B3C] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-sm font-medium text-slate-700"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#122D52] text-white text-sm font-semibold transition-colors"
            >
              Simpan Kegiatan
            </button>
          </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
        {sorted.map((act) => (
          <div
            key={act.id}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                <SafeImage
                  src={act.imageUrl}
                  alt={act.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 mb-0.5">
                  <span className="font-semibold text-[#A87E26]">
                    {act.category}
                  </span>{' '}
                  · {formatDateID(act.date)} · {act.status}
                </p>
                <h4 className="font-display font-bold text-sm text-[#0B1F3A] truncate">
                  {act.name}
                </h4>
                <p className="text-xs text-slate-500 truncate">{act.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => openEdit(act)}
                aria-label={`Edit kegiatan ${act.name}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#0B1F3A]"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(act)}
                aria-label={`Hapus kegiatan ${act.name}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Kegiatan?"
        message={`Kegiatan "${deleteTarget?.name || ''}" akan dihapus dari daftar.`}
        confirmLabel="Hapus"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            void removeActivity(deleteTarget.id, deleteTarget.name)
              .then(() =>
                showToast(`Kegiatan "${deleteTarget.name}" telah dihapus.`, 'info')
              )
              .catch((err: unknown) =>
                showToast(
                  err instanceof Error ? err.message : 'Gagal menghapus kegiatan.',
                  'error'
                )
              );
          }
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
