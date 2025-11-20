'use client';

import { useState } from 'react';
import { InventoryItem, DeliveryBatch } from "C:/Users/Пользователь/pack_go/app/types";

interface AddItemModalProps {
  batches: DeliveryBatch[];
  onClose: () => void;
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
}

export default function AddItemModal({ batches, onClose, onAddItem }: AddItemModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    room: '',
    category: '',
    batchId: '',
  });
  const [isFragile, setIsFragile] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.room || !formData.category || !formData.batchId) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    // Проверяем, есть ли место в выбранной партии
    const selectedBatch = batches.find(batch => batch.id === parseInt(formData.batchId));
    if (selectedBatch && selectedBatch.currentItems >= selectedBatch.itemLimit) {
      alert(`Партия "${selectedBatch.name}" уже заполнена! Лимит: ${selectedBatch.itemLimit} предметов`);
      return;
    }

    const newItem: Omit<InventoryItem, 'id'> = {
      name: formData.name,
      room: formData.room,
      category: formData.category,
      batchId: parseInt(formData.batchId),
      fragile: isFragile,
      packed: false
    };

    onAddItem(newItem);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleFragile = () => {
    setIsFragile(!isFragile);
  };

  return (
    <div className="modal-overlay" id="modalOverlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Добавить предмет</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form id="addItemForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="itemName">Название</label>
            <input
              type="text"
              className="form-input"
              id="itemName"
              name="name"
              placeholder="Например: Кофеварка"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="itemRoom">Комната</label>
            <select
              className="form-select"
              id="itemRoom"
              name="room"
              value={formData.room}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Выберите комнату</option>
              <option value="living-room">Гостиная</option>
              <option value="kitchen">Кухня</option>
              <option value="bedroom">Спальня</option>
              <option value="office">Кабинет</option>
              <option value="bathroom">Ванная</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="itemCategory">Категория</label>
            <select
              className="form-select"
              id="itemCategory"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Выберите категорию</option>
              <option value="furniture">Мебель</option>
              <option value="electronics">Электроника</option>
              <option value="clothing">Одежда</option>
              <option value="books">Книги</option>
              <option value="kitchen">Кухонные принадлежности</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="itemBatch">Партия доставки</label>
            <select
              className="form-select"
              id="itemBatch"
              name="batchId"
              value={formData.batchId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Выберите партию</option>
              {batches.map(batch => (
                <option key={batch.id} value={batch.id}>
                  {batch.name} ({batch.currentItems}/{batch.itemLimit})
                </option>
              ))}
              {batches.length === 0 && (
                <option value="" disabled>
                  Сначала создайте партию доставки
                </option>
              )}
            </select>
          </div>
          
          <div className="checkbox-group">
            <div 
              className={`checkbox ${isFragile ? 'checked' : ''}`}
              onClick={toggleFragile}
            >
              {isFragile ? '✓' : ''}
            </div>
            <span className="checkbox-label">Хрупкий предмет</span>
          </div>
          
          <button type="submit" className="submit-button">Добавить в инвентарь</button>
        </form>
      </div>
    </div>
  );
}