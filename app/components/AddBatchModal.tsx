'use client';

import React, { useState, useEffect } from 'react';
import { PriorityType } from '../types';

interface AddBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBatch: (batch: {
    name: string;
    date: string;
    time: string;
    address: string;
    itemLimit: number;
    priority: PriorityType;
  }) => void;
}

const AddBatchModal: React.FC<AddBatchModalProps> = ({
  isOpen,
  onClose,
  onAddBatch,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    address: '',
    itemLimit: 24,
    priority: 'medium' as PriorityType,
  });

  useEffect(() => {
    if (isOpen) {
      // Установить текущую дату и время по умолчанию
      const today = new Date().toISOString().split('T')[0];
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      
      setFormData(prev => ({
        ...prev,
        date: today,
        time: `${hours}:${minutes}`,
      }));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.time || !formData.address || !formData.itemLimit) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    onAddBatch(formData);
    setFormData({
      name: '',
      date: '',
      time: '',
      address: '',
      itemLimit: 24,
      priority: 'medium',
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'itemLimit' ? parseInt(value) || 0 : value }));
  };

  return (
    <div className="modal-overlay" id="batchModalOverlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Создать новую партию</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="batchName">Название партии</label>
            <input
              type="text"
              className="form-input"
              id="batchName"
              name="name"
              placeholder="Например: Первоочередные вещи"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="batchDate">Дата доставки</label>
            <input
              type="date"
              className="form-input"
              id="batchDate"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="batchTime">Время доставки</label>
            <input
              type="time"
              className="form-input"
              id="batchTime"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="batchAddress">Адрес доставки</label>
            <input
              type="text"
              className="form-input"
              id="batchAddress"
              name="address"
              placeholder="ул. Пушкина, д. 15, кв. 42"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="batchLimit">Лимит вещей</label>
            <input
              type="number"
              className="form-input"
              id="batchLimit"
              name="itemLimit"
              placeholder="Например: 24"
              min="1"
              value={formData.itemLimit}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="batchPriority">Приоритет</label>
            <select
              className="form-select"
              id="batchPriority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Выберите приоритет</option>
              <option value="urgent">Срочно</option>
              <option value="medium">Средний</option>
              <option value="low">Можно подождать</option>
            </select>
          </div>
          
          <button type="submit" className="submit-button">Создать партию</button>
        </form>
      </div>
    </div>
  );
};

export default AddBatchModal;