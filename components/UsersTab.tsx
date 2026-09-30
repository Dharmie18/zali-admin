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
    <div className="rounded-3xl bg-white border border-[#ECEEF2] p-6 sm:p-8 shadow-xs">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B1C56] tracking-tight">Registered User Directory</h2>
          <p className="text-xs text-[#5C688E] mt-0.5">Authenticated customer profiles synced with Aiven PostgreSQL</p>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-[#340D73] bg-[#F0EBF9] hover:bg-[#340D73] hover:text-white transition-all disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#ECEEF2]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#F8F9FD] text-[#5C688E] text-[11px] uppercase tracking-wider font-bold border-b border-[#ECEEF2]">
              <th className="py-4 px-5">User ID</th>
              <th className="py-4 px-5">Full Name</th>
              <th className="py-4 px-5">Email Address</th>
              <th className="py-4 px-5">Phone</th>
              <th className="py-4 px-5">Access Role</th>
              <th className="py-4 px-5 text-right">Wallet Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECEEF2]">
            {!user ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-[#768498]">
                  {loading ? 'Fetching directory...' : 'No users loaded.'}
                </td>
              </tr>
            ) : (
              <tr className="hover:bg-[#F8F9FD]/80 transition-colors">
                <td className="py-4 px-5 font-mono font-bold text-[#0B1C56] text-xs">
                  #{user.user_id}
                </td>
                <td className="py-4 px-5 font-bold text-[#0B1C56] text-sm">
                  {user.first_name} {user.last_name}
                </td>
                <td className="py-4 px-5 text-xs text-[#5C688E]">
                  {user.email}
                </td>
                <td className="py-4 px-5 text-xs text-[#768498]">
                  {user.phone || 'Not Set'}
                </td>
                <td className="py-4 px-5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                      user.role === 'admin'
                        ? 'bg-[#F0EBF9] text-[#340D73] border border-[#340D73]/30'
                        : 'bg-[#F8F9FD] text-[#5C688E] border border-[#ECEEF2]'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-[#37A970]" />
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-5 text-right font-extrabold text-[#37A970] text-sm">
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
