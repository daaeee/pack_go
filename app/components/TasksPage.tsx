// app/components/TasksPage.tsx

import React from 'react';
import { Task } from '../types';

interface TasksPageProps {
  tasks: Task[];
  stats: {
    total: number;
    completed: number;
    remaining: number;
  };
  onAddTask: () => void;
  currentFilter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  onToggleCompleted: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
  formatTaskDate: (date: string) => string;
  getTaskPluralForm: (number: number) => string;
}

const TasksPage: React.FC<TasksPageProps> = ({
  tasks,
  stats,
  onAddTask,
  currentFilter,
  onFilterChange,
  onToggleCompleted,
  onDeleteTask,
  formatTaskDate,
  getTaskPluralForm,
}) => {
  const getTasksBySection = (section: 'before' | 'during' | 'after') => {
    return tasks.filter(task => task.section === section);
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'before':
        return 'До переезда';
      case 'during':
        return 'Во время переезда';
      case 'after':
        return 'После переезда';
      default:
        return section;
    }
  };

  const getSectionIndicatorClass = (section: string) => {
    switch (section) {
      case 'before':
        return 'before';
      case 'during':
        return 'during';
      case 'after':
        return 'after';
      default:
        return 'before';
    }
  };

  const completedText = getTaskPluralForm(stats.completed);
  const totalText = getTaskPluralForm(stats.total);

  const filterTaskByStatus = (task: Task) => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  };

  return (
    <div id="tasks-page" className="tasks-page">
      <div className="tasks-header">
        <h1 className="tasks-title">Задачи</h1>
        <div className="tasks-subtitle" id="tasksSummary">
          {stats.completed} из {stats.total} выполнена
        </div>
        
        <div className="stats-container">
          <div className="tasks-stat-card total">
            <h3>Всего</h3>
            <div className="number" id="totalTasks">
              {stats.total}
            </div>
          </div>
          <div className="tasks-stat-card completed">
            <h3>Выполнено</h3>
            <div className="number" id="completedTasks">
              {stats.completed}
            </div>
          </div>
          <div className="tasks-stat-card remaining">
            <h3>Осталось</h3>
            <div className="number" id="remainingTasks">
              {stats.remaining}
            </div>
          </div>
        </div>
        
        <div className="add-task-button" id="addTaskButton" onClick={onAddTask}>
          <span>Добавить</span>
        </div>
        
        <div className="tabs-container">
          <div 
            className={`tab ${currentFilter === 'all' ? 'active' : 'inactive'}`}
            onClick={() => onFilterChange('all')}
          >
            Все
          </div>
          <div 
            className={`tab ${currentFilter === 'active' ? 'active' : 'inactive'}`}
            onClick={() => onFilterChange('active')}
          >
            Активные
          </div>
          <div 
            className={`tab ${currentFilter === 'completed' ? 'active' : 'inactive'}`}
            onClick={() => onFilterChange('completed')}
          >
            Завершенные
          </div>
        </div>
      </div>
      
      <div className="tasks-content" id="tasksContent">
        {(['before', 'during', 'after'] as const).map(section => {
          const sectionTasks = getTasksBySection(section).filter(filterTaskByStatus);
          
          return (
            <div className="section" key={section} id={`${section}-moving-section`}>
              <div className="section-header">
                <div className={`section-indicator ${getSectionIndicatorClass(section)}`}></div>
                <h2 className="section-title">{getSectionTitle(section)}</h2>
              </div>
              <div className="tasks-list" id={`${section}-moving-tasks`}>
                {sectionTasks.length > 0 ? (
                  sectionTasks.map(task => (
                    <div 
                      className={`task-card ${task.completed ? 'completed' : ''}`} 
                      key={task.id}
                    >
                      <div 
                        className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                        onClick={() => onToggleCompleted(task.id)}
                      >
                        {task.completed ? '✓' : ''}
                      </div>
                      <div className="task-content">
                        <div className="task-title">{task.title}</div>
                        {task.description && (
                          <div className="task-description">{task.description}</div>
                        )}
                        <div className="task-date">{formatTaskDate(task.date)}</div>
                      </div>
                      <div 
                        className="task-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTask(task.id);
                        }}
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
          );
        })}
      </div>
    </div>
  );
};

export default TasksPage;