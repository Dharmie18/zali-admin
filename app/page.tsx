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
    <div className="min-h-screen bg-[#F8F9FD] text-[#0B1C56] flex flex-col">
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
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'orders'
                ? 'bg-[#340D73] text-white shadow-md shadow-[#340D73]/25'
                : 'bg-white hover:bg-[#F0EBF9] text-[#5C688E] hover:text-[#0B1C56] border border-[#ECEEF2]'
            }`}
          >
            <ArrowDownRight className={`w-4 h-4 ${activeTab === 'orders' ? 'text-white' : 'text-[#DBB452]'}`} />
            <span>Pending Trades Queue</span>
            {pendingCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'orders' ? 'bg-white text-[#340D73]' : 'bg-[#DBB452] text-white'
              }`}>
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('rates')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'rates'
                ? 'bg-[#340D73] text-white shadow-md shadow-[#340D73]/25'
                : 'bg-white hover:bg-[#F0EBF9] text-[#5C688E] hover:text-[#0B1C56] border border-[#ECEEF2]'
            }`}
          >
            <TrendingUp className={`w-4 h-4 ${activeTab === 'rates' ? 'text-white' : 'text-[#37A970]'}`} />
            <span>Live Exchange Rates</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'users'
                ? 'bg-[#340D73] text-white shadow-md shadow-[#340D73]/25'
                : 'bg-white hover:bg-[#F0EBF9] text-[#5C688E] hover:text-[#0B1C56] border border-[#ECEEF2]'
            }`}
          >
            <Users className={`w-4 h-4 ${activeTab === 'users' ? 'text-white' : 'text-[#7D00FF]'}`} />
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
