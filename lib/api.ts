import { CryptoOrder, CryptoRate, SystemHealth, User } from './types';

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://zali-api.onrender.com/api';
const CLEAN_URL = RAW_API_URL.replace(/\/+$/, '');
export const API_BASE_URL = CLEAN_URL.endsWith('/api') ? CLEAN_URL : `${CLEAN_URL}/api`;

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('zali_admin_token');
}

export function setStoredAuth(token: string | null, user: User | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('zali_admin_token', token);
  } else {
    localStorage.removeItem('zali_admin_token');
  }

  if (user) {
    localStorage.setItem('zali_admin_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('zali_admin_user');
  }
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('zali_admin_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function apiFetch<T = any>(
  endpoint: string,
  method: string = 'GET',
  body?: any
): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

// Dedicated API Methods
export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiFetch<{ message: string; token: string; user: User }>('/users/login', 'POST', { email, password }),
  
  // Health
  getHealth: () => apiFetch<SystemHealth>('/health'),

  // Orders
  getOrders: () => apiFetch<{ orders: CryptoOrder[] }>('/crypto/orders'),
  updateOrderStatus: (order_id: string, status: 'Completed' | 'Cancelled') =>
    apiFetch<{ message: string; order_id: string; status: string }>('/admin/orders', 'PUT', { order_id, status }),

  // Rates
  getRates: () => apiFetch<{ rates: CryptoRate[] }>('/crypto/rates'),
  updateRate: (coin_id: string, naira_rate: number, usd_rate?: number) =>
    apiFetch<{ message: string; coin_id: string; naira_rate: number }>('/admin/rates', 'PUT', { coin_id, naira_rate, usd_rate }),

  // Profile / Users
  getProfile: () => apiFetch<{ user: User }>('/users/profile'),
};
