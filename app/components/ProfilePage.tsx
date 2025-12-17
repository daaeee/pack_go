// app/components/ProfilePage.tsx

import React from 'react';

interface ProfilePageProps {
  inventoryCount: number;
  batchesCount: number;
  address: string;
  moveDate: string;
  onShowHelp: () => void;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  inventoryCount,
  batchesCount,
  address,
  moveDate,
  onShowHelp,
  onLogout,
}) => {
  return (
    <div className="profile-page">
      <div className="profile-top-section">
        <div className="profile-header">
          <div className="profile-avatar">ИИ</div>
          <div className="profile-info">
            <h1 id="profile-name">Иван Иванов</h1>
            <p id="profile-email">name@example.com</p>
          </div>
          <div className="app-help">
            <span className="help-text" id="showHelpButton" onClick={onShowHelp}>
              Как работает приложение?
            </span>
          </div>
        </div>

        <div className="current-move-card">
          <div className="location-icon">📍</div>
          <div className="current-move-content">
            <div className="current-move-label">Текущий переезд</div>
            <div className="current-move-address" id="current-address">
              {address}
            </div>
            <div className="calendar-icon">📅</div>
            <div className="move-start-date" id="move-start-date">
              Начат: {moveDate}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-middle-section">
        <div className="stats-section">
          <h2 className="section-title">Статистика переезда</h2>
          
          <div className="stats-cards">
            <div className="stat-item total-items">
              <div className="stat-icon">📦</div>
              <div className="stat-number" id="profile-total-items">
                {inventoryCount}
              </div>
              <div className="stat-label">Всего вещей</div>
            </div>
            
            <div className="stat-item total-batches">
              <div className="stat-icon">🚚</div>
              <div className="stat-number" id="profile-total-batches">
                {batchesCount}
              </div>
              <div className="stat-label">Партии</div>
            </div>
          </div>
        </div>

        <div className="history-section">
          <h2 className="section-title">История переездов</h2>
          
          <div className="history-card" id="history-item" style={{ display: 'none' }}>
            <div className="history-icon">📍</div>
            <div className="history-content">
              <div className="history-address" id="history-address"></div>
              <div className="history-date" id="history-date"></div>
              <div className="history-stats" id="history-stats"></div>
            </div>
          </div>
          
          <div className="history-empty" id="history-empty">
            У вас пока нет завершенных переездов
          </div>
        </div>
      </div>

      <div className="logout-section">
        <div className="logout-button" id="logoutButton" onClick={onLogout}>
          <div className="logout-icon">🚪</div>
          <div className="logout-text">Выйти из аккаунта</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;