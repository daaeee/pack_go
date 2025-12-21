'use client';

import React, { useState } from 'react';
import { Box } from '../types';

interface UnpackingPageProps {
  boxes: Box[];
  onScanQRCode: () => void;
  onMarkUnpacked: (boxId: number) => void;
}

const UnpackingPage: React.FC<UnpackingPageProps> = ({
  boxes,
  onScanQRCode,
  onMarkUnpacked,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

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

  const unpackedBoxes = boxes.filter(box => box.unpacked).length;
  const totalBoxes = boxes.length;
  const progressPercentage = totalBoxes > 0 ? (unpackedBoxes / totalBoxes) * 100 : 0;

  const filteredBoxes = boxes.filter(box => {
    if (!searchQuery) return true;
    
    const roomName = getRoomName(box.room).toLowerCase();
    const boxName = box.name.toLowerCase();
    return roomName.includes(searchQuery.toLowerCase()) || boxName.includes(searchQuery.toLowerCase());
  });

  return (
    <div id="unpacking-page" className="page unpacking-page">
      <div className="unpacking-header">
        <h1 className="unpacking-title">Распаковка</h1>
        <div className="unpacking-subtitle">
          {unpackedBoxes} из {totalBoxes} коробок распаковано
        </div>
        <div className="unpacking-progress-text">{Math.round(progressPercentage)}% выполнено</div>
        
        <div className="unpacking-progress-container"></div>
        <div
          className="unpacking-progress-bar"
          style={{ width: `${progressPercentage}%` }}
        ></div>
        
        <div className="scan-section" onClick={onScanQRCode}>
          <span className="scan-text">Сканировать QR-код</span>
        </div>
        
        <div className="unpacking-search-container">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            className="unpacking-search-input"
            placeholder="Поиск по вещам или комнатам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="boxes-container" id="unpackingBoxesContainer">
        {filteredBoxes.length === 0 ? (
          <div className="empty-state" id="unpackingEmptyState">
            Нет коробок для распаковки
          </div>
        ) : (
          filteredBoxes.map(box => {
            const iconClass = box.unpacked ? 'green' : 'orange';
            const iconInner = box.unpacked ? '✓' : box.icon;
            
            return (
              <div
                key={box.id}
                className="box-card"
                data-box-id={box.id}
                onClick={!box.unpacked ? () => onMarkUnpacked(box.id) : undefined}
                style={{ cursor: box.unpacked ? 'default' : 'pointer' }}
              >
                <div className={`box-icon ${iconClass}`}>
                  {box.unpacked ? (
                    <div className="check-icon">✓</div>
                  ) : (
                    <div className="box-icon-inner">{iconInner}</div>
                  )}
                </div>
                <h2 className="box-title">
                  Коробка №{box.id} - {getRoomName(box.room)}
                </h2>
                <div className="box-room">{getRoomName(box.room)}</div>
                
                {box.items.map((item, index) => (
                  <React.Fragment key={index}>
                    <div
                      className="item-dot"
                      style={{ top: `${140 + index * 41}px` }}
                    ></div>
                    <div
                      className="box-items"
                      style={{ top: `${132 + index * 41}px` }}
                    >
                      {item}
                    </div>
                  </React.Fragment>
                ))}
                
                <div className="batch-tag">
                  <span className="batch-text">Партия №{box.batchId}</span>
                </div>
                
                {box.unpacked && (
                  <div className="unpacked-tag">
                    <span className="unpacked-text">Распаковано</span>
                  </div>
                )}
                
                <div className="box-id">
                  <span className="box-id-text">BOX-{box.id.toString().padStart(3, '0')}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UnpackingPage;