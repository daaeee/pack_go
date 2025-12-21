'use client';

import React, { useState } from 'react';
import { Batch, RoomType, StatusType } from '../types';

interface AddBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBox: (box: {
    name: string;
    room: RoomType;
    description: string;
    status: StatusType;
    batchId: number;
  }) => void;
  batches: Batch[];
}

const AddBoxModal: React.FC<AddBoxModalProps> = ({
  isOpen,
  onClose,
  onAddBox,
  batches,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    room: '' as RoomType,
    description: '',
    status: 'empty' as StatusType,
    batchId: 0,
  });

  const [errors, setErrors] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors: string[] = [];
    
    if (!formData.name.trim()) {
      validationErrors.push('Название коробки обязательно');
    }
    
    if (!formData.room) {
      validationErrors.push('Выберите комнату');
    }
    
    if (!formData.status) {
      validationErrors.push('Выберите статус');
    }
    
    if (!formData.batchId || formData.batchId <= 0) {
      validationErrors.push('Выберите партию доставки');
    }
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      alert(`Пожалуйста, заполните все обязательные поля:\n${validationErrors.join('\n')}`);
      return;
    }
    
    setErrors([]);

    onAddBox(formData);
    setFormData({
      name: '',
      room: '' as RoomType,
      description: '',
      status: 'empty',
      batchId: 0,
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Очищаем ошибки при изменении поля
    if (errors.length > 0) {
      setErrors([]);
    }
    
    if (name === 'batchId') {
      // Конвертируем в число, но проверяем на валидность
      const numericValue = parseInt(value);
      setFormData(prev => ({ 
        ...prev, 
        [name]: isNaN(numericValue) ? 0 : numericValue 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="modal-overlay" id="boxModalOverlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Добавить коробку</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="boxName">Название коробки *</label>
            <input
              type="text"
              className="form-input"
              id="boxName"
              name="name"
              placeholder="Например: Кухонная посуда"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="boxRoom">Комната *</label>
            <select
              className="form-select"
              id="boxRoom"
              name="room"
              value={formData.room}
              onChange={handleChange}
              required
            >
              <option value="">Выберите комнату</option>
              <option value="kitchen">Кухня</option>
              <option value="living-room">Гостиная</option>
              <option value="bedroom">Спальня</option>
              <option value="office">Кабинет</option>
              <option value="bathroom">Ванная</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="boxDescription">Описание содержимого</label>
            <textarea
              className="form-textarea"
              id="boxDescription"
              name="description"
              placeholder="Перечислите основные предметы в коробке..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="boxStatus">Статус *</label>
            <select
              className="form-select"
              id="boxStatus"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Выберите статус</option>
              <option value="empty">Пустая</option>
              <option value="assembling">Комплектуется</option>
              <option value="ready">Готова</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="boxBatch">Партия доставки *</label>
            <select
              className="form-select"
              id="boxBatch"
              name="batchId"
              value={formData.batchId || ""}
              onChange={handleChange}
              required
            >
              <option value="">Выберите партию</option>
              {batches.map(batch => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
              {batches.length === 0 && (
                <option value="" disabled>Сначала создайте партию доставки</option>
              )}
            </select>
          </div>
          
          {errors.length > 0 && (
            <div style={{ 
              color: '#A1000B', 
              marginBottom: '20px', 
              padding: '10px', 
              background: '#FFE6E6',
              borderRadius: '8px'
            }}>
              <strong>Ошибки:</strong>
              <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          <button type="submit" className="submit-button">Добавить коробку</button>
        </form>
      </div>
    </div>
  );
};

export default AddBoxModal;