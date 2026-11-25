import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWhatsAppUrl,
  filterActivities,
  filterNews,
  formatDateID,
  getRelatedNews,
  groupMembersByTier,
  normalizeWhatsAppDigits,
  validateBackupPayload,
  validateImageFile,
} from './logic';
import type { ActivityItem, NewsItem, OrganizationMember } from '../types';

const sampleNews: NewsItem[] = [
  {
    id: 'n1',
    title: 'Ibadah Raya Pemuda Baliem Tengah',
    summary: 'Kebersamaan pemuda dalam ibadah raya.',
    content: 'Isi berita lengkap ibadah raya.',
    category: 'Ibadah',
    publishedAt: '2026-11-10',
    imageUrl: '/img1.jpg',
    author: 'Tim Multimedia',
    status: 'published',
    updatedAt: '2026-11-10T10:00:00Z',
  },
  {
    id: 'n2',
    title: 'Draft Rapat Kerja',
    summary: 'Masih draft internal.',
    content: 'Konten draft.',
    category: 'Pengumuman',
    publishedAt: '2026-11-15',
    imageUrl: '/img2.jpg',
    author: 'Sekretaris',
    status: 'draft',
    updatedAt: '2026-11-15T10:00:00Z',
  },
  {
    id: 'n3',
    title: 'Pelatihan Musik Pujian',
    summary: 'Pembinaan pemusik muda gereja.',
    content: 'Pelatihan gitar dan vokal.',
    category: 'Pembinaan',
    publishedAt: '2026-11-12',
    imageUrl: '/img3.jpg',
    author: 'Bidang Musik',
    status: 'published',
    updatedAt: '2026-11-12T10:00:00Z',
  },
];

test('filterNews excludes drafts on public view and sorts newest first', () => {
  const publicNews = filterNews(sampleNews, '', 'Semua', false);
  assert.equal(publicNews.length, 2);
  assert.equal(publicNews[0].id, 'n3');
  assert.equal(publicNews[1].id, 'n1');

  const allWithDrafts = filterNews(sampleNews, '', 'Semua', true);
  assert.equal(allWithDrafts.length, 3);
  assert.equal(allWithDrafts[0].id, 'n2');
});

test('filterNews matches query and category accurately', () => {
  const found = filterNews(sampleNews, 'gitar', 'Pembinaan', false);
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 'n3');
});

test('getRelatedNews excludes current article and returns published articles', () => {
  const related = getRelatedNews(sampleNews, 'n1', 3);
  assert.equal(related.length, 1);
  assert.equal(related[0].id, 'n3');
});

test('filterActivities filters by category and status', () => {
  const activities: ActivityItem[] = [
    {
      id: 'a1',
      name: 'Retreat Lembah Baliem',
      category: 'Retreat',
      date: '2026-12-05',
      location: 'Bukit Kurima',
      description: 'Retreat tahunan pemuda.',
      status: 'Akan Datang',
      imageUrl: '/a1.jpg',
      updatedAt: '2026-11-01',
    },
    {
      id: 'a2',
      name: 'Bakti Sosial Wamena',
      category: 'Bakti Sosial',
      date: '2026-10-20',
      location: 'Wamena Kota',
      description: 'Kunjungan kasih.',
      status: 'Selesai',
      imageUrl: '/a2.jpg',
      updatedAt: '2026-10-21',
    },
  ];
  const filtered = filterActivities(activities, 'Retreat', 'Akan Datang');
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 'a1');
});

test('groupMembersByTier organizes roles into 4 clean tiers', () => {
  const members: OrganizationMember[] = [
    {
      id: 'm1',
      fullName: '[Nama Ketua]',
      role: 'Ketua',
      division: 'Pengurus Inti',
      description: 'Koordinator umum.',
      photoUrl: '',
      order: 1,
    },
    {
      id: 'm2',
      fullName: '[Nama Sekretaris]',
      role: 'Sekretaris',
      division: 'Pengurus Inti',
      description: 'Administrasi.',
      photoUrl: '',
      order: 3,
    },
    {
      id: 'm3',
      fullName: '[Koordinator Kerohanian]',
      role: 'Koordinator Bidang',
      division: 'Bidang Kerohanian',
      description: 'Pelayanan doa.',
      photoUrl: '',
      order: 7,
    },
    {
      id: 'm4',
      fullName: '[Anggota Bidang]',
      role: 'Anggota',
      division: 'Bidang Kerohanian',
      description: 'Anggota aktif.',
      photoUrl: '',
      order: 12,
    },
  ];
  const tiers = groupMembersByTier(members);
  assert.equal(tiers.executive.length, 1);
  assert.equal(tiers.secretariatTreasury.length, 1);
  assert.equal(tiers.coordinators.length, 1);
  assert.equal(tiers.members.length, 1);
});

test('normalizeWhatsAppDigits & buildWhatsAppUrl format Indonesian numbers and validate input', () => {
  assert.equal(normalizeWhatsAppDigits('0812-3456-7890'), '6281234567890');
  const bad = buildWhatsAppUrl('081234567890', {
    name: 'A',
    churchOrOrigin: '',
    subject: 'Tanya',
    message: 'Shalom',
  });
  assert.equal(bad.ok, false);

  const ok = buildWhatsAppUrl('0812-3456-7890', {
    name: 'Daniel',
    churchOrOrigin: 'GKII Jemaat Betlehem',
    subject: 'Jadwal Ibadah',
    message: 'Shalom, mohon info jadwal ibadah pemuda minggu ini.',
  });
  assert.equal(ok.ok, true);
  if (ok.ok) {
    assert.ok(ok.url.startsWith('https://wa.me/6281234567890?text='));
  }
});

test('validateImageFile rejects unsupported mime types and oversized files', () => {
  assert.equal(validateImageFile({ type: 'image/jpeg', size: 500000 }).valid, true);
  assert.equal(validateImageFile({ type: 'application/pdf', size: 1000, name: 'doc.pdf' }).valid, false);
  assert.equal(validateImageFile({ type: 'image/png', size: 15 * 1024 * 1024 }).valid, false);
});

test('validateBackupPayload accepts valid structure and rejects corrupt JSON', () => {
  assert.equal(validateBackupPayload(null).valid, false);
  assert.equal(
    validateBackupPayload({
      version: 1,
      exportedAt: '2026-11-21',
      source: 'test',
      data: {
        news: [],
        activities: [],
        gallery: [],
        members: [],
        programs: [],
        settings: {},
      },
    }).valid,
    true
  );
});

test('formatDateID formats ISO dates cleanly in Indonesian', () => {
  assert.equal(formatDateID('2026-11-21'), '21 November 2026');
  assert.equal(formatDateID('2026-01-05'), '5 Januari 2026');
});
