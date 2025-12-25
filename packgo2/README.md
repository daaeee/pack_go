# Pack&Go - Система управления переездом

Система управления переездом с полным функционалом инвентаризации, управления коробками, партиями доставки и задачами.

## Структура проекта

```
packgo3/
├── backend/           # Backend сервер (Node.js + Express + SQLite)
│   ├── server.js      # Основной файл сервера
│   └── package.json   # Зависимости backend
├── src/
│   ├── css/          # Стили
│   └── js/
│       ├── api.js    # API клиент для работы с backend
│       └── main.js   # Основная логика frontend
└── index.html        # Главная страница
```

## Установка и запуск

### 1. Установка зависимостей backend

Перейдите в папку `backend` и установите зависимости:

```bash
cd backend
npm install
```

### 2. Запуск backend сервера

```bash
npm start
```

Сервер запустится на `http://localhost:3000`

Для разработки с автоматической перезагрузкой используйте:

```bash
npm run dev
```

### 3. Запуск frontend

Откройте файл `index.html` в браузере или используйте локальный сервер:

```bash
# Используя Python
python -m http.server 8000

# Используя Node.js http-server
npx http-server -p 8000
```

Затем откройте в браузере: `http://localhost:8000`

## API Endpoints

### Items (Предметы)
- `GET /api/items` - Получить все предметы
- `GET /api/items/:id` - Получить предмет по ID
- `POST /api/items` - Создать предмет
- `PUT /api/items/:id` - Обновить предмет
- `PATCH /api/items/:id/toggle-packed` - Переключить статус упаковки
- `DELETE /api/items/:id` - Удалить предмет

### Batches (Партии доставки)
- `GET /api/batches` - Получить все партии
- `GET /api/batches/:id` - Получить партию по ID
- `POST /api/batches` - Создать партию
- `PUT /api/batches/:id` - Обновить партию
- `DELETE /api/batches/:id` - Удалить партию

### Boxes (Коробки)
- `GET /api/boxes` - Получить все коробки
- `GET /api/boxes/:id` - Получить коробку по ID
- `POST /api/boxes` - Создать коробку
- `PUT /api/boxes/:id` - Обновить коробку
- `PATCH /api/boxes/:id/toggle-unpacked` - Переключить статус распаковки
- `DELETE /api/boxes/:id` - Удалить коробку

### Tasks (Задачи)
- `GET /api/tasks` - Получить все задачи
- `GET /api/tasks/:id` - Получить задачу по ID
- `POST /api/tasks` - Создать задачу
- `PUT /api/tasks/:id` - Обновить задачу
- `PATCH /api/tasks/:id/toggle-completed` - Переключить статус выполнения
- `DELETE /api/tasks/:id` - Удалить задачу

### Profile (Профиль)
- `GET /api/profile` - Получить профиль
- `PUT /api/profile` - Обновить профиль

### Move History (История переездов)
- `GET /api/move-history` - Получить историю переездов
- `POST /api/move-history` - Создать запись в истории

### Finish Move (Завершение переезда)
- `POST /api/finish-move` - Завершить переезд (сохранить в историю и очистить данные)

## База данных

Используется SQLite база данных (`database.sqlite`), которая автоматически создается при первом запуске сервера.

## Особенности

- Полная интеграция frontend и backend
- RESTful API
- SQLite база данных для хранения данных
- CORS настроен для работы с frontend
- Автоматическая синхронизация данных между frontend и backend

## Технологии

- **Frontend**: HTML, CSS, JavaScript (ES6 Modules)
- **Backend**: Node.js, Express.js
- **Database**: SQLite3

