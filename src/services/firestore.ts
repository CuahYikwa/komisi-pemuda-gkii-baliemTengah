import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
  type WriteBatch,
} from 'firebase/firestore';
import type { SiteSettings } from '../types';
import { db } from './firebase';

export type FirestoreCollectionName =
  | 'news'
  | 'activities'
  | 'gallery'
  | 'members'
  | 'programs'
  | 'logs';

export async function getFirestoreItems<T>(
  collectionName: FirestoreCollectionName
): Promise<T[]> {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((item) => item.data() as T);
}

export async function putFirestoreItem<T extends { id: string }>(
  collectionName: FirestoreCollectionName,
  item: T
): Promise<void> {
  await setDoc(doc(db, collectionName, item.id), item);
}

export async function deleteFirestoreItem(
  collectionName: FirestoreCollectionName,
  id: string
): Promise<void> {
  await deleteDoc(doc(db, collectionName, id));
}

export async function replaceFirestoreItems<T extends { id: string }>(
  collectionName: FirestoreCollectionName,
  items: T[]
): Promise<void> {
  const existing = await getDocs(collection(db, collectionName));
  const operations: Array<(batch: WriteBatch) => void> = [
    ...existing.docs.map((item) => (batch: WriteBatch) => batch.delete(item.ref)),
    ...items.map(
      (item) => (batch: WriteBatch) =>
        batch.set(doc(db, collectionName, item.id), item)
    ),
  ];

  for (let offset = 0; offset < operations.length; offset += 500) {
    const batch = writeBatch(db);
    operations.slice(offset, offset + 500).forEach((operation) => operation(batch));
    await batch.commit();
  }
}

export async function getFirestoreSettings(): Promise<Partial<SiteSettings> | null> {
  const snapshot = await getDoc(doc(db, 'settings', 'website'));
  return snapshot.exists() ? (snapshot.data() as Partial<SiteSettings>) : null;
}

export async function saveFirestoreSettings(
  settings: SiteSettings
): Promise<void> {
  await setDoc(doc(db, 'settings', 'website'), settings);
}
