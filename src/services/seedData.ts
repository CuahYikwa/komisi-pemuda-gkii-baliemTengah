import type {
  ActivityItem,
  ActivityLogEntry,
  GalleryPhoto,
  NewsItem,
  OrganizationMember,
  SiteSettings,
  WorkProgram,
} from '../types';
import kopdaImage from '../assets/images/kopda.jpg';
import pemudaImage from '../assets/images/pemuda.jpg';
import retreatImage from '../assets/images/youth_fellowship_retreat_1795265001584.jpg';

export const HERO_IMAGES = [
  {
    src: kopdaImage,
    alt: 'Panorama pelayanan dan masyarakat Lembah Baliem di Wamena',
    caption: 'Pelayanan dan Komunitas di Lembah Baliem',
  },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  organizationName: 'KOMISI PEMUDA DAERAH GKII BALIEM TENGAH',
  shortName: 'KPP GKII Baliem Tengah',
  tagline: 'Bertumbuh dalam Iman, Bersatu dalam Kasih, Melayani dengan Hati.',
  heroDescription:
    'Menjadi generasi muda Kristen yang beriman, berkarakter, bersatu, dan berdampak bagi gereja serta masyarakat melalui pelayanan yang berlandaskan Firman Tuhan.',
  secretariatAddress:
    'Sekretariat Pemuda GKII Wilayah Baliem Tengah, Jl. Yos Sudarso No. 14, Wamena, Kabupaten Jayawijaya, Papua Pegunungan',
  email: 'yaminusyikwa9@gmail.com',
  whatsappNumber: '082146639535',
  serviceSchedule: 'Setiap Sabtu, Pukul 17.00 WIT',
  mapsQuery: 'Wamena, Jayawijaya, Papua Pegunungan',
  socialLinks: {
    facebook: 'https://facebook.com/kppgkiibaliemtengah',
    instagram: 'https://instagram.com/kppgkiibaliemtengah',
    tiktok: 'https://tiktok.com/@kppgkiibaliemtengah',
    youtube: 'https://youtube.com/@kppgkiibaliemtengah',
    whatsapp: '6282146639535',
  },
};

export const SEED_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Ibadah Padang dan Pembinaan Iman Pemuda se-Wilayah Baliem Tengah',
    summary:
      'Ratusan pemuda-pemudi dari berbagai jemaat GKII di Lembah Baliem berkumpul bersama untuk memuji Tuhan, mendalami Firman, dan mempererat persaudaraan lintas jemaat.',
    content:
      'Komisi Pemuda Pemudi GKII Baliem Tengah sukses menyelenggarakan Ibadah Padang dan Pembinaan Iman yang diikuti oleh perwakilan pemuda dari berbagai jemaat lokal di sekitar Lembah Baliem.\n\nKegiatan yang diawali dengan pujian dan penyembahan bersama di alam terbuka ini menekankan pentingnya menjaga kemurnian iman serta membangun karakter Kristus di tengah tantangan zaman modern dan perkembangan teknologi.\n\nDalam sesi pembinaan, para pembicara mengajak seluruh pemuda-pemudi untuk tidak hanya aktif dalam kegiatan gerejawi, tetapi juga menjadi teladan dalam pendidikan, etos kerja, dan pelayanan sosial di tengah masyarakat Papua Pegunungan. Acara ditutup dengan doa syafaat bersama bagi gereja, bangsa, dan generasi muda Baliem Tengah.',
    category: 'Ibadah',
    publishedAt: '2026-11-12',
    imageUrl: pemudaImage,
    author: 'Bidang Multimedia & Dokumentasi',
    status: 'published',
    updatedAt: '2026-11-12T08:00:00.000Z',
  },
];

export const SEED_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    name: 'Ibadah Rutin Pemuda Gabungan Wilayah',
    category: 'Ibadah Pemuda',
    date: '2026-11-28',
    time: '17.00 WIT',
    location: 'Gedung Gereja GKII Induk, Wamena',
    description:
      'Ibadah gabungan pemuda-pemudi seluruh jemaat wilayah Baliem Tengah dengan tema penguatan iman dan kesaksian generasi muda.',
    status: 'Akan Datang',
    imageUrl: kopdaImage,
    updatedAt: '2026-11-10T09:00:00.000Z',
  },
];

export const SEED_GALLERY: GalleryPhoto[] = [
  {
    id: 'gal-1',
    title: 'Pujian Bersama di Ibadah Raya Pemuda',
    category: 'Ibadah Pemuda',
    caption: 'Sukacita pemuda-pemudi saat menaikkan pujian penyembahan di gereja induk.',
    takenAt: '2026-11-12',
    imageUrl: kopdaImage,
    createdAt: '2026-11-12T12:00:00.000Z',
  },
  {
    id: 'gal-2',
    title: 'Kelompok Kecil Retreat Lembah Baliem',
    category: 'Retreat',
    caption: 'Diskusi pendalaman Alkitab di alam terbuka dengan latar pegunungan Lembah Baliem.',
    takenAt: '2026-11-08',
    imageUrl: retreatImage,
    createdAt: '2026-11-08T09:00:00.000Z',
  },
];

export const SEED_MEMBERS: OrganizationMember[] = [
  {
    id: 'mem-1',
    fullName: 'YAMINUS YIKWA.M. Th',
    role: 'Ketua',
    division: 'Pengurus Inti',
    description:
      'Memimpin koordinasi umum pelayanan Komisi Pemuda Pemudi GKII Baliem Tengah serta mewakili organisasi dalam rapat wilayah dan antar-lembaga.',
    contact: '0812-0000-0001 (Contoh)',
    photoUrl: '',
    order: 1,
  },
];

export const SEED_PROGRAMS: WorkProgram[] = [
  {
    id: 'prog-1',
    name: 'Persekutuan Doa & Pendalaman Alkitab Pemuda',
    category: 'Program Kerohanian',
    description:
      'Ibadah penguatan iman mingguan, doa syafaat, dan diskusi Firman Tuhan kontekstual bagi generasi muda Papua.',
    schedule: 'Setiap Sabtu, 17.00 WIT',
    status: 'Berjalan',
    imageUrl: kopdaImage,
  },
];

export const SEED_LOGS: ActivityLogEntry[] = [
  {
    id: 'log-1',
    action: 'Inisialisasi data contoh organisasi',
    module: 'Pengaturan',
    timestamp: '2026-11-21T08:00:00.000Z',
  },
];
