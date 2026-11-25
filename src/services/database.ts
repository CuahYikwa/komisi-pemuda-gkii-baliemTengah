import type {
  ActivityItem,
  ActivityLogEntry,
  Congregation,
  GalleryPhoto,
  NewsItem,
  OrganizationMember,
  WorkProgram,
} from '../types';
import {
  SEED_ACTIVITIES,
  SEED_CHURCHES,
  SEED_GALLERY,
  SEED_LOGS,
  SEED_MEMBERS,
  SEED_NEWS,
  SEED_PROGRAMS,
} from './seedData';
import {
  deleteFirestoreItem,
  getFirestoreItems,
  putFirestoreItem,
  replaceFirestoreItems,
} from './firestore';
import { hasAdminAccess } from './auth';

const DB_NAME = 'kpp_gkii_baliem_db';
const DB_VERSION = 2;

export type StoreName =
  | 'news'
  | 'activities'
  | 'gallery'
  | 'members'
  | 'programs'
  | 'churches'
  | 'logs';

const STORES: StoreName[] = [
  'news',
  'activities',
  'gallery',
  'members',
  'programs',
  'churches',
  'logs',
];

const SEEDED_FLAG_KEY = 'kpp_gkii_idb_seeded_v1';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('Browser ini tidak mendukung IndexedDB.'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const store of STORES) {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: 'id' });
        }
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error || new Error('Gagal membuka IndexedDB.'));
  });
}

export async function getAllFromStore<T>(storeName: StoreName): Promise<T[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve((req.result as T[]) || []);
    req.onerror = () => reject(req.error || new Error(`Gagal membaca ${storeName}.`));
  });
}

export async function putInStore<T extends { id: string }>(
  storeName: StoreName,
  item: T
): Promise<void> {
  await putFirestoreItem(storeName, item);
  await putLocally(storeName, item);
}

async function putLocally<T extends { id: string }>(
  storeName: StoreName,
  item: T
): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.put(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () =>
      reject(tx.error || new Error(`Gagal menyimpan data ke ${storeName}.`));
  });
}

export async function deleteFromStore(
  storeName: StoreName,
  id: string
): Promise<void> {
  await deleteFirestoreItem(storeName, id);
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () =>
      reject(tx.error || new Error(`Gagal menghapus item di ${storeName}.`));
  });
}

export async function replaceStoreItems<T extends { id: string }>(
  storeName: StoreName,
  items: T[]
): Promise<void> {
  await replaceFirestoreItems(storeName, items);
  await replaceLocally(storeName, items);
}

async function replaceLocally<T extends { id: string }>(
  storeName: StoreName,
  items: T[]
): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.clear();
    for (const item of items) {
      store.put(item);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () =>
      reject(tx.error || new Error(`Gagal memperbarui store ${storeName}.`));
  });
}

export interface AllDatabaseData {
  news: NewsItem[];
  activities: ActivityItem[];
  gallery: GalleryPhoto[];
  members: OrganizationMember[];
  programs: WorkProgram[];
  churches: Congregation[];
  logs: ActivityLogEntry[];
}

export async function initializeAndLoadDatabase(): Promise<AllDatabaseData> {
  const [news, activities, gallery, members, programs, churches, logs] = await Promise.all([
    getAllFromStore<NewsItem>('news'),
    getAllFromStore<ActivityItem>('activities'),
    getAllFromStore<GalleryPhoto>('gallery'),
    getAllFromStore<OrganizationMember>('members'),
    getAllFromStore<WorkProgram>('programs'),
    getAllFromStore<Congregation>('churches'),
    getAllFromStore<ActivityLogEntry>('logs'),
  ]);

  const alreadySeeded = localStorage.getItem(SEEDED_FLAG_KEY) === 'true';
  const isEmpty =
    news.length === 0 &&
    activities.length === 0 &&
    gallery.length === 0 &&
    members.length === 0 &&
    programs.length === 0 &&
    churches.length === 0;

  try {
    const [cloudNews, cloudActivities, cloudGallery, cloudMembers, cloudPrograms, cloudChurches, cloudLogs] =
      await Promise.all([
        getFirestoreItems<NewsItem>('news'),
        getFirestoreItems<ActivityItem>('activities'),
        getFirestoreItems<GalleryPhoto>('gallery'),
        getFirestoreItems<OrganizationMember>('members'),
        getFirestoreItems<WorkProgram>('programs'),
        getFirestoreItems<Congregation>('churches'),
        getFirestoreItems<ActivityLogEntry>('logs'),
      ]);

    const cloudIsEmpty =
      cloudNews.length === 0 &&
      cloudActivities.length === 0 &&
      cloudGallery.length === 0 &&
      cloudMembers.length === 0 &&
      cloudPrograms.length === 0 &&
      cloudChurches.length === 0;

    if (cloudIsEmpty) {
      const source = isEmpty
        ? {
            news: SEED_NEWS,
            activities: SEED_ACTIVITIES,
            gallery: SEED_GALLERY,
            members: SEED_MEMBERS,
            programs: SEED_PROGRAMS,
            churches: churches.length > 0 ? churches : SEED_CHURCHES,
            logs: SEED_LOGS,
          }
        : {
            news,
            activities,
            gallery,
            members,
            programs,
            churches: churches.length > 0 ? churches : SEED_CHURCHES,
            logs,
          };

      if (await hasAdminAccess()) {
        await Promise.all([
          replaceFirestoreItems('news', source.news),
          replaceFirestoreItems('activities', source.activities),
          replaceFirestoreItems('gallery', source.gallery),
          replaceFirestoreItems('members', source.members),
          replaceFirestoreItems('programs', source.programs),
          replaceFirestoreItems('churches', source.churches),
          replaceFirestoreItems('logs', source.logs),
        ]);
      }

      await Promise.all([
        replaceLocally('news', source.news),
        replaceLocally('activities', source.activities),
        replaceLocally('gallery', source.gallery),
        replaceLocally('members', source.members),
        replaceLocally('programs', source.programs),
        replaceLocally('churches', source.churches),
        replaceLocally('logs', source.logs),
      ]);
      localStorage.setItem(SEEDED_FLAG_KEY, 'true');
      return source;
    }

    const loadedChurches =
      cloudChurches.length > 0
        ? cloudChurches
        : churches.length > 0
          ? churches
          : SEED_CHURCHES;
    if (cloudChurches.length === 0 && (await hasAdminAccess())) {
      await replaceFirestoreItems('churches', loadedChurches);
    }

    await Promise.all([
      replaceLocally('news', cloudNews),
      replaceLocally('activities', cloudActivities),
      replaceLocally('gallery', cloudGallery),
      replaceLocally('members', cloudMembers),
      replaceLocally('programs', cloudPrograms),
      replaceLocally('churches', loadedChurches),
      replaceLocally('logs', cloudLogs),
    ]);
    localStorage.setItem(SEEDED_FLAG_KEY, 'true');
    return {
      news: cloudNews,
      activities: cloudActivities,
      gallery: cloudGallery,
      members: cloudMembers,
      programs: cloudPrograms,
      churches: loadedChurches,
      logs: cloudLogs,
    };
  } catch (error) {
    console.warn('Firebase tidak tersedia; memakai data lokal IndexedDB.', error);
  }

  if (!alreadySeeded && isEmpty) {
    const source = {
      news: SEED_NEWS,
      activities: SEED_ACTIVITIES,
      gallery: SEED_GALLERY,
      members: SEED_MEMBERS,
      programs: SEED_PROGRAMS,
      churches: SEED_CHURCHES,
      logs: SEED_LOGS,
    };
    await Promise.all([
      replaceLocally('news', source.news),
      replaceLocally('activities', source.activities),
      replaceLocally('gallery', source.gallery),
      replaceLocally('members', source.members),
      replaceLocally('programs', source.programs),
      replaceLocally('churches', source.churches),
      replaceLocally('logs', source.logs),
    ]);
    localStorage.setItem(SEEDED_FLAG_KEY, 'true');
    return source;
  }

  const chairman = members.find(
    (member) => member.id === 'mem-1' || member.role === 'Ketua'
  );
  if (chairman && chairman.fullName !== 'YAMINUS YIKWA.M. Th') {
    chairman.fullName = 'YAMINUS YIKWA.M. Th';
    await putLocally('members', chairman);
  }

  const loadedChurches = churches.length > 0 ? churches : SEED_CHURCHES;
  if (churches.length === 0) {
    await replaceLocally('churches', loadedChurches);
  }
  return { news, activities, gallery, members, programs, churches: loadedChurches, logs };
}

export async function seedDefaultDatabase(): Promise<void> {
  await Promise.all([
    replaceFirestoreItems('news', SEED_NEWS),
    replaceFirestoreItems('activities', SEED_ACTIVITIES),
    replaceFirestoreItems('gallery', SEED_GALLERY),
    replaceFirestoreItems('members', SEED_MEMBERS),
    replaceFirestoreItems('programs', SEED_PROGRAMS),
    replaceFirestoreItems('churches', SEED_CHURCHES),
    replaceFirestoreItems('logs', SEED_LOGS),
  ]);
  await Promise.all([
    replaceLocally('news', SEED_NEWS),
    replaceLocally('activities', SEED_ACTIVITIES),
    replaceLocally('gallery', SEED_GALLERY),
    replaceLocally('members', SEED_MEMBERS),
    replaceLocally('programs', SEED_PROGRAMS),
    replaceLocally('churches', SEED_CHURCHES),
    replaceLocally('logs', SEED_LOGS),
  ]);
  localStorage.setItem(SEEDED_FLAG_KEY, 'true');
}

export async function estimateStorageUsage(): Promise<{
  usedBytes: number;
  quotaBytes: number;
} | null> {
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const est = await navigator.storage.estimate();
      return {
        usedBytes: est.usage || 0,
        quotaBytes: est.quota || 0,
      };
    }
    return null;
  } catch {
    return null;
  }
}
