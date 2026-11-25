import { useState, type FormEvent } from 'react';
import { Edit2, Plus, Trash2, X } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import type { Congregation } from '../types';

export function ChurchManager() {
  const { churches, upsertChurch, removeChurch } = useAppData();
  const { showToast } = useToast();
  const [editing, setEditing] = useState<Congregation | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Congregation | null>(null);
  const [name, setName] = useState('');
  const [youthCount, setYouthCount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const openNew = () => {
    setEditing(null);
    setName('');
    setYouthCount('');
    setError(null);
    setFormOpen(true);
  };

  const openEdit = (church: Congregation) => {
    setEditing(church);
    setName(church.name);
    setYouthCount(church.youthCount === null ? '' : String(church.youthCount));
    setError(null);
    setFormOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const count = youthCount.trim() === '' ? null : Number(youthCount);
    if (trimmedName.length < 3) {
      setError('Nama jemaat minimal 3 karakter.');
      return;
    }
    if (
      count !== null &&
      (!Number.isSafeInteger(count) || count < 0)
    ) {
      setError('Jumlah pemuda harus berupa bilangan bulat nol atau lebih.');
      return;
    }

    const order =
      editing?.order ??
      Math.max(0, ...churches.map((church) => church.order)) + 1;
    const church: Congregation = {
      id: editing?.id ?? `church-${Date.now()}`,
      name: trimmedName,
      youthCount: count,
      order,
    };

    try {
      await upsertChurch(church);
      setFormOpen(false);
      showToast(editing ? 'Data jemaat berhasil diperbarui.' : 'Jemaat berhasil ditambahkan.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan data jemaat.';
      setError(message);
      showToast(message, 'error');
    }
  };

  const sortedChurches = [...churches].sort((a, b) => a.order - b.order);
  const knownYouthCount = churches.reduce(
    (total, church) => total + (church.youthCount ?? 0),
    0
  );
  const reportedChurches = churches.filter(
    (church) => church.youthCount !== null
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-[#0B1F3A]">
            Kelola Data Jemaat
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Perbarui nama jemaat dan jumlah pemuda. Data akan tampil di halaman publik.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#122D52] text-white text-sm font-semibold whitespace-nowrap"
        >
          <Plus className="w-4 h-4 text-[#DCB458]" />
          <span>Tambah Jemaat</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200">
          <p className="text-xs font-medium text-slate-500">Jumlah Jemaat</p>
          <p className="font-display text-3xl font-bold text-[#0B1F3A] mt-1">
            {churches.length}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200">
          <p className="text-xs font-medium text-slate-500">Jumlah Pemuda Tercatat</p>
          <p className="font-display text-3xl font-bold text-[#0B1F3A] mt-1">
            {knownYouthCount}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Data sudah diisi untuk {reportedChurches} dari {churches.length} jemaat
          </p>
        </div>
      </div>

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-display font-bold text-lg text-[#0B1F3A]">
              {editing ? 'Edit Data Jemaat' : 'Tambah Jemaat'}
            </h3>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              aria-label="Tutup form jemaat"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="church-name" className="block text-xs font-semibold text-[#0B1F3A] mb-1.5">
                Nama Jemaat *
              </label>
              <input
                id="church-name"
                required
                minLength={3}
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label htmlFor="church-youth-count" className="block text-xs font-semibold text-[#0B1F3A] mb-1.5">
                Jumlah Pemuda
              </label>
              <input
                id="church-youth-count"
                type="number"
                min="0"
                step="1"
                value={youthCount}
                onChange={(event) => setYouthCount(event.target.value)}
                placeholder="Kosongkan jika belum didata"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>
          {error && (
            <p role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-sm font-medium text-slate-700"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#122D52] text-white text-sm font-semibold"
            >
              Simpan Jemaat
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
        {sortedChurches.map((church, index) => (
          <div
            key={church.id}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3 min-w-0">
              <span className="w-9 h-9 rounded-xl bg-[#F9F1DC] text-[#A87E26] flex items-center justify-center text-xs font-bold shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h4 className="font-display font-bold text-sm text-[#0B1F3A]">
                  {church.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {church.youthCount === null
                    ? 'Jumlah pemuda belum didata'
                    : `${church.youthCount} pemuda`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => openEdit(church)}
                aria-label={`Edit jemaat ${church.name}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#0B1F3A]"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(church)}
                aria-label={`Hapus jemaat ${church.name}`}
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
        title="Hapus Data Jemaat?"
        message={`Data "${deleteTarget?.name || ''}" akan dihapus.`}
        confirmLabel="Hapus"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            void removeChurch(deleteTarget.id, deleteTarget.name)
              .then(() => showToast(`Jemaat "${deleteTarget.name}" telah dihapus.`, 'info'))
              .catch((err: unknown) =>
                showToast(
                  err instanceof Error ? err.message : 'Gagal menghapus data jemaat.',
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
