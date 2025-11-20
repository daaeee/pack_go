'use client';

export default function UnpackingPage() {
  const handleScanClick = () => {
    alert('Функция сканирования QR-кода будет реализована в будущем');
  };

  return (
    <div id="unpacking-page" className="page unpacking-page">
      <div className="unpacking-header">
        <h1 className="unpacking-title">Распаковка</h1>
        <div className="unpacking-subtitle">2 из 4 коробок распаковано</div>
        <div className="unpacking-progress-text">50% выполнено</div>
        
        <div className="unpacking-progress-container"></div>
        <div className="unpacking-progress-bar"></div>
        
        <div className="scan-section" onClick={handleScanClick}>
          <span className="scan-text">Сканировать QR-код</span>
        </div>
        
        <div className="unpacking-search-container">
          <div className="search-icon"></div>
          <span className="unpacking-search-placeholder">Поиск по вещам или комнатам...</span>
        </div>
      </div>
      
      <div className="boxes-container">
        {/* Коробка 1 - Посуда */}
        <div className="box-card">
          <div className="box-icon green"></div>
          <div className="check-icon">✓</div>
          <h2 className="box-title">Коробка №1 - Посуда</h2>
          <div className="box-room">Кухня</div>
          
          <div className="item-dot" style={{ top: '140px' }}></div>
          <div className="box-items" style={{ top: '132px' }}>Набор тарелок</div>
          
          <div className="item-dot" style={{ top: '181px' }}></div>
          <div className="box-items" style={{ top: '173px' }}>Чашки (6 шт)</div>
          
          <div className="item-dot" style={{ top: '222px' }}></div>
          <div className="box-items" style={{ top: '214px' }}>Столовые приборы</div>
          
          <div className="item-dot" style={{ top: '263px' }}></div>
          <div className="box-items" style={{ top: '255px' }}>Кастрюли (3 шт)</div>
          
          <div className="batch-tag">
            <span className="batch-text">Партия №1</span>
          </div>
          
          <div className="unpacked-tag">
            <span className="unpacked-text">Распаковано</span>
          </div>
          
          <div className="box-id">
            <span className="box-id-text">BOX-001</span>
          </div>
        </div>
        
        {/* Коробка 2 - Электроника */}
        <div className="box-card">
          <div className="box-icon green"></div>
          <div className="check-icon">✓</div>
          <h2 className="box-title">Коробка №2 - Электроника</h2>
          <div className="box-room">Гостиная</div>
          
          <div className="item-dot" style={{ top: '140px' }}></div>
          <div className="box-items" style={{ top: '132px' }}>Телевизор</div>
          
          <div className="item-dot" style={{ top: '181px' }}></div>
          <div className="box-items" style={{ top: '173px' }}>Пульты</div>
          
          <div className="item-dot" style={{ top: '222px' }}></div>
          <div className="box-items" style={{ top: '214px' }}>Роутер</div>
          
          <div className="item-dot" style={{ top: '263px' }}></div>
          <div className="box-items" style={{ top: '255px' }}>Колонка</div>
          
          <div className="batch-tag">
            <span className="batch-text">Партия №1</span>
          </div>
          
          <div className="unpacked-tag">
            <span className="unpacked-text">Распаковано</span>
          </div>
          
          <div className="box-id">
            <span className="box-id-text">BOX-002</span>
          </div>
        </div>
        
        {/* Коробка 3 - Постельное белье */}
        <div className="box-card">
          <div className="box-icon orange"></div>
          <div className="box-icon-inner">📦</div>
          <h2 className="box-title">Коробка №3 - Постельное белье</h2>
          <div className="box-room">Спальня</div>
          
          <div className="item-dot" style={{ top: '140px' }}></div>
          <div className="box-items" style={{ top: '132px' }}>Простыни (3 комплекта)</div>
          
          <div className="item-dot" style={{ top: '181px' }}></div>
          <div className="box-items" style={{ top: '173px' }}>Подушки</div>
          
          <div className="item-dot" style={{ top: '222px' }}></div>
          <div className="box-items" style={{ top: '214px' }}>Одеяла</div>
          
          <div className="item-dot" style={{ top: '263px' }}></div>
          <div className="box-items" style={{ top: '255px' }}>Плед</div>
          
          <div className="batch-tag">
            <span className="batch-text">Партия №1</span>
          </div>
          
          <div className="box-id">
            <span className="box-id-text">BOX-003</span>
          </div>
        </div>
        
        {/* Коробка 4 - Книги */}
        <div className="box-card">
          <div className="box-icon orange"></div>
          <div className="box-icon-inner">📦</div>
          <h2 className="box-title">Коробка №4 - Книги</h2>
          <div className="box-room">Кабинет</div>
          
          <div className="item-dot" style={{ top: '140px' }}></div>
          <div className="box-items" style={{ top: '132px' }}>Учебники</div>
          
          <div className="item-dot" style={{ top: '181px' }}></div>
          <div className="box-items" style={{ top: '173px' }}>Журналы</div>
          
          <div className="item-dot" style={{ top: '222px' }}></div>
          <div className="box-items" style={{ top: '214px' }}>Фотоальбомы</div>
          
          <div className="item-dot" style={{ top: '263px' }}></div>
          <div className="box-items" style={{ top: '255px' }}>Художественная литература</div>
          
          <div className="batch-tag">
            <span className="batch-text">Партия №1</span>
          </div>
          
          <div className="box-id">
            <span className="box-id-text">BOX-004</span>
          </div>
        </div>
      </div>
    </div>
  );
}