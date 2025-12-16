// app/components/ScannerPage.tsx

import React from 'react';

interface ScannerPageProps {
  // Можно добавить пропсы для интеграции со сканером, если понадобится
}

const ScannerPage: React.FC<ScannerPageProps> = () => {
  const handleStartScan = () => {
    alert('Сканирование начато! Наведите камеру на QR-код коробки.');
  };

  return (
    <div id="scanner-page" className="scanner-page">
      <div className="scanner-container">
        <div className="scanner-header">
          <h1 className="scanner-title">Сканер QR-кодов</h1>
          <p className="scanner-subtitle">
            Отсканируйте коробку для просмотра содержимого
          </p>
        </div>

        <div className="scanner-card">
          <div className="scanner-description">
            Наведите камеру на QR-код коробки для быстрого доступа к информации
            о содержимом коробки.
          </div>
          <div className="scanner-preview">
            <div className="scanner-frame">
              <div className="scanner-line" />
            </div>
            <div className="scanner-hint">Наведите камеру на QR-код</div>
          </div>
          <button
            className="scanner-button"
            id="startScanButton"
            type="button"
            onClick={handleStartScan}
          >
            Начать сканирование
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
