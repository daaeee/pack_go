'use client';

import { useState } from 'react';
import { DeliveryBatch, InventoryItem } from "C:/Users/Пользователь/pack_go/app/types";
import AddBatchModal from './AddBatchModal';
import BatchCard from './BatchCard';

interface DeliveryPageProps {
  items: InventoryItem[];
  batches: DeliveryBatch[];
  onBatchesChange: (batches: DeliveryBatch[]) => void;
}

export default function DeliveryPage({
  items,
  batches,
  onBatchesChange,
}: DeliveryPageProps) {
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);

  const deliveredBatches = batches.filter(batch => batch.status === 'delivered');
  const inTransitBatches = batches.filter(batch => batch.status === 'in-transit');
  const plannedBatches = batches.filter(batch => batch.status === 'planned');

  const handleAddBatch = (newBatch: Omit<DeliveryBatch, 'id'>) => {
    const batchWithId = {
      ...newBatch,
      id: Date.now(),
    };
    onBatchesChange([...batches, batchWithId]);
    setShowAddBatchModal(false);
  };

  const updateBatchStatus = (batchId: number, newStatus: DeliveryBatch['status']) => {
    const updatedBatches = batches.map(batch =>
      batch.id === batchId ? { ...batch, status: newStatus } : batch
    );
    onBatchesChange(updatedBatches);
  };

  return (
    <div id="delivery-page" className="page active">
      <div className="batch-header">
        <div className="batch-header-title">Партии доставки</div>
        <div className="batch-header-subtitle" id="batchesCount">
          Запланировано {batches.length} партий
        </div>
      </div>
      
      <div className="batch-container" id="batchesContainer">
        {batches.length === 0 ? (
          <div className="empty-state active" id="batchesEmptyState">
            Партии доставки отсутствуют. Создайте первую партию!
          </div>
        ) : (
          batches.map((batch, index) => (
            <BatchCard
              key={batch.id}
              batch={batch}
              index={index}
              items={items.filter(item => item.batchId === batch.id)}
              onUpdateStatus={updateBatchStatus}
            />
          ))
        )}
      </div>
      
      <div className="summary-section">
        <div className="summary-container">
          <div className="summary-title">Сводка по партиям</div>
          
          <div className="summary-item">
            <div className="summary-indicator indicator-delivered"></div>
            <div className="summary-label">Доставлено</div>
            <div className="summary-count" id="deliveredCount">
              {deliveredBatches.length} партий
            </div>
          </div>
          
          <div className="summary-item">
            <div className="summary-indicator indicator-in-transit"></div>
            <div className="summary-label">В пути</div>
            <div className="summary-count" id="inTransitCount">
              {inTransitBatches.length} партий
            </div>
          </div>
          
          <div className="summary-item">
            <div className="summary-indicator indicator-planned"></div>
            <div className="summary-label">Планируется</div>
            <div className="summary-count" id="plannedCount">
              {plannedBatches.length} партий
            </div>
          </div>
        </div>
      </div>
      
      <div 
        className="create-batch-button" 
        id="createBatchButton"
        onClick={() => setShowAddBatchModal(true)}
      >
        <div className="create-batch-text">Создать новую партию</div>
      </div>

      {showAddBatchModal && (
        <AddBatchModal
          onClose={() => setShowAddBatchModal(false)}
          onAddBatch={handleAddBatch}
        />
      )}
    </div>
  );
}