'use client';

import React from 'react';
import BatchCard from './BatchCard';
import { Batch, Item } from '../types';

interface DeliveryPageProps {
  batches: Batch[];
  items: Item[];
  onCreateBatch: () => void;
}

const DeliveryPage: React.FC<DeliveryPageProps> = ({
  batches,
  items,
  onCreateBatch,
}) => {
  const deliveredCount = batches.filter(batch => batch.status === 'delivered').length;
  const inTransitCount = batches.filter(batch => batch.status === 'in-transit').length;
  const plannedCount = batches.filter(batch => batch.status === 'planned').length;

  const getPluralForm = (number: number, word: string) => {
    if (number % 10 === 1 && number % 100 !== 11) {
      return `${number} ${word}`;
    } else if ([2, 3, 4].includes(number % 10) && ![12, 13, 14].includes(number % 100)) {
      return `${number} ${word}и`;
    } else {
      return `${number} ${word}ий`;
    }
  };

  return (
    <div id="delivery-page" className="page">
      <div className="batch-header">
        <div className="batch-header-title">Партии доставки</div>
        <div className="batch-header-subtitle" id="batchesCount">
          {getPluralForm(batches.length, 'Запланирована парти')}
        </div>
      </div>
      
      <div className="batch-container" id="batchesContainer">
        {batches.length === 0 ? (
          <div className="empty-state active" id="batchesEmptyState">
            Партии доставки отсутствуют. Создайте первую партию!
          </div>
        ) : (
          batches.map((batch, index) => {
            const batchItems = items.filter(item => item.batchId === batch.id);
            return (
              <BatchCard
                key={batch.id}
                batch={batch}
                index={index}
                batchItems={batchItems}
              />
            );
          })
        )}
      </div>
      
      <div className="summary-section">
        <div className="summary-container">
          <div className="summary-title">Сводка по партиям</div>
          
          <div className="summary-item">
            <div className="summary-indicator indicator-delivered"></div>
            <div className="summary-label">Доставлено</div>
            <div className="summary-count" id="deliveredCount">
              {getPluralForm(deliveredCount, 'парти')}
            </div>
          </div>
          
          <div className="summary-item">
            <div className="summary-indicator indicator-in-transit"></div>
            <div className="summary-label">В пути</div>
            <div className="summary-count" id="inTransitCount">
              {getPluralForm(inTransitCount, 'парти')}
            </div>
          </div>
          
          <div className="summary-item">
            <div className="summary-indicator indicator-planned"></div>
            <div className="summary-label">Планируется</div>
            <div className="summary-count" id="plannedCount">
              {getPluralForm(plannedCount, 'парти')}
            </div>
          </div>
        </div>
      </div>
      
      <div className="create-batch-button" id="createBatchButton" onClick={onCreateBatch}>
        <div className="create-batch-text">Создать новую партию</div>
      </div>
    </div>
  );
};

export default DeliveryPage;