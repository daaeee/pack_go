'use client';

import { useState } from 'react';
import { DeliveryBatch, InventoryItem } from "C:/Users/Пользователь/pack_go/app/types";

interface BatchCardProps {
  batch: DeliveryBatch;
  index: number;
  items: InventoryItem[];
  onUpdateStatus: (batchId: number, newStatus: DeliveryBatch['status']) => void;
}

export default function BatchCard({ batch, index, items, onUpdateStatus }: BatchCardProps) {
  const [showItems, setShowItems] = useState(false);

  const progressPercentage = batch.itemLimit > 0 ? (batch.currentItems / batch.itemLimit) * 100 : 0;
  
  const batchNumber = index + 1;
  let batchNumberClass = 'batch-number-1';
  if (batchNumber === 2) batchNumberClass = 'batch-number-2';
  else if (batchNumber === 3) batchNumberClass = 'batch-number-3';
  else if (batchNumber >= 4) batchNumberClass = 'batch-number-4';

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

  const getPriorityName = (priorityValue: string) => {
    const priorityNames: { [key: string]: string } = {
      'urgent': 'Срочно',
      'medium': 'Средний',
      'low': 'Можно подождать'
    };
    return priorityNames[priorityValue] || priorityValue;
  };

  const getPriorityClass = (priorityValue: string) => {
    const priorityClasses: { [key: string]: string } = {
      'urgent': 'priority-urgent',
      'medium': 'priority-medium',
      'low': 'priority-low'
    };
    return priorityClasses[priorityValue] || 'priority-medium';
  };

  const getPriorityTextClass = (priorityValue: string) => {
    const priorityTextClasses: { [key: string]: string } = {
      'urgent': 'priority-urgent-text',
      'medium': 'priority-medium-text',
      'low': 'priority-low-text'
    };
    return priorityTextClasses[priorityValue] || 'priority-medium-text';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleMarkDelivered = () => {
    if (batch.status !== 'delivered') {
      onUpdateStatus(batch.id, 'delivered');
    }
  };

  return (
    <div className="batch-card" data-batch-id={batch.id}>
      <div className={`batch-number ${batchNumberClass}`}>{batchNumber}</div>
      <div className="batch-content">
        <div className="batch-title">{batch.name}</div>
        <div className="batch-date">{formatDate(batch.date)} {batch.time}</div>
        <div className="batch-address">{batch.address}</div>
        
        <div className="batch-packed-label">Упаковано</div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="batch-packed-count">
          {batch.currentItems} из {batch.itemLimit} предметов
        </div>
        
        {batch.status === 'delivered' ? (
          <div className="batch-action batch-action-delivered">
            <div className="batch-action-text">Доставлено</div>
          </div>
        ) : (
          <div 
            className="batch-action batch-action-details"
            onClick={() => setShowItems(!showItems)}
          >
            <div className="batch-action-text batch-action-text-blue">
              {showItems ? 'Скрыть детали' : 'Посмотреть детали'}
            </div>
          </div>
        )}
        
        <div className={`batch-priority ${getPriorityClass(batch.priority)}`}>
          <div className={`priority-text ${getPriorityTextClass(batch.priority)}`}>
            {getPriorityName(batch.priority)}
          </div>
        </div>
        
        <div className={`batch-items-container ${showItems ? 'expanded' : ''}`}>
          <div className="batch-items-title">Предметы в партии:</div>
          <div className="batch-items-list">
            {items.length > 0 ? (
              items.map(item => (
                <div key={item.id} className="batch-item">
                  <div className={`batch-item-icon ${item.packed ? 'green' : 'gray'}`}></div>
                  <div className="batch-item-details">
                    <div className="batch-item-name">{item.name}</div>
                    <div className="batch-item-room">{getRoomName(item.room)}</div>
                  </div>
                  {item.fragile && <div className="batch-item-fragile">Хрупкое</div>}
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#9F9F9F' }}>
                В этой партии пока нет предметов
              </div>
            )}
          </div>
          
          {batch.status !== 'delivered' && (
            <div 
              className="batch-action batch-action-delivered"
              style={{ marginTop: '20px' }}
              onClick={handleMarkDelivered}
            >
              <div className="batch-action-text batch-action-text-blue">
                Отметить как доставленную
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}