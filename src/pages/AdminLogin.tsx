import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { FirebaseError } from 'firebase/app';
import { ArrowLeft, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import { LogoMark } from '../components/LogoMark';
import {
  sendAdminPasswordReset,
  signInAdmin,
  watchAdminAuthorization,
} from '../services/auth';

export function AdminLogin() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  useEffect(() => {
    return watchAdminAuthorization((authorized) => {
      if (authorized) navigate('/admin', { replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (!email.trim() || !password) {
      setError('Mohon masukkan email dan password.');
      return;
    }

    setSubmitting(true);
    try {
      await signInAdmin(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      if (err instanceof FirebaseError && err.code === 'auth/invalid-credential') {
        setError(
          'Email atau kata sandi tidak cocok. Jika akun baru dibuat, buka tautan reset dari email dan gunakan kata sandi yang Anda tetapkan di sana.'
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : 'Gagal masuk. Periksa koneksi dan kredensial Firebase Anda.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    setError(null);
    setNotice(null);
    if (!email.trim()) {
      setError('Masukkan email admin untuk menerima tautan reset kata sandi.');
      return;
    }

    setResettingPassword(true);
    try {
      await sendAdminPasswordReset(email);
      setNotice('Tautan reset kata sandi telah dikirim. Periksa email Anda.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengirim tautan reset kata sandi.'
      );
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#071426] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(200,155,60,0.14),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(26,61,110,0.4),transparent_50%)]"
      />
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
      >
        <div className="bg-[#0B1F3A] px-6 py-7 text-center border-b border-white/10">
          <div className="flex justify-center mb-3">
            <LogoMark className="w-12 h-12" />
          </div>
          <h1 className="font-display text-lg font-bold text-white tracking-tight">
            Panel Pengelola Organisasi
          </h1>
          <p className="text-xs text-[#DCB458] mt-1">
            KOMISI PEMUDA DAERAH GKII BALIEM TENGAH
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
            >
              Email Admin
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@contoh.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#C89B3C]"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold text-[#0B1F3A] mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full pl-3.5 pr-11 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#C89B3C]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword ? 'Sembunyikan password' : 'Tampilkan password'
                }
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-[#0B1F3A] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium"
            >
              {error}
            </div>
          )}

          {notice && (
            <div
              role="status"
              className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium"
            >
              {notice}
            </div>
          )}

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0B1F3A] hover:bg-[#122D52] disabled:opacity-60 text-white text-sm font-semibold transition-colors"
          >
            <Lock className="w-4 h-4 text-[#DCB458]" aria-hidden="true" />
            <span>{submitting ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
          </motion.button>

          <button
            type="button"
            onClick={handlePasswordReset}
            disabled={resettingPassword}
            className="w-full text-xs font-semibold text-[#0B1F3A] hover:underline disabled:opacity-60"
          >
            {resettingPassword
              ? 'Mengirim tautan reset...'
              : 'Kirim ulang tautan reset kata sandi'}
          </button>

          <div className="p-3.5 rounded-xl bg-[#F6F8FB] border border-slate-200 text-[11px] text-slate-600 leading-relaxed flex items-start gap-2.5">
            <ShieldCheck
              className="w-4 h-4 text-[#A87E26] shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold text-[#0B1F3A]">
                Akses Admin Firebase
              </p>
              <p className="mt-0.5">
                Gunakan akun Email/Password Firebase yang sudah terdaftar
                sebagai admin. Akun tanpa izin admin tidak dapat mengakses
                dashboard atau mengubah data.
              </p>
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0B1F3A] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Kembali ke Website</span>
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
