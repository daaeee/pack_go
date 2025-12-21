'use client';

import React from 'react';
import { Box } from '../types';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  box: Box | null;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, box }) => {
  if (!isOpen || !box) return null;

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

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    alert('Функция сохранения как изображение будет реализована');
  };

  const handleShare = () => {
    alert('Функция поделиться будет реализована');
  };

  return (
    <div className="modal-overlay" id="qrCodeModalOverlay">
      <div className="modal-content qr-code-modal-content">
        <div className="qr-code-container">
          <div className="qr-code-title">QR-код коробки</div>
          
          <div className="qr-code-box">
            <div className="qr-code-placeholder" id="qrCodePlaceholder">
              {/* QR-код будет здесь */}
            </div>
          </div>
          
          <div className="qr-code-number" id="qrCodeNumber">BOX{box.id.toString().padStart(3, '0')}</div>
          
          <div className="qr-code-info-box">
            <div className="qr-code-room-label" id="qrCodeRoomLabel">
              {getRoomName(box.room)}
            </div>
            <div className="qr-code-box-title" id="qrCodeBoxTitle">
              Коробка №{box.id} - {getRoomName(box.room)}
            </div>
            <div className="qr-code-content" id="qrCodeContent">
              Содержимое: {box.description || 'Описание не указано'}
            </div>
          </div>
          
          <div className="qr-code-actions">
            <button className="qr-action-button print-button" onClick={handlePrint}>
              Распечатать
            </button>
            <button className="qr-action-button save-button" onClick={handleSave}>
              Сохранить как изображение
            </button>
            <button className="qr-action-button share-button" onClick={handleShare}>
              Поделиться
            </button>
            <button className="qr-action-button done-button" onClick={onClose}>
              Готово
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;