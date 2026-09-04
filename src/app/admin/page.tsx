'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  Trash2, 
  CheckCircle2, 
  RefreshCw, 
  LogOut, 
  ArrowLeft,
  Sparkles,
  Inbox,
  Clock
} from 'lucide-react';

interface MessageItem {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
}

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageError, setMessageError] = useState('');

  // Check current session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoadingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch messages if session exists
  useEffect(() => {
    if (session) {
      fetchMessages();
    }
  }, [session]);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    setMessageError('');
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setMessageError(err.message || 'Gagal memuat daftar pesan.');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err: any) {
      setLoginError(err.message || 'Email atau kata sandi tidak valid.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMessages([]);
  };

  const toggleReadStatus = async (id: string, currentRead: boolean) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: !currentRead })
        .eq('id', id);

      if (error) throw error;
      
      setMessages(prev =>
        prev.map(msg => (msg.id === id ? { ...msg, read: !currentRead } : msg))
      );
    } catch (err: any) {
      console.error('Error updating read status:', err);
      alert(err.message || 'Gagal memperbarui status.');
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesan ini?')) return;
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessages(prev => prev.filter(msg => msg.id !== id));
    } catch (err: any) {
      console.error('Error deleting message:', err);
      alert(err.message || 'Gagal menghapus pesan.');
    }
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[#080A0F] text-zinc-300 flex items-center justify-center font-mono text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
          <span>MEMUAT SESI AUTENTIKASI...</span>
        </div>
      </div>
    );
  }

  // Login View
  if (!session) {
    return (
      <main className="min-h-screen bg-[#080A0F] text-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="w-full max-w-md rounded-3xl bg-[#0D111A]/95 border border-white/15 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-6 relative z-10">
          <div className="space-y-2 text-center">
            <div className="inline-flex p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 mb-2">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-white font-display tracking-tight">
              DAN.DEV ADMIN
            </h1>
            <p className="text-xs font-mono text-zinc-400">
              Gerbang Otentikasi Terenkripsi Supabase
            </p>
          </div>
          
          <form className="space-y-4" onSubmit={handleLogin}>
            {loginError && (
              <div className="font-mono text-xs text-red-300 border border-red-500/40 bg-red-950/80 p-3 rounded-xl">
                {loginError === 'Invalid login credentials' ? 'Email atau kata sandi tidak cocok.' : loginError}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-zinc-400 uppercase" htmlFor="email">
                Email Administrator
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#131826] border border-white/10 text-white font-mono text-xs focus:border-sky-400 focus:outline-none placeholder:text-zinc-600 transition-colors"
                  id="email"
                  type="email"
                  placeholder="admin@mrr.dev"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loginLoading}
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-zinc-400 uppercase" htmlFor="password">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#131826] border border-white/10 text-white font-mono text-xs focus:border-sky-400 focus:outline-none placeholder:text-zinc-600 transition-colors"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loginLoading}
                />
              </div>
            </div>

            <button
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-black font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-sky-500/20 active:scale-98 disabled:opacity-50 mt-2"
              type="submit"
              disabled={loginLoading}
            >
              {loginLoading ? 'MEMVERIFIKASI...' : 'MASUK KE KONSOL'}
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <div className="pt-2 text-center">
              <Link href="/" className="text-xs font-mono text-zinc-400 hover:text-sky-400 flex items-center justify-center gap-1 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Portofolio Utama</span>
              </Link>
            </div>
          </form>
        </div>
      </main>
    );
  }

  // Logged-in Dashboard View
  return (
    <main className="min-h-screen bg-[#080A0F] text-[#F8FAFC] p-4 sm:p-8 lg:p-12 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>KONSOL ADMINISTRATOR</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display mt-1">
              Kotak Masuk Kontak.
            </h1>
            <p className="text-xs font-mono text-zinc-400 mt-1">
              Masuk sebagai: <span className="text-white font-bold">{session.user?.email}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={fetchMessages}
              disabled={loadingMessages}
              className="px-4 py-2.5 rounded-xl bg-[#131826] hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 flex items-center justify-center gap-2 cursor-pointer transition-colors flex-1 sm:flex-initial"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingMessages ? 'animate-spin' : ''}`} />
              <span>Muat Ulang</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-red-950/50 hover:bg-red-900/80 border border-red-500/30 text-xs font-mono text-red-300 flex items-center justify-center gap-2 cursor-pointer transition-colors flex-1 sm:flex-initial"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <section className="space-y-6">
          {messageError && (
            <div className="font-mono text-xs text-red-300 border border-red-500/40 bg-red-950/80 p-4 rounded-2xl">
              {messageError}
            </div>
          )}

          {loadingMessages ? (
            <div className="rounded-3xl border border-white/10 p-16 bg-[#0D111A]/90 text-center font-mono text-xs text-zinc-400 flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
              <span>MENGAMBIL PESAN DARI DATABASE SUPABASE...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="rounded-3xl border border-white/10 p-16 bg-[#0D111A]/90 text-center font-mono text-xs text-zinc-400 flex flex-col items-center gap-3">
              <Inbox className="w-10 h-10 text-zinc-600" />
              <span>BELUM ADA PESAN MASUK DARI PENGUNJUNG.</span>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 overflow-hidden bg-[#0D111A]/90 shadow-2xl backdrop-blur-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 font-mono text-[11px] text-zinc-400 uppercase bg-[#131826]/80">
                      <th className="p-4 sm:p-5">Status</th>
                      <th className="p-4 sm:p-5">Waktu</th>
                      <th className="p-4 sm:p-5">Nama</th>
                      <th className="p-4 sm:p-5">Email</th>
                      <th className="p-4 sm:p-5 w-1/2">Pesan</th>
                      <th className="p-4 sm:p-5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {messages.map((msg) => (
                      <tr 
                        key={msg.id} 
                        className={`transition-colors duration-150 ${
                          msg.read ? 'text-zinc-400 hover:bg-white/[0.02]' : 'bg-sky-500/[0.04] text-white font-medium hover:bg-sky-500/[0.08]'
                        }`}
                      >
                        <td className="p-4 sm:p-5 font-mono text-[11px]">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border ${
                            msg.read 
                              ? 'border-white/10 text-zinc-500 bg-white/5' 
                              : 'border-emerald-500/40 text-emerald-400 bg-emerald-950/80 font-bold'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${msg.read ? 'bg-zinc-600' : 'bg-emerald-400 animate-pulse'}`} />
                            {msg.read ? 'DIBACA' : 'BARU'}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 font-mono text-[12px] whitespace-nowrap text-zinc-400">
                          {new Date(msg.created_at).toLocaleString('id-ID', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })} WITA
                        </td>
                        <td className="p-4 sm:p-5 font-bold whitespace-nowrap text-white">{msg.name}</td>
                        <td className="p-4 sm:p-5 whitespace-nowrap font-mono text-xs">
                          <a href={`mailto:${msg.email}`} className="text-sky-400 hover:underline">
                            {msg.email}
                          </a>
                        </td>
                        <td className="p-4 sm:p-5 text-xs text-zinc-300 leading-relaxed max-w-md break-words">
                          {msg.message}
                        </td>
                        <td className="p-4 sm:p-5 text-right whitespace-nowrap">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => toggleReadStatus(msg.id, msg.read)}
                              className={`text-[11px] font-mono px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                                msg.read
                                  ? 'border-white/10 text-zinc-400 hover:bg-white/10'
                                  : 'border-sky-500/40 text-sky-400 bg-sky-950/50 hover:bg-sky-900/80 font-bold'
                              }`}
                            >
                              {msg.read ? 'Tandai Baru' : 'Tandai Dibaca'}
                            </button>
                            <button
                              onClick={() => deleteMessage(msg.id)}
                              className="text-[11px] font-mono p-1.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-950/80 transition-colors cursor-pointer"
                              title="Hapus Pesan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="pt-4">
            <Link href="/" className="text-xs font-mono text-zinc-400 hover:text-sky-400 inline-flex items-center gap-1.5 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Halaman Portofolio Utama</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
