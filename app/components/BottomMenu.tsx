'use client';

import { PageType } from "C:/Users/Пользователь/pack_go/app/types";

interface BottomMenuProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export default function BottomMenu({ currentPage, onPageChange }: BottomMenuProps) {
  const getMenuIconClass = (page: PageType) => {
    return currentPage === page ? 'menu-icon active' : 'menu-icon inactive';
  };

  const getMenuTextClass = (page: PageType) => {
    return currentPage === page ? 'menu-text active' : 'menu-text inactive';
  };

  return (
    <div className="bottom-menu">
      <div 
        className="menu-item" 
        onClick={() => onPageChange('inventory')}
      >
        <div className={getMenuIconClass('inventory')}>1</div>
        <div className={getMenuTextClass('inventory')}>Инвентарь</div>
      </div>
      
      <div 
        className="menu-item" 
        onClick={() => onPageChange('delivery')}
      >
        <div className={getMenuIconClass('delivery')}>2</div>
        <div className={getMenuTextClass('delivery')}>Партии</div>
      </div>
      
      <div 
        className="menu-item" 
        onClick={() => onPageChange('unpacking')}
      >
        <div className={getMenuIconClass('unpacking')}>3</div>
        <div className={getMenuTextClass('unpacking')}>Распаковка</div>
      </div>
      
      <div className="menu-item">
        <div className="menu-icon inactive">4</div>
        <div className="menu-text inactive">Задачи</div>
      </div>
      
      <div className="menu-item">
        <div className="menu-icon inactive">5</div>
        <div className="menu-text inactive">Профиль</div>
      </div>
    </div>
  );
}