'use client';

import React, { useState } from 'react';
import ItemCard from './ItemCard';
import { Item, Batch, FilterType } from '../types';

interface InventoryPageProps {
  items: Item[];
  batches: Batch[];
  onTogglePacked: (itemId: number) => void;
  onAddItem: () => void;
  onSearch: (query: string) => void;
  onFilterChange: (filter: FilterType) => void;
  currentFilter: FilterType;
  searchQuery: string;
}

const InventoryPage: React.FC<InventoryPageProps> = ({
  items,
  batches,
  onTogglePacked,
  onAddItem,
  onSearch,
  onFilterChange,
  currentFilter,
  searchQuery,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const getRoomName = (roomValue: string) => {
    const roomNames: Record<string, string> = {
      'living-room': 'Гостиная',
      'kitchen': 'Кухня',
      'bedroom': 'Спальня',
      'office': 'Кабинет',
      'bathroom': 'Ванная'
    };
    return roomNames[roomValue] || roomValue;
  };

  const getCategoryName = (categoryValue: string) => {
    const categoryNames: Record<string, string> = {
      'furniture': 'Мебель',
      'electronics': 'Электроника',
      'clothing': 'Одежда',
      'books': 'Книги',
      'kitchen': 'Кухонные принадлежности'
    };
    return categoryNames[categoryValue] || categoryValue;
  };

  const getFilteredItems = () => {
    let filtered = items;
    
    // Применяем фильтр по категории
    if (currentFilter !== 'all') {
      filtered = filtered.filter(item => item.category === currentFilter);
    }
    
    // Применяем поиск
    if (localSearchQuery) {
      filtered = filtered.filter(item => {
        const itemName = item.name.toLowerCase();
        const roomName = getRoomName(item.room).toLowerCase();
        return itemName.includes(localSearchQuery.toLowerCase()) || roomName.includes(localSearchQuery.toLowerCase());
      });
    }
    
    return filtered;
  };

  const getPluralForm = (number: number) => {
    if (number % 10 === 1 && number % 100 !== 11) {
      return '';
    } else if ([2, 3, 4].includes(number % 10) && ![12, 13, 14].includes(number % 100)) {
      return 'а';
    } else {
      return 'ов';
    }
  };

  const totalItems = items.length;
  const packedItems = items.filter(item => item.packed).length;
  const fragileItems = items.filter(item => item.fragile).length;
  const filteredItems = getFilteredItems();
  const showNoResults = localSearchQuery && filteredItems.length === 0 && items.length > 0;
  const showEmptyState = items.length === 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    onSearch(value);
  };

  const filters = [
    { value: 'all' as FilterType, label: 'Все' },
    { value: 'furniture' as FilterType, label: 'Мебель' },
    { value: 'clothing' as FilterType, label: 'Одежда' },
    { value: 'electronics' as FilterType, label: 'Электроника' },
    { value: 'books' as FilterType, label: 'Книги' },
    { value: 'kitchen' as FilterType, label: 'Кухня' },
  ];

  return (
    <div id="inventory-page" className="page">
      <div className="container">
        <div className="top-section">
          <div className="header">
            <h1>Инвентарь</h1>
            <p id="itemsCount">{totalItems} предмет{getPluralForm(totalItems)}</p>
          </div>
          
          <div className="stats">
            <div className="stat-card total">
              <h3>Всего</h3>
              <div className="number" id="totalCount">{totalItems}</div>
            </div>
            <div className="stat-card packed">
              <h3>Упаковано</h3>
              <div className="number" id="packedCount">{packedItems}</div>
            </div>
            <div className="stat-card fragile">
              <h3>Хрупкое</h3>
              <div className="number" id="fragileCount">{fragileItems}</div>
            </div>
          </div>
          
          <div className="add-button" id="addButton" onClick={onAddItem}>
            <span>Добавить</span>
          </div>
          
          <div className="search-container">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              className="search-input"
              id="searchInput"
              placeholder="Поиск по вещам или комнатам..."
              value={localSearchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="filters">
            {filters.map(filter => (
              <div
                key={filter.value}
                className={`filter ${currentFilter === filter.value ? 'active' : ''}`}
                data-filter={filter.value}
                onClick={() => onFilterChange(filter.value)}
              >
                <span>{filter.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bottom-section">
          <div className="items-container" id="itemsContainer">
            {showEmptyState && (
              <div className="empty-state active" id="emptyState">
                Инвентарь пуст. Добавьте первый предмет!
              </div>
            )}
            
            {showNoResults && (
              <div className="search-no-results active" id="searchNoResults">
                Предмет не найден. Попробуйте другой запрос.
              </div>
            )}
            
            {!showEmptyState && !showNoResults && filteredItems.map(item => {
              const batch = batches.find(b => b.id === item.batchId);
              const batchName = batch ? batch.name : 'Не назначена';
              
              return (
                <ItemCard
                  key={item.id}
                  item={item}
                  batchName={batchName}
                  onTogglePacked={onTogglePacked}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;