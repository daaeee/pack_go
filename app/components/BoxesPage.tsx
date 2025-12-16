// app/components/BoxesPage.tsx

import React from 'react';
import { Box } from '../types';

interface BoxesPageProps {
  boxes: Box[];
  stats: {
    total: number;
    ready: number;
    inWork: number;
  };
  onAddBox: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  getRoomName: (room: string) => string;
  getBoxStatusName: (status: string) => string;
  getBoxStatusClass: (status: string) => string;
  getBoxIconClass: (room: string) => string;
  onShowQRCode: (boxId: number) => void;
}

const BoxesPage: React.FC<BoxesPageProps> = ({
  boxes,
  stats,
  onAddBox,
  searchQuery,
  onSearchChange,
  getRoomName,
  getBoxStatusName,
  getBoxStatusClass,
  getBoxIconClass,
  onShowQRCode,
}) => {
  return (
    <div id="boxes-page" className="boxes-page">
      <div className="boxes-container">
        <div className="boxes-header">
          <h1 className="boxes-title">Мои коробки</h1>
          <p className="boxes-subtitle" id="boxesCount">
            {stats.total} коробок создано
          </p>
        </div>

        <div className="boxes-stats">
          <div className="box-stat-card total">
            <h3>Всего</h3>
            <div className="number" id="totalBoxes">
              {stats.total}
            </div>
          </div>
          <div className="box-stat-card ready">
            <h3>Готовы</h3>
            <div className="number" id="readyBoxes">
              {stats.ready}
            </div>
          </div>
          <div className="box-stat-card in-work">
            <h3>В работе</h3>
            <div className="number" id="inWorkBoxes">
              {stats.inWork}
            </div>
          </div>

          <div className="add-box-button" id="addBoxButton" onClick={onAddBox}>
            <span>Добавить</span>
          </div>
        </div>

        <div className="boxes-search-container">
          <div className="search-icon" />
          <input
            type="text"
            className="boxes-search-input"
            id="boxesSearchInput"
            placeholder="Поиск по названию или комнате"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>

        <div className="boxes-list" id="boxesList">
          {boxes.length === 0 ? (
            <div className="empty-state" id="boxesEmptyState">
              Коробок нет. Добавьте первую коробку!
            </div>
          ) : (
            boxes.map(box => {
              const iconClass = getBoxIconClass(box.room);
              const statusClass = getBoxStatusClass(box.status);
              const statusName = getBoxStatusName(box.status);

              const itemsCountText =
                box.status === 'empty'
                  ? 'Пустая коробка'
                  : `${box.itemsCount} предметов`;

              const itemsCountClass =
                box.status === 'empty' ? 'box-items-count empty' : 'box-items-count';

              return (
                <div className="box-card" key={box.id} data-box-id={box.id}>
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

                  <div className={itemsCountClass}>{itemsCountText}</div>

                  <div
                    className="show-qr-button"
                    data-box-id={box.id}
                    onClick={() => onShowQRCode(box.id)}
                  >
                    <div className="qr-icon" />
                    <span className="show-qr-text">Показать QR-код</span>
                  </div>

                  <div className={`box-status-tag ${statusClass}`}>
                    <span className="status-text">{statusName}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default BoxesPage;
