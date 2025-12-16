// app/components/BatchCard.tsx

import React from 'react';
import { Batch, InventoryItem } from '../types';

interface BatchCardProps {
  batch: Batch;
  index: number;
  items: InventoryItem[];
  onToggleDetails: (batchId: number) => void;
  isExpanded: boolean;
  getRoomName: (room: string) => string;
  getPriorityName: (priority: string) => string;
  getPriorityClass: (priority: string) => string;
  getPriorityTextClass: (priority: string) => string;
  formatDate: (date: string) => string;
}

const BatchCard: React.FC<BatchCardProps> = ({
  batch,
  index,
  items,
  onToggleDetails,
  isExpanded,
  getRoomName,
  getPriorityName,
  getPriorityClass,
  getPriorityTextClass,
  formatDate,
}) => {
  const progressPercentage =
    batch.itemLimit > 0 ? (batch.currentItems / batch.itemLimit) * 100 : 0;

  const batchNumber = index + 1;
  let batchNumberClass = 'batch-number-1';
  if (batchNumber === 2) batchNumberClass = 'batch-number-2';
  else if (batchNumber === 3) batchNumberClass = 'batch-number-3';
  else if (batchNumber >= 4) batchNumberClass = 'batch-number-4';

  const priorityClass = getPriorityClass(batch.priority);
  const priorityTextClass = getPriorityTextClass(batch.priority);
  const priorityName = getPriorityName(batch.priority);

  const showDetailsButton = batch.status !== 'delivered';

  return (
    <div className="batch-card" data-batch-id={batch.id}>
      <div className={`batch-number ${batchNumberClass}`}>{batchNumber}</div>

      <div className="batch-content">
        <div className="batch-title">{batch.name}</div>
        <div className="batch-date">
          {formatDate(batch.date)} {batch.time}
        </div>
        <div className="batch-address">{batch.address}</div>

        <div className="batch-packed-label">Упаковано</div>

        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="batch-packed-count">
          {batch.currentItems} из {batch.itemLimit} предметов
        </div>

        <div
          className={
            'batch-action ' +
            (batch.status === 'delivered'
              ? 'batch-action-delivered'
              : 'batch-action-details')
          }
          onClick={
            showDetailsButton ? () => onToggleDetails(batch.id) : undefined
          }
        >
          {showDetailsButton ? (
            <div className="batch-action-text batch-action-text-blue">
              {isExpanded ? 'Скрыть детали' : 'Посмотреть детали'}
            </div>
          ) : (
            <div className="batch-action-text">Доставлено</div>
          )}
        </div>

        <div className={`batch-priority ${priorityClass}`}>
          <div className={`priority-text ${priorityTextClass}`}>
            {priorityName}
          </div>
        </div>

        <div
          className={
            'batch-items-container' + (isExpanded ? ' expanded' : '')
          }
        >
          <div className="batch-items-title">Предметы в партии:</div>
          <div className="batch-items-list">
            {items.length > 0 ? (
              items.map(item => (
                <div className="batch-item" key={item.id}>
                  <div
                    className={
                      'batch-item-icon ' +
                      (item.packed ? 'green' : 'gray')
                    }
                  />
                  <div className="batch-item-details">
                    <div className="batch-item-name">{item.name}</div>
                    <div className="batch-item-room">
                      {getRoomName(item.room)}
                    </div>
                  </div>
                  {item.fragile && (
                    <div className="batch-item-fragile">Хрупкое</div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', color: '#9F9F9F' }}>
                В этой партии пока нет предметов
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchCard;
