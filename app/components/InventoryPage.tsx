// app/components/InventoryPage.tsx
"use client";

import React from "react";
import { InventoryItem } from "../types";

interface InventoryPageProps {
  items: InventoryItem[];
  stats: {
    total: number;
    packed: number;
    fragile: number;
  };
  onAddItem: () => void;
  onTogglePacked: (id: number) => void;
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  getRoomName: (room: string) => string;
  getCategoryName: (category: string) => string;
}

const InventoryPage: React.FC<InventoryPageProps> = ({
  items,
  stats,
  onAddItem,
  onTogglePacked,
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  getRoomName,
  getCategoryName,
}) => {
  const handleFilterClick = (value: string) => {
    onFilterChange(value);
  };

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onSearchChange(e.target.value);
  };

  const hasItems = items.length > 0;

  return (
    <div className="page active" id="inventory-page">
      <div className="container">
        <div className="top-section">
          <div className="header">
            <h1>Инвентарь</h1>
            <p>0 предметов</p>
          </div>

          <div className="stats">
            <div className="stat-card total">
              <h3>Всего предметов</h3>
              <div className="number">{stats.total}</div>
            </div>
            <div className="stat-card packed">
              <h3>Упаковано</h3>
              <div className="number">{stats.packed}</div>
            </div>
            <div className="stat-card fragile">
              <h3>Хрупкое</h3>
              <div className="number">{stats.fragile}</div>
            </div>
          </div>

          <div className="add-button" onClick={onAddItem}>
            <span>Добавить</span>
          </div>

          <div className="search-container">
            <div className="search-icon" />
            <input
              className="search-input"
              type="text"
              placeholder="Поиск по вещам или комнатам..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className="filters">
            <div
              className={
                "filter" + (currentFilter === "all" ? " active" : "")
              }
              onClick={() => handleFilterClick("all")}
            >
              <span>Все</span>
            </div>
            <div
              className={
                "filter" +
                (currentFilter === "furniture" ? " active" : "")
              }
              onClick={() => handleFilterClick("furniture")}
            >
              <span>Мебель</span>
            </div>
            <div
              className={
                "filter" +
                (currentFilter === "electronics" ? " active" : "")
              }
              onClick={() => handleFilterClick("electronics")}
            >
              <span>Одежда</span>
            </div>
            <div
              className={
                "filter" +
                (currentFilter === "clothing" ? " active" : "")
              }
              onClick={() => handleFilterClick("clothing")}
            >
              <span>Электроника</span>
            </div>
            <div
              className={
                "filter" +
                (currentFilter === "books" ? " active" : "")
              }
              onClick={() => handleFilterClick("books")}
            >
              <span>Книги</span>
            </div>
            <div
              className={
                "filter" +
                (currentFilter === "kitchen" ? " active" : "")
              }
              onClick={() => handleFilterClick("kitchen")}
            >
              <span>Кухня</span>
            </div>
          </div>
        </div>

        <div className="bottom-section">
          <div className="items-container">
            {!hasItems && (
              <div className="empty-state active">
                Инвентарь пуст. Добавьте первый предмет!
              </div>
            )}

            {hasItems &&
              items.map((item) => (
                <div key={item.id} className="item-card">
                  <div
                    className={
                      "item-icon " + (item.packed ? "green" : "gray")
                    }
                  />

                  <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    <div className="item-room">
                      {getRoomName(item.room)} ·{" "}
                      {getCategoryName(item.category)}
                    </div>

                    <div className="item-tags">
                      <div
                        className={
                          "tag " +
                          (item.packed
                            ? "green packed-tag"
                            : "white packed-tag")
                        }
                        onClick={() => onTogglePacked(item.id)}
                      >
                        {item.packed
                          ? "Упаковано"
                          : "Отметить как упакованное"}
                      </div>

                      <div className="tag gray">QR‑код</div>

                      {item.fragile && (
                        <div className="tag red">Хрупкое</div>
                      )}
                    </div>
                  </div>

                  {item.fragile && (
                    <div className="fragile-indicator">
                      Осторожно, хрупкое
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
