export type NewsCategory =
  | 'Pelayanan'
  | 'Ibadah'
  | 'Pembinaan'
  | 'Sosial'
  | 'Pengumuman';

export type NewsStatus = 'published' | 'draft';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  publishedAt: string; // YYYY-MM-DD
  imageUrl: string;
  author: string;
  status: NewsStatus;
  updatedAt: string;
}

export type ActivityCategory =
  | 'Ibadah Pemuda'
  | 'Retreat'
  | 'Seminar'
  | 'KKR'
  | 'Perayaan Hari Besar Gerejawi'
  | 'Olahraga'
  | 'Bakti Sosial'
  | 'Kegiatan Lainnya';

export type ActivityStatus = 'Akan Datang' | 'Sedang Berlangsung' | 'Selesai';

export interface ActivityItem {
  id: string;
  name: string;
  category: ActivityCategory;
  date: string; // YYYY-MM-DD
  time?: string;
  location: string;
  description: string;
  status: ActivityStatus;
  imageUrl: string;
  updatedAt: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: ActivityCategory;
  caption: string;
  takenAt: string; // YYYY-MM-DD
  imageUrl: string;
  createdAt: string;
}

export type OrganizationRole =
  | 'Ketua'
  | 'Wakil Ketua'
  | 'Sekretaris'
  | 'Wakil Sekretaris'
  | 'Bendahara'
  | 'Wakil Bendahara'
  | 'Koordinator Bidang'
  | 'Anggota';

export type DivisionName =
  | 'Pengurus Inti'
  | 'Bidang Kerohanian'
  | 'Bidang Musik dan Pujian'
  | 'Bidang Media Digital'
  | 'Bidang Minat dan bakat'
  | 'Bidang Pendidikan dan Litbang'
  | 'Bidang Penginjilan'
  | 'Bidang Doa'
  | 'Bidang Usaha Dana'
  | 'Bidang Multimedia dan Dokumentasi'
  | 'Bidang Olahraga dan Seni'
  | 'Bidang Pendidikan dan Pengembangan SDM'
  | 'Bidang Sosial dan Pelayanan Masyarakat';

export interface OrganizationMember {
  id: string;
  fullName: string;
  role: OrganizationRole;
  division: DivisionName;
  description: string;
  contact?: string;
  photoUrl: string;
  order: number;
}

export type ProgramCategory =
  | 'Program Kerohanian'
  | 'Program Pembinaan Pemuda'
  | 'Program Pendidikan'
  | 'Program Olahraga'
  | 'Program Sosial'
  | 'Program Kreativitas dan Seni'
  | 'Program Penginjilan dan Misi'
  | 'Program Kebersamaan';

export type ProgramStatus = 'Terencana' | 'Berjalan' | 'Selesai';

export interface WorkProgram {
  id: string;
  name: string;
  category: ProgramCategory;
  description: string;
  schedule: string;
  status: ProgramStatus;
  imageUrl: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  whatsapp: string;
}

export interface SiteSettings {
  organizationName: string;
  shortName: string;
  tagline: string;
  heroDescription: string;
  secretariatAddress: string;
  email: string;
  whatsappNumber: string;
  serviceSchedule: string;
  mapsQuery: string;
  socialLinks: SocialLinks;
}

export interface ActivityLogEntry {
  id: string;
  action: string;
  module: 'Berita' | 'Kegiatan' | 'Galeri' | 'Struktur' | 'Program' | 'Pengaturan' | 'Backup';
  timestamp: string;
}

export interface BackupPayload {
  version: number;
  exportedAt: string;
  source: string;
  data: {
    news: NewsItem[];
    activities: ActivityItem[];
    gallery: GalleryPhoto[];
    members: OrganizationMember[];
    programs: WorkProgram[];
    settings: SiteSettings;
  };
}
