// app/components/BoxesPage.tsx
"use client";

import React from "react";
import { Box } from "../types";

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
  const hasBoxes = boxes.length > 0;

  return (
    <div className="page active" id="boxes-page">
      <div className="container">
        <div className="top-section">
          <div className="header">
            <h1>Мои коробки</h1>
            <p>{stats.total} коробок создано</p>
          </div>

          <div className="stats">
            <div className="stat-card total">
              <h3>Всего</h3>
              <div className="number">{stats.total}</div>
            </div>
            <div className="stat-card packed">
              <h3>Готовы</h3>
              <div className="number">{stats.ready}</div>
            </div>
            <div className="stat-card fragile">
              <h3>В работе</h3>
              <div className="number">{stats.inWork}</div>
            </div>
          </div>

                <div
        className="add-button"
        onClick={() => {
          console.log("CLICK ADD BOX FROM BoxesPage");
          onAddBox();
        }}
      >
        <span>Добавить</span>
      </div>


          <div className="search-container">
            <div className="search-icon" />
            <input
              className="search-input"
              type="text"
              placeholder="Поиск по коробкам или комнатам..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="bottom-section">
          <div className="items-container">
            {!hasBoxes && (
              <div className="empty-state active">
                Коробок нет. Добавьте первую коробку!
              </div>
            )}

            {hasBoxes &&
              boxes.map((box) => {
                const iconClass = getBoxIconClass(box.room);
                const statusClass = getBoxStatusClass(box.status);
                const statusName = getBoxStatusName(box.status);
                const itemsCountText =
                  box.status === "empty"
                    ? "Пустая коробка"
                    : `${box.itemsCount} предметов`;
                const itemsCountClass =
                  box.status === "empty"
                    ? "box-items-count empty"
                    : "box-items-count";

                return (
                  <div key={box.id} className="box-card">
                    <div className={`box-icon ${iconClass}`}>
                      {box.icon}
                    </div>

                    <div className="box-details">
                      <div className="box-title">
                        Коробка №{box.id} - {getRoomName(box.room)}
                      </div>
                      <div className="box-room">
                        {getRoomName(box.room)}
                      </div>

                      {box.description && (
                        <div className="box-description">
                          {box.description}
                        </div>
                      )}

                      <div className={itemsCountClass}>
                        {itemsCountText}
                      </div>

                      <div className="box-tags">
                        <div
                          className="tag gray"
                          onClick={() => onShowQRCode(box.id)}
                        >
                          Показать QR-код
                        </div>
                        <div className={`tag ${statusClass}`}>
                          {statusName}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxesPage;
