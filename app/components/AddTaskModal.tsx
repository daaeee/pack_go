'use client';

import React, { useState, useEffect } from 'react';
import { SectionType } from '../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: {
    title: string;
    description: string;
    section: SectionType;
    date: string;
  }) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    section: '' as SectionType,
    date: '',
  });

  useEffect(() => {
    if (isOpen) {
      // Установить дату по умолчанию на завтра
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData(prev => ({
        ...prev,
        date: tomorrow.toISOString().split('T')[0],
      }));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.section || !formData.date) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    onAddTask(formData);
    setFormData({
      title: '',
      description: '',
      section: '' as SectionType,
      date: '',
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay" id="taskModalOverlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Добавить задачу</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="taskTitle">Название задачи</label>
            <input
              type="text"
              className="form-input"
              id="taskTitle"
              name="title"
              placeholder="Например: Упаковать посуду"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="taskDescription">Описание</label>
            <textarea
              className="form-textarea"
              id="taskDescription"
              name="description"
              placeholder="Дополнительные детали..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="taskSection">Раздел</label>
            <select
              className="form-select"
              id="taskSection"
              name="section"
              value={formData.section}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Выберите раздел</option>
              <option value="before">До переезда</option>
              <option value="during">Во время переезда</option>
              <option value="after">После переезда</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="taskDate">Дата выполнения</label>
            <input
              type="date"
              className="form-input"
              id="taskDate"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="submit-button">Добавить задачу</button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;