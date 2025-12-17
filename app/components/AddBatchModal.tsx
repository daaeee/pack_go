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
      <div className="modal">
        <button className="modal-close-button" onClick={onClose}>
          ×
        </button>

        <h2 className="modal-title">Создать новую партию</h2>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="modal-label">
            Название партии
            <input
              type="text"
              name="name"
              className="modal-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <div className="modal-row">
            <label className="modal-label">
              Дата доставки
              <input
                type="date"
                name="date"
                className="modal-input"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </label>

            <label className="modal-label">
              Время доставки
              <input
                type="time"
                name="time"
                className="modal-input"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label className="modal-label">
            Адрес доставки
            <input
              type="text"
              name="address"
              className="modal-input"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </label>

          <label className="modal-label">
            Лимит вещей
            <input
              type="number"
              name="itemLimit"
              className="modal-input"
              value={formData.itemLimit}
              onChange={handleChange}
              min={1}
              required
            />
          </label>

          <label className="modal-label">
            Приоритет
            <select
              name="priority"
              className="modal-input"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="">Выберите приоритет</option>
              <option value="urgent">Срочно</option>
              <option value="medium">Средний</option>
              <option value="low">Можно подождать</option>
            </select>
          </label>

          <button type="submit" className="modal-submit-button">
            Создать партию
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBatchModal;
