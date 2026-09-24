"use client";

import React from 'react';
import { User } from '@/lib/types';
import { RotateCw, UserCheck, Shield, Wallet } from 'lucide-react';

interface UsersTabProps {
  user: User | null;
  loading: boolean;
  onRefresh: () => void;
}

export function UsersTab({ user, loading, onRefresh }: UsersTabProps) {
  return (
    <div className="rounded-3xl bg-[#270949] border border-white/10 p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Registered User Directory</h2>
          <p className="text-xs text-[#A390C5] mt-0.5">Authenticated customer profiles synced with Aiven PostgreSQL</p>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-[#D4C2F1] bg-white/5 hover:bg-[#6333F5]/20 border border-white/10 hover:border-[#6333F5]/40 transition-all disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#6333F5]' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#1F0A38] text-[#A390C5] text-[11px] uppercase tracking-wider font-bold border-b border-white/10">
              <th className="py-4 px-5">User ID</th>
              <th className="py-4 px-5">Full Name</th>
              <th className="py-4 px-5">Email Address</th>
              <th className="py-4 px-5">Phone</th>
              <th className="py-4 px-5">Access Role</th>
              <th className="py-4 px-5 text-right">Wallet Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {!user ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-[#A390C5]">
                  {loading ? 'Fetching directory...' : 'No users loaded.'}
                </td>
              </tr>
            ) : (
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-5 font-mono font-bold text-white text-xs">
                  #{user.user_id}
                </td>
                <td className="py-4 px-5 font-bold text-white text-sm">
                  {user.first_name} {user.last_name}
                </td>
                <td className="py-4 px-5 text-xs text-[#D4C2F1]">
                  {user.email}
                </td>
                <td className="py-4 px-5 text-xs text-[#A390C5]">
                  {user.phone || 'Not Set'}
                </td>
                <td className="py-4 px-5">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                      user.role === 'admin'
                        ? 'bg-[#6333F5]/20 text-[#D4C2F1] border border-[#6333F5]/30'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    <Shield className="w-3 h-3 text-[#10B981]" />
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-5 text-right font-extrabold text-[#10B981] text-sm">
                  ₦{Number(user.wallet_balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
