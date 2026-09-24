"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { CryptoRate } from '@/lib/types';
import { api } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { RotateCw, Save, Calculator, ArrowRightLeft } from 'lucide-react';

interface RatesTabProps {
  rates: CryptoRate[];
  loading: boolean;
  onRefresh: () => void;
}

export function RatesTab({ rates, loading, onRefresh }: RatesTabProps) {
  const [editedRates, setEditedRates] = useState<Record<string, number>>({});
  const [savingCoin, setSavingCoin] = useState<string | null>(null);
  const [calcAmount, setCalcAmount] = useState<number>(1);
  const [calcCoin, setCalcCoin] = useState<string>('btc');
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

  const handleInputChange = (coinId: string, val: string) => {
    const num = parseFloat(val);
    setEditedRates((prev) => ({
      ...prev,
      [coinId]: isNaN(num) ? 0 : num,
    }));
  };

  const handleSaveRate = async (rate: CryptoRate) => {
    const newNaira = editedRates[rate.coin_id] !== undefined ? editedRates[rate.coin_id] : rate.naira_rate;

    if (newNaira <= 0) {
      showToast('Please enter a valid positive Naira rate', 'error');
      return;
    }

    setSavingCoin(rate.coin_id);
    try {
      await api.updateRate(rate.coin_id, newNaira, rate.usd_rate);
      showToast(`Rate for ${rate.name} (${rate.symbol}) updated to ₦${newNaira.toLocaleString()}!`, 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to update rate', 'error');
    } finally {
      setSavingCoin(null);
    }
  };

  // Calculator calculation
  const selectedRateObj = rates.find((r) => r.coin_id === calcCoin) || rates[0];
  const activeRate = selectedRateObj
    ? (editedRates[selectedRateObj.coin_id] !== undefined ? editedRates[selectedRateObj.coin_id] : selectedRateObj.naira_rate)
    : 0;
  const calculatedNaira = (calcAmount || 0) * activeRate;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Rates Management Table */}
      <div className="lg:col-span-2 rounded-3xl bg-[#270949] border border-white/10 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Cryptocurrency Exchange Rates</h2>
            <p className="text-xs text-[#A390C5] mt-0.5">Live rates synced directly to the user mobile app and calculators</p>
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
                <th className="py-4 px-5">Asset</th>
                <th className="py-4 px-5">Symbol</th>
                <th className="py-4 px-5">USD Reference</th>
                <th className="py-4 px-5">Current Naira Rate</th>
                <th className="py-4 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-[#A390C5]">
                    {loading ? 'Fetching live rates...' : 'No rates found.'}
                  </td>
                </tr>
              ) : (
                rates.map((rate) => {
                  const currentVal = editedRates[rate.coin_id] !== undefined ? editedRates[rate.coin_id] : rate.naira_rate;

                  return (
                    <tr key={rate.coin_id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 p-1 flex items-center justify-center shrink-0">
                            <Image
                              src={getCoinImage(rate.coin_id)}
                              alt={rate.name}
                              width={22}
                              height={22}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-extrabold text-sm text-white">{rate.name}</p>
                            <p className="text-[11px] font-mono text-[#A390C5]">{rate.coin_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#6333F5]/20 text-[#D4C2F1] border border-[#6333F5]/30">
                          {rate.symbol}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-xs text-[#D4C2F1] font-semibold">
                        ${Number(rate.usd_rate).toLocaleString()}
                      </td>
                      <td className="py-4 px-5">
                        <div className="relative w-44">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#10B981] text-xs">₦</span>
                          <input
                            type="number"
                            step="0.01"
                            value={currentVal}
                            onChange={(e) => handleInputChange(rate.coin_id, e.target.value)}
                            className="w-full bg-[#1A0733] border border-white/15 rounded-xl pl-8 pr-3 py-2 text-xs font-bold text-[#10B981] focus:outline-none focus:border-[#6333F5] focus:ring-2 focus:ring-[#6333F5]/20"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => handleSaveRate(rate)}
                          disabled={savingCoin === rate.coin_id}
                          className="px-4 py-2 rounded-full bg-gradient-to-r from-[#6333F5] to-[#764DF5] hover:brightness-110 text-white text-xs font-bold shadow-md shadow-[#6333F5]/30 transition-all disabled:opacity-50 inline-flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{savingCoin === rate.coin_id ? 'Saving...' : 'Save'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right: Rate Preview & Conversion Calculator (Zali Card) */}
      <div className="rounded-3xl bg-[#270949] border border-white/10 p-6 sm:p-8 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-[#6333F5]/20 text-[#D4C2F1] flex items-center justify-center border border-[#6333F5]/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Rate Calculator</h3>
              <p className="text-xs text-[#A390C5]">Instant Naira payout preview</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#D4C2F1] mb-2">
                Select Asset
              </label>
              <select
                value={calcCoin}
                onChange={(e) => setCalcCoin(e.target.value)}
                className="w-full bg-[#1A0733] border border-white/10 rounded-2xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#764DF5]"
              >
                {rates.map((r) => (
                  <option key={r.coin_id} value={r.coin_id} className="bg-[#1A0733] text-white">
                    {r.name} ({r.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#D4C2F1] mb-2">
                Crypto Amount
              </label>
              <input
                type="number"
                step="any"
                value={calcAmount}
                onChange={(e) => setCalcAmount(parseFloat(e.target.value) || 0)}
                placeholder="1.0"
                className="w-full bg-[#1A0733] border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#764DF5]"
              />
            </div>

            <div className="pt-4 border-t border-white/10">
              <span className="text-xs text-[#A390C5] font-semibold block mb-1">Estimated Naira Payout:</span>
              <div className="p-4 rounded-2xl bg-[#1A0733] border border-[#10B981]/30">
                <p className="text-2xl font-black text-[#10B981]">
                  ₦{calculatedNaira.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-[#A390C5] mt-1 font-mono">
                  1 {selectedRateObj?.symbol || 'CRYPTO'} = ₦{Number(activeRate).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-[#D4C2F1] flex items-center gap-3">
          <ArrowRightLeft className="w-5 h-5 text-[#6333F5] shrink-0" />
          <p>Rates adjust automatically on the user app within seconds of saving.</p>
        </div>
      </div>
    </div>
  );
}
