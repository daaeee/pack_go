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
    <div id="profile-page" className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">ИИ</div>
          <div className="profile-info">
            <div className="profile-name">Иван Иванов</div>
            <div className="profile-email">name@example.com</div>
          </div>
        </div>

        <button
          className="profile-help-button"
          id="howItWorksButton"
          type="button"
          onClick={onShowHelp}
        >
          Как работает приложение?
        </button>

        <div className="profile-section">
          <div className="profile-section-title">Текущий переезд</div>
          <div className="profile-move-address" id="currentMoveAddress">
            {address}
          </div>
          <div className="profile-move-date" id="currentMoveDate">
            Начат: {moveDate}
          </div>
        </div>

        <div className="profile-section">
          <div className="profile-section-title">Статистика переезда</div>
          <div className="profile-stats">
            <div className="profile-stat-card">
              <div className="profile-stat-number" id="profileItemsCount">
                {inventoryCount}
              </div>
              <div className="profile-stat-label">Всего вещей</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-number" id="profileBatchesCount">
                {batchesCount}
              </div>
              <div className="profile-stat-label">Партии</div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <div className="profile-section-title">История переездов</div>
          <div className="profile-history-empty" id="movesHistoryEmpty">
            У вас пока нет завершенных переездов
          </div>
        </div>

        <button
          className="logout-button"
          id="logoutButton"
          type="button"
          onClick={onLogout}
        >
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
