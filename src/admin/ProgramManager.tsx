import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Edit2, Plus, Trash2, Upload, X } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { SafeImage } from '../components/SafeImage';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { compressImageFile } from '../services/storage';
import kopdaImage from '../assets/images/kopda.jpg';
import type { ProgramCategory, ProgramStatus, WorkProgram } from '../types';
import { validateImageFile } from '../utils/logic';

const CATEGORIES: ProgramCategory[] = [
  'Program Kerohanian',
  'Program Pembinaan Pemuda',
  'Program Pendidikan',
  'Program Olahraga',
  'Program Sosial',
  'Program Kreativitas dan Seni',
  'Program Penginjilan dan Misi',
  'Program Kebersamaan',
];

const STATUSES: ProgramStatus[] = ['Terencana', 'Berjalan', 'Selesai'];
const DEFAULT_IMG = kopdaImage;

export function ProgramManager() {
  const { programs, upsertProgram, removeProgram } = useAppData();
  const { showToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<WorkProgram | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WorkProgram | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] =
    useState<ProgramCategory>('Program Kerohanian');
  const [schedule, setSchedule] = useState('');
  const [status, setStatus] = useState<ProgramStatus>('Berjalan');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMG);
  const [error, setError] = useState<string | null>(null);

  const openNew = () => {
    setEditing(null);
    setName('');
    setCategory('Program Kerohanian');
    setSchedule('');
    setStatus('Berjalan');
    setDescription('');
    setImageUrl(DEFAULT_IMG);
    setError(null);
    setIsFormOpen(true);
  };

  const openEdit = (p: WorkProgram) => {
    setEditing(p);
    setName(p.name);
    setCategory(p.category);
    setSchedule(p.schedule);
    setStatus(p.status);
    setDescription(p.description);
    setImageUrl(p.imageUrl);
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
      const compressed = await compressImageFile(file);
      setImageUrl(compressed);
      setError(null);
      showToast('Foto ilustrasi program berhasil dikompresi.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses foto.';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3) {
      setError('Mohon isi nama program kerja.');
      return;
    }
    try {
      await upsertProgram({
        id: editing ? editing.id : `prog-${Date.now()}`,
        name: name.trim(),
        category,
        schedule: schedule.trim() || 'Menyesuaikan agenda',
        status,
        description: description.trim(),
        imageUrl: imageUrl || DEFAULT_IMG,
      });
      showToast(
        editing
          ? 'Program kerja berhasil diperbarui.'
          : 'Program kerja baru berhasil ditambahkan.'
      );
      setIsFormOpen(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal menyimpan program kerja.';
      setError(message);
      showToast(message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-[#0B1F3A]">
            Kelola Program Kerja
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Atur program kerja berdasarkan 8 kategori pelayanan pemuda.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#122D52] text-white text-sm font-semibold whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4 text-[#DCB458]" />
          <span>Tambah Program</span>
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
            className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm"
          >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-display font-bold text-lg text-[#0B1F3A]">
              {editing ? 'Edit Program Kerja' : 'Tambah Program Kerja'}
            </h3>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              aria-label="Tutup form program"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              <div>
                <label
                  htmlFor="prog-name"
                  className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                >
                  Nama Program *
                </label>
                <input
                  id="prog-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="prog-cat"
                    className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                  >
                    Kategori
                  </label>
                  <select
                    id="prog-cat"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as ProgramCategory)
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
                    htmlFor="prog-status"
                    className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                  >
                    Status
                  </label>
                  <select
                    id="prog-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProgramStatus)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="prog-sched"
                    className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                  >
                    Jadwal
                  </label>
                  <input
                    id="prog-sched"
                    type="text"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    placeholder="Contoh: Setiap Sabtu"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="prog-desc"
                  className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                >
                  Deskripsi Program
                </label>
                <textarea
                  id="prog-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-3">
              <p className="text-xs font-semibold text-[#0B1F3A]">
                Foto Ilustrasi
              </p>
              <div className="aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <SafeImage
                  src={imageUrl}
                  alt="Ilustrasi program"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#F6F8FB] border border-slate-200 text-xs font-semibold text-[#0B1F3A] cursor-pointer">
                <Upload className="w-4 h-4 text-[#A87E26]" />
                <span>Pilih Gambar</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImage}
                  className="sr-only"
                />
              </label>
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
              Simpan Program
            </button>
          </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
        {programs.map((p) => (
          <div
            key={p.id}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                <SafeImage
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">
                  <span className="font-semibold text-[#A87E26]">
                    {p.category}
                  </span>{' '}
                  · {p.status} · {p.schedule}
                </p>
                <h4 className="font-display font-bold text-sm text-[#0B1F3A] truncate mt-0.5">
                  {p.name}
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => openEdit(p)}
                aria-label={`Edit program ${p.name}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#0B1F3A]"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(p)}
                aria-label={`Hapus program ${p.name}`}
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
        title="Hapus Program Kerja?"
        message={`Program "${deleteTarget?.name || ''}" akan dihapus.`}
        confirmLabel="Hapus"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            void removeProgram(deleteTarget.id, deleteTarget.name)
              .then(() =>
                showToast(`Program "${deleteTarget.name}" telah dihapus.`, 'info')
              )
              .catch((err: unknown) =>
                showToast(
                  err instanceof Error ? err.message : 'Gagal menghapus program.',
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
