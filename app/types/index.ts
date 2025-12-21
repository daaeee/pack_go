export interface Item {
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

export interface MoveHistory {
  id: number;
  address: string;
  startDate: string;
  endDate: string;
  totalItems: number;
  totalBatches: number;
  totalBoxes: number;
  completedTasks: number;
  totalTasks: number;
}

export type FilterType = 'all' | 'furniture' | 'clothing' | 'electronics' | 'books' | 'kitchen';
export type TasksFilterType = 'all' | 'active' | 'completed';
export type RoomType = 'living-room' | 'kitchen' | 'bedroom' | 'office' | 'bathroom';
export type CategoryType = 'furniture' | 'electronics' | 'clothing' | 'books' | 'kitchen';
export type PriorityType = 'urgent' | 'medium' | 'low';
export type StatusType = 'empty' | 'assembling' | 'ready';
export type SectionType = 'before' | 'during' | 'after';

// В конце файла app/types/index.ts добавьте:
export const initialTestData = {
  items: [
    {
      id: 1,
      name: 'Кофеварка',
      room: 'kitchen',
      category: 'kitchen',
      batchId: 1,
      fragile: true,
      packed: false
    },
    {
      id: 2,
      name: 'Диван',
      room: 'living-room',
      category: 'furniture',
      batchId: 1,
      fragile: false,
      packed: true
    }
  ],
  batches: [
    {
      id: 1,
      name: 'Первоочередные вещи',
      date: '2024-01-15',
      time: '14:00',
      address: 'ул. Пушкина, д. 15, кв. 42',
      itemLimit: 10,
      currentItems: 2,
      priority: 'urgent',
      status: 'planned'
    }
  ],
  boxes: [
    {
      id: 1,
      name: 'Кухонная посуда',
      room: 'kitchen',
      description: 'Тарелки, кастрюли, столовые приборы',
      status: 'ready',
      batchId: 1,
      icon: '🍽️',
      unpacked: false,
      itemsCount: 3,
      items: ['Тарелки (12 шт)', 'Кастрюли (3 шт)', 'Столовые приборы']
    }
  ],
  tasks: [
    {
      id: 1,
      title: 'Упаковать посуду',
      description: 'Аккуратно завернуть хрупкие предметы',
      section: 'before',
      date: '2024-01-10',
      completed: false
    }
  ]
};