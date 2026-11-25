<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Komisi Pemuda Pemudi GKII Baliem Tengah

## Menjalankan aplikasi

1. Install dependency dengan `npm install`.
2. Jalankan `npm run dev`.
3. Validasi perubahan dengan `npm run lint` dan `npm run build`.

Konfigurasi Firebase web dapat diberikan melalui variabel `VITE_FIREBASE_*`.
Jika tidak diberikan, aplikasi menggunakan konfigurasi proyek yang ada di
`src/services/firebase.ts`.

## Menyiapkan akses admin Firebase

1. Di Firebase Console, aktifkan **Authentication > Sign-in method > Email/Password**.
2. Buat akun admin pada **Authentication > Users**, lalu salin UID akun tersebut.
3. Di **Firestore Database**, buat dokumen `admins/{UID}` (UID sebagai ID dokumen,
   isi dokumen boleh kosong). Dokumen ini hanya dapat dibuat dan dihapus melalui
   Firebase Console/Admin SDK; klien aplikasi tidak dapat memberi dirinya akses.
4. Publikasikan aturan dari `firestore.rules` pada bagian **Firestore Database >
   Rules**.
5. Login di `/admin/login` dengan email dan kata sandi akun tersebut.

Konten publik dapat dibaca siapa saja, tetapi perubahan data, pengaturan, dan
konten dashboard lain hanya diizinkan bagi akun dengan dokumen `admins/{UID}`.
Firebase Auth dan aturan Firestore tetap memeriksa izin di server; proteksi UI
dashboard bukan satu-satunya lapisan keamanan.

Berita, kegiatan, galeri, struktur, program, dan pengaturan disimpan di
Firestore dan dibaca dari sana oleh website publik. Gambar yang diunggah
dikompresi agar tetap berada di bawah batas ukuran dokumen Firestore; Firebase
Storage tidak digunakan karena pada proyek ini memerlukan paket Blaze.
