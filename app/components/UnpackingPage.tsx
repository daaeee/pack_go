'use client';

import { useState } from 'react';

interface BoxItem {
  id: number;
  title: string;
  room: string;
  items: string[];
  batchNumber: string;
  boxId: string;
  isUnpacked: boolean;
}

export default function UnpackingPage() {
  const [boxes, setBoxes] = useState<BoxItem[]>([
    {
      id: 1,
      title: "Коробка №1 - Посуда",
      room: "Кухня",
      items: ["Набор тарелок", "Чашки (6 шт)", "Столовые приборы", "Кастрюли (3 шт)"],
      batchNumber: "Партия №1",
      boxId: "BOX-001",
      isUnpacked: true,
    },
    {
      id: 2,
      title: "Коробка №2 - Электроника",
      room: "Гостиная",
      items: ["Телевизор", "Пульты", "Роутер", "Колонка"],
      batchNumber: "Партия №1",
      boxId: "BOX-002",
      isUnpacked: true,
    },
    {
      id: 3,
      title: "Коробка №3 - Постельное белье",
      room: "Спальня",
      items: ["Простыни (3 комплекта)", "Подушки", "Одеяла", "Плед"],
      batchNumber: "Партия №1",
      boxId: "BOX-003",
      isUnpacked: false,
    },
    {
      id: 4,
      title: "Коробка №4 - Книги",
      room: "Кабинет",
      items: ["Учебники", "Журналы", "Фотоальбомы", "Художественная литература"],
      batchNumber: "Партия №1",
      boxId: "BOX-004",
      isUnpacked: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const unpackedCount = boxes.filter(box => box.isUnpacked).length;
  const totalCount = boxes.length;
  const progressPercentage = totalCount > 0 ? (unpackedCount / totalCount) * 100 : 0;

  const filteredBoxes = boxes.filter(box => {
    const matchesSearch = 
      box.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      box.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      box.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleScanClick = () => {
    alert('Функция сканирования QR-кода будет реализована в будущем');
  };

  const toggleUnpacked = (boxId: number) => {
    setBoxes(boxes.map(box => 
      box.id === boxId ? { ...box, isUnpacked: !box.isUnpacked } : box
    ));
  };

  return (
    <div id="unpacking-page" className="page unpacking-page active">
      {/* Заголовок с фоновым блоком */}
      <div className="unpacking-header">
        <h1 className="unpacking-title">Распаковка</h1>
        <div className="unpacking-subtitle">
          {unpackedCount} из {totalCount} коробок распаковано
        </div>
        <div className="unpacking-progress-text">{Math.round(progressPercentage)}% выполнено</div>
        
        {/* Прогресс-бар */}
        <div className="unpacking-progress-container">
          <div 
            className="unpacking-progress-bar" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        {/* Кнопка сканирования */}
        <div className="scan-section" onClick={handleScanClick}>
          <span className="scan-text">Сканировать QR-код</span>
        </div>
        
        {/* Поле поиска */}
        <div className="unpacking-search-container">
          <div className="search-icon"></div>
          <input
            type="text"
            className="unpacking-search-input"
            placeholder="Поиск по вещам или комнатам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              width: '100%',
              marginLeft: '15px',
              fontSize: '16px',
              color: '#9F9F9F',
              outline: 'none'
            }}
          />
        </div>
      </div>
      
      {/* Список коробок */}
      <div className="boxes-container">
        {filteredBoxes.map((box) => (
          <div key={box.id} className="box-card">
            <div className={`box-icon ${box.isUnpacked ? 'green' : 'orange'}`}>
              {box.isUnpacked ? (
                <div className="check-icon">✓</div>
              ) : (
                <div className="box-icon-inner">📦</div>
              )}
            </div>
            
            <h2 className="box-title">{box.title}</h2>
            <div className="box-room">{box.room}</div>
            
            {/* Список предметов в коробке */}
            {box.items.map((item, index) => (
              <div key={index}>
                <div 
                  className="item-dot" 
                  style={{ top: `${140 + (index * 41)}px` }}
                ></div>
                <div 
                  className="box-items" 
                  style={{ top: `${132 + (index * 41)}px` }}
                >
                  {item}
                </div>
              </div>
            ))}
            
            {/* Теги */}
            <div className="batch-tag">
              <span className="batch-text">{box.batchNumber}</span>
            </div>
            
            {box.isUnpacked && (
              <div className="unpacked-tag">
                <span className="unpacked-text">Распаковано</span>
              </div>
            )}
            
            <div className="box-id">
              <span className="box-id-text">{box.boxId}</span>
            </div>
            
            {/* Скрытая кнопка для переключения статуса (можно кликнуть на всю карточку) */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                opacity: 0
              }}
              onClick={() => toggleUnpacked(box.id)}
              title={box.isUnpacked ? 'Отметить как нераспакованную' : 'Отметить как распакованную'}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}