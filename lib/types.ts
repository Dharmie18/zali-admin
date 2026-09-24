export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  wallet_balance: number;
  created_at?: string;
}

export interface CryptoRate {
  coin_id: string;
  name: string;
  symbol: string;
  naira_rate: number;
  usd_rate: number;
  updated_at?: string;
}

export interface CryptoOrder {
  order_id: string;
  user_id: number;
  coin_id: string;
  amount_crypto: number;
  naira_value: number;
  wallet_address: string;
  status: 'Pending' | 'Received' | 'Processed' | 'Completed' | 'Cancelled';
  created_at: string;
}

export interface GiftcardOrder {
  order_id: string;
  user_id: number;
  card_type: string;
  trade_type: 'BUY' | 'SELL';
  face_value: number;
  naira_payout: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
}

export interface SystemHealth {
  status: string;
  service: string;
  db: string;
}
