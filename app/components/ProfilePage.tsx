'use client';

import React from 'react';
import { MoveHistory } from '../types';

interface ProfilePageProps {
  totalItems: number;
  totalBatches: number;
  currentAddress: string;
  moveStartDate: string;
  moveHistory: MoveHistory[];
  onShowHelp: () => void;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  totalItems,
  totalBatches,
  currentAddress,
  moveStartDate,
  moveHistory,
  onShowHelp,
  onLogout,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const hasHistory = moveHistory.length > 0;
  const lastMove = hasHistory ? moveHistory[moveHistory.length - 1] : null;

  return (
    <div id="profile-page" className="page">
      <div className="profile-page">
        <div className="profile-top-section">
          <div className="profile-header">
            <div className="profile-avatar">ИИ</div>
            <div className="profile-info">
              <h1 id="profile-name">Фамилия Имя</h1>
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
                {currentAddress}
              </div>
              <div className="calendar-icon">📅</div>
              <div className="move-start-date" id="move-start-date">
                Начат: {moveStartDate}
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
                  {totalItems}
                </div>
                <div className="stat-label">Всего вещей</div>
              </div>
              
              <div className="stat-item total-batches">
                <div className="stat-icon">🚚</div>
                <div className="stat-number" id="profile-total-batches">
                  {totalBatches}
                </div>
                <div className="stat-label">Партии</div>
              </div>
            </div>
          </div>

          <div className="history-section">
            <h2 className="section-title">История переездов</h2>
            
            {lastMove ? (
              <div className="history-card" id="history-item">
                <div className="history-icon">📍</div>
                <div className="history-content">
                  <div className="history-address" id="history-address">
                    {lastMove.address}
                  </div>
                  <div className="history-date" id="history-date">
                    Завершен: {formatDate(lastMove.endDate)}
                  </div>
                  <div className="history-stats" id="history-stats">
                    {lastMove.totalItems} вещей, {lastMove.totalBatches} партий, {lastMove.totalBoxes} коробок
                  </div>
                </div>
              </div>
            ) : (
              <div className="history-empty" id="history-empty">
                У вас пока нет завершенных переездов
              </div>
            )}
          </div>
        </div>

        <div className="logout-section">
          <div className="logout-button" id="logoutButton" onClick={onLogout}>
            <div className="logout-icon">🚪</div>
            <div className="logout-text">Выйти из аккаунта</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;