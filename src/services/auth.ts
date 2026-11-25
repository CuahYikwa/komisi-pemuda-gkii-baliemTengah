import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type Unsubscribe,
  type User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

async function isAuthorizedAdmin(user: User): Promise<boolean> {
  const adminDocument = await getDoc(doc(db, 'admins', user.uid));
  return adminDocument.exists();
}

export async function signInAdmin(email: string, password: string): Promise<void> {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  try {
    if (!(await isAuthorizedAdmin(credential.user))) {
      await signOut(auth);
      throw new Error('Akun ini belum diberi akses admin.');
    }
  } catch (error) {
    if (auth.currentUser?.uid === credential.user.uid) {
      await signOut(auth);
    }
    throw error;
  }
}

export async function hasAdminAccess(): Promise<boolean> {
  const user = auth.currentUser;
  return user ? isAuthorizedAdmin(user) : false;
}

export function watchAdminAuthorization(
  callback: (authorized: boolean) => void
): Unsubscribe {
  return onAuthStateChanged(auth, (user) => {
    if (!user) {
      callback(false);
      return;
    }

    void isAuthorizedAdmin(user)
      .then((authorized) => {
        if (auth.currentUser?.uid === user.uid) callback(authorized);
      })
      .catch((error: unknown) => {
        console.error('Gagal memverifikasi akses admin Firebase:', error);
        if (auth.currentUser?.uid === user.uid) callback(false);
      });
  });
}

export function getAdminEmail(): string {
  return auth.currentUser?.email || '';
}

export async function logoutAdmin(): Promise<void> {
  await signOut(auth);
}

export async function sendAdminPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}
