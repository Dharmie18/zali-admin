"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { CryptoOrder } from '@/lib/types';
import { api } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { RotateCw, Copy, Check, CheckCircle2, XCircle, Search, ExternalLink } from 'lucide-react';

interface OrdersTabProps {
  orders: CryptoOrder[];
  loading: boolean;
  onRefresh: () => void;
}

export function OrdersTab({ orders, loading, onRefresh }: OrdersTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const { showToast } = useToast();

  const getCoinImage = (coinId: string): string => {
    const id = coinId.toLowerCase();
    if (id.includes('btc')) return '/btc.png';
    if (id.includes('eth')) return '/eth.png';
    if (id.includes('usdt')) return '/usdt.png';
    if (id.includes('sol')) return '/sol.png';
    if (id.includes('ltc') || id.includes('litecoin')) return '/litecoin.png';
    if (id.includes('doge')) return '/dogecoin.png';
    return '/btc.png';
  };

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    showToast('Wallet address copied to clipboard!', 'success');
    setTimeout(() => setCopiedAddress(null), 2500);
  };

  const handleStatusUpdate = async (orderId: string, status: 'Completed' | 'Cancelled') => {
    const confirmMsg = status === 'Completed'
      ? `Approve order ${orderId}? This will automatically credit the user's Naira wallet and send an email receipt.`
      : `Reject order ${orderId}?`;

    if (!confirm(confirmMsg)) return;

    setProcessingId(orderId);
    try {
      await api.updateOrderStatus(orderId, status);
      showToast(`Order ${orderId} successfully set to ${status}!`, 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      order.order_id.toLowerCase().includes(term) ||
      order.coin_id.toLowerCase().includes(term) ||
      String(order.user_id).includes(term) ||
      (order.wallet_address && order.wallet_address.toLowerCase().includes(term))
    );
  });

  return (
    <div className="rounded-3xl bg-[#270949] border border-white/10 p-6 sm:p-8 shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Trade Orders Queue</h2>
          <p className="text-xs text-[#A390C5] mt-0.5">Real-time incoming sell trades from the Zali client</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A390C5]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search order or asset..."
              className="w-full bg-[#1A0733] border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-[#7C69A2] focus:outline-none focus:border-[#764DF5]"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-[#D4C2F1] bg-white/5 hover:bg-[#6333F5]/20 border border-white/10 hover:border-[#6333F5]/40 transition-all disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#6333F5]' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#1F0A38] text-[#A390C5] text-[11px] uppercase tracking-wider font-bold border-b border-white/10">
              <th className="py-4 px-5">Order ID</th>
              <th className="py-4 px-5">User</th>
              <th className="py-4 px-5">Asset</th>
              <th className="py-4 px-5">Crypto Amount</th>
              <th className="py-4 px-5">NGN Value</th>
              <th className="py-4 px-5">Deposit Address</th>
              <th className="py-4 px-5">Status</th>
              <th className="py-4 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-[#A390C5]">
                  {loading ? 'Fetching active orders...' : 'No orders found.'}
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const isPending = order.status === 'Pending';
                const isCompleted = order.status === 'Completed';

                return (
                  <tr key={order.order_id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-white text-xs">
                      {order.order_id}
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#6333F5]/20 text-[#D4C2F1] border border-[#6333F5]/30">
                        User #{order.user_id}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-white/10 p-1 flex items-center justify-center shrink-0">
                          <Image
                            src={getCoinImage(order.coin_id)}
                            alt={order.coin_id}
                            width={20}
                            height={20}
                            className="object-contain"
                          />
                        </div>
                        <span className="font-extrabold text-xs uppercase text-white tracking-wide">
                          {order.coin_id}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5 font-semibold text-white text-xs">
                      {order.amount_crypto}
                    </td>
                    <td className="py-4 px-5 font-extrabold text-[#10B981] text-sm">
                      ₦{Number(order.naira_value).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#A390C5] max-w-[140px] truncate" title={order.wallet_address}>
                          {order.wallet_address || 'N/A'}
                        </span>
                        {order.wallet_address && (
                          <button
                            onClick={() => handleCopy(order.wallet_address)}
                            className="text-[#A390C5] hover:text-white p-1 rounded transition-colors"
                            title="Copy Wallet Address"
                          >
                            {copiedAddress === order.wallet_address ? (
                              <Check className="w-3.5 h-3.5 text-[#10B981]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ${
                          isCompleted
                            ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                            : isPending
                            ? 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30'
                            : 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      {isPending ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStatusUpdate(order.order_id, 'Completed')}
                            disabled={processingId === order.order_id}
                            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#49A367] to-[#58AE7A] hover:brightness-110 text-white text-xs font-bold shadow-md shadow-[#49A367]/30 transition-all disabled:opacity-50 flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve & Pay</span>
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(order.order_id, 'Cancelled')}
                            disabled={processingId === order.order_id}
                            className="px-3 py-1.5 rounded-full bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#EF4444] border border-[#EF4444]/30 text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-[#A390C5] font-medium">Settled</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
