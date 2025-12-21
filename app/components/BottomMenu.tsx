'use client';

import React from 'react';

interface BottomMenuProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const BottomMenu: React.FC<BottomMenuProps> = ({ activePage, onPageChange }) => {
  const menuItems = [
    { id: 'inventory', label: 'Инвентарь' },
    { id: 'boxes', label: 'Коробки' },
    { id: 'scanner', label: 'Сканер' },
    { id: 'delivery', label: 'Партии' },
    { id: 'unpacking', label: 'Распаковка' },
    { id: 'tasks', label: 'Задачи' },
    { id: 'profile', label: 'Профиль' },
  ];

  return (
    <div className="bottom-menu">
      {menuItems.map((item) => {
        const isActive = activePage === item.id;
        return (
          <div
            key={item.id}
            className="menu-item"
            onClick={() => onPageChange(item.id)}
          >
            <div
              id={`${item.id}-icon`}
              className={`menu-icon ${isActive ? 'active' : 'inactive'}`}
            ></div>
            <div
              id={`${item.id}-text`}
              className={`menu-text ${isActive ? 'active' : 'inactive'}`}
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BottomMenu;