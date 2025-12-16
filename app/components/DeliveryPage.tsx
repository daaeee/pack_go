// app/components/DeliveryPage.tsx

import React, { useState } from 'react';
import { Batch, InventoryItem } from '../types';

interface DeliveryPageProps {
  batches: Batch[];
  stats: {
    total: number;
    delivered: number;
    inTransit: number;
    planned: number;
  };
  onAddBatch: () => void;
  inventoryItems: InventoryItem[];
  getRoomName: (room: string) => string;
  getPriorityName: (priority: string) => string;
  getPriorityClass: (priority: string) => string;
  getPriorityTextClass: (priority: string) => string;
  formatDate: (date: string) => string;
}

const DeliveryPage: React.FC<DeliveryPageProps> = ({
  batches,
  stats,
  onAddBatch,
  inventoryItems,
  getRoomName,
  getPriorityName,
  getPriorityClass,
  getPriorityTextClass,
  formatDate,
}) => {
  const [expandedBatch, setExpandedBatch] = useState<number | null>(null);

  const toggleBatchExpanded = (batchId: number) => {
    setExpandedBatch(prev => (prev === batchId ? null : batchId));
  };

  const getBatchItems = (batchId: number) =>
    inventoryItems.filter(item => item.batchId === batchId);

  return (
    <div id="delivery-page" className="delivery-page">
      <div className="batch-header">
        <div className="batch-header-title">Партии доставки</div>
        <div className="batch-header-subtitle" id="batchesCount">
          Запланировано {stats.total} партий
        </div>
      </div>

      <div className="batch-container" id="batchesContainer">
        {batches.length === 0 ? (
          <div className="empty-state active" id="batchesEmptyState">
            Партии доставки отсутствуют. Создайте первую партию!
          </div>
        ) : (
          batches.map((batch, index) => {
            const progressPercentage =
              batch.itemLimit > 0
                ? (batch.currentItems / batch.itemLimit) * 100
                : 0;

            const batchItems = getBatchItems(batch.id);
            const batchNumber = index + 1;

            let batchNumberClass = 'batch-number-1';
            if (batchNumber === 2) batchNumberClass = 'batch-number-2';
            else if (batchNumber === 3) batchNumberClass = 'batch-number-3';
            else if (batchNumber >= 4) batchNumberClass = 'batch-number-4';

            const priorityClass = getPriorityClass(batch.priority);
            const priorityTextClass = getPriorityTextClass(batch.priority);
            const priorityName = getPriorityName(batch.priority);

            const isExpanded = expandedBatch === batch.id;

            return (
              <div className="batch-card" key={batch.id} data-batch-id={batch.id}>
                <div className={`batch-number ${batchNumberClass}`}>
                  {batchNumber}
                </div>

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
                      batch.status !== 'delivered'
                        ? () => toggleBatchExpanded(batch.id)
                        : undefined
                    }
                  >
                    <div className="batch-action-text">
                      {batch.status === 'delivered'
                        ? 'Доставлено'
                        : isExpanded
                        ? 'Скрыть детали'
                        : 'Посмотреть детали'}
                    </div>
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
                      {batchItems.length > 0 ? (
                        batchItems.map(item => (
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
                        <div
                          style={{
                            padding: '20px',
                            color: '#9F9F9F',
                          }}
                        >
                          В этой партии пока нет предметов
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="summary-section">
        <div className="summary-container">
          <div className="summary-title">Сводка по партиям</div>

          <div className="summary-item">
            <div className="summary-indicator indicator-delivered" />
            <div className="summary-label">Доставлено</div>
            <div className="summary-count" id="deliveredCount">
              {stats.delivered}
            </div>
          </div>

          <div className="summary-item">
            <div className="summary-indicator indicator-in-transit" />
            <div className="summary-label">В пути</div>
            <div className="summary-count" id="inTransitCount">
              {stats.inTransit}
            </div>
          </div>

          <div className="summary-item">
            <div className="summary-indicator indicator-planned" />
            <div className="summary-label">Планируется</div>
            <div className="summary-count" id="plannedCount">
              {stats.planned}
            </div>
          </div>
        </div>
      </div>

      <div
        className="create-batch-button"
        id="createBatchButton"
        onClick={onAddBatch}
      >
        <div className="create-batch-text">Создать новую партию</div>
      </div>
    </div>
  );
};

export default DeliveryPage;
