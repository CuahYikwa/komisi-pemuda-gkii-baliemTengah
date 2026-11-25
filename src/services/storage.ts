import type { SiteSettings } from '../types';
import { DEFAULT_SETTINGS } from './seedData';

const SETTINGS_KEY = 'kpp_gkii_settings_v1';
const PREFS_KEY = 'kpp_gkii_prefs_v1';
const MAX_IMAGE_DATA_URL_LENGTH = 700 * 1024;

export interface UIPreferences {
  lastAdminTab?: string;
  compactTables?: boolean;
}

export function loadSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<SiteSettings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      socialLinks: {
        ...DEFAULT_SETTINGS.socialLinks,
        ...(parsed.socialLinks || {}),
      },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: SiteSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Gagal menyimpan pengaturan ke LocalStorage:', err);
    throw new Error('Penyimpanan LocalStorage penuh atau diblokir browser.');
  }
}

export function loadPreferences(): UIPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as UIPreferences;
  } catch {
    return {};
  }
}

export function savePreferences(prefs: UIPreferences): void {
  try {
    const current = loadPreferences();
    localStorage.setItem(PREFS_KEY, JSON.stringify({ ...current, ...prefs }));
  } catch {
    // ignore preference write failure
  }
}

/**
 * Compress uploaded images to fit safely inside a Firestore document.
 */
export function compressImageFile(
  file: File,
  maxWidth = 1400,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Gagal membaca file gambar.'));
        return;
      }

      const dataUrl = reader.result;
      if (
        file.type === 'image/gif' &&
        dataUrl.length <= MAX_IMAGE_DATA_URL_LENGTH
      ) {
        resolve(dataUrl);
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('File bukan gambar yang valid.'));
      img.onload = () => {
        if (!img.width || !img.height) {
          reject(new Error('Gambar tidak memiliki dimensi yang valid.'));
          return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Browser tidak dapat memproses gambar.'));
          return;
        }

        const initialScale = Math.min(1, maxWidth / img.width);
        const qualitySteps = [
          ...new Set([quality, Math.max(0.65, quality - 0.15), 0.5]),
        ];

        try {
          for (let sizeAttempt = 0; sizeAttempt < 7; sizeAttempt += 1) {
            const scale = initialScale * 0.82 ** sizeAttempt;
            canvas.width = Math.max(1, Math.round(img.width * scale));
            canvas.height = Math.max(1, Math.round(img.height * scale));
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            for (const stepQuality of qualitySteps) {
              const compressed = canvas.toDataURL(
                'image/jpeg',
                Math.max(0.45, Math.min(1, stepQuality))
              );
              if (compressed.length <= MAX_IMAGE_DATA_URL_LENGTH) {
                resolve(compressed);
                return;
              }
            }
          }
        } catch (error) {
          reject(
            error instanceof Error
              ? error
              : new Error('Gagal mengompresi gambar.')
          );
          return;
        }

        reject(
          new Error(
            'Gambar tidak dapat dikompresi agar aman disimpan di Firebase. Coba gambar yang lebih kecil.'
          )
        );
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}
