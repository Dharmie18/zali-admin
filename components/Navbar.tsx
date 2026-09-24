"use client";

import React from 'react';
import Image from 'next/image';
import { User } from '@/lib/types';
import { LogOut, ShieldCheck, Activity } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  systemStatus: string;
}

export function Navbar({ user, onLogout, systemStatus }: NavbarProps) {
  const initial = (user?.first_name || user?.email || 'A').charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#1A0733]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6333F5] to-[#764DF5] p-2 shadow-lg shadow-[#6333F5]/30 flex items-center justify-center">
            <Image
              src="/zali_white.png"
              alt="Zali Logo"
              width={26}
              height={26}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-[#EFEBFF] to-[#D4C2F1]">
              ZALI
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider bg-[#6333F5]/20 text-[#D4C2F1] border border-[#6333F5]/30">
              <ShieldCheck className="w-3 h-3 text-[#10B981]" />
              ADMIN PORTAL
            </span>
          </div>
        </div>

        {/* User Navigation */}
        <div className="flex items-center gap-4">
          {/* Status Chip */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[#D4C2F1]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
            </span>
            <span>{systemStatus}</span>
          </div>

          {/* User Profile Chip */}
          <div className="flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6333F5] to-[#4D23CC] text-white font-bold text-sm flex items-center justify-center shadow-md">
              {initial}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white tracking-tight">{user?.first_name || 'Admin'} {user?.last_name || ''}</p>
              <p className="text-[11px] text-[#A390C5] truncate max-w-[140px]">{user?.email}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-[#A390C5] hover:text-[#EF4444] bg-white/5 hover:bg-[#EF4444]/15 border border-white/10 hover:border-[#EF4444]/30 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
