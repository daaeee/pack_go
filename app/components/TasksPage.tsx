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
  const tabs = [
    { id: 'all', label: 'Все' },
    { id: 'active', label: 'Активные' },
    { id: 'completed', label: 'Завершенные' },
  ];

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
      <div className="tasks-container">
        <div className="tasks-header">
          <h1 className="tasks-title">Задачи</h1>
          <p className="tasks-subtitle" id="tasksProgressText">
            {stats.completed} {completedText} из {stats.total} {totalText} выполнено
          </p>
        </div>

        <div className="tasks-stats">
          <div className="task-stat-card total">
            <h3>Всего</h3>
            <div className="number" id="totalTasks">
              {stats.total}
            </div>
          </div>
          <div className="task-stat-card completed">
            <h3>Выполнено</h3>
            <div className="number" id="completedTasks">
              {stats.completed}
            </div>
          </div>
          <div className="task-stat-card remaining">
            <h3>Осталось</h3>
            <div className="number" id="remainingTasks">
              {stats.remaining}
            </div>
          </div>

          <div className="add-task-button" id="addTaskButton" onClick={onAddTask}>
            <span>Добавить</span>
          </div>
        </div>

        <div className="tasks-tabs">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={
                'tasks-tab ' +
                (currentFilter === tab.id ? 'active' : '')
              }
              data-filter={tab.id}
              onClick={() =>
                onFilterChange(tab.id as 'all' | 'active' | 'completed')
              }
            >
              {tab.label}
            </div>
          ))}
        </div>

        <div className="tasks-sections">
          {(['before', 'during', 'after'] as const).map(section => {
            const sectionTasks = getTasksBySection(section).filter(
              filterTaskByStatus,
            );

            return (
              <div
                className="tasks-section"
                key={section}
                data-section={section}
              >
                <div className="tasks-section-header">
                  <div
                    className={
                      'tasks-section-indicator ' +
                      getSectionIndicatorClass(section)
                    }
                  />
                  <div className="tasks-section-title">
                    {getSectionTitle(section)}
                  </div>
                </div>

                {sectionTasks.length > 0 ? (
                  <div className="tasks-list">
                    {sectionTasks.map(task => (
                      <div
                        className={
                          'task-card ' + (task.completed ? 'completed' : '')
                        }
                        key={task.id}
                        data-task-id={task.id}
                        onClick={() => onToggleCompleted(task.id)}
                      >
                        <div
                          className={
                            'task-checkbox ' +
                            (task.completed ? 'checked' : '')
                          }
                        >
                          {task.completed ? '✓' : ''}
                        </div>
                        <div className="task-content">
                          <div className="task-title">{task.title}</div>
                          {task.description && (
                            <div className="task-description">
                              {task.description}
                            </div>
                          )}
                          <div className="task-date">
                            {formatTaskDate(task.date)}
                          </div>
                        </div>
                        <button
                          className="task-delete-button"
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            onDeleteTask(task.id);
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="tasks-empty">
                    Нет задач в этом разделе. Добавьте первую задачу!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
