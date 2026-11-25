import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Edit2, Plus, Search, Trash2, Upload, X } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { NewsShareActions } from '../components/NewsShareActions';
import { SafeImage } from '../components/SafeImage';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { compressImageFile } from '../services/storage';
import pemudaImage from '../assets/images/pemuda.jpg';
import type { NewsCategory, NewsItem, NewsStatus } from '../types';
import { filterNews, formatDateID, validateImageFile } from '../utils/logic';

const CATEGORIES: NewsCategory[] = [
  'Pelayanan',
  'Ibadah',
  'Pembinaan',
  'Sosial',
  'Pengumuman',
];

const DEFAULT_IMG = pemudaImage;

export function NewsManager() {
  const { news, upsertNews, removeNews } = useAppData();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [shareableNews, setShareableNews] = useState<NewsItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NewsCategory>('Pelayanan');
  const [publishedAt, setPublishedAt] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [status, setStatus] = useState<NewsStatus>('published');
  const [author, setAuthor] = useState('Bidang Multimedia & Dokumentasi');
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMG);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const filtered = filterNews(news, query, 'Semua', true);

  const openNew = () => {
    setEditing(null);
    setShareableNews(null);
    setTitle('');
    setSummary('');
    setContent('');
    setCategory('Pelayanan');
    setPublishedAt(new Date().toISOString().slice(0, 10));
    setStatus('published');
    setAuthor('Bidang Multimedia & Dokumentasi');
    setImageUrl(DEFAULT_IMG);
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEdit = (item: NewsItem) => {
    setEditing(item);
    setShareableNews(null);
    setTitle(item.title);
    setSummary(item.summary);
    setContent(item.content);
    setCategory(item.category);
    setPublishedAt(item.publishedAt);
    setStatus(item.status);
    setAuthor(item.author);
    setImageUrl(item.imageUrl);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormError(null);
    const check = validateImageFile(file);
    if (!check.valid) {
      setFormError(check.error);
      showToast(check.error, 'error');
      return;
    }
    try {
      setUploadProgress(40);
      const compressed = await compressImageFile(file);
      setUploadProgress(100);
      setImageUrl(compressed);
      showToast('Foto berita berhasil dikompresi & siap disimpan.');
      window.setTimeout(() => setUploadProgress(null), 600);
    } catch (err) {
      setUploadProgress(null);
      setFormError(
        err instanceof Error ? err.message : 'Gagal memproses gambar.'
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (title.trim().length < 3) {
      setFormError('Judul berita minimal 3 karakter.');
      return;
    }
    if (summary.trim().length < 10) {
      setFormError('Ringkasan berita minimal 10 karakter.');
      return;
    }
    if (content.trim().length < 15) {
      setFormError('Isi berita lengkap minimal 15 karakter.');
      return;
    }

    setSaving(true);
    try {
      const item: NewsItem = {
        id: editing ? editing.id : `news-${Date.now()}`,
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        category,
        publishedAt,
        status,
        author: author.trim() || 'Redaksi Pemuda',
        imageUrl: imageUrl || DEFAULT_IMG,
        updatedAt: new Date().toISOString(),
      };
      await upsertNews(item);
      setShareableNews(item.status === 'published' ? item : null);
      showToast(
        editing
          ? `Berita "${item.title}" berhasil diperbarui.`
          : `Berita "${item.title}" berhasil disimpan.`
      );
      setIsFormOpen(false);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Gagal menyimpan berita.'
      );
      showToast('Gagal menyimpan berita.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-[#0B1F3A]">
            Kelola Berita Organisasi
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Berita berstatus Terbit langsung muncul di Beranda dan halaman Berita.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#122D52] text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4 text-[#DCB458]" aria-hidden="true" />
          <span>Tambah Berita</span>
        </button>
      </div>

      {shareableNews && (
        <section
          aria-label="Bagikan berita yang baru diterbitkan"
          className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3"
        >
          <div>
            <h3 className="font-display font-bold text-sm text-emerald-900">
              Berita berhasil diterbitkan
            </h3>
            <p className="mt-1 text-xs text-emerald-800">
              Bagikan link berita ini kepada pengguna:
            </p>
          </div>
          <NewsShareActions
            url={`${window.location.origin}/berita/${encodeURIComponent(
              shareableNews.id
            )}`}
            title={shareableNews.title}
            summary={shareableNews.summary}
          />
        </section>
      )}

      {/* Animated Form Editor */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            onSubmit={handleSubmit}
            className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5 shadow-sm"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-display font-bold text-lg text-[#0B1F3A]">
                {editing ? 'Edit Berita' : 'Tambah Berita Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                aria-label="Tutup form berita"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-4">
                <div>
                  <label
                    htmlFor="news-title"
                    className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                  >
                    Judul Berita *
                  </label>
                  <input
                    id="news-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masukkan judul berita..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C89B3C]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="news-category"
                      className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                    >
                      Kategori
                    </label>
                    <select
                      id="news-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as NewsCategory)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C89B3C]"
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
                      htmlFor="news-date"
                      className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                    >
                      Tanggal Publikasi
                    </label>
                    <input
                      id="news-date"
                      type="date"
                      value={publishedAt}
                      onChange={(e) => setPublishedAt(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C89B3C]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="news-status"
                      className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                    >
                      Status Publikasi
                    </label>
                    <select
                      id="news-status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as NewsStatus)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C89B3C]"
                    >
                      <option value="published">Terbit (Publik)</option>
                      <option value="draft">Draft (Disimpan)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="news-summary"
                    className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                  >
                    Ringkasan Berita *
                  </label>
                  <textarea
                    id="news-summary"
                    rows={2}
                    required
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Ringkasan singkat 1-2 kalimat..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C89B3C]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="news-content"
                    className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                  >
                    Isi Berita Lengkap *
                  </label>
                  <textarea
                    id="news-content"
                    rows={6}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tuliskan isi berita lengkap (pisahkan paragraf dengan Enter)..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C89B3C]"
                  />
                </div>
              </div>

              <div className="lg:col-span-4 space-y-4">
                <div>
                  <label
                    htmlFor="news-author"
                    className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
                  >
                    Penulis / Bidang
                  </label>
                  <input
                    id="news-author"
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C89B3C]"
                  />
                </div>

                <div>
                  <p className="block text-xs font-semibold text-[#0B1F3A] mb-1.5">
                    Foto Berita (Pratinjau & Kompresi Otomatis)
                  </p>
                  <motion.div
                    key={imageUrl}
                    initial={{ opacity: 0.5, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className="aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mb-3"
                  >
                    <SafeImage
                      src={imageUrl}
                      alt="Pratinjau foto berita"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {uploadProgress !== null && (
                    <div className="mb-3 space-y-1">
                      <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-[#C89B3C] transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 tabular-nums">
                        Memproses gambar: {uploadProgress}%
                      </p>
                    </div>
                  )}

                  <label className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#F6F8FB] border border-slate-200 hover:border-[#0B1F3A] text-xs font-semibold text-[#0B1F3A] cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-[#A87E26]" aria-hidden="true" />
                    <span>Unggah Foto dari Perangkat</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            </div>

            {formError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700"
              >
                {formError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#122D52] text-white text-sm font-semibold disabled:opacity-60"
              >
                {saving ? 'Menyimpan...' : 'Simpan Berita'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Search & Animated Row List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari berita..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C89B3C]"
            />
          </div>
          <span className="text-xs text-slate-500 tabular-nums shrink-0">
            {filtered.length} berita
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Belum ada data berita.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F6F8FB]/80 transition-colors"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    <SafeImage
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-[#A87E26]">
                        {item.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{formatDateID(item.publishedAt)}</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={`font-semibold ${
                          item.status === 'published'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {item.status === 'published' ? 'Terbit' : 'Draft'}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-sm text-[#0B1F3A] truncate">
                      {item.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    aria-label={`Edit berita ${item.title}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#0B1F3A] text-xs font-semibold text-[#0B1F3A]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    aria-label={`Hapus berita ${item.title}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-xs font-semibold text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Berita?"
        message={`Berita "${deleteTarget?.title || ''}" akan dihapus permanen dari penyimpanan browser ini.`}
        confirmLabel="Hapus Berita"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            const deletedTitle = deleteTarget.title;
            void removeNews(deleteTarget.id, deletedTitle).then(() => {
              showToast(`Berita "${deletedTitle}" telah dihapus.`);
            }).catch((err: unknown) => {
              showToast(
                err instanceof Error ? err.message : 'Gagal menghapus berita.',
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
