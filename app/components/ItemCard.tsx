// app/components/ItemCard.tsx
import React from 'react';
import { InventoryItem } from '../types';

interface ItemCardProps {
  item: InventoryItem;
  onTogglePacked: (id: number) => void;
  getRoomName: (room: string) => string;
  getCategoryName: (category: string) => string;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onTogglePacked,
  getRoomName,
  getCategoryName,
}) => {
  return (
    <div className="item-card" data-item-id={item.id}>
      <div className={`item-icon ${item.packed ? 'green' : 'gray'}`} />
      <div className="item-details">
        <div className="item-name">{item.name}</div>
        <div className="item-room">{getRoomName(item.room)}</div>
        <div className="item-tags">
          <div className="tag white">{getCategoryName(item.category)}</div>
          <div className="tag red">Партия №{item.batchId}</div>
          <div
            className={`tag ${item.packed ? 'green' : 'gray'} packed-tag`}
            onClick={() => onTogglePacked(item.id)}
          >
            {item.packed ? 'Упаковано' : 'Не упаковано'}
          </div>
        </div>
      </div>
      {item.fragile && <div className="fragile-indicator">Хрупкое</div>}
    </div>
  );
};

export default ItemCard;
