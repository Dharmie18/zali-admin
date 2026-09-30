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
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#ECEEF2] p-6 shadow-xs hover:shadow-md transition-all duration-200 group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#DBB452]" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5C688E]">Pending Trades</span>
          <div className="w-10 h-10 rounded-2xl bg-[#FEF9EE] text-[#DBB452] flex items-center justify-center border border-[#DBB452]/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl font-black text-[#0B1C56] mb-1">{pendingCount}</div>
        <p className="text-xs text-[#DBB452] font-semibold">Requires verification & payout</p>
      </div>

      {/* 2. Completed Trades */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#ECEEF2] p-6 shadow-xs hover:shadow-md transition-all duration-200 group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#37A970]" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5C688E]">Completed Trades</span>
          <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] text-[#37A970] flex items-center justify-center border border-[#37A970]/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl font-black text-[#0B1C56] mb-1">{completedCount}</div>
        <p className="text-xs text-[#37A970] font-semibold">Processed & credited to wallets</p>
      </div>

      {/* 3. Live Crypto Rates */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#ECEEF2] p-6 shadow-xs hover:shadow-md transition-all duration-200 group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#340D73]" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5C688E]">Active Rates</span>
          <div className="w-10 h-10 rounded-2xl bg-[#F0EBF9] text-[#340D73] flex items-center justify-center border border-[#340D73]/20">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl font-black text-[#0B1C56] mb-1">{ratesCount} Pairs</div>
        <p className="text-xs text-[#340D73] font-semibold">Live Naira conversion tickers</p>
      </div>

      {/* 4. Engine Health */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#ECEEF2] p-6 shadow-xs hover:shadow-md transition-all duration-200 group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#7D00FF]" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5C688E]">Database & Server</span>
          <div className="w-10 h-10 rounded-2xl bg-[#F0EBF9] text-[#7D00FF] flex items-center justify-center border border-[#7D00FF]/20">
            <Database className="w-5 h-5" />
          </div>
        </div>
        <div className="text-xl font-black text-[#37A970] truncate mb-1">{dbMode}</div>
        <p className="text-xs text-[#5C688E] font-semibold">Cloud PostgreSQL Engine</p>
      </div>
    </div>
  );
}
