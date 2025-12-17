// app/components/AddItemModal.tsx
"use client";

import React, { useState } from "react";
import { Batch } from "../types";

interface AddItemModalProps {
  onClose: () => void;
  onSubmit: (item: {
    name: string;
    room: string;
    category: string;
    batchId: number;
    fragile: boolean;
    packed: boolean;
  }) => void;
  batches: Batch[];
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  onClose,
  onSubmit,
  batches,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    room: "",
    category: "",
    batchId: "",
    fragile: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.room ||
      !formData.category ||
      !formData.batchId
    ) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }

    const selectedBatch = batches.find(
      (b) => b.id === parseInt(formData.batchId, 10)
    );

    if (
      selectedBatch &&
      selectedBatch.currentItems >= selectedBatch.itemLimit
    ) {
      alert(
        `Партия "${selectedBatch.name}" уже заполнена! Лимит: ${selectedBatch.itemLimit} предметов`
      );
      return;
    }

    onSubmit({
      name: formData.name,
      room: formData.room,
      category: formData.category,
      batchId: parseInt(formData.batchId, 10),
      fragile: formData.fragile,
      packed: false,
    });

    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleFragile = () => {
    setFormData((prev) => ({ ...prev, fragile: !prev.fragile }));
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ height: "900px", overflowY: "auto" }}>
        <div className="modal-header">
          <h2 className="modal-title">Добавить предмет</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="itemName">
              Название
            </label>
            <input
              className="form-input"
              id="itemName"
              type="text"
              name="name"
              placeholder="Например: Кофеварка"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="itemRoom">
              Комната
            </label>
            <select
              className="form-select"
              id="itemRoom"
              name="room"
              value={formData.room}
              onChange={handleChange}
              required
            >
              <option value="">Выберите комнату</option>
              <option value="living-room">Гостиная</option>
              <option value="kitchen">Кухня</option>
              <option value="bedroom">Спальня</option>
              <option value="office">Кабинет</option>
              <option value="bathroom">Ванная</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="itemCategory">
              Категория
            </label>
            <select
              className="form-select"
              id="itemCategory"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Выберите категорию</option>
              <option value="furniture">Мебель</option>
              <option value="electronics">Электроника</option>
              <option value="clothing">Одежда</option>
              <option value="books">Книги</option>
              <option value="kitchen">Кухонные принадлежности</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="itemBatch">
              Партия доставки
            </label>
            <select
              className="form-select"
              id="itemBatch"
              name="batchId"
              value={formData.batchId}
              onChange={handleChange}
              required
            >
              <option value="">Выберите партию</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name} ({batch.currentItems}/{batch.itemLimit})
                </option>
              ))}
            </select>
            {batches.length === 0 && (
              <p style={{ marginTop: 10, color: "#9F9F9F", fontSize: "24px" }}>
                Сначала создайте партию доставки
              </p>
            )}
          </div>

          <div className="checkbox-group">
            <div
              className={"checkbox" + (formData.fragile ? " checked" : "")}
              onClick={toggleFragile}
              style={{ cursor: "pointer" }}
            >
              {formData.fragile ? "✓" : ""}
            </div>
            <span className="checkbox-label" onClick={toggleFragile} style={{ cursor: "pointer" }}>
              Хрупкий предмет
            </span>
          </div>

          <button type="submit" className="submit-button">
            Добавить в инвентарь
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;