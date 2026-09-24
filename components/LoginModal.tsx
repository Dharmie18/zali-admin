"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { api, setStoredAuth } from '@/lib/api';
import { User } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import { Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';

interface LoginModalProps {
  onSuccess: (user: User) => void;
}

export function LoginModal({ onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await api.login(email.trim(), password);
      if (data.user.role !== 'admin') {
        throw new Error('Access denied. Administrator privileges required.');
      }

      setStoredAuth(data.token, data.user);
      showToast(`Welcome back, ${data.user.first_name || 'Admin'}!`, 'success');
      onSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#120422]/90 backdrop-blur-2xl">
      <div className="relative w-full max-w-md rounded-3xl bg-[#270949] border border-white/15 p-8 shadow-2xl shadow-[#6333F5]/20 overflow-hidden">
        {/* Top Glow bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6333F5] via-[#764DF5] to-[#49A367]" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-[#6333F5] to-[#764DF5] p-3 shadow-xl shadow-[#6333F5]/40 mb-4">
            <Image
              src="/zali_white.png"
              alt="Zali Logo"
              width={38}
              height={38}
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-2xl font-black tracking-wide text-white">ZALI CONTROL</h2>
          <p className="text-sm text-[#A390C5] mt-1">Sign in with administrator credentials</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs font-semibold text-[#FCA5A5]">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D4C2F1] mb-2">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A390C5]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@zali.com"
                required
                className="w-full bg-[#1A0733] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-[#7C69A2] focus:outline-none focus:border-[#764DF5] focus:ring-4 focus:ring-[#6333F5]/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D4C2F1] mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A390C5]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#1A0733] border border-white/10 rounded-2xl pl-12 pr-12 py-3.5 text-sm text-white placeholder-[#7C69A2] focus:outline-none focus:border-[#764DF5] focus:ring-4 focus:ring-[#6333F5]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A390C5] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-4 rounded-full bg-gradient-to-r from-[#6333F5] to-[#764DF5] hover:brightness-110 text-white font-bold text-sm tracking-wide shadow-lg shadow-[#6333F5]/30 hover:shadow-[#6333F5]/50 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Login to Control Portal</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
