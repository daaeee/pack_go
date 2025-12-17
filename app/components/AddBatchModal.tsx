// app/components/AddBatchModal.tsx
"use client";

import React, { useState, useEffect } from "react";

interface AddBatchModalProps {
  onClose: () => void;
  onSubmit: (batch: {
    name: string;
    date: string;
    time: string;
    address: string;
    itemLimit: number;
    priority: "urgent" | "medium" | "low";
  }) => void;
}

const AddBatchModal: React.FC<AddBatchModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    address: "",
    itemLimit: "",
    priority: "",
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    setFormData(prev => ({
      ...prev,
      date: today,
      time: `${hours}:${minutes}`,
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.date ||
      !formData.time ||
      !formData.address ||
      !formData.itemLimit ||
      !formData.priority
    ) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }

    onSubmit({
      name: formData.name,
      date: formData.date,
      time: formData.time,
      address: formData.address,
      itemLimit: parseInt(formData.itemLimit, 10),
      priority: formData.priority as "urgent" | "medium" | "low",
    });

    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ height: "900px", overflowY: "auto" }}>
        <div className="modal-header">
          <h2 className="modal-title">Создать новую партию</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Название партии
            </label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введите название партии"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Дата доставки
            </label>
            <input
              type="date"
              name="date"
              className="form-input"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Время доставки
            </label>
            <input
              type="time"
              name="time"
              className="form-input"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Адрес доставки
            </label>
            <input
              type="text"
              name="address"
              className="form-input"
              value={formData.address}
              onChange={handleChange}
              placeholder="Введите адрес доставки"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Лимит вещей
            </label>
            <input
              type="number"
              name="itemLimit"
              className="form-input"
              value={formData.itemLimit}
              onChange={handleChange}
              min={1}
              placeholder="Введите лимит вещей"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Приоритет
            </label>
            <select
              name="priority"
              className="form-select"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="">Выберите приоритет</option>
              <option value="urgent">Срочно</option>
              <option value="medium">Средний</option>
              <option value="low">Можно подождать</option>
            </select>
          </div>

          <button type="submit" className="submit-button">
            Создать партию
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBatchModal;