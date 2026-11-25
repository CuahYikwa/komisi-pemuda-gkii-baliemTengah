import type { BackupPayload, Congregation, SiteSettings } from '../types';
import { validateBackupPayload } from '../utils/logic';
import {
  getAllFromStore,
  replaceStoreItems,
} from './database';
import { saveFirestoreSettings } from './firestore';
import { loadSettings, saveSettings } from './storage';
import { SEED_CHURCHES } from './seedData';

export async function createBackupPayload(): Promise<BackupPayload> {
  const [news, activities, gallery, members, programs, churches] = await Promise.all([
    getAllFromStore<BackupPayload['data']['news'][number]>('news'),
    getAllFromStore<BackupPayload['data']['activities'][number]>('activities'),
    getAllFromStore<BackupPayload['data']['gallery'][number]>('gallery'),
    getAllFromStore<BackupPayload['data']['members'][number]>('members'),
    getAllFromStore<BackupPayload['data']['programs'][number]>('programs'),
    getAllFromStore<Congregation>('churches'),
  ]);
  const settings: SiteSettings = loadSettings();

  return {
    version: 2,
    exportedAt: new Date().toISOString(),
    source: 'KOMISI PEMUDA DAERAH GKII BALIEM TENGAH',
    data: {
      news,
      activities,
      gallery,
      members,
      programs,
      churches,
      settings,
    },
  };
}

export function downloadBackupFile(payload: BackupPayload): string {
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `kpp-gkii-baliem-backup-${dateStr}.json`;
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  return filename;
}

export async function parseAndValidateBackupFile(
  file: File
): Promise<{ valid: true; payload: BackupPayload } | { valid: false; error: string }> {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text) as unknown;
    return validateBackupPayload(parsed);
  } catch {
    return {
      valid: false,
      error: 'Gagal membaca file backup. Pastikan file berformat .json yang valid.',
    };
  }
}

export async function restoreFromBackupPayload(
  payload: BackupPayload
): Promise<void> {
  await Promise.all([
    replaceStoreItems('news', payload.data.news),
    replaceStoreItems('activities', payload.data.activities),
    replaceStoreItems('gallery', payload.data.gallery),
    replaceStoreItems('members', payload.data.members),
    replaceStoreItems('programs', payload.data.programs),
    replaceStoreItems('churches', payload.data.churches ?? SEED_CHURCHES),
  ]);
  await saveFirestoreSettings(payload.data.settings);
  saveSettings(payload.data.settings);
  localStorage.setItem('kpp_gkii_idb_seeded_v1', 'true');
}
