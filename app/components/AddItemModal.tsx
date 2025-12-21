'use client';

import React, { useState } from 'react';
import { Batch, RoomType, CategoryType } from '../types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: {
    name: string;
    room: RoomType;
    category: CategoryType;
    batchId: number;
    fragile: boolean;
  }) => void;
  batches: Batch[];
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
  batches,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    room: '' as RoomType,
    category: '' as CategoryType,
    batchId: 0,
    fragile: false,
  });

  const [errors, setErrors] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors: string[] = [];
    
    if (!formData.name.trim()) {
      validationErrors.push('Название предмета обязательно');
    }
    
    if (!formData.room) {
      validationErrors.push('Выберите комнату');
    }
    
    if (!formData.category) {
      validationErrors.push('Выберите категорию');
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

    // Проверяем, есть ли место в выбранной партии
    const selectedBatch = batches.find(batch => batch.id === formData.batchId);
    if (selectedBatch && selectedBatch.currentItems >= selectedBatch.itemLimit) {
      alert(`Партия "${selectedBatch.name}" уже заполнена! Лимит: ${selectedBatch.itemLimit} предметов`);
      return;
    }

    onAddItem(formData);
    
    // Сброс формы
    setFormData({
      name: '',
      room: '' as RoomType,
      category: '' as CategoryType,
      batchId: 0,
      fragile: false,
    });
    
    setErrors([]);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Очищаем ошибки при изменении поля
    if (errors.length > 0) {
      setErrors([]);
    }
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'batchId') {
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

  const handleFragileToggle = () => {
    setFormData(prev => ({ ...prev, fragile: !prev.fragile }));
  };

  // Для отладки - можно добавить console.log
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Select changed:', e.target.name, e.target.value);
    handleChange(e);
  };

  return (
    <div className="modal-overlay" id="itemModalOverlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Добавить предмет</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="itemName">Название *</label>
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
            <label className="form-label" htmlFor="itemRoom">Комната *</label>
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
            <label className="form-label" htmlFor="itemCategory">Категория *</label>
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
            <label className="form-label" htmlFor="itemBatch">Партия доставки *</label>
            <select
              className="form-select"
              id="itemBatch"
              name="batchId"
              value={formData.batchId || ""}
              onChange={handleSelectChange}
              required
            >
              <option value="">Выберите партию</option>
              {batches.map(batch => (
                <option key={batch.id} value={batch.id}>
                  {batch.name} ({batch.currentItems}/{batch.itemLimit})
                </option>
              ))}
              {batches.length === 0 && (
                <option value="" disabled>Сначала создайте партию доставки</option>
              )}
            </select>
          </div>
          
          <div className="checkbox-group">
            <div
              className={`checkbox ${formData.fragile ? 'checked' : ''}`}
              onClick={handleFragileToggle}
              style={{ cursor: 'pointer' }}
            >
              {formData.fragile ? '✓' : ''}
            </div>
            <span className="checkbox-label">Хрупкий предмет</span>
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
          
          <button type="submit" className="submit-button">Добавить в инвентарь</button>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;