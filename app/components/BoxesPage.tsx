'use client';

import React, { useState } from 'react';
import { Box } from '../types';

interface BoxesPageProps {
  boxes: Box[];
  onAddBox: () => void;
  onShowQRCode: (box: Box) => void;
}

const BoxesPage: React.FC<BoxesPageProps> = ({
  boxes,
  onAddBox,
  onShowQRCode,
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

  const getBoxStatusName = (statusValue: string) => {
    const statusNames: Record<string, string> = {
      'empty': 'Пустая',
      'assembling': 'Комплектуется',
      'ready': 'Готова'
    };
    return statusNames[statusValue] || statusValue;
  };

  const getBoxStatusClass = (statusValue: string) => {
    const statusClasses: Record<string, string> = {
      'empty': 'empty',
      'assembling': 'assembling',
      'ready': 'ready'
    };
    return statusClasses[statusValue] || 'empty';
  };

  const getBoxIconClass = (roomValue: string) => {
    const iconClasses: Record<string, string> = {
      'kitchen': 'orange',
      'bedroom': 'orange',
      'bathroom': 'blue',
      'living-room': 'green',
      'office': 'green'
    };
    return iconClasses[roomValue] || 'green';
  };

  const filteredBoxes = boxes.filter(box => {
    if (!searchQuery) return true;
    
    const boxName = box.name.toLowerCase();
    const roomName = getRoomName(box.room).toLowerCase();
    return boxName.includes(searchQuery.toLowerCase()) || roomName.includes(searchQuery.toLowerCase());
  });

  const totalBoxes = boxes.length;
  const readyBoxes = boxes.filter(box => box.status === 'ready').length;
  const inWorkBoxes = boxes.filter(box => box.status === 'assembling').length;

  const getPluralForm = (number: number, word: string) => {
    if (number % 10 === 1 && number % 100 !== 11) {
      return `${number} ${word}ка`;
    } else if ([2, 3, 4].includes(number % 10) && ![12, 13, 14].includes(number % 100)) {
      return `${number} ${word}ки`;
    } else {
      return `${number} ${word}ок`;
    }
  };

  return (
    <div id="boxes-page" className="page">
      <div className="boxes-container">
        <div className="boxes-top-section">
          <div className="boxes-header">
            <h1 className="boxes-title">Мои коробки</h1>
            <p className="boxes-subtitle" id="boxesCount">
              {getPluralForm(totalBoxes, 'коробк')} создано
            </p>
          </div>
          
          <div className="boxes-stats">
            <div className="box-stat-card total">
              <h3>Всего</h3>
              <div className="number" id="totalBoxes">{totalBoxes}</div>
            </div>
            <div className="box-stat-card ready">
              <h3>Готовы</h3>
              <div className="number" id="readyBoxes">{readyBoxes}</div>
            </div>
            <div className="box-stat-card in-work">
              <h3>В работе</h3>
              <div className="number" id="inWorkBoxes">{inWorkBoxes}</div>
            </div>
          </div>
          
          <div className="add-box-button" id="addBoxButton" onClick={onAddBox}>
            <span>Добавить</span>
          </div>
          
          <div className="boxes-search-container">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              className="boxes-search-input"
              id="boxesSearchInput"
              placeholder="Поиск по коробкам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="boxes-bottom-section">
          <div className="boxes-list" id="boxesList">
            {filteredBoxes.length === 0 ? (
              <div className="empty-state" id="boxesEmptyState">
                Коробок нет. Добавьте первую коробку!
              </div>
            ) : (
              filteredBoxes.map(box => {
                const iconClass = getBoxIconClass(box.room);
                let itemsCountText = `${box.itemsCount} предметов`;
                if (box.status === 'empty') {
                  itemsCountText = 'Пустая коробка';
                }
                
                const itemsCountClass = box.status === 'empty' ? 'empty' : '';
                
                return (
                  <div key={box.id} className="box-card" data-box-id={box.id}>
                    <div className={`box-icon ${iconClass}`}>
                      <div className="box-icon-inner">{box.icon}</div>
                    </div>
                    <h2 className="box-title">
                      Коробка №{box.id} - {getRoomName(box.room)}
                    </h2>
                    <div className="box-room">{getRoomName(box.room)}</div>
                    {box.description && (
                      <div className="box-items-list">{box.description}</div>
                    )}
                    <div className={`box-items-count ${itemsCountClass}`}>
                      {itemsCountText}
                    </div>
                    <div
                      className="show-qr-button"
                      data-box-id={box.id}
                      onClick={() => onShowQRCode(box)}
                    >
                      <div className="qr-icon">📱</div>
                      <span className="show-qr-text">Показать QR-код</span>
                    </div>
                    <div className={`box-status-tag ${getBoxStatusClass(box.status)}`}>
                      <span className="status-text">{getBoxStatusName(box.status)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxesPage;