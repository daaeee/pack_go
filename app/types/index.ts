// app/types/index.ts

export interface InventoryItem {
  id: number;
  name: string;
  room: string;
  category: string;
  batchId: number;
  fragile: boolean;
  packed: boolean;
}

export interface Batch {
  id: number;
  name: string;
  date: string;
  time: string;
  address: string;
  itemLimit: number;
  currentItems: number;
  priority: 'urgent' | 'medium' | 'low';
  status: 'planned' | 'in-transit' | 'delivered';
}

export interface Box {
  id: number;
  name: string;
  room: string;
  description: string;
  status: 'empty' | 'assembling' | 'ready';
  batchId: number;
  icon: string;
  unpacked: boolean;
  itemsCount: number;
  items: string[];
}

export interface Task {
  id: number;
  title: string;
  description: string;
  section: 'before' | 'during' | 'after';
  date: string;
  completed: boolean;
}

export interface HistoryItem {
  address: string;
  date: string;
  stats: string;
}
