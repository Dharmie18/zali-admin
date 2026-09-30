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
    <header className="sticky top-0 z-40 w-full border-b border-[#ECEEF2] bg-white/90 backdrop-blur-xl shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <div className="relative w-11 h-11 rounded-2xl bg-[#340D73] p-2.5 shadow-md shadow-[#340D73]/25 flex items-center justify-center">
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
            <span className="text-2xl font-black tracking-wider text-[#0B1C56]">
              ZALI
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider bg-[#F0EBF9] text-[#340D73] border border-[#340D73]/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#37A970]" />
              ADMIN PORTAL
            </span>
          </div>
        </div>

        {/* User Navigation */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Status Chip */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8F9FD] border border-[#ECEEF2] text-xs font-semibold text-[#5C688E]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#37A970] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#37A970]"></span>
            </span>
            <span>{systemStatus}</span>
          </div>

          {/* User Profile Chip */}
          <div className="flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-full bg-[#F8F9FD] border border-[#ECEEF2]">
            <div className="w-8 h-8 rounded-full bg-[#340D73] text-white font-bold text-sm flex items-center justify-center shadow-xs">
              {initial}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-[#0B1C56] tracking-tight">{user?.first_name || 'Admin'} {user?.last_name || ''}</p>
              <p className="text-[11px] text-[#5C688E] truncate max-w-[140px]">{user?.email}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-[#5C688E] hover:text-[#DC5355] bg-[#F8F9FD] hover:bg-[#FEF1F1] border border-[#ECEEF2] hover:border-[#DC5355]/30 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
