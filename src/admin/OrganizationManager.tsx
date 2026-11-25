import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Edit2, Plus, Trash2, Upload, User, X } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { SafeImage } from '../components/SafeImage';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { compressImageFile } from '../services/storage';
import type {
  DivisionName,
  OrganizationMember,
  OrganizationRole,
} from '../types';
import { validateImageFile } from '../utils/logic';

const ROLES: OrganizationRole[] = [
  'Ketua',
  'Wakil Ketua',
  'Sekretaris',
  'Wakil Sekretaris',
  'Bendahara',
  'Wakil Bendahara',
  'Koordinator Bidang',
  'Anggota',
];

const DIVISIONS: DivisionName[] = [
  'Pengurus Inti',
  'Bidang Kerohanian',
  'Bidang Musik dan Pujian',
  'Bidang Media Digital',
  'Bidang Minat dan bakat',
  'Bidang Pendidikan dan Litbang',
  'Bidang Penginjilan',
  'Bidang Doa',
  'Bidang Usaha Dana',
];

export function OrganizationManager() {
  const { members, upsertMember, removeMember } = useAppData();
  const { showToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<OrganizationMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<OrganizationMember | null>(
    null
  );

  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<OrganizationRole>('Koordinator Bidang');
  const [division, setDivision] = useState<DivisionName>('Bidang Kerohanian');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [order, setOrder] = useState(10);
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const sorted = [...members].sort((a, b) => a.order - b.order);

  const openNew = () => {
    setEditing(null);
    setFullName('');
    setRole('Koordinator Bidang');
    setDivision('Bidang Kerohanian');
    setDescription('');
    setContact('');
    setOrder(members.length + 1);
    setPhotoUrl('');
    setError(null);
    setIsFormOpen(true);
  };

  const openEdit = (m: OrganizationMember) => {
    setEditing(m);
    setFullName(m.fullName);
    setRole(m.role);
    setDivision(m.division);
    setDescription(m.description);
    setContact(m.contact || '');
    setOrder(m.order);
    setPhotoUrl(m.photoUrl);
    setError(null);
    setIsFormOpen(true);
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const check = validateImageFile(file);
    if (!check.valid) {
      setError(check.error);
      showToast(check.error, 'error');
      return;
    }
    try {
      const compressed = await compressImageFile(file, 600, 0.82);
      setPhotoUrl(compressed);
      setError(null);
      showToast('Foto profil berhasil dikompresi.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses foto.';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim().length < 2) {
      setError('Mohon isi nama lengkap atau label pengurus.');
      return;
    }
    try {
      await upsertMember({
        id: editing ? editing.id : `mem-${Date.now()}`,
        fullName: fullName.trim(),
        role,
        division,
        description: description.trim(),
        contact: contact.trim() || undefined,
        order: Number(order) || 1,
        photoUrl,
      });
      showToast(
        editing
          ? 'Data pengurus berhasil diperbarui.'
          : 'Pengurus baru berhasil ditambahkan.'
      );
      setIsFormOpen(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal menyimpan data pengurus.';
      setError(message);
      showToast(message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-[#0B1F3A]">
            Kelola Struktur Organisasi
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Ganti nama placeholder bawaan dengan nama resmi pengurus Komisi
            Pemuda Pemudi GKII Baliem Tengah.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#122D52] text-white text-sm font-semibold whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4 text-[#DCB458]" aria-hidden="true" />
          <span>Tambah Pengurus</span>
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
              {editing ? 'Edit Data Pengurus' : 'Tambah Pengurus Baru'}
            </h3>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              aria-label="Tutup form pengurus"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="mem-name"
                    className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                  >
                    Nama Lengkap *
                  </label>
                  <input
                    id="mem-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nama lengkap pengurus"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="mem-contact"
                    className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                  >
                    Kontak (Opsional)
                  </label>
                  <input
                    id="mem-contact"
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="No. WA atau email"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="mem-role"
                    className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                  >
                    Jabatan
                  </label>
                  <select
                    id="mem-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as OrganizationRole)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="mem-div"
                    className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                  >
                    Bidang
                  </label>
                  <select
                    id="mem-div"
                    value={division}
                    onChange={(e) => setDivision(e.target.value as DivisionName)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {DIVISIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="mem-order"
                    className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                  >
                    Urutan Tampil
                  </label>
                  <input
                    id="mem-order"
                    type="number"
                    min={1}
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="mem-desc"
                  className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                >
                  Deskripsi Tugas Singkat
                </label>
                <textarea
                  id="mem-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-3">
              <p className="text-xs font-semibold text-[#0B1F3A]">
                Foto Profil (Opsional)
              </p>
              <div className="w-32 h-32 rounded-2xl overflow-hidden border border-slate-200 bg-[#F6F8FB] flex items-center justify-center">
                {photoUrl ? (
                  <SafeImage
                    src={photoUrl}
                    alt="Foto profil pengurus"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-slate-400" />
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F6F8FB] border border-slate-200 text-xs font-semibold text-[#0B1F3A] cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[#A87E26]" />
                  <span>Unggah Foto</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhoto}
                    className="sr-only"
                  />
                </label>
                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Hapus Foto
                  </button>
                )}
              </div>
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
              Simpan Pengurus
            </button>
          </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
        {sorted.map((m) => (
          <div
            key={m.id}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-[#F6F8FB] border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                {m.photoUrl ? (
                  <SafeImage
                    src={m.photoUrl}
                    alt={m.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-[#0B1F3A]/60" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#A87E26]">
                  {m.role} · {m.division}
                </p>
                <h4 className="font-display font-bold text-sm text-[#0B1F3A] truncate">
                  {m.fullName}
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => openEdit(m)}
                aria-label={`Edit pengurus ${m.fullName}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#0B1F3A]"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(m)}
                aria-label={`Hapus pengurus ${m.fullName}`}
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
        title="Hapus Pengurus?"
        message={`Data "${deleteTarget?.fullName || ''}" akan dihapus dari bagan struktur organisasi.`}
        confirmLabel="Hapus"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            void removeMember(deleteTarget.id, deleteTarget.fullName)
              .then(() =>
                showToast(`Data "${deleteTarget.fullName}" telah dihapus.`, 'info')
              )
              .catch((err: unknown) =>
                showToast(
                  err instanceof Error ? err.message : 'Gagal menghapus pengurus.',
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
