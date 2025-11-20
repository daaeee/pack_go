export type PageType = 'inventory' | 'delivery' | 'unpacking';

export interface InventoryItem {
  id: number;
  name: string;
  room: string;
  category: string;
  batchId: number;
  fragile: boolean;
  packed: boolean;
}

export interface DeliveryBatch {
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

export type FilterType = 'all' | 'furniture' | 'clothing' | 'electronics' | 'books' | 'kitchen';