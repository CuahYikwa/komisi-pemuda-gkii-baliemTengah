import type {
  ActivityCategory,
  ActivityItem,
  ActivityStatus,
  BackupPayload,
  GalleryPhoto,
  NewsCategory,
  NewsItem,
  OrganizationMember,
  ProgramCategory,
  WorkProgram,
} from '../types';

export function filterNews(
  items: NewsItem[],
  query: string,
  category: NewsCategory | 'Semua',
  includeDrafts = false
): NewsItem[] {
  const normalizedQuery = query.trim().toLowerCase();
  return [...items]
    .filter((item) => {
      if (!includeDrafts && item.status !== 'published') {
        return false;
      }
      if (category !== 'Semua' && item.category !== category) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }
      return (
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.summary.toLowerCase().includes(normalizedQuery) ||
        item.content.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery)
      );
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getRelatedNews(
  items: NewsItem[],
  currentId: string,
  limit = 3
): NewsItem[] {
  const published = items.filter(
    (item) => item.status === 'published' && item.id !== currentId
  );
  const current = items.find((item) => item.id === currentId);
  if (!current) {
    return published.slice(0, limit);
  }
  const sameCategory = published.filter(
    (item) => item.category === current.category
  );
  const others = published.filter((item) => item.category !== current.category);
  return [...sameCategory, ...others].slice(0, limit);
}

export function filterActivities(
  items: ActivityItem[],
  category: ActivityCategory | 'Semua',
  status: ActivityStatus | 'Semua' = 'Semua',
  query = ''
): ActivityItem[] {
  const q = query.trim().toLowerCase();
  return [...items]
    .filter((item) => {
      if (category !== 'Semua' && item.category !== category) return false;
      if (status !== 'Semua' && item.status !== status) return false;
      if (
        q &&
        !item.name.toLowerCase().includes(q) &&
        !item.location.toLowerCase().includes(q) &&
        !item.description.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function filterGallery(
  items: GalleryPhoto[],
  category: ActivityCategory | 'Semua'
): GalleryPhoto[] {
  return [...items]
    .filter((item) => category === 'Semua' || item.category === category)
    .sort((a, b) => b.takenAt.localeCompare(a.takenAt));
}

export function filterPrograms(
  items: WorkProgram[],
  category: ProgramCategory | 'Semua'
): WorkProgram[] {
  return items.filter(
    (item) => category === 'Semua' || item.category === category
  );
}

export interface OrganizationTiers {
  executive: OrganizationMember[]; // Ketua, Wakil Ketua
  secretariatTreasury: OrganizationMember[]; // Sekretaris, Wakil Sekretaris, Bendahara, Wakil Bendahara
  coordinators: OrganizationMember[]; // Koordinator Bidang
  members: OrganizationMember[]; // Anggota
}

export function groupMembersByTier(
  members: OrganizationMember[]
): OrganizationTiers {
  const sorted = [...members].sort((a, b) => a.order - b.order);
  return {
    executive: sorted.filter(
      (m) => m.role === 'Ketua' || m.role === 'Wakil Ketua'
    ),
    secretariatTreasury: sorted.filter(
      (m) =>
        m.role === 'Sekretaris' ||
        m.role === 'Wakil Sekretaris' ||
        m.role === 'Bendahara' ||
        m.role === 'Wakil Bendahara'
    ),
    coordinators: sorted.filter((m) => m.role === 'Koordinator Bidang'),
    members: sorted.filter((m) => m.role === 'Anggota'),
  };
}

export function normalizeWhatsAppDigits(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) {
    return `62${digits.slice(1)}`;
  }
  if (digits.startsWith('8')) {
    return `62${digits}`;
  }
  return digits;
}

export interface ContactMessageInput {
  name: string;
  churchOrOrigin: string;
  subject: string;
  message: string;
}

export function buildWhatsAppUrl(
  rawPhone: string,
  input: ContactMessageInput
): { ok: true; url: string; previewText: string } | { ok: false; error: string } {
  const name = input.name.trim();
  const subject = input.subject.trim();
  const message = input.message.trim();
  const origin = input.churchOrOrigin.trim();

  if (name.length < 2) {
    return { ok: false, error: 'Mohon isi nama lengkap minimal 2 karakter.' };
  }
  if (message.length < 5) {
    return { ok: false, error: 'Mohon tuliskan pesan Anda minimal 5 karakter.' };
  }

  const normalizedPhone = normalizeWhatsAppDigits(rawPhone);
  if (normalizedPhone.length < 10) {
    return { ok: false, error: 'Nomor WhatsApp tujuan belum dikonfigurasi dengan valid.' };
  }

  const lines = [
    'Shalom Pengurus Komisi Pemuda Pemudi GKII Baliem Tengah,',
    '',
    `Nama: ${name}`,
    origin ? `Jemaat/Asal: ${origin}` : '',
    subject ? `Perihal: ${subject}` : '',
    `Pesan: ${message}`,
  ].filter((line, idx) => line !== '' || idx === 1);

  const previewText = lines.join('\n');
  const url = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(previewText)}`;
  return { ok: true, url, previewText };
}

export function validateImageFile(file: {
  type: string;
  size: number;
  name?: string;
}): { valid: true } | { valid: false; error: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Format file ${file.name || ''} tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.`,
    };
  }
  const maxBytes = 10 * 1024 * 1024; // 10 MB pre-compression limit
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `Ukuran file ${file.name || ''} melebihi batas 10 MB.`,
    };
  }
  return { valid: true };
}

export function validateBackupPayload(
  raw: unknown
): { valid: true; payload: BackupPayload } | { valid: false; error: string } {
  if (!raw || typeof raw !== 'object') {
    return { valid: false, error: 'File JSON tidak valid.' };
  }
  const obj = raw as Record<string, unknown>;
  if (typeof obj.version !== 'number' || !obj.data || typeof obj.data !== 'object') {
    return {
      valid: false,
      error: 'Struktur file backup tidak sesuai format KPP GKII Baliem Tengah.',
    };
  }
  const data = obj.data as Record<string, unknown>;
  const requiredArrays = ['news', 'activities', 'gallery', 'members', 'programs'];
  for (const key of requiredArrays) {
    if (!Array.isArray(data[key])) {
      return {
        valid: false,
        error: `Data "${key}" hilang atau rusak pada file backup.`,
      };
    }
    if (data.churches !== undefined && !Array.isArray(data.churches)) {
      return {
        valid: false,
        error: 'Data "churches" rusak pada file backup.',
      };
    }
  }
  if (!data.settings || typeof data.settings !== 'object') {
    return {
      valid: false,
      error: 'Data pengaturan website tidak ditemukan dalam file backup.',
    };
  }
  return { valid: true, payload: raw as BackupPayload };
}

const MONTHS_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export function formatDateID(isoDate: string): string {
  if (!isoDate) return '-';
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate);
  if (!match) return isoDate;
  const year = Number(match[1]);
  const monthIdx = Number(match[2]) - 1;
  const day = Number(match[3]);
  if (monthIdx < 0 || monthIdx > 11 || Number.isNaN(day)) return isoDate;
  return `${day} ${MONTHS_ID[monthIdx]} ${year}`;
}
