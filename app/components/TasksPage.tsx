'use client';

import React, { useState } from 'react';
import { Task, TasksFilterType, SectionType } from '../types';

interface TasksPageProps {
  tasks: Task[];
  onAddTask: () => void;
  onToggleCompleted: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
}

const TasksPage: React.FC<TasksPageProps> = ({
  tasks,
  onAddTask,
  onToggleCompleted,
  onDeleteTask,
}) => {
  const [currentFilter, setCurrentFilter] = useState<TasksFilterType>('all');

  const formatTaskDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    
    const monthNames = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    
    return `${day} ${monthNames[date.getMonth()]}`;
  };

  const getSectionName = (sectionValue: SectionType) => {
    const sectionNames: Record<SectionType, string> = {
      'before': 'До переезда',
      'during': 'Во время переезда',
      'after': 'После переезда'
    };
    return sectionNames[sectionValue] || sectionValue;
  };

  const getTaskPluralForm = (number: number) => {
    if (number % 10 === 1 && number % 100 !== 11) {
      return 'задача';
    } else if ([2, 3, 4].includes(number % 10) && ![12, 13, 14].includes(number % 100)) {
      return 'задачи';
    } else {
      return 'задач';
    }
  };

  // Фильтрация задач
  let filteredTasks = tasks;
  if (currentFilter === 'active') {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  }

  // Группировка задач по разделам
  const beforeTasks = filteredTasks.filter(task => task.section === 'before');
  const duringTasks = filteredTasks.filter(task => task.section === 'during');
  const afterTasks = filteredTasks.filter(task => task.section === 'after');

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const remainingTasks = totalTasks - completedTasks;

  const completedText = getTaskPluralForm(completedTasks);
  const totalText = getTaskPluralForm(totalTasks);

  const filters = [
    { value: 'all' as TasksFilterType, label: 'Все' },
    { value: 'active' as TasksFilterType, label: 'Активные' },
    { value: 'completed' as TasksFilterType, label: 'Завершенные' },
  ];

  return (
    <div id="tasks-page" className="page">
      <div className="tasks-page">
        <div className="tasks-header">
          <h1 className="tasks-title">Задачи</h1>
          <div className="tasks-subtitle" id="tasksSummary">
            {completedTasks} {completedText} из {totalTasks} {totalText} выполнено
          </div>
          
          <div className="stats-container">
            <div className="tasks-stat-card total">
              <h3>Всего</h3>
              <div className="number" id="totalTasks">{totalTasks}</div>
            </div>
            <div className="tasks-stat-card completed">
              <h3>Выполнено</h3>
              <div className="number" id="completedTasks">{completedTasks}</div>
            </div>
            <div className="tasks-stat-card remaining">
              <h3>Осталось</h3>
              <div className="number" id="remainingTasks">{remainingTasks}</div>
            </div>
          </div>
          
          <div className="add-task-button" id="addTaskButton" onClick={onAddTask}>
            <span>Добавить</span>
          </div>
          
          <div className="tabs-container">
            {filters.map(filter => (
              <div
                key={filter.value}
                className={`tab ${currentFilter === filter.value ? 'active' : 'inactive'}`}
                data-filter={filter.value}
                onClick={() => setCurrentFilter(filter.value)}
              >
                {filter.label}
              </div>
            ))}
          </div>
        </div>
        
        <div className="tasks-content" id="tasksContent">
          <div className="section" id="before-moving-section">
            <div className="section-header">
              <div className="section-indicator before"></div>
              <h2 className="section-title">До переезда</h2>
            </div>
            <div className="tasks-list" id="before-moving-tasks">
              {beforeTasks.length > 0 ? (
                beforeTasks.map(task => (
                  <div
                    key={task.id}
                    className={`task-card ${task.completed ? 'completed' : ''}`}
                    data-task-id={task.id}
                  >
                    <div
                      className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                      onClick={() => onToggleCompleted(task.id)}
                    >
                      {task.completed ? '✓' : ''}
                    </div>
                    <div className="task-content">
                      <div className={`task-title ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="task-description">{task.description}</div>
                      )}
                      <div className="task-date">{formatTaskDate(task.date)}</div>
                    </div>
                    <div
                      className="task-delete"
                      data-task-id={task.id}
                      onClick={() => onDeleteTask(task.id)}
                    >
                      🗑️
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-section">
                  Нет задач в этом разделе. Добавьте первую задачу!
                </div>
              )}
            </div>
          </div>
          
          <div className="section" id="during-moving-section">
            <div className="section-header">
              <div className="section-indicator during"></div>
              <h2 className="section-title">Во время переезда</h2>
            </div>
            <div className="tasks-list" id="during-moving-tasks">
              {duringTasks.length > 0 ? (
                duringTasks.map(task => (
                  <div
                    key={task.id}
                    className={`task-card ${task.completed ? 'completed' : ''}`}
                    data-task-id={task.id}
                  >
                    <div
                      className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                      onClick={() => onToggleCompleted(task.id)}
                    >
                      {task.completed ? '✓' : ''}
                    </div>
                    <div className="task-content">
                      <div className={`task-title ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="task-description">{task.description}</div>
                      )}
                      <div className="task-date">{formatTaskDate(task.date)}</div>
                    </div>
                    <div
                      className="task-delete"
                      data-task-id={task.id}
                      onClick={() => onDeleteTask(task.id)}
                    >
                      🗑️
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-section">
                  Нет задач в этом разделе. Добавьте первую задачу!
                </div>
              )}
            </div>
          </div>
          
          <div className="section" id="after-moving-section">
            <div className="section-header">
              <div className="section-indicator after"></div>
              <h2 className="section-title">После переезда</h2>
            </div>
            <div className="tasks-list" id="after-moving-tasks">
              {afterTasks.length > 0 ? (
                afterTasks.map(task => (
                  <div
                    key={task.id}
                    className={`task-card ${task.completed ? 'completed' : ''}`}
                    data-task-id={task.id}
                  >
                    <div
                      className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                      onClick={() => onToggleCompleted(task.id)}
                    >
                      {task.completed ? '✓' : ''}
                    </div>
                    <div className="task-content">
                      <div className={`task-title ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="task-description">{task.description}</div>
                      )}
                      <div className="task-date">{formatTaskDate(task.date)}</div>
                    </div>
                    <div
                      className="task-delete"
                      data-task-id={task.id}
                      onClick={() => onDeleteTask(task.id)}
                    >
                      🗑️
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-section">
                  Нет задач в этом разделе. Добавьте первую задачу!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;