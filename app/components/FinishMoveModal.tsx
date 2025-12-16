// app/components/FinishMoveModal.tsx

import React from 'react';

interface FinishMoveModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const FinishMoveModal: React.FC<FinishMoveModalProps> = ({ onClose, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      id="finishMoveModalOverlay"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content finish-move-modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Завершить переезд?</h2>
          <button
            className="close-button"
            id="closeFinishMoveModal"
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="finish-move-content">
          <p className="finish-move-description">
            Все партии доставлены. Завершить переезд? Он переместится в историю, и вы
            сможете начать новый переезд.
          </p>

          <div className="finish-move-buttons">
            <button
              className="finish-move-button cancel-button"
              id="cancelFinishMove"
              type="button"
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              className="finish-move-button confirm-button"
              id="confirmFinishMove"
              type="button"
              onClick={handleConfirm}
            >
              Завершить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishMoveModal;
