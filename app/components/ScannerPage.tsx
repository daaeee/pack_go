'use client';

import React from 'react';

interface ScannerPageProps {
  onStartScanning: () => void;
}

const ScannerPage: React.FC<ScannerPageProps> = ({ onStartScanning }) => {
  return (
    <div id="scanner-page" className="page">
      <div className="scanner-container">
        <div className="scanner-header">
          <h1 className="scanner-title">Сканер QR-кодов</h1>
          <p className="scanner-subtitle">Отсканируйте коробку для просмотра содержимого</p>
        </div>
        
        <div className="scanner-info-box">
          <p className="scanner-info-text">
            Наведите камеру на QR-код коробки для быстрого доступа к информации о содержимом коробки.
          </p>
        </div>
        
        <div className="scanner-preview">
          <div className="scanner-frame">
            <div className="scanner-overlay">
              <div className="scanner-line"></div>
            </div>
          </div>
          <div className="scanner-instruction">Наведите камеру на QR-код</div>
        </div>
        
        <div className="start-scan-button" id="startScanButton" onClick={onStartScanning}>
          <div className="start-scan-text">Начать сканирование</div>
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;