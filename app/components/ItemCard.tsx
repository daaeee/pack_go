'use client';

import React from 'react';
import { Item } from '../types';

interface ItemCardProps {
  item: Item;
  batchName: string;
  onTogglePacked: (itemId: number) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, batchName, onTogglePacked }) => {
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

  const iconClass = item.packed ? 'item-icon green' : 'item-icon gray';
  const packedTagClass = item.packed ? 'tag green' : 'tag gray';
  const packedTagText = item.packed ? 'Упаковано' : 'Не упаковано';

  let itemIcon = '📦';
  switch(item.category) {
    case 'furniture': itemIcon = '🪑'; break;
    case 'electronics': itemIcon = '📱'; break;
    case 'clothing': itemIcon = '👕'; break;
    case 'books': itemIcon = '📚'; break;
    case 'kitchen': itemIcon = '🍽️'; break;
  }

  return (
    <div className="item-card">
      <div className={iconClass}>{itemIcon}</div>
      <div className="item-details">
        <div className="item-name">{item.name}</div>
        <div className="item-room">{getRoomName(item.room)}</div>
        <div className="item-tags">
          <div className="tag white">{getCategoryName(item.category)}</div>
          <div className="tag red">{batchName}</div>
          <div
            className={`${packedTagClass} packed-tag`}
            onClick={() => onTogglePacked(item.id)}
          >
            {packedTagText}
          </div>
        </div>
      </div>
      {item.fragile && <div className="fragile-indicator">Хрупкое</div>}
    </div>
  );
};

export default ItemCard;