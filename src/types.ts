/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppView = 'login' | 'dashboard' | 'analytics' | 'devices';

export interface TransactionItem {
  id: string;
  title: string;
  count: number;
  date: string;
  time: string;
  status: 'Selesai' | 'Pending' | 'Gagal';
  amount: number; // in Rupiah
  type: 'battery' | 'atk' | 'box' | 'bottle';
}

export interface BinCapacity {
  id: 'battery' | 'atk' | 'box' | 'bottle';
  name: string;
  subName?: string;
  icon: string;
  percentage: number;
  maxVolume: number; // e.g. 50 items max
  currentCount: number;
  warning?: string;
  colorHex: string;
}

export interface NodeStatus {
  id: string;
  name: string;
  status: 'ONLINE' | 'SYNCING' | 'OFFLINE' | 'MAINTENANCE';
  colorClass: string;
}
