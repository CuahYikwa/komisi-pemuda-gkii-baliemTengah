import React, { useEffect, useState } from 'react';
import {
  Download,
  HardDrive,
  Info,
  RotateCcw,
  Upload,
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import {
  createBackupPayload,
  downloadBackupFile,
  parseAndValidateBackupFile,
  restoreFromBackupPayload,
} from '../services/backup';
import { estimateStorageUsage } from '../services/database';
import type { BackupPayload } from '../types';

export function BackupManager() {
  const { refreshAll, resetToSeedData, recordLog } = useAppData();
  const { showToast } = useToast();
  const [usage, setUsage] = useState<{
    usedBytes: number;
    quotaBytes: number;
  } | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pendingRestore, setPendingRestore] = useState<BackupPayload | null>(
    null
  );
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    void estimateStorageUsage().then(setUsage);
  }, []);

  const handleExport = async () => {
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      const payload = await createBackupPayload();
      const filename = downloadBackupFile(payload);
      await recordLog(`Mengunduh file backup ${filename}`, 'Backup');
      const msg = `Backup berhasil diunduh: ${filename}`;
      setStatusMsg(msg);
      showToast(msg);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Gagal membuat file backup.';
      setErrorMsg(msg);
      showToast(msg, 'error');
    }
  };

  const handleFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg(null);
    setStatusMsg(null);
    const result = await parseAndValidateBackupFile(file);
    if (!result.valid) {
      setErrorMsg(result.error);
      showToast(result.error, 'error');
      e.target.value = '';
      return;
    }
    setPendingRestore(result.payload);
    e.target.value = '';
  };

  const confirmRestore = async () => {
    if (!pendingRestore) return;
    try {
      await restoreFromBackupPayload(pendingRestore);
      await refreshAll();
      await recordLog('Memulihkan seluruh data dari file backup JSON', 'Backup');
      const msg = 'Seluruh data berhasil dipulihkan dari file backup.';
      setStatusMsg(msg);
      showToast(msg);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Gagal memulihkan backup.';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setPendingRestore(null);
    }
  };

  const formatMB = (bytes: number) =>
    `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[#0B1F3A]">
          Backup & Restore Data Website
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          Ekspor seluruh berita, kegiatan, foto galeri, pengurus, program kerja,
          dan pengaturan ke file JSON untuk dipindahkan ke perangkat lain.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-[#F9F1DC] border border-[#C89B3C]/40 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#A87E26] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-[#0B1F3A] leading-relaxed">
          <p className="font-bold">Catatan Penyimpanan Website</p>
          <p className="mt-1">
            Data utama disimpan di Firebase agar dapat ditampilkan kepada
            pengunjung dan perangkat lain. Ekspor backup JSON secara berkala
            sebagai salinan cadangan.
          </p>
        </div>
      </div>

      {/* Storage Usage */}
      {usage && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B1F3A] text-[#DCB458] flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">
                Estimasi Ruang Penyimpanan Browser
              </p>
              <p className="font-mono text-sm font-bold text-[#0B1F3A] tabular-nums">
                Terpakai {formatMB(usage.usedBytes)} dari kuota{' '}
                {formatMB(usage.quotaBytes)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
          <h3 className="font-display font-bold text-base text-[#0B1F3A]">
            1. Ekspor Cadangan (Backup JSON)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Mengunduh arsip lengkap berisi seluruh berita, kegiatan, foto
            galeri, struktur pengurus, program kerja, dan pengaturan website.
          </p>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#122D52] text-white text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4 text-[#DCB458]" />
            <span>Unduh Backup JSON</span>
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
          <h3 className="font-display font-bold text-base text-[#0B1F3A]">
            2. Pulihkan Data (Restore JSON)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Pilih file <code>.json</code> hasil backup sebelumnya untuk
            mengembalikan seluruh konten website ke browser ini.
          </p>
          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C89B3C] hover:bg-[#DCB458] text-[#071426] text-sm font-semibold cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span>Pilih File Backup (.json)</span>
            <input
              type="file"
              accept="application/json,.json"
              onChange={handleFilePick}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {/* Reset Option */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-sm text-[#0B1F3A]">
            Kembalikan ke Data Contoh Bawaan
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Mengganti konten Firebase saat ini dengan data contoh awal.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Data Awal</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-medium text-emerald-800">
          {statusMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm font-medium text-red-700">
          {errorMsg}
        </div>
      )}

      <ConfirmModal
        open={Boolean(pendingRestore)}
        title="Pulihkan Data dari Backup?"
        message={`File backup dari tanggal ${
          pendingRestore?.exportedAt.slice(0, 10) || ''
        } valid (${pendingRestore?.data.news.length || 0} berita, ${
          pendingRestore?.data.activities.length || 0
        } kegiatan, ${
          pendingRestore?.data.gallery.length || 0
        } foto). Data website saat ini akan diganti dengan isi backup.`}
        confirmLabel="Ya, Pulihkan Data"
        danger={false}
        onCancel={() => setPendingRestore(null)}
        onConfirm={() => void confirmRestore()}
      />

      <ConfirmModal
        open={confirmReset}
        title="Reset ke Data Awal?"
        message="Semua berita, foto, dan perubahan yang belum diekspor ke JSON akan digantikan dengan data contoh awal."
        confirmLabel="Ya, Reset Sekarang"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          void resetToSeedData()
            .then(() => {
              setConfirmReset(false);
              const msg = 'Data berhasil dikembalikan ke pengaturan awal.';
              setStatusMsg(msg);
              showToast(msg);
            })
            .catch((err: unknown) => {
              const msg =
                err instanceof Error ? err.message : 'Gagal mereset data.';
              setErrorMsg(msg);
              showToast(msg, 'error');
            });
        }}
      />
    </div>
  );
}
