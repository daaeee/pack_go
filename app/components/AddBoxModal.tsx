// app/components/AddBoxModal.tsx

import React, { useState } from 'react';
import { Batch } from '../types';

interface AddBoxModalProps {
  onClose: () => void;
  onSubmit: (box: {
    name: string;
    room: string;
    description: string;
    status: 'empty' | 'assembling' | 'ready';
    batchId: number;
  }) => void;
  batches: Batch[];
}

const AddBoxModal: React.FC<AddBoxModalProps> = ({ onClose, onSubmit, batches }) => {
  const [formData, setFormData] = useState({
    name: '',
    room: '',
    description: '',
    status: '' as 'empty' | 'assembling' | 'ready' | '',
    batchId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.room || !formData.status || !formData.batchId) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    onSubmit({
      name: formData.name,
      room: formData.room,
      description: formData.description,
      status: formData.status as 'empty' | 'assembling' | 'ready',
      batchId: parseInt(formData.batchId, 10),
    });

    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className="modal-overlay"
      id="boxModalOverlay"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Добавить коробку</h2>
          <button
            className="close-button"
            id="closeBoxModal"
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form id="addBoxForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="boxName">
              Название коробки
            </label>
            <input
              type="text"
              className="form-input"
              id="boxName"
              name="name"
              placeholder="Например, «Кухонная утварь»"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="boxRoom">
              Комната
            </label>
            <select
              className="form-select"
              id="boxRoom"
              name="room"
              value={formData.room}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Выберите комнату
              </option>
              <option value="kitchen">Кухня</option>
              <option value="living-room">Гостиная</option>
              <option value="bedroom">Спальня</option>
              <option value="office">Кабинет</option>
              <option value="bathroom">Ванная</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="boxDescription">
              Описание содержимого
            </label>
            <textarea
              className="form-textarea"
              id="boxDescription"
              name="description"
              placeholder="Например, тарелки, кружки, бокалы..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="boxStatus">
              Статус
            </label>
            <select
              className="form-select"
              id="boxStatus"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Выберите статус
              </option>
              <option value="empty">Пустая</option>
              <option value="assembling">Комплектуется</option>
              <option value="ready">Готова</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="boxBatch">
              Партия доставки
            </label>
            <select
              className="form-select"
              id="boxBatch"
              name="batchId"
              value={formData.batchId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Выберите партию
              </option>
              {batches.map(batch => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
            {batches.length === 0 && (
              <p style={{ marginTop: '10px', color: '#9F9F9F', fontSize: '18px' }}>
                Сначала создайте партию доставки
              </p>
            )}
          </div>

          <button type="submit" className="submit-button">
            Добавить коробку
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBoxModal;
