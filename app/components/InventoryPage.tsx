'use client';

import { useState } from 'react';
import { InventoryItem, DeliveryBatch, FilterType } from "C:/Users/Пользователь/pack_go/app/types";
import AddItemModal from './AddItemModal';
import ItemCard from './ItemCard';

interface InventoryPageProps {
  items: InventoryItem[];
  batches: DeliveryBatch[];
  onItemsChange: (items: InventoryItem[]) => void;
  onBatchesChange: (batches: DeliveryBatch[]) => void;
}

export default function InventoryPage({
  items,
  batches,
  onItemsChange,
  onBatchesChange,
}: InventoryPageProps) {
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredItems = items.filter(item => {
    const matchesFilter = currentFilter === 'all' || item.category === currentFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.room.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalCount = items.length;
  const packedCount = items.filter(item => item.packed).length;
  const fragileCount = items.filter(item => item.fragile).length;

  const handleAddItem = (newItem: Omit<InventoryItem, 'id'>) => {
    const itemWithId = {
      ...newItem,
      id: Date.now(),
    };
    onItemsChange([...items, itemWithId]);
    setShowAddModal(false);
  };

  const togglePackedStatus = (itemId: number) => {
    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, packed: !item.packed } : item
    );
    onItemsChange(updatedItems);
  };

  return (
    <div className="container">
      {/* Верхняя белая секция */}
      <div className="top-section">
        <div className="header">
          <h1>Инвентарь</h1>
          <p id="itemsCount">{totalCount} предметов</p>
        </div>
        
        <div className="stats">
          <div className="stat-card total">
            <h3>Всего</h3>
            <div className="number" id="totalCount">{totalCount}</div>
          </div>
          <div className="stat-card packed">
            <h3>Упаковано</h3>
            <div className="number" id="packedCount">{packedCount}</div>
          </div>
          <div className="stat-card fragile">
            <h3>Хрупкое</h3>
            <div className="number" id="fragileCount">{fragileCount}</div>
          </div>
        </div>
        
        <div className="add-button" onClick={() => setShowAddModal(true)}>
          <span>Добавить</span>
        </div>
        
        <div className="search-container">
          <div className="search-icon"></div>
          <input
            type="text"
            className="search-input"
            placeholder="Поиск по вещам или комнатам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filters">
          {(['all', 'furniture', 'clothing', 'electronics', 'books', 'kitchen'] as FilterType[]).map(filter => (
            <div
              key={filter}
              className={`filter ${currentFilter === filter ? 'active' : ''}`}
              onClick={() => setCurrentFilter(filter)}
            >
              <span>
                {filter === 'all' ? 'Все' :
                 filter === 'furniture' ? 'Мебель' :
                 filter === 'clothing' ? 'Одежда' :
                 filter === 'electronics' ? 'Электроника' :
                 filter === 'books' ? 'Книги' : 'Кухня'}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Нижняя оранжевая секция */}
      <div className="bottom-section">
        <div className="items-container" id="itemsContainer">
          {filteredItems.length === 0 ? (
            <div className="empty-state active">
              {searchQuery ? 'Предмет не найден. Попробуйте другой запрос.' : 'Инвентарь пуст. Добавьте первый предмет!'}
            </div>
          ) : (
            filteredItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                batch={batches.find(b => b.id === item.batchId)}
                onTogglePacked={() => togglePackedStatus(item.id)}
              />
            ))
          )}
        </div>
      </div>

      {showAddModal && (
        <AddItemModal
          batches={batches}
          onClose={() => setShowAddModal(false)}
          onAddItem={handleAddItem}
        />
      )}
    </div>
  );
}