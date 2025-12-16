// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { InventoryItem, Batch, Box, Task } from './types';

import InventoryPage from './components/InventoryPage';
import BoxesPage from './components/BoxesPage';
import ScannerPage from './components/ScannerPage';
import DeliveryPage from './components/DeliveryPage';
import UnpackingPage from './components/UnpackingPage';
import TasksPage from './components/TasksPage';
import ProfilePage from './components/ProfilePage';
import BottomMenu from './components/BottomMenu';

import AddItemModal from './components/AddItemModal';
import AddBatchModal from './components/AddBatchModal';
import AddBoxModal from './components/AddBoxModal';
import AddTaskModal from './components/AddTaskModal';
import HelpModal from './components/HelpModal';
import FinishMoveModal from './components/FinishMoveModal';

type Page =
  | 'inventory'
  | 'boxes'
  | 'scanner'
  | 'delivery'
  | 'unpacking'
  | 'tasks'
  | 'profile';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('inventory');

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [showAddBoxModal, setShowAddBoxModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showFinishMoveModal, setShowFinishMoveModal] = useState(false);
  const [hasShownFinishMoveModal, setHasShownFinishMoveModal] =
    useState(false);

  // данные
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // счётчики
  const [nextItemId, setNextItemId] = useState(1);
  const [nextBatchId, setNextBatchId] = useState(1);
  const [nextBoxId, setNextBoxId] = useState(1);
  const [nextTaskId, setNextTaskId] = useState(1);

  // фильтры и поиск
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentTasksFilter, setCurrentTasksFilter] =
    useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [boxesSearchQuery, setBoxesSearchQuery] = useState('');

  // авто‑показ модалки завершения переезда
  useEffect(() => {
    const allBoxesUnpacked =
      boxes.length > 0 && boxes.every(box => box.unpacked);

    if (allBoxesUnpacked && !hasShownFinishMoveModal) {
      setTimeout(() => {
        setShowFinishMoveModal(true);
      }, 500);
    }
  }, [boxes, hasShownFinishMoveModal]);

  // --- инвентарь ---
  const addItem = (item: Omit<InventoryItem, 'id' | 'packed'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: nextItemId,
      packed: false,
    };

    setInventoryItems(prev => [...prev, newItem]);
    setNextItemId(prev => prev + 1);

    const batchIndex = batches.findIndex(b => b.id === item.batchId);
    if (batchIndex !== -1) {
      const updatedBatches = [...batches];
      updatedBatches[batchIndex] = {
        ...updatedBatches[batchIndex],
        currentItems: updatedBatches[batchIndex].currentItems + 1,
      };
      setBatches(updatedBatches);
    }
  };

  const toggleItemPackedStatus = (itemId: number) => {
    setInventoryItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, packed: !item.packed } : item,
      ),
    );
  };

  // --- партии ---
  const addBatch = (batch: Omit<Batch, 'id' | 'currentItems' | 'status'>) => {
    const newBatch: Batch = {
      ...batch,
      id: nextBatchId,
      currentItems: 0,
      status: 'planned',
    };

    setBatches(prev => [...prev, newBatch]);
    setNextBatchId(prev => prev + 1);
  };

  // --- коробки ---
  const addBox = (box: Omit<Box, 'id' | 'icon' | 'unpacked' | 'itemsCount' | 'items'>) => {
    let icon = '📦';

    switch (box.room) {
      case 'kitchen':
        icon = '🍽️';
        break;
      case 'bedroom':
        icon = '🛏️';
        break;
      case 'bathroom':
        icon = '🛁';
        break;
      case 'living-room':
        icon = '📺';
        break;
      case 'office':
        icon = '📚';
        break;
    }

    const items = box.description ? box.description.split('\n') : [];

    const newBox: Box = {
      ...box,
      id: nextBoxId,
      icon,
      unpacked: false,
      itemsCount: items.length,
      items,
    };

    setBoxes(prev => [...prev, newBox]);
    setNextBoxId(prev => prev + 1);
  };

  const markBoxAsUnpacked = (boxId: number) => {
    setBoxes(prev =>
      prev.map(box =>
        box.id === boxId ? { ...box, unpacked: true } : box,
      ),
    );
  };

  // --- задачи ---
  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: nextTaskId,
      completed: false,
    };

    setTasks(prev => [...prev, newTask]);
    setNextTaskId(prev => prev + 1);
  };

  const toggleTaskCompleted = (taskId: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (taskId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  // --- вспомогательные мапперы ---
  const getRoomName = (roomValue: string) => {
    const roomNames: Record<string, string> = {
      'living-room': 'Гостиная',
      kitchen: 'Кухня',
      bedroom: 'Спальня',
      office: 'Кабинет',
      bathroom: 'Ванная',
    };
    return roomNames[roomValue] || roomValue;
  };

  const getCategoryName = (categoryValue: string) => {
    const categoryNames: Record<string, string> = {
      furniture: 'Мебель',
      electronics: 'Электроника',
      clothing: 'Одежда',
      books: 'Книги',
      kitchen: 'Кухонные принадлежности',
    };
    return categoryNames[categoryValue] || categoryValue;
  };

  const getPriorityName = (priorityValue: string) => {
    const priorityNames: Record<string, string> = {
      urgent: 'Срочно',
      medium: 'Средний',
      low: 'Можно подождать',
    };
    return priorityNames[priorityValue] || priorityValue;
  };

  const getPriorityClass = (priorityValue: string) => {
    const priorityClasses: Record<string, string> = {
      urgent: 'priority-urgent',
      medium: 'priority-medium',
      low: 'priority-low',
    };
    return priorityClasses[priorityValue] || 'priority-medium';
  };

  const getPriorityTextClass = (priorityValue: string) => {
    const priorityTextClasses: Record<string, string> = {
      urgent: 'priority-urgent-text',
      medium: 'priority-medium-text',
      low: 'priority-low-text',
    };
    return priorityTextClasses[priorityValue] || 'priority-medium-text';
  };

  const getBoxStatusName = (statusValue: string) => {
    const statusNames: Record<string, string> = {
      empty: 'Пустая',
      assembling: 'Комплектуется',
      ready: 'Готова',
    };
    return statusNames[statusValue] || statusValue;
  };

  const getBoxStatusClass = (statusValue: string) => {
    const statusClasses: Record<string, string> = {
      empty: 'empty',
      assembling: 'assembling',
      ready: 'ready',
    };
    return statusClasses[statusValue] || 'empty';
  };

  const getBoxIconClass = (roomValue: string) => {
    const iconClasses: Record<string, string> = {
      kitchen: 'orange',
      bedroom: 'orange',
      bathroom: 'blue',
      'living-room': 'green',
      office: 'green',
    };
    return iconClasses[roomValue] || 'green';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatTaskDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря',
    ];
    return `${day} ${monthNames[date.getMonth()]}`;
  };

  const getPluralForm = (number: number) => {
    if (number % 10 === 1 && number % 100 !== 11) return '';
    if (
      [2, 3, 4].includes(number % 10) &&
      ![12, 13, 14].includes(number % 100)
    ) {
      return 'а';
    }
    return 'ов';
  };

  const getTaskPluralForm = (number: number) => {
    if (number % 10 === 1 && number % 100 !== 11) return 'задача';
    if (
      [2, 3, 4].includes(number % 10) &&
      ![12, 13, 14].includes(number % 100)
    ) {
      return 'задачи';
    }
    return 'задач';
  };

  // статистики и фильтры
  const getFilteredItems = () => {
    let filtered = inventoryItems;

    if (currentFilter !== 'all') {
      filtered = filtered.filter(item => item.category === currentFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(q) ||
          getRoomName(item.room).toLowerCase().includes(q),
      );
    }

    return filtered;
  };

  const getFilteredBoxes = () => {
    let filtered = boxes;

    if (boxesSearchQuery) {
      const q = boxesSearchQuery.toLowerCase();
      filtered = filtered.filter(
        box =>
          (box as any).name?.toLowerCase().includes(q) ||
          getRoomName(box.room).toLowerCase().includes(q),
      );
    }

    return filtered;
  };

  const getFilteredTasks = () => {
    let filtered = tasks;
    if (currentTasksFilter === 'active') {
      filtered = filtered.filter(t => !t.completed);
    } else if (currentTasksFilter === 'completed') {
      filtered = filtered.filter(t => t.completed);
    }
    return filtered;
  };

  const inventoryStats = {
    total: inventoryItems.length,
    packed: inventoryItems.filter(i => i.packed).length,
    fragile: inventoryItems.filter(i => i.fragile).length,
  };

  const boxesStats = {
    total: boxes.length,
    ready: boxes.filter(b => b.status === 'ready').length,
    inWork: boxes.filter(b => b.status === 'assembling').length,
  };

  const batchesStats = {
    total: batches.length,
    delivered: batches.filter(b => b.status === 'delivered').length,
    inTransit: batches.filter(b => b.status === 'in-transit').length,
    planned: batches.filter(b => b.status === 'planned').length,
  };

  const tasksStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    remaining: tasks.filter(t => !t.completed).length,
  };

  const unpackingStats = {
    unpacked: boxes.filter(b => b.unpacked).length,
    total: boxes.length,
    progress:
      boxes.length > 0
        ? (boxes.filter(b => b.unpacked).length / boxes.length) * 100
        : 0,
  };

  console.log('showAddItemModal:', showAddItemModal);

  return (
    <>
      {currentPage === 'inventory' && (
        <InventoryPage
          items={getFilteredItems()}
          stats={inventoryStats}
          onAddItem={() => setShowAddItemModal(true)}
          onTogglePacked={toggleItemPackedStatus}
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          getRoomName={getRoomName}
          getCategoryName={getCategoryName}
        />
      )}

      {currentPage === 'boxes' && (
        <BoxesPage
          boxes={getFilteredBoxes()}
          stats={boxesStats}
          onAddBox={() => setShowAddBoxModal(true)}
          searchQuery={boxesSearchQuery}
          onSearchChange={setBoxesSearchQuery}
          getRoomName={getRoomName}
          getBoxStatusName={getBoxStatusName}
          getBoxStatusClass={getBoxStatusClass}
          getBoxIconClass={getBoxIconClass}
          onShowQRCode={boxId => alert(`QR-код для коробки ${boxId}`)}
        />
      )}

      {currentPage === 'scanner' && <ScannerPage />}

      {currentPage === 'delivery' && (
        <DeliveryPage
          batches={batches}
          stats={batchesStats}
          onAddBatch={() => setShowAddBatchModal(true)}
          inventoryItems={inventoryItems}
          getRoomName={getRoomName}
          getPriorityName={getPriorityName}
          getPriorityClass={getPriorityClass}
          getPriorityTextClass={getPriorityTextClass}
          formatDate={formatDate}
        />
      )}

      {currentPage === 'unpacking' && (
        <UnpackingPage
          boxes={boxes}
          stats={unpackingStats}
          onScanClick={() => setCurrentPage('scanner')}
          onMarkAsUnpacked={markBoxAsUnpacked}
          getRoomName={getRoomName}
          getBoxIconClass={getBoxIconClass}
        />
      )}

      {currentPage === 'tasks' && (
        <TasksPage
          tasks={getFilteredTasks()}
          stats={tasksStats}
          onAddTask={() => setShowAddTaskModal(true)}
          currentFilter={currentTasksFilter}
          onFilterChange={setCurrentTasksFilter}
          onToggleCompleted={toggleTaskCompleted}
          onDeleteTask={deleteTask}
          formatTaskDate={formatTaskDate}
          getTaskPluralForm={getTaskPluralForm}
        />
      )}

      {currentPage === 'profile' && (
        <ProfilePage
          inventoryCount={inventoryItems.length}
          batchesCount={batches.length}
          address={batches.length > 0 ? batches[0].address : '--'}
          moveDate={
            batches.length > 0 ? formatDate(batches[0].date) : '--'
          }
          onShowHelp={() => setShowHelpModal(true)}
          onLogout={() => {
            if (window.confirm('Выйти из аккаунта?')) {
              alert('Вы вышли');
            }
          }}
        />
      )}

      {/* модалки */}
      {showAddItemModal && (
        <AddItemModal
          onClose={() => setShowAddItemModal(false)}
          onSubmit={addItem}
          batches={batches}
        />
      )}

      {showAddBatchModal && (
        <AddBatchModal
          onClose={() => setShowAddBatchModal(false)}
          onSubmit={addBatch}
        />
      )}

      {showAddBoxModal && (
        <AddBoxModal
          onClose={() => setShowAddBoxModal(false)}
          onSubmit={addBox}
          batches={batches}
        />
      )}

      {showAddTaskModal && (
        <AddTaskModal
          onClose={() => setShowAddTaskModal(false)}
          onSubmit={addTask}
        />
      )}

      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}

      {showFinishMoveModal && (
        <FinishMoveModal
          onClose={() => setShowFinishMoveModal(false)}
          onConfirm={() => {
            setShowFinishMoveModal(false);
            setHasShownFinishMoveModal(true);
            alert('Переезд завершён!');
          }}
        />
      )}

      <BottomMenu
        currentPage={currentPage}
        onPageChange={p => setCurrentPage(p as Page)}
      />
    </>
  );
}
