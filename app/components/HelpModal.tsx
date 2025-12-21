'use client';

import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" id="helpModalOverlay">
      <div className="modal-content help-modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Руководство Pack&Go</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="help-content">
          <div className="help-main-content">
            <div className="help-section">
              <div className="help-section-number">1</div>
              <div className="help-section-content">
                <h3>Инвентаризация</h3>
                <p>Создайте цифровой список всех вещей, которые планируете перевезти.</p>
                <div className="help-instruction-box">
                  <h4>Что делать:</h4>
                  <ul>
                    <li>Сфотографируйте каждую вещь или коробку</li>
                    <li>Добавьте название и описание</li>
                    <li>Укажите комнату назначения</li>
                    <li>Отметьте хрупкость и ценность</li>
                    <li>Система автоматически сгенерирует QR-код</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="help-section">
              <div className="help-section-number">2</div>
              <div className="help-section-content">
                <h3>QR-коды</h3>
                <p>Для каждой вещи или коробки автоматически генерируется уникальный QR-код.</p>
                <div className="help-instruction-box">
                  <h4>Что происходит с QR-кодами:</h4>
                  <ul>
                    <li>QR-код связан с цифровой карточкой предмета</li>
                    <li>Распечатайте коды через приложение</li>
                    <li>Наклейте их на коробки или прикрепите к вещам</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="help-section">
              <div className="help-section-number">3</div>
              <div className="help-section-content">
                <h3>Партии доставки</h3>
                <p>Распределите вещи по партиям в зависимости от срочности и логистики.</p>
                <div className="help-instruction-box">
                  <h4>Что делать:</h4>
                  <ul>
                    <li>Создайте партии: &quot;Кухня&quot;, &quot;Мебель&quot; и т.д.</li>
                    <li>Добавьте вещи из инвентаря в каждую партию</li>
                    <li>Укажите дату доставки</li>
                    <li>Установите приоритет (срочно/средний/можно подождать)</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="help-section">
              <div className="help-section-number">4</div>
              <div className="help-section-content">
                <h3>Упаковка</h3>
                <p>Упаковывайте вещи и отмечайте процесс в приложении.</p>
                <div className="help-instruction-box">
                  <h4>Что происходит с вещами:</h4>
                  <ul>
                    <li>Упаковываете вещь/коробку</li>
                    <li>Наклеиваете QR-код</li>
                    <li>В приложении отмечаете &quot;Упаковано&quot;</li>
                    <li>Система обновляет процесс партии</li>
                    <li>Видите общий процесс переезда</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="help-section">
              <div className="help-section-number">5</div>
              <div className="help-section-content">
                <h3>Доставка</h3>
                <p>Отслеживайте статус каждой партии в реальном времени.</p>
                <div className="help-instruction-box">
                  <h4>Статусы партий:</h4>
                  <ul>
                    <li>Планируется - ожидает отправки</li>
                    <li>В пути - на транспорте</li>
                    <li>Доставлено - прибыло на место</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="help-section">
              <div className="help-section-number">6</div>
              <div className="help-section-content">
                <h3>Распаковка с QR-сканированием</h3>
                <p>QR-коды превращают хаотичную распаковку в организованный процесс.</p>
                <div className="help-instruction-box">
                  <h4>Как работает распаковка:</h4>
                  <ul>
                    <li>Коробка прибыла в новую квартиру</li>
                    <li>Сканируете QR-код на коробке</li>
                    <li>Приложение открывает карточку предмета</li>
                    <li>Видите всю информацию о содержимом</li>
                    <li>Знаете, куда нести коробку</li>
                    <li>Отмечаете &quot;Распаковано&quot;</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;