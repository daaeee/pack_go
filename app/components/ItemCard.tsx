'use client';

import { InventoryItem, DeliveryBatch } from "C:/Users/Пользователь/pack_go/app/types";

interface ItemCardProps {
  item: InventoryItem;
  batch?: DeliveryBatch;
  onTogglePacked: () => void;
}

export default function ItemCard({ item, batch, onTogglePacked }: ItemCardProps) {
  const getRoomName = (roomValue: string) => {
    const roomNames: { [key: string]: string } = {
      'living-room': 'Гостиная',
      'kitchen': 'Кухня',
      'bedroom': 'Спальня',
      'office': 'Кабинет',
      'bathroom': 'Ванная'
    };
    return roomNames[roomValue] || roomValue;
  };

  const getCategoryName = (categoryValue: string) => {
    const categoryNames: { [key: string]: string } = {
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
  const batchName = batch ? batch.name : 'Не назначена';

  return (
    <div className="item-card">
      <div className={iconClass}></div>
      <div className="item-details">
        <div className="item-name">{item.name}</div>
        <div className="item-room">{getRoomName(item.room)}</div>
        <div className="item-tags">
          <div className="tag white">{getCategoryName(item.category)}</div>
          <div className="tag red">{batchName}</div>
          <div 
            className={`${packedTagClass} packed-tag`}
            onClick={onTogglePacked}
          >
            {packedTagText}
          </div>
        </div>
      </div>
      {item.fragile && <div className="fragile-indicator">Хрупкое</div>}
    </div>
  );
}