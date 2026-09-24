"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { StatsOverview } from '@/components/StatsOverview';
import { OrdersTab } from '@/components/OrdersTab';
import { RatesTab } from '@/components/RatesTab';
import { UsersTab } from '@/components/UsersTab';
import { LoginModal } from '@/components/LoginModal';
import { api, getStoredToken, getStoredUser, setStoredAuth } from '@/lib/api';
import { CryptoOrder, CryptoRate, User } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import { ArrowDownRight, TrendingUp, Users } from 'lucide-react';

export default function AdminDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'rates' | 'users'>('orders');

  const [orders, setOrders] = useState<CryptoOrder[]>([]);
  const [rates, setRates] = useState<CryptoRate[]>([]);
  const [dbMode, setDbMode] = useState<string>('Aiven PostgreSQL');
  const [loading, setLoading] = useState<boolean>(false);

  const { showToast } = useToast();

  const loadData = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);

    try {
      const [ordersRes, ratesRes, healthRes] = await Promise.all([
        api.getOrders().catch(() => ({ orders: [] })),
        api.getRates().catch(() => ({ rates: [] })),
        api.getHealth().catch(() => ({ db: 'Aiven PostgreSQL', service: 'Zali API', status: 'ok' })),
      ]);

      setOrders(ordersRes.orders || []);
      setRates(ratesRes.rates || []);
      setDbMode(`${healthRes.db || 'Cloud'} Active`);
    } catch (err: any) {
      showToast(err.message || 'Failed to sync with API', 'error');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, showToast]);

  useEffect(() => {
    const token = getStoredToken();
    const storedUser = getStoredUser();

    if (token && storedUser && storedUser.role === 'admin') {
      setUser(storedUser);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  const handleLogout = () => {
    setStoredAuth(null, null);
    setUser(null);
    setIsAuthenticated(false);
    showToast('Logged out successfully', 'info');
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
  };

  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const completedCount = orders.filter((o) => o.status === 'Completed').length;

  return (
    <div className="min-h-screen bg-[#120422] text-white flex flex-col">
      {!isAuthenticated && <LoginModal onSuccess={handleLoginSuccess} />}

      <Navbar user={user} onLogout={handleLogout} systemStatus={dbMode} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Stats Overview */}
        <StatsOverview
          pendingCount={pendingCount}
          completedCount={completedCount}
          ratesCount={rates.length}
          dbMode={dbMode}
        />

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-white/10 mb-8 pb-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-t-2xl font-bold text-sm transition-all relative ${
              activeTab === 'orders'
                ? 'text-white bg-[#6333F5]/15 border-b-2 border-[#6333F5]'
                : 'text-[#A390C5] hover:text-white hover:bg-white/5'
            }`}
          >
            <ArrowDownRight className="w-4 h-4 text-[#F59E0B]" />
            <span>Pending Trades Queue</span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#F59E0B] text-black">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('rates')}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-t-2xl font-bold text-sm transition-all relative ${
              activeTab === 'rates'
                ? 'text-white bg-[#6333F5]/15 border-b-2 border-[#6333F5]'
                : 'text-[#A390C5] hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
            <span>Live Exchange Rates</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-t-2xl font-bold text-sm transition-all relative ${
              activeTab === 'users'
                ? 'text-white bg-[#6333F5]/15 border-b-2 border-[#6333F5]'
                : 'text-[#A390C5] hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4 text-[#D4C2F1]" />
            <span>Registered Users</span>
          </button>
        </div>

        {/* Tab Panels */}
        {activeTab === 'orders' && (
          <OrdersTab orders={orders} loading={loading} onRefresh={loadData} />
        )}

        {activeTab === 'rates' && (
          <RatesTab rates={rates} loading={loading} onRefresh={loadData} />
        )}

        {activeTab === 'users' && (
          <UsersTab user={user} loading={loading} onRefresh={loadData} />
        )}
      </main>
    </div>
  );
}
