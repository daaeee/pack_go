'use client';

import React from 'react';

interface FinishMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const FinishMoveModal: React.FC<FinishMoveModalProps> = ({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" id="finishMoveModalOverlay">
      <div className="modal-content finish-move-modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Завершить переезд?</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="finish-move-content">
          <p className="finish-move-description">
            Все партии доставлены. Завершить переезд? Он переместится в историю, и вы сможете начать новый переезд.
          </p>
          
          <div className="finish-move-buttons">
            <button className="finish-move-button cancel-button" onClick={onCancel}>
              Отмена
            </button>
            <button className="finish-move-button confirm-button" onClick={onConfirm}>
              Завершить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishMoveModal;