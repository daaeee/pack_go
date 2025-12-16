// app/components/BottomMenu.tsx

import React from 'react';

interface BottomMenuProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: 'inventory', label: 'Инвентарь', number: '1' },
  { id: 'boxes', label: 'Коробки', number: '2' },
  { id: 'scanner', label: 'Сканер', number: '3' },
  { id: 'delivery', label: 'Партии', number: '4' },
  { id: 'unpacking', label: 'Распаковка', number: '5' },
  { id: 'tasks', label: 'Задачи', number: '6' },
  { id: 'profile', label: 'Профиль', number: '7' },
];

const BottomMenu: React.FC<BottomMenuProps> = ({ currentPage, onPageChange }) => {
  return (
    <div className="bottom-menu">
      {menuItems.map(item => {
        const isActive = currentPage === item.id;

        return (
          <div
            key={item.id}
            className="menu-item"
            onClick={() => onPageChange(item.id)}
          >
            <div
              id={`${item.id}-icon`}
              className={`menu-icon ${isActive ? 'active' : 'inactive'}`}
            >
              {item.number}
            </div>
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
