// app/components/HelpModal.tsx

import React from 'react';

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const helpSections = [
    {
      number: '1',
      title: 'Инвентаризация',
      description: 'Создайте цифровой список всех вещей, которые планируете перевезти.',
      instructions: {
        title: 'Что делать:',
        items: [
          'Сфотографируйте каждую вещь или коробку',
          'Добавьте название и описание',
          'Укажите комнату назначения',
          'Отметьте хрупкость и ценность',
          'Система автоматически сгенерирует QR-код',
        ],
      },
    },
    {
      number: '2',
      title: 'QR-коды',
      description:
        'Для каждой вещи или коробки автоматически генерируется уникальный QR-код.',
      instructions: {
        title: 'Что происходит с QR-кодами:',
        items: [
          'QR-код связан с цифровой карточкой предмета',
          'Распечатайте коды через приложение',
          'Наклейте их на коробки или прикрепите к вещам',
        ],
      },
    },
    {
      number: '3',
      title: 'Партии доставки',
      description:
        'Распределите вещи по партиям в зависимости от срочности и логистики.',
      instructions: {
        title: 'Что делать:',
        items: [
          'Создайте партии: "Кухня", "Мебель" и т.д.',
          'Добавьте вещи из инвентаря в каждую партию',
          'Укажите дату доставки',
          'Установите приоритет (срочно/средний/можно подождать)',
        ],
      },
    },
    {
      number: '4',
      title: 'Упаковка',
      description: 'Упаковывайте вещи и отмечайте процесс в приложении.',
      instructions: {
        title: 'Что происходит с вещами:',
        items: [
          'Упаковываете вещь/коробку',
          'Наклеиваете QR-код',
          'В приложении отмечаете "Упаковано"',
          'Система обновляет процесс партии',
          'Видите общий процесс переезда',
        ],
      },
    },
    {
      number: '5',
      title: 'Доставка',
      description: 'Отслеживайте статус каждой партии в реальном времени.',
      instructions: {
        title: 'Статусы партий:',
        items: [
          'Планируется - ожидает отправки',
          'В пути - на транспорте',
          'Доставлено - прибыло на место',
        ],
      },
    },
    {
      number: '6',
      title: 'Распаковка с QR-сканированием',
      description:
        'QR-коды превращают хаотичную распаковку в организованный процесс.',
      instructions: {
        title: 'Как работает распаковка:',
        items: [
          'Коробка прибыла в новую квартиру',
          'Сканируете QR-код на коробке',
          'Приложение открывает карточку предмета',
          'Видите всю информацию о содержимом',
          'Знаете, куда нести коробку',
          'Отмечаете "Распаковано"',
        ],
      },
    },
  ];

  return (
    <div
      className="modal-overlay"
      id="helpModalOverlay"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content help-modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Руководство Pack&Go</h2>
          <button
            className="close-button"
            id="closeHelpModal"
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="help-content">
          <div className="help-main-content">
            {helpSections.map(section => (
              <div className="help-section" key={section.number}>
                <div className="help-section-number">{section.number}</div>
                <div className="help-section-content">
                  <h3>{section.title}</h3>
                  <p>{section.description}</p>
                  <div className="help-instruction-box">
                    <h4>{section.instructions.title}</h4>
                    <ul>
                      {section.instructions.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
