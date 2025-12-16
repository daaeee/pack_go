// app/components/UnpackingPage.tsx
import React from 'react';
import { Box } from '../types';

interface UnpackingPageProps {
  boxes: Box[];
  stats: {
    unpacked: number;
    total: number;
    progress: number;
  };
  onScanClick: () => void;
  onMarkAsUnpacked: (boxId: number) => void;
  getRoomName: (room: string) => string;
  getBoxIconClass: (room: string) => string;
}

const UnpackingPage: React.FC<UnpackingPageProps> = ({
  boxes,
  stats,
  onScanClick,
  onMarkAsUnpacked,
  getRoomName,
  getBoxIconClass,
}) => {
  return (
    <div id="unpacking-page" className="page unpacking-page">
      <div className="unpacking-header">
        <h1 className="unpacking-title">Распаковка</h1>
        <div className="unpacking-subtitle">{stats.unpacked} из {stats.total} коробок распаковано</div>
        <div className="unpacking-progress-text">{Math.round(stats.progress)}% выполнено</div>
        
        <div className="unpacking-progress-container"></div>
        <div 
          className="unpacking-progress-bar"
          style={{ width: `${stats.progress}%` }}
        ></div>
        
        <div className="scan-section" onClick={onScanClick}>
          <span className="scan-text">Сканировать QR-код</span>
        </div>
        
        <div className="unpacking-search-container">
          <div className="search-icon-svg"></div>
          <input 
            type="text" 
            className="unpacking-search-input" 
            placeholder="Поиск по вещам или комнатам..."
          />
        </div>
      </div>
      
      <div className="boxes-container" id="unpackingBoxesContainer">
        {boxes.length === 0 ? (
          <div className="empty-state" id="unpackingEmptyState">
            Нет коробок для распаковки
          </div>
        ) : (
          boxes.map((box) => (
            <div 
              key={box.id} 
              className="box-card"
              onClick={() => !box.unpacked && onMarkAsUnpacked(box.id)}
              style={{ cursor: box.unpacked ? 'default' : 'pointer' }}
            >
              <div className={`box-icon ${getBoxIconClass(box.room)}`}></div>
              {box.unpacked ? (
                <div className="check-icon">✓</div>
              ) : (
                <div className="box-icon-inner">{box.icon}</div>
              )}
              <h2 className="box-title">Коробка №{box.id} - {getRoomName(box.room)}</h2>
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
          ))
        )}
      </div>
    </div>
  );
};

export default UnpackingPage;