'use client';

import React, { useState, useEffect } from 'react';
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
import AddTaskModal from './components/AddTaskModal';
import AddBoxModal from './components/AddBoxModal';
import HelpModal from './components/HelpModal';
import FinishMoveModal from './components/FinishMoveModal';
import QRCodeModal from './components/QRCodeModal';
import {
  Item,
  Batch,
  Box,
  Task,
  MoveHistory,
  FilterType,
  RoomType,
  CategoryType,
  PriorityType,
  StatusType,
  SectionType,
} from './types';

export default function Home() {
  // Состояния данных
  const [items, setItems] = useState<Item[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [moveHistory, setMoveHistory] = useState<MoveHistory[]>([]);
  
  // Счетчики
  const [nextItemId, setNextItemId] = useState(1);
  const [nextBatchId, setNextBatchId] = useState(1);
  const [nextBoxId, setNextBoxId] = useState(1);
  const [nextTaskId, setNextTaskId] = useState(1);
  
  // UI состояния
  const [currentPage, setCurrentPage] = useState('inventory');
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Модальные окна
  const [showItemModal, setShowItemModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showBoxModal, setShowBoxModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showFinishMoveModal, setShowFinishMoveModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  
  const [selectedBoxForQR, setSelectedBoxForQR] = useState<Box | null>(null);
  const [hasShownFinishMoveModal, setHasShownFinishMoveModal] = useState(false);

  // Проверка условия для показа окна завершения переезда
  useEffect(() => {
    const allBoxesUnpacked = boxes.length > 0 && boxes.every(box => box.unpacked);
    if (allBoxesUnpacked && !hasShownFinishMoveModal) {
      setTimeout(() => {
        setShowFinishMoveModal(true);
      }, 500);
    }
  }, [boxes, hasShownFinishMoveModal]);

  // Вспомогательные функции
  const getRoomName = (roomValue: string): string => {
    const roomNames: Record<string, string> = {
      'living-room': 'Гостиная',
      'kitchen': 'Кухня',
      'bedroom': 'Спальня',
      'office': 'Кабинет',
      'bathroom': 'Ванная'
    };
    return roomNames[roomValue] || roomValue;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Обработчики для предметов
  const handleAddItem = (itemData: {
    name: string;
    room: RoomType;
    category: CategoryType;
    batchId: number;
    fragile: boolean;
  }) => {
    const newItem: Item = {
      ...itemData,
      id: nextItemId,
      packed: false,
    };
    
    // Обновляем счетчик предметов в партии
    const updatedBatches = batches.map(batch => {
      if (batch.id === itemData.batchId) {
        return { ...batch, currentItems: batch.currentItems + 1 };
      }
      return batch;
    });
    
    setItems([...items, newItem]);
    setBatches(updatedBatches);
    setNextItemId(nextItemId + 1);
  };

  const handleTogglePacked = (itemId: number) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, packed: !item.packed } : item
    ));
  };

  // Обработчики для партий
  const handleAddBatch = (batchData: {
    name: string;
    date: string;
    time: string;
    address: string;
    itemLimit: number;
    priority: PriorityType;
  }) => {
    const newBatch: Batch = {
      ...batchData,
      id: nextBatchId,
      currentItems: 0,
      status: 'planned',
    };
    
    setBatches([...batches, newBatch]);
    setNextBatchId(nextBatchId + 1);
  };

  // Обработчики для коробок
  const handleAddBox = (boxData: {
    name: string;
    room: RoomType;
    description: string;
    status: StatusType;
    batchId: number;
  }) => {
    // Определяем иконку в зависимости от комнаты
    let boxIcon = '📦';
    switch(boxData.room) {
      case 'kitchen': boxIcon = '🍽️'; break;
      case 'bedroom': boxIcon = '🛏️'; break;
      case 'bathroom': boxIcon = '🛁'; break;
      case 'living-room': boxIcon = '📺'; break;
      case 'office': boxIcon = '📚'; break;
    }
    
    const newBox: Box = {
      ...boxData,
      id: nextBoxId,
      icon: boxIcon,
      unpacked: false,
      itemsCount: 0,
      items: [],
    };
    
    setBoxes([...boxes, newBox]);
    setNextBoxId(nextBoxId + 1);
  };

  const handleShowQRCode = (box: Box) => {
    setSelectedBoxForQR(box);
    setShowQRModal(true);
  };

  const handleMarkUnpacked = (boxId: number) => {
    setBoxes(boxes.map(box => 
      box.id === boxId ? { ...box, unpacked: true } : box
    ));
  };

  // Обработчики для задач
  const handleAddTask = (taskData: {
    title: string;
    description: string;
    section: SectionType;
    date: string;
  }) => {
    const newTask: Task = {
      ...taskData,
      id: nextTaskId,
      completed: false,
    };
    
    setTasks([...tasks, newTask]);
    setNextTaskId(nextTaskId + 1);
  };

  const handleToggleCompleted = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId: number) => {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  // Обработчики для профиля
  const handleShowHelp = () => {
    setShowHelpModal(true);
  };

  const handleLogout = () => {
    if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
      alert('Выход из аккаунта выполнен');
    }
  };

  const handleFinishMoveCancel = () => {
    setShowFinishMoveModal(false);
  };

  const handleFinishMoveConfirm = () => {
    setShowFinishMoveModal(false);
    setHasShownFinishMoveModal(true);
    
    // Сохраняем текущий переезд в историю
    const currentMove: MoveHistory = {
      id: moveHistory.length + 1,
      address: batches.length > 0 ? batches[0].address : 'Не указан',
      startDate: batches.length > 0 ? batches[0].date : new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      totalItems: items.length,
      totalBatches: batches.length,
      totalBoxes: boxes.length,
      completedTasks: tasks.filter(task => task.completed).length,
      totalTasks: tasks.length
    };
    
    setMoveHistory([...moveHistory, currentMove]);
    
    // Очищаем все данные
    setItems([]);
    setBatches([]);
    setBoxes([]);
    setTasks([]);
    setNextItemId(1);
    setNextBatchId(1);
    setNextBoxId(1);
    setNextTaskId(1);
    setCurrentFilter('all');
    setSearchQuery('');
    
    alert('Переезд успешно завершен! Данные перемещены в историю.');
  };

  // Получение данных для профиля
  const currentAddress = batches.length > 0 ? batches[0].address : 'Не указан';
  const moveStartDateText = batches.length > 0 
    ? `Начат: ${formatDate(batches[0].date)}`
    : 'Начат: --';

  // Отображение текущей страницы
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'inventory':
        return (
          <InventoryPage
            items={items}
            batches={batches}
            onTogglePacked={handleTogglePacked}
            onAddItem={() => setShowItemModal(true)}
            onSearch={setSearchQuery}
            onFilterChange={setCurrentFilter}
            currentFilter={currentFilter}
            searchQuery={searchQuery}
          />
        );
      
      case 'boxes':
        return (
          <BoxesPage
            boxes={boxes}
            onAddBox={() => setShowBoxModal(true)}
            onShowQRCode={handleShowQRCode}
          />
        );
      
      case 'scanner':
        return (
          <ScannerPage onStartScanning={() => alert('Сканирование начато! Наведите камеру на QR-код коробки.')} />
        );
      
      case 'delivery':
        return (
          <DeliveryPage
            batches={batches}
            items={items}
            onCreateBatch={() => setShowBatchModal(true)}
          />
        );
      
      case 'unpacking':
        return (
          <UnpackingPage
            boxes={boxes}
            onScanQRCode={() => setCurrentPage('scanner')}
            onMarkUnpacked={handleMarkUnpacked}
          />
        );
      
      case 'tasks':
        return (
          <TasksPage
            tasks={tasks}
            onAddTask={() => setShowTaskModal(true)}
            onToggleCompleted={handleToggleCompleted}
            onDeleteTask={handleDeleteTask}
          />
        );
      
      case 'profile':
        return (
          <ProfilePage
            totalItems={items.length}
            totalBatches={batches.length}
            currentAddress={currentAddress}
            moveStartDate={moveStartDateText}
            moveHistory={moveHistory}
            onShowHelp={handleShowHelp}
            onLogout={handleLogout}
          />
        );
      
      default:
        return (
          <InventoryPage
            items={items}
            batches={batches}
            onTogglePacked={handleTogglePacked}
            onAddItem={() => setShowItemModal(true)}
            onSearch={setSearchQuery}
            onFilterChange={setCurrentFilter}
            currentFilter={currentFilter}
            searchQuery={searchQuery}
          />
        );
    }
  };

  return (
    <>
      {renderCurrentPage()}
      
      <BottomMenu
        activePage={currentPage}
        onPageChange={setCurrentPage}
      />
      
      <AddItemModal
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
        onAddItem={handleAddItem}
        batches={batches}
      />
      
      <AddBatchModal
        isOpen={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        onAddBatch={handleAddBatch}
      />
      
      <AddTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onAddTask={handleAddTask}
      />
      
      <AddBoxModal
        isOpen={showBoxModal}
        onClose={() => setShowBoxModal(false)}
        onAddBox={handleAddBox}
        batches={batches}
      />
      
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
      
      <FinishMoveModal
        isOpen={showFinishMoveModal}
        onClose={() => setShowFinishMoveModal(false)}
        onCancel={handleFinishMoveCancel}
        onConfirm={handleFinishMoveConfirm}
      />
      
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => {
          setShowQRModal(false);
          setSelectedBoxForQR(null);
        }}
        box={selectedBoxForQR}
      />
    </>
  );
}