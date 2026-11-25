import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type {
  ActivityItem,
  ActivityLogEntry,
  GalleryPhoto,
  NewsItem,
  OrganizationMember,
  SiteSettings,
  WorkProgram,
} from '../types';
import {
  deleteFromStore,
  initializeAndLoadDatabase,
  putInStore,
  seedDefaultDatabase,
} from '../services/database';
import { DEFAULT_SETTINGS } from '../services/seedData';
import { loadSettings, saveSettings } from '../services/storage';
import {
  getFirestoreSettings,
  saveFirestoreSettings,
} from '../services/firestore';
import { watchAdminAuthorization } from '../services/auth';

interface AppDataContextValue {
  loading: boolean;
  error: string | null;
  news: NewsItem[];
  activities: ActivityItem[];
  gallery: GalleryPhoto[];
  members: OrganizationMember[];
  programs: WorkProgram[];
  logs: ActivityLogEntry[];
  settings: SiteSettings;
  refreshAll: () => Promise<void>;
  upsertNews: (item: NewsItem) => Promise<void>;
  removeNews: (id: string, title?: string) => Promise<void>;
  upsertActivity: (item: ActivityItem) => Promise<void>;
  removeActivity: (id: string, name?: string) => Promise<void>;
  addGalleryPhotos: (photos: GalleryPhoto[]) => Promise<void>;
  removeGalleryPhoto: (id: string, title?: string) => Promise<void>;
  upsertMember: (member: OrganizationMember) => Promise<void>;
  removeMember: (id: string, name?: string) => Promise<void>;
  upsertProgram: (program: WorkProgram) => Promise<void>;
  removeProgram: (id: string, name?: string) => Promise<void>;
  updateSettings: (next: SiteSettings) => Promise<void>;
  resetToSeedData: () => Promise<void>;
  recordLog: (action: string, module: ActivityLogEntry['module']) => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

function migrateDefaultWhatsAppNumber(settings: SiteSettings): SiteSettings {
  return {
    ...settings,
    whatsappNumber:
      settings.whatsappNumber === '081234567890'
        ? DEFAULT_SETTINGS.whatsappNumber
        : settings.whatsappNumber,
    socialLinks: {
      ...settings.socialLinks,
      whatsapp:
        settings.socialLinks.whatsapp === '6281234567890'
          ? DEFAULT_SETTINGS.socialLinks.whatsapp
          : settings.socialLinks.whatsapp,
    },
  };
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [programs, setPrograms] = useState<WorkProgram[]>([]);
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  const refreshAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [dbData, loadedSettings] = await Promise.all([
        initializeAndLoadDatabase(),
        Promise.resolve(loadSettings()),
      ]);
      let nextSettings = migrateDefaultWhatsAppNumber(loadedSettings);
      try {
        const cloudSettings = await getFirestoreSettings();
        if (cloudSettings) {
          nextSettings = migrateDefaultWhatsAppNumber({
            ...DEFAULT_SETTINGS,
            ...cloudSettings,
            socialLinks: {
              ...DEFAULT_SETTINGS.socialLinks,
              ...(cloudSettings.socialLinks || {}),
            },
          });
          saveSettings(nextSettings);
        }
      } catch (error) {
        console.warn('Pengaturan Firebase tidak tersedia; memakai pengaturan lokal.', error);
      }
      setNews(dbData.news);
      setActivities(dbData.activities);
      setGallery(dbData.gallery);
      setMembers(dbData.members);
      setPrograms(dbData.programs);
      setLogs(
        [...dbData.logs].sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      );
      setSettings(nextSettings);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal memuat data lokal dari browser.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  useEffect(
    () =>
      watchAdminAuthorization((authorized) => {
        if (authorized) void refreshAll();
      }),
    [refreshAll]
  );

  const recordLog = useCallback(
    async (action: string, module: ActivityLogEntry['module']) => {
      const entry: ActivityLogEntry = {
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        action,
        module,
        timestamp: new Date().toISOString(),
      };
      await putInStore('logs', entry);
      setLogs((prev) => [entry, ...prev].slice(0, 40));
    },
    []
  );

  const upsertNews = useCallback(
    async (item: NewsItem) => {
      await putInStore('news', item);
      setNews((prev) => {
        const exists = prev.some((n) => n.id === item.id);
        return exists
          ? prev.map((n) => (n.id === item.id ? item : n))
          : [item, ...prev];
      });
      await recordLog(`Menyimpan berita "${item.title}"`, 'Berita');
    },
    [recordLog]
  );

  const removeNews = useCallback(
    async (id: string, title?: string) => {
      await deleteFromStore('news', id);
      setNews((prev) => prev.filter((n) => n.id !== id));
      await recordLog(`Menghapus berita "${title || id}"`, 'Berita');
    },
    [recordLog]
  );

  const upsertActivity = useCallback(
    async (item: ActivityItem) => {
      await putInStore('activities', item);
      setActivities((prev) => {
        const exists = prev.some((a) => a.id === item.id);
        return exists
          ? prev.map((a) => (a.id === item.id ? item : a))
          : [item, ...prev];
      });
      await recordLog(`Menyimpan kegiatan "${item.name}"`, 'Kegiatan');
    },
    [recordLog]
  );

  const removeActivity = useCallback(
    async (id: string, name?: string) => {
      await deleteFromStore('activities', id);
      setActivities((prev) => prev.filter((a) => a.id !== id));
      await recordLog(`Menghapus kegiatan "${name || id}"`, 'Kegiatan');
    },
    [recordLog]
  );

  const addGalleryPhotos = useCallback(
    async (photos: GalleryPhoto[]) => {
      await Promise.all(photos.map((p) => putInStore('gallery', p)));
      setGallery((prev) => [...photos, ...prev]);
      await recordLog(
        `Mengunggah ${photos.length} foto ke galeri dokumentasi`,
        'Galeri'
      );
    },
    [recordLog]
  );

  const removeGalleryPhoto = useCallback(
    async (id: string, title?: string) => {
      await deleteFromStore('gallery', id);
      setGallery((prev) => prev.filter((g) => g.id !== id));
      await recordLog(`Menghapus foto "${title || id}" dari galeri`, 'Galeri');
    },
    [recordLog]
  );

  const upsertMember = useCallback(
    async (member: OrganizationMember) => {
      await putInStore('members', member);
      setMembers((prev) => {
        const exists = prev.some((m) => m.id === member.id);
        return exists
          ? prev.map((m) => (m.id === member.id ? member : m))
          : [...prev, member];
      });
      await recordLog(
        `Memperbarui data pengurus "${member.fullName}" (${member.role})`,
        'Struktur'
      );
    },
    [recordLog]
  );

  const removeMember = useCallback(
    async (id: string, name?: string) => {
      await deleteFromStore('members', id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      await recordLog(
        `Menghapus pengurus "${name || id}" dari struktur`,
        'Struktur'
      );
    },
    [recordLog]
  );

  const upsertProgram = useCallback(
    async (program: WorkProgram) => {
      await putInStore('programs', program);
      setPrograms((prev) => {
        const exists = prev.some((p) => p.id === program.id);
        return exists
          ? prev.map((p) => (p.id === program.id ? program : p))
          : [...prev, program];
      });
      await recordLog(`Menyimpan program kerja "${program.name}"`, 'Program');
    },
    [recordLog]
  );

  const removeProgram = useCallback(
    async (id: string, name?: string) => {
      await deleteFromStore('programs', id);
      setPrograms((prev) => prev.filter((p) => p.id !== id));
      await recordLog(`Menghapus program kerja "${name || id}"`, 'Program');
    },
    [recordLog]
  );

  const updateSettings = useCallback(
    async (next: SiteSettings) => {
      await saveFirestoreSettings(next);
      saveSettings(next);
      setSettings(next);
      await recordLog('Memperbarui pengaturan & profil website', 'Pengaturan');
    },
    [recordLog]
  );

  const resetToSeedData = useCallback(async () => {
    await seedDefaultDatabase();
    await saveFirestoreSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
    await refreshAll();
  }, [refreshAll]);

  return (
    <AppDataContext.Provider
      value={{
        loading,
        error,
        news,
        activities,
        gallery,
        members,
        programs,
        logs,
        settings,
        refreshAll,
        upsertNews,
        removeNews,
        upsertActivity,
        removeActivity,
        addGalleryPhotos,
        removeGalleryPhoto,
        upsertMember,
        removeMember,
        upsertProgram,
        removeProgram,
        updateSettings,
        resetToSeedData,
        recordLog,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData harus digunakan di dalam AppDataProvider');
  }
  return ctx;
}
