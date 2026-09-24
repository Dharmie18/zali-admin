"use client";

import React from 'react';
import { Clock, CheckCircle2, TrendingUp, Database } from 'lucide-react';

interface StatsProps {
  pendingCount: number;
  completedCount: number;
  ratesCount: number;
  dbMode: string;
}

export function StatsOverview({ pendingCount, completedCount, ratesCount, dbMode }: StatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {/* 1. Pending Trades */}
      <div className="relative overflow-hidden rounded-3xl bg-[#270949] border border-white/10 p-6 shadow-xl hover:border-white/20 transition-all duration-200 group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F59E0B] to-[#D97706]" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A390C5]">Pending Trades</span>
          <div className="w-10 h-10 rounded-2xl bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center border border-[#F59E0B]/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-white mb-1">{pendingCount}</div>
        <p className="text-xs text-[#F59E0B] font-semibold">Requires verification & payout</p>
      </div>

      {/* 2. Completed Trades */}
      <div className="relative overflow-hidden rounded-3xl bg-[#270949] border border-white/10 p-6 shadow-xl hover:border-white/20 transition-all duration-200 group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#49A367] to-[#58AE7A]" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A390C5]">Completed Trades</span>
          <div className="w-10 h-10 rounded-2xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-white mb-1">{completedCount}</div>
        <p className="text-xs text-[#10B981] font-semibold">Processed & credited to wallets</p>
      </div>

      {/* 3. Live Crypto Rates */}
      <div className="relative overflow-hidden rounded-3xl bg-[#270949] border border-white/10 p-6 shadow-xl hover:border-white/20 transition-all duration-200 group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6333F5] to-[#764DF5]" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A390C5]">Active Rates</span>
          <div className="w-10 h-10 rounded-2xl bg-[#6333F5]/20 text-[#D4C2F1] flex items-center justify-center border border-[#6333F5]/30">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-white mb-1">{ratesCount} Pairs</div>
        <p className="text-xs text-[#D4C2F1] font-semibold">Live Naira conversion tickers</p>
      </div>

      {/* 4. Engine Health */}
      <div className="relative overflow-hidden rounded-3xl bg-[#270949] border border-white/10 p-6 shadow-xl hover:border-white/20 transition-all duration-200 group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4061F1] to-[#5876F2]" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A390C5]">Database & Server</span>
          <div className="w-10 h-10 rounded-2xl bg-[#4061F1]/20 text-[#5876F2] flex items-center justify-center border border-[#4061F1]/30">
            <Database className="w-5 h-5" />
          </div>
        </div>
        <div className="text-xl font-bold text-[#10B981] truncate mb-1">{dbMode}</div>
        <p className="text-xs text-[#A390C5] font-semibold">Cloud PostgreSQL Engine</p>
      </div>
    </div>
  );
}
