// app/components/AddBoxModal.tsx
"use client";

import React, { useState } from "react";
import { Batch } from "../types";

interface AddBoxModalProps {
  onClose: () => void;
  onSubmit: (box: {
    name: string;
    room: string;
    description: string;
    status: "empty" | "assembling" | "ready";
    batchId: number;
  }) => void;
  batches: Batch[];
}

const AddBoxModal: React.FC<AddBoxModalProps> = ({
  onClose,
  onSubmit,
  batches,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    room: "",
    description: "",
    status: "" as "" | "empty" | "assembling" | "ready",
    batchId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.room ||
      !formData.status ||
      !formData.batchId
    ) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }

    onSubmit({
      name: formData.name,
      room: formData.room,
      description: formData.description,
      status: formData.status as "empty" | "assembling" | "ready",
      batchId: parseInt(formData.batchId, 10),
    });

    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(160,160,160,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-content"
        style={{
          width: 1250,
          maxWidth: "95%",
          height: 800,
          maxHeight: "95%",
          boxSizing: "border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">Добавить коробку</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="boxName">
              Название коробки
            </label>
            <input
              id="boxName"
              className="form-input"
              type="text"
              name="name"
              placeholder="Например: Кухонная утварь"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="boxRoom">
              Комната
            </label>
            <select
              id="boxRoom"
              className="form-select"
              name="room"
              value={formData.room}
              onChange={handleChange}
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
            <label className="form-label" htmlFor="boxDescription">
              Описание содержимого
            </label>
            <textarea
              id="boxDescription"
              className="form-input"
              style={{ height: 150, paddingTop: 20, paddingBottom: 20 }}
              name="description"
              placeholder={"Перечислите основные предметы в коробке..."}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="boxStatus">
              Статус
            </label>
            <select
              id="boxStatus"
              className="form-select"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="">Выберите статус</option>
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
              id="boxBatch"
              className="form-select"
              name="batchId"
              value={formData.batchId}
              onChange={handleChange}
            >
              <option value="">Выберите партию</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
            {batches.length === 0 && (
              <p style={{ marginTop: 10 }}>Сначала создайте партию доставки</p>
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
