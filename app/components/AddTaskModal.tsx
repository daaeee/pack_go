// app/components/AddTaskModal.tsx

import React, { useState, useEffect } from 'react';

interface AddTaskModalProps {
  onClose: () => void;
  onSubmit: (task: {
    title: string;
    description: string;
    section: 'before' | 'during' | 'after';
    date: string;
  }) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    section: '',
    date: '',
  });

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData(prev => ({
      ...prev,
      date: tomorrow.toISOString().split('T')[0],
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.section || !formData.date) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    onSubmit({
      title: formData.title,
      description: formData.description,
      section: formData.section as 'before' | 'during' | 'after',
      date: formData.date,
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
      id="taskModalOverlay"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Добавить задачу</h2>
          <button
            className="close-button"
            id="closeTaskModal"
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form id="addTaskForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="taskTitle">
              Название задачи
            </label>
            <input
              type="text"
              className="form-input"
              id="taskTitle"
              name="title"
              placeholder="Например, «Упаковать кухню»"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="taskDescription">
              Описание
            </label>
            <textarea
              className="form-textarea"
              id="taskDescription"
              name="description"
              placeholder="Добавьте подробности задачи..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="taskSection">
              Раздел
            </label>
            <select
              className="form-select"
              id="taskSection"
              name="section"
              value={formData.section}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Выберите раздел
              </option>
              <option value="before">До переезда</option>
              <option value="during">Во время переезда</option>
              <option value="after">После переезда</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="taskDate">
              Дата выполнения
            </label>
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

          <button type="submit" className="submit-button">
            Добавить задачу
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
