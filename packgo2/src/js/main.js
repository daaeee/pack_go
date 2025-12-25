// ========== ИМПОРТ API ==========
import { itemsAPI, batchesAPI, boxesAPI, tasksAPI, profileAPI, moveHistoryAPI, finishMoveAPI } from './api.js';

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========

// Хранилище данных для инвентаря
let inventoryItems = [];
let batches = [];
let boxes = [];
let currentFilter = 'all';
let currentSearchQuery = '';

// Хранилище данных для задач
let tasks = [];
let currentTasksFilter = 'all';

// Флаг для отслеживания показа окна завершения переезда
let hasShownFinishMoveModal = false;

// Флаг загрузки данных
let isLoading = false;

// ========== ЭЛЕМЕНТЫ ДЛЯ ИНВЕНТАРЯ ==========

// Элементы DOM для инвентаря
const itemsContainer = document.getElementById('itemsContainer');
const emptyState = document.getElementById('emptyState');
const searchNoResults = document.getElementById('searchNoResults');
const itemsCount = document.getElementById('itemsCount');
const totalCount = document.getElementById('totalCount');
const packedCount = document.getElementById('packedCount');
const fragileCount = document.getElementById('fragileCount');
const addButton = document.getElementById('addButton');
const itemModalOverlay = document.getElementById('itemModalOverlay');
const closeItemModal = document.getElementById('closeItemModal');
const addItemForm = document.getElementById('addItemForm');
const fragileCheckbox = document.getElementById('fragileCheckbox');
const filters = document.querySelectorAll('.filter');
const searchInput = document.getElementById('searchInput');

// Элементы для партий
const batchesContainer = document.getElementById('batchesContainer');
const batchesEmptyState = document.getElementById('batchesEmptyState');
const batchesCount = document.getElementById('batchesCount');
const deliveredCount = document.getElementById('deliveredCount');
const inTransitCount = document.getElementById('inTransitCount');
const plannedCount = document.getElementById('plannedCount');
const createBatchButton = document.getElementById('createBatchButton');
const batchModalOverlay = document.getElementById('batchModalOverlay');
const closeBatchModal = document.getElementById('closeBatchModal');
const addBatchForm = document.getElementById('addBatchForm');
const itemBatchSelect = document.getElementById('itemBatch');

// Элементы для коробок
const boxesList = document.getElementById('boxesList');
const boxesEmptyState = document.getElementById('boxesEmptyState');
const boxesCount = document.getElementById('boxesCount');
const totalBoxes = document.getElementById('totalBoxes');
const readyBoxes = document.getElementById('readyBoxes');
const inWorkBoxes = document.getElementById('inWorkBoxes');
const addBoxButton = document.getElementById('addBoxButton');
const boxModalOverlay = document.getElementById('boxModalOverlay');
const closeBoxModal = document.getElementById('closeBoxModal');
const addBoxForm = document.getElementById('addBoxForm');
const boxBatchSelect = document.getElementById('boxBatch');
const boxesSearchInput = document.getElementById('boxesSearchInput');

// Элементы для распаковки
const unpackingBoxesContainer = document.getElementById('unpackingBoxesContainer');
const unpackingEmptyState = document.getElementById('unpackingEmptyState');
const unpackingSubtitle = document.querySelector('.unpacking-subtitle');
const unpackingProgressText = document.querySelector('.unpacking-progress-text');
const unpackingProgressBar = document.querySelector('.unpacking-progress-bar');
const scanSection = document.querySelector('.scan-section');

// Элементы для сканера
const startScanButton = document.getElementById('startScanButton');

// ========== ЭЛЕМЕНТЫ ДЛЯ ЗАДАЧ ==========

const tasksContent = document.getElementById('tasksContent');
const tasksSummary = document.getElementById('tasksSummary');
const totalTasks = document.getElementById('totalTasks');
const completedTasks = document.getElementById('completedTasks');
const remainingTasks = document.getElementById('remainingTasks');
const addTaskButton = document.getElementById('addTaskButton');
const taskModalOverlay = document.getElementById('taskModalOverlay');
const closeTaskModal = document.getElementById('closeTaskModal');
const addTaskForm = document.getElementById('addTaskForm');
const tasksTabs = document.querySelectorAll('.tab');

// Секции задач
const beforeMovingTasks = document.getElementById('before-moving-tasks');
const duringMovingTasks = document.getElementById('during-moving-tasks');
const afterMovingTasks = document.getElementById('after-moving-tasks');

// ========== ЭЛЕМЕНТЫ ДЛЯ ПРОФИЛЯ ==========

const profileTotalItems = document.getElementById('profile-total-items');
const profileTotalBatches = document.getElementById('profile-total-batches');
const currentAddress = document.getElementById('current-address');
const moveStartDate = document.getElementById('move-start-date');
const historyEmpty = document.getElementById('history-empty');
const logoutButton = document.getElementById('logoutButton');
const historyCard = document.getElementById('history-item');
const historyAddress = document.getElementById('history-address');
const historyDate = document.getElementById('history-date');
const historyStats = document.getElementById('history-stats');

// ========== ЭЛЕМЕНТЫ ДЛЯ НОВЫХ МОДАЛЬНЫХ ОКОН ==========

// Модальное окно "Как работает приложение"
const showHelpButton = document.getElementById('showHelpButton');
const helpModalOverlay = document.getElementById('helpModalOverlay');
const closeHelpModal = document.getElementById('closeHelpModal');

// Модальное окно "Завершить переезд"
const finishMoveModalOverlay = document.getElementById('finishMoveModalOverlay');
const closeFinishMoveModal = document.getElementById('closeFinishMoveModal');
const cancelFinishMove = document.getElementById('cancelFinishMove');
const confirmFinishMove = document.getElementById('confirmFinishMove');

// Модальное окно QR-кода
const qrCodeModalOverlay = document.getElementById('qrCodeModalOverlay');
const qrPrintButton = document.getElementById('qrPrintButton');
const qrSaveButton = document.getElementById('qrSaveButton');
const qrShareButton = document.getElementById('qrShareButton');
const qrDoneButton = document.getElementById('qrDoneButton');

// История переездов
let moveHistory = [];

// ========== ФУНКЦИИ ЗАГРУЗКИ ДАННЫХ ==========

// Загрузка всех данных из API
async function loadAllData() {
    if (isLoading) return;
    isLoading = true;
    
    try {
        [inventoryItems, batches, boxesData, tasks, moveHistory] = await Promise.all([
            itemsAPI.getAll(),
            batchesAPI.getAll(),
            boxesAPI.getAll(),
            tasksAPI.getAll(),
            moveHistoryAPI.getAll()
        ]);
        
        // Убеждаемся, что у всех коробок есть массив items
        boxes = boxesData.map(box => ({
            ...box,
            unpacked: box.unpacked === 1 || box.unpacked === true,
            items: box.items || []
        }));
        
        // Обновляем все отображения
        updateInventoryDisplay();
        updateBoxesDisplay();
        updateBatchesDisplay();
        updateTasksDisplay();
        updateUnpackingDisplay();
        updateProfileData();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Ошибка загрузки данных. Убедитесь, что сервер запущен.');
    } finally {
        isLoading = false;
    }
}

// ========== ФУНКЦИИ ДЛЯ ИНВЕНТАРЯ ==========

// Открытие модального окна добавления предмета
addButton.addEventListener('click', function() {
    updateBatchSelect();
    itemModalOverlay.style.display = 'flex';
});

// Закрытие модального окна добавления предмета
closeItemModal.addEventListener('click', function() {
    itemModalOverlay.style.display = 'none';
    resetItemForm();
});

// Закрытие модального окна добавления предмета при клике вне его
itemModalOverlay.addEventListener('click', function(e) {
    if (e.target === this) {
        itemModalOverlay.style.display = 'none';
        resetItemForm();
    }
});

// Открытие модального окна создания партии
createBatchButton.addEventListener('click', function() {
    batchModalOverlay.style.display = 'flex';
});

// Закрытие модального окна создания партии
closeBatchModal.addEventListener('click', function() {
    batchModalOverlay.style.display = 'none';
    resetBatchForm();
});

// Закрытие модального окна создания партии при клике вне его
batchModalOverlay.addEventListener('click', function(e) {
    if (e.target === this) {
        batchModalOverlay.style.display = 'none';
        resetBatchForm();
    }
});

// Открытие модального окна добавления коробки
addBoxButton.addEventListener('click', function() {
    updateBatchSelectForBoxes();
    boxModalOverlay.style.display = 'flex';
});

// Закрытие модального окна добавления коробки
closeBoxModal.addEventListener('click', function() {
    boxModalOverlay.style.display = 'none';
    resetBoxForm();
});

// Закрытие модального окна добавления коробки при клике вне его
boxModalOverlay.addEventListener('click', function(e) {
    if (e.target === this) {
        boxModalOverlay.style.display = 'none';
        resetBoxForm();
    }
});

// Обработка кнопки начала сканирования
startScanButton.addEventListener('click', function() {
    alert('Сканирование начато! Наведите камеру на QR-код коробки.');
});

// Обработка кнопки сканирования на странице распаковки
scanSection.addEventListener('click', function() {
    showPage('scanner-page');
});

// Переключение чекбокса хрупкости
fragileCheckbox.addEventListener('click', function() {
    this.classList.toggle('checked');
    this.textContent = this.classList.contains('checked') ? '✓' : '';
});

// Обработка поиска
searchInput.addEventListener('input', function() {
    currentSearchQuery = this.value.toLowerCase().trim();
    updateInventoryDisplay();
});

// Обработка поиска коробок
boxesSearchInput.addEventListener('input', function() {
    updateBoxesDisplay();
});

// Обработка формы добавления предмета
addItemForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const itemName = document.getElementById('itemName').value;
    const itemRoom = document.getElementById('itemRoom').value;
    const itemCategory = document.getElementById('itemCategory').value;
    const itemBatch = document.getElementById('itemBatch').value;
    const isFragile = fragileCheckbox.classList.contains('checked');
    
    // Проверяем, есть ли место в выбранной партии
    const selectedBatch = batches.find(batch => batch.id == itemBatch);
    if (selectedBatch && selectedBatch.currentItems >= selectedBatch.itemLimit) {
        alert(`Партия "${selectedBatch.name}" уже заполнена! Лимит: ${selectedBatch.itemLimit} предметов`);
        return;
    }
    
    try {
        // Создание нового предмета через API
        const newItem = await itemsAPI.create({
            name: itemName,
            room: itemRoom,
            category: itemCategory,
            batchId: parseInt(itemBatch),
            fragile: isFragile,
            packed: false
        });
        
        // Добавление предмета в локальный массив
        inventoryItems.push(newItem);
        
        // Обновляем счетчик предметов в партии
        if (selectedBatch) {
            selectedBatch.currentItems++;
        }
        
        // Обновление интерфейса
        updateInventoryDisplay();
        updateBatchesDisplay();
        updateProfileData();
        
        // Закрытие модального окна и сброс формы
        itemModalOverlay.style.display = 'none';
        resetItemForm();
    } catch (error) {
        console.error('Error creating item:', error);
        alert('Ошибка при добавлении предмета');
    }
});

// Обработка формы создания партии
addBatchForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const batchName = document.getElementById('batchName').value;
    const batchDate = document.getElementById('batchDate').value;
    const batchTime = document.getElementById('batchTime').value;
    const batchAddress = document.getElementById('batchAddress').value;
    const batchLimit = parseInt(document.getElementById('batchLimit').value);
    const batchPriority = document.getElementById('batchPriority').value;
    
    try {
        // Создание новой партии через API
        const newBatch = await batchesAPI.create({
            name: batchName,
            date: batchDate,
            time: batchTime,
            address: batchAddress,
            itemLimit: batchLimit,
            priority: batchPriority,
            status: 'planned'
        });
        
        // Добавление партии в локальный массив
        batches.push(newBatch);
        
        // Обновление интерфейса
        updateBatchesDisplay();
        updateBatchSelect();
        updateBatchSelectForBoxes();
        updateProfileData();
        
        // Закрытие модального окна и сброс формы
        batchModalOverlay.style.display = 'none';
        resetBatchForm();
    } catch (error) {
        console.error('Error creating batch:', error);
        alert('Ошибка при создании партии');
    }
});

// Обработка формы добавления коробки
addBoxForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const boxName = document.getElementById('boxName').value;
    const boxRoom = document.getElementById('boxRoom').value;
    const boxDescription = document.getElementById('boxDescription').value;
    const boxStatus = document.getElementById('boxStatus').value;
    const boxBatch = document.getElementById('boxBatch').value;
    
    // Определяем иконку в зависимости от комнаты
    let boxIcon = '📦';
    switch(boxRoom) {
        case 'kitchen': boxIcon = '🍽️'; break;
        case 'bedroom': boxIcon = '🛏️'; break;
        case 'bathroom': boxIcon = '🛁'; break;
        case 'living-room': boxIcon = '📺'; break;
        case 'office': boxIcon = '📚'; break;
    }
    
    try {
        // Создание новой коробки через API
        const newBox = await boxesAPI.create({
            name: boxName,
            room: boxRoom,
            description: boxDescription,
            status: boxStatus,
            batchId: parseInt(boxBatch),
            icon: boxIcon
        });
        
        // Инициализируем items массив если его нет
        if (!newBox.items) {
            newBox.items = [];
        }
        
        // Добавление коробки в локальный массив
        boxes.push(newBox);
        
        // Обновление интерфейса
        updateBoxesDisplay();
        updateUnpackingDisplay();
        
        // Проверяем условие для показа окна завершения переезда
        checkAndShowFinishMoveModal();
        
        // Закрытие модального окна и сброс формы
        boxModalOverlay.style.display = 'none';
        resetBoxForm();
    } catch (error) {
        console.error('Error creating box:', error);
        alert('Ошибка при добавлении коробки');
    }
});

// Функция сброса формы добавления предмета
function resetItemForm() {
    addItemForm.reset();
    fragileCheckbox.classList.remove('checked');
    fragileCheckbox.textContent = '';
}

// Функция сброса формы создания партии
function resetBatchForm() {
    addBatchForm.reset();
}

// Функция сброса формы добавления коробки
function resetBoxForm() {
    addBoxForm.reset();
}

// Функция обновления выбора партий в форме добавления предмета
function updateBatchSelect() {
    itemBatchSelect.innerHTML = '<option value="" disabled selected>Выберите партию</option>';
    
    batches.forEach(batch => {
        const option = document.createElement('option');
        option.value = batch.id;
        option.textContent = `${batch.name} (${batch.currentItems}/${batch.itemLimit})`;
        itemBatchSelect.appendChild(option);
    });
    
    // Если нет партий, добавляем сообщение
    if (batches.length === 0) {
        const option = document.createElement('option');
        option.value = "";
        option.textContent = "Сначала создайте партию доставки";
        option.disabled = true;
        itemBatchSelect.appendChild(option);
    }
}

// Функция обновления выбора партий в форме добавления коробки
function updateBatchSelectForBoxes() {
    boxBatchSelect.innerHTML = '<option value="" disabled selected>Выберите партию</option>';
    
    batches.forEach(batch => {
        const option = document.createElement('option');
        option.value = batch.id;
        option.textContent = batch.name;
        boxBatchSelect.appendChild(option);
    });
    
    // Если нет партий, добавляем сообщение
    if (batches.length === 0) {
        const option = document.createElement('option');
        option.value = "";
        option.textContent = "Сначала создайте партию доставки";
        option.disabled = true;
        boxBatchSelect.appendChild(option);
    }
}

// Функция получения русского названия комнаты
function getRoomName(roomValue) {
    const roomNames = {
        'living-room': 'Гостиная',
        'kitchen': 'Кухня',
        'bedroom': 'Спальня',
        'office': 'Кабинет',
        'bathroom': 'Ванная'
    };
    return roomNames[roomValue] || roomValue;
}

// Функция получения русского названия категории
function getCategoryName(categoryValue) {
    const categoryNames = {
        'furniture': 'Мебель',
        'electronics': 'Электроника',
        'clothing': 'Одежда',
        'books': 'Книги',
        'kitchen': 'Кухонные принадлежности'
    };
    return categoryNames[categoryValue] || categoryValue;
}

// Функция получения названия приоритета
function getPriorityName(priorityValue) {
    const priorityNames = {
        'urgent': 'Срочно',
        'medium': 'Средний',
        'low': 'Можно подождать'
    };
    return priorityNames[priorityValue] || priorityValue;
}

// Функция получения класса приоритета
function getPriorityClass(priorityValue) {
    const priorityClasses = {
        'urgent': 'priority-urgent',
        'medium': 'priority-medium',
        'low': 'priority-low'
    };
    return priorityClasses[priorityValue] || 'priority-medium';
}

// Функция получения класса текста приоритета
function getPriorityTextClass(priorityValue) {
    const priorityTextClasses = {
        'urgent': 'priority-urgent-text',
        'medium': 'priority-medium-text',
        'low': 'priority-low-text'
    };
    return priorityTextClasses[priorityValue] || 'priority-medium-text';
}

// Функция получения названия статуса коробки
function getBoxStatusName(statusValue) {
    const statusNames = {
        'empty': 'Пустая',
        'assembling': 'Комплектуется',
        'ready': 'Готова'
    };
    return statusNames[statusValue] || statusValue;
}

// Функция получения класса статуса коробки
function getBoxStatusClass(statusValue) {
    const statusClasses = {
        'empty': 'empty',
        'assembling': 'assembling',
        'ready': 'ready'
    };
    return statusClasses[statusValue] || 'empty';
}

// Функция получения класса иконки коробки
function getBoxIconClass(roomValue) {
    const iconClasses = {
        'kitchen': 'orange',
        'bedroom': 'orange',
        'bathroom': 'blue',
        'living-room': 'green',
        'office': 'green'
    };
    return iconClasses[roomValue] || 'green';
}

// Функция форматирования даты
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// Функция обновления отображения инвентаря
function updateInventoryDisplay() {
    // Очистка списка
    itemsContainer.innerHTML = '';
    
    // Получение отфильтрованных предметов
    const filteredItems = getFilteredItems();
    
    // Применение поиска, если есть запрос
    const searchedItems = applySearch(filteredItems);
    
    // Скрываем все сообщения по умолчанию
    emptyState.classList.remove('active');
    searchNoResults.classList.remove('active');
    
    if (searchedItems.length === 0) {
        if (currentSearchQuery && filteredItems.length > 0) {
            // Показываем сообщение о том, что по поиску ничего не найдено
            searchNoResults.classList.add('active');
            itemsContainer.appendChild(searchNoResults);
        } else if (filteredItems.length === 0) {
            // Показываем сообщение о пустом списке
            emptyState.classList.add('active');
            itemsContainer.appendChild(emptyState);
        }
    } else {
        // Добавление каждого предмета в список
        searchedItems.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'item-card';
            
            // Находим партию предмета
            const itemBatch = batches.find(batch => batch.id === item.batchId);
            const batchName = itemBatch ? itemBatch.name : 'Не назначена';
            
            // Определение цвета иконки
            const iconClass = item.packed ? 'item-icon green' : 'item-icon gray';
            
            // Определение класса для тега упаковки
            const packedTagClass = item.packed ? 'tag green' : 'tag gray';
            const packedTagText = item.packed ? 'Упаковано' : 'Не упаковано';
            
            // Определяем иконку в зависимости от категории
            let itemIcon = '📦';
            switch(item.category) {
                case 'furniture': itemIcon = '🪑'; break;
                case 'electronics': itemIcon = '📱'; break;
                case 'clothing': itemIcon = '👕'; break;
                case 'books': itemIcon = '📚'; break;
                case 'kitchen': itemIcon = '🍽️'; break;
            }
            
            // Создание HTML для карточки предмета
            itemCard.innerHTML = `
                <div class="${iconClass}">${itemIcon}</div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-room">${getRoomName(item.room)}</div>
                    <div class="item-tags">
                        <div class="tag white">${getCategoryName(item.category)}</div>
                        <div class="tag red">${batchName}</div>
                        <div class="${packedTagClass} packed-tag" data-item-id="${item.id}">${packedTagText}</div>
                    </div>
                </div>
                ${item.fragile ? '<div class="fragile-indicator">Хрупкое</div>' : ''}
            `;
            
            itemsContainer.appendChild(itemCard);
        });
        
        // Добавление обработчиков событий для тегов упаковки
        document.querySelectorAll('.packed-tag').forEach(tag => {
            tag.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-item-id'));
                toggleItemPackedStatus(itemId);
            });
        });
    }
    
    // Обновление статистики
    updateInventoryStatistics();
}

// Функция обновления отображения партий
function updateBatchesDisplay() {
    // Очистка списка
    batchesContainer.innerHTML = '';
    
    // Скрываем сообщение о пустом списке по умолчанию
    batchesEmptyState.classList.remove('active');
    
    if (batches.length === 0) {
        // Показываем сообщение о пустом списке
        batchesEmptyState.classList.add('active');
        batchesContainer.appendChild(batchesEmptyState);
    } else {
        // Добавление каждой партии в список
        batches.forEach((batch, index) => {
            const batchCard = document.createElement('div');
            batchCard.className = 'batch-card';
            batchCard.dataset.batchId = batch.id;
            
            // Расчет прогресса
            const progressPercentage = batch.itemLimit > 0 ? (batch.currentItems / batch.itemLimit) * 100 : 0;
            
            // Определение номера партии
            const batchNumber = index + 1;
            let batchNumberClass = 'batch-number-1';
            if (batchNumber === 2) batchNumberClass = 'batch-number-2';
            else if (batchNumber === 3) batchNumberClass = 'batch-number-3';
            else if (batchNumber >= 4) batchNumberClass = 'batch-number-4';
            
            // Получаем предметы этой партии
            const batchItems = inventoryItems.filter(item => item.batchId === batch.id);
            
            // Создание HTML для карточки партии
            batchCard.innerHTML = `
                <div class="batch-number ${batchNumberClass}">${batchNumber}</div>
                <div class="batch-content">
                    <div class="batch-title">${batch.name}</div>
                    <div class="batch-date">${formatDate(batch.date)} ${batch.time}</div>
                    <div class="batch-address">${batch.address}</div>
                    
                    <div class="batch-packed-label">Упаковано</div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${progressPercentage}%"></div>
                    </div>
                    <div class="batch-packed-count">${batch.currentItems} из ${batch.itemLimit} предметов</div>
                    
                    <div class="batch-action ${batch.status === 'delivered' ? 'batch-action-delivered' : 'batch-action-details'}">
                        <div class="batch-action-text ${batch.status !== 'delivered' ? 'batch-action-text-blue' : ''}">
                            ${batch.status === 'delivered' ? 'Доставлено' : 'Посмотреть детали'}
                        </div>
                    </div>
                    
                    <div class="batch-priority ${getPriorityClass(batch.priority)}">
                        <div class="priority-text ${getPriorityTextClass(batch.priority)}">${getPriorityName(batch.priority)}</div>
                    </div>
                    
                    <div class="batch-items-container">
                        <div class="batch-items-title">Предметы в партии:</div>
                        <div class="batch-items-list">
                            ${batchItems.length > 0 ? 
                                batchItems.map(item => {
                                    let itemIcon = '📦';
                                    switch(item.category) {
                                        case 'furniture': itemIcon = '🪑'; break;
                                        case 'electronics': itemIcon = '📱'; break;
                                        case 'clothing': itemIcon = '👕'; break;
                                        case 'books': itemIcon = '📚'; break;
                                        case 'kitchen': itemIcon = '🍽️'; break;
                                    }
                                    return `
                                        <div class="batch-item">
                                            <div class="batch-item-icon ${item.packed ? 'green' : 'gray'}">${itemIcon}</div>
                                            <div class="batch-item-details">
                                                <div class="batch-item-name">${item.name}</div>
                                                <div class="batch-item-room">${getRoomName(item.room)}</div>
                                            </div>
                                            ${item.fragile ? '<div class="batch-item-fragile">Хрупкое</div>' : ''}
                                        </div>
                                    `;
                                }).join('') : 
                                '<div style="padding: 20px; text-align: center; color: #9F9F9F;">В этой партии пока нет предметов</div>'
                            }
                        </div>
                    </div>
                </div>
            `;
            
            batchesContainer.appendChild(batchCard);
            
            // Добавляем обработчик события для кнопки "Посмотреть детали"
            const detailsButton = batchCard.querySelector('.batch-action-details');
            if (detailsButton) {
                detailsButton.addEventListener('click', function() {
                    const itemsContainer = batchCard.querySelector('.batch-items-container');
                    itemsContainer.classList.toggle('expanded');
                    
                    // Обновляем текст кнопки
                    const buttonText = batchCard.querySelector('.batch-action-text');
                    if (itemsContainer.classList.contains('expanded')) {
                        buttonText.textContent = 'Скрыть детали';
                    } else {
                        buttonText.textContent = 'Посмотреть детали';
                    }
                });
            }
        });
    }
    
    // Обновление статистики партий
    updateBatchesStatistics();
}

// Функция обновления отображения коробок
function updateBoxesDisplay() {
    // Очистка списка
    boxesList.innerHTML = '';
    
    // Получаем поисковый запрос
    const searchQuery = boxesSearchInput.value.toLowerCase().trim();
    
    // Фильтруем коробки по поисковому запросу
    let filteredBoxes = boxes;
    if (searchQuery) {
        filteredBoxes = boxes.filter(box => 
            box.name.toLowerCase().includes(searchQuery) || 
            getRoomName(box.room).toLowerCase().includes(searchQuery)
        );
    }
    
    // Скрываем сообщение о пустом списке по умолчанию
    boxesEmptyState.classList.remove('active');
    
    if (filteredBoxes.length === 0) {
        // Показываем сообщение о пустом списке
        boxesEmptyState.classList.add('active');
        boxesList.appendChild(boxesEmptyState);
    } else {
        // Добавление каждой коробки в список
        filteredBoxes.forEach(box => {
            const boxCard = document.createElement('div');
            boxCard.className = 'box-card';
            boxCard.dataset.boxId = box.id;
            
            // Определяем класс иконки
            const iconClass = getBoxIconClass(box.room);
            
            // Определяем текст для количества предметов
            let itemsCountText = `${box.itemsCount} предметов`;
            if (box.status === 'empty') {
                itemsCountText = 'Пустая коробка';
            }
            
            // Определяем класс для текста количества предметов
            const itemsCountClass = box.status === 'empty' ? 'empty' : '';
            
            // Создание HTML для карточки коробки
            boxCard.innerHTML = `
                <div class="box-icon ${iconClass}">
                    <div class="box-icon-inner">${box.icon}</div>
                </div>
                <h2 class="box-title">Коробка №${box.id} - ${getRoomName(box.room)}</h2>
                <div class="box-room">${getRoomName(box.room)}</div>
                ${box.description ? `<div class="box-items-list">${box.description}</div>` : ''}
                <div class="box-items-count ${itemsCountClass}">${itemsCountText}</div>
                <div class="show-qr-button" data-box-id="${box.id}">
                    <div class="qr-icon">📱</div>
                    <span class="show-qr-text">Показать QR-код</span>
                </div>
                <div class="box-status-tag ${getBoxStatusClass(box.status)}">
                    <span class="status-text">${getBoxStatusName(box.status)}</span>
                </div>
            `;
            
            boxesList.appendChild(boxCard);
            
            // Добавляем обработчик события для кнопки "Показать QR-код"
            const qrButton = boxCard.querySelector('.show-qr-button');
            qrButton.addEventListener('click', function() {
                const boxId = this.getAttribute('data-box-id');
                showBoxQRCode(boxId);
            });
        });
    }
    
    // Обновление статистики коробок
    updateBoxesStatistics();
}

// Функция обновления отображения распаковки
function updateUnpackingDisplay() {
    // Очистка списка
    unpackingBoxesContainer.innerHTML = '';
    
    // Скрываем сообщение о пустом списке по умолчанию
    unpackingEmptyState.classList.remove('active');
    
    if (boxes.length === 0) {
        // Показываем сообщение о пустом списке
        unpackingEmptyState.classList.add('active');
        unpackingBoxesContainer.appendChild(unpackingEmptyState);
        
        // Обновляем статистику распаковки
        unpackingSubtitle.textContent = '0 из 0 коробок распаковано';
        unpackingProgressText.textContent = '0% выполнено';
        unpackingProgressBar.style.width = '0%';
    } else {
        // Считаем распакованные коробки
        const unpackedBoxes = boxes.filter(box => box.unpacked).length;
        const totalBoxes = boxes.length;
        const progressPercentage = (unpackedBoxes / totalBoxes) * 100;
        
        // Обновляем статистику распаковки
        unpackingSubtitle.textContent = `${unpackedBoxes} из ${totalBoxes} коробок распаковано`;
        unpackingProgressText.textContent = `${Math.round(progressPercentage)}% выполнено`;
        unpackingProgressBar.style.width = `${progressPercentage}%`;
        
        // Добавление каждой коробки в список
        boxes.forEach(box => {
            const boxCard = document.createElement('div');
            boxCard.className = 'box-card';
            boxCard.dataset.boxId = box.id;
            
            // Определяем класс иконки
            const iconClass = box.unpacked ? 'green' : 'orange';
            
            // Определяем содержимое иконки
            const iconInner = box.unpacked ? '✓' : box.icon;
            
            // Создание HTML для карточки коробки в распаковке
            boxCard.innerHTML = `
                <div class="box-icon ${iconClass}">
                    ${box.unpacked ? '<div class="check-icon">✓</div>' : `<div class="box-icon-inner">${iconInner}</div>`}
                </div>
                <h2 class="box-title">Коробка №${box.id} - ${getRoomName(box.room)}</h2>
                <div class="box-room">${getRoomName(box.room)}</div>
                
                ${box.items.map((item, index) => `
                    <div class="item-dot" style="top: ${140 + index * 41}px;"></div>
                    <div class="box-items" style="top: ${132 + index * 41}px;">${item}</div>
                `).join('')}
                
                <div class="batch-tag">
                    <span class="batch-text">Партия №${box.batchId}</span>
                </div>
                
                ${box.unpacked ? `
                    <div class="unpacked-tag">
                        <span class="unpacked-text">Распаковано</span>
                    </div>
                ` : ''}
                
                <div class="box-id">
                    <span class="box-id-text">BOX-${box.id.toString().padStart(3, '0')}</span>
                </div>
            `;
            
            unpackingBoxesContainer.appendChild(boxCard);
            
            // Добавляем обработчик события для клика на коробку (отметить как распакованную)
            if (!box.unpacked) {
                boxCard.addEventListener('click', function() {
                    markBoxAsUnpacked(box.id);
                });
            }
        });
        
        // Проверяем условие для показа окна завершения переезда
        checkAndShowFinishMoveModal();
    }
}

// Функция показа QR-кода коробки
function showBoxQRCode(boxId) {
    const box = boxes.find(b => b.id == boxId);
    if (box) {
        // Заполняем данные в модальном окне
        document.getElementById('qrCodeNumber').textContent = `BOX${box.id.toString().padStart(3, '0')}`;
        document.getElementById('qrCodeRoomLabel').textContent = getRoomName(box.room);
        document.getElementById('qrCodeBoxTitle').textContent = `Коробка №${box.id} - ${getRoomName(box.room)}`;
        
        // Показываем описание содержимого коробки, которое было добавлено при создании
        const description = box.description || 'Описание не указано';
        document.getElementById('qrCodeContent').textContent = `Содержимое: ${description}`;
        
        // Показываем модальное окно
        document.getElementById('qrCodeModalOverlay').style.display = 'flex';
    }
}

// Функция отметки коробки как распакованной
async function markBoxAsUnpacked(boxId) {
    const boxIndex = boxes.findIndex(b => b.id == boxId);
    if (boxIndex !== -1) {
        try {
            // Переключаем статус распаковки через API
            const result = await boxesAPI.toggleUnpacked(boxId);
            
            // Обновляем локальный массив
            boxes[boxIndex].unpacked = result.unpacked;
            
            updateUnpackingDisplay();
            
            // Проверяем условие для показа окна завершения переезда
            checkAndShowFinishMoveModal();
        } catch (error) {
            console.error('Error marking box as unpacked:', error);
            alert('Ошибка при обновлении статуса коробки');
        }
    }
}

// Функция применения поиска к списку предметов
function applySearch(items) {
    if (!currentSearchQuery) {
        return items;
    }
    
    return items.filter(item => {
        const itemName = item.name.toLowerCase();
        const roomName = getRoomName(item.room).toLowerCase();
        
        return itemName.includes(currentSearchQuery) || roomName.includes(currentSearchQuery);
    });
}

// Функция переключения статуса упаковки предмета
async function toggleItemPackedStatus(itemId) {
    const itemIndex = inventoryItems.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        try {
            // Переключаем статус упаковки через API
            const result = await itemsAPI.togglePacked(itemId);
            
            // Обновляем локальный массив
            inventoryItems[itemIndex].packed = result.packed;
            
            // Обновляем отображение
            updateInventoryDisplay();
            updateProfileData();
        } catch (error) {
            console.error('Error toggling item packed status:', error);
            alert('Ошибка при обновлении статуса предмета');
        }
    }
}

// Функция получения отфильтрованных предметов
function getFilteredItems() {
    if (currentFilter === 'all') {
        return inventoryItems;
    } else {
        return inventoryItems.filter(item => item.category === currentFilter);
    }
}

// Функция обновления статистики инвентаря
function updateInventoryStatistics() {
    const total = inventoryItems.length;
    const packed = inventoryItems.filter(item => item.packed).length;
    const fragile = inventoryItems.filter(item => item.fragile).length;
    
    itemsCount.textContent = `${total} предмет${getPluralForm(total)}`;
    totalCount.textContent = total;
    packedCount.textContent = packed;
    fragileCount.textContent = fragile;
}

// Функция обновления статистики партий
function updateBatchesStatistics() {
    const total = batches.length;
    const delivered = batches.filter(batch => batch.status === 'delivered').length;
    const inTransit = batches.filter(batch => batch.status === 'in-transit').length;
    const planned = batches.filter(batch => batch.status === 'planned').length;
    
    batchesCount.textContent = `Запланировано ${total} партий`;
    deliveredCount.textContent = `${delivered} партий`;
    inTransitCount.textContent = `${inTransit} партий`;
    plannedCount.textContent = `${planned} партий`;
}

// Функция обновления статистики коробок
function updateBoxesStatistics() {
    const total = boxes.length;
    const ready = boxes.filter(box => box.status === 'ready').length;
    const inWork = boxes.filter(box => box.status === 'assembling').length;
    
    boxesCount.textContent = `${total} коробок создано`;
    totalBoxes.textContent = total;
    readyBoxes.textContent = ready;
    inWorkBoxes.textContent = inWork;
}

// Функция для правильного склонения слова "предмет"
function getPluralForm(number) {
    if (number % 10 === 1 && number % 100 !== 11) {
        return '';
    } else if ([2, 3, 4].includes(number % 10) && ![12, 13, 14].includes(number % 100)) {
        return 'а';
    } else {
        return 'ов';
    }
}

// Обработка фильтров
filters.forEach(filter => {
    filter.addEventListener('click', function() {
        // Удаление активного класса у всех фильтров
        filters.forEach(f => f.classList.remove('active'));
        // Добавление активного класса к выбранному фильтру
        this.classList.add('active');
        
        // Установка текущего фильтра
        currentFilter = this.dataset.filter;
        
        // Применение фильтра
        updateInventoryDisplay();
    });
});

// ========== ФУНКЦИИ ДЛЯ ЗАДАЧ ==========

// Открытие модального окна добавления задачи
addTaskButton.addEventListener('click', function() {
    // Установить дату по умолчанию на завтра
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('taskDate').valueAsDate = tomorrow;
    
    taskModalOverlay.style.display = 'flex';
});

// Закрытие модального окна добавления задачи
closeTaskModal.addEventListener('click', function() {
    taskModalOverlay.style.display = 'none';
    resetTaskForm();
});

// Закрытие модального окна добавления задачи при клике вне его
taskModalOverlay.addEventListener('click', function(e) {
    if (e.target === this) {
        taskModalOverlay.style.display = 'none';
        resetTaskForm();
    }
});

// Обработка формы добавления задачи
addTaskForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const taskTitle = document.getElementById('taskTitle').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const taskSection = document.getElementById('taskSection').value;
    const taskDate = document.getElementById('taskDate').value;
    
    try {
        // Создание новой задачи через API
        const newTask = await tasksAPI.create({
            title: taskTitle,
            description: taskDescription,
            section: taskSection,
            date: taskDate,
            completed: false
        });
        
        // Добавление задачи в локальный массив
        tasks.push(newTask);
        
        // Обновление интерфейса
        updateTasksDisplay();
        
        // Закрытие модального окна и сброс формы
        taskModalOverlay.style.display = 'none';
        resetTaskForm();
    } catch (error) {
        console.error('Error creating task:', error);
        alert('Ошибка при добавлении задачи');
    }
});

// Функция сброса формы добавления задачи
function resetTaskForm() {
    addTaskForm.reset();
    
    // Установить дату по умолчанию на завтра
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('taskDate').valueAsDate = tomorrow;
}

// Функция форматирования даты для задач
function formatTaskDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    // Русские названия месяцев
    const monthNames = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    
    return `${day} ${monthNames[date.getMonth()]}`;
}

// Функция получения русского названия раздела
function getSectionName(sectionValue) {
    const sectionNames = {
        'before': 'До переезда',
        'during': 'Во время переезда',
        'after': 'После переезда'
    };
    return sectionNames[sectionValue] || sectionValue;
}

// Функция получения правильной формы слова "задача"
function getTaskPluralForm(number) {
    if (number % 10 === 1 && number % 100 !== 11) {
        return 'задача';
    } else if ([2, 3, 4].includes(number % 10) && ![12, 13, 14].includes(number % 100)) {
        return 'задачи';
    } else {
        return 'задач';
    }
}

// Функция обновления отображения задач
function updateTasksDisplay() {
    // Очистка всех списков задач
    beforeMovingTasks.innerHTML = '';
    duringMovingTasks.innerHTML = '';
    afterMovingTasks.innerHTML = '';
    
    // Фильтрация задач
    let filteredTasks = tasks;
    if (currentTasksFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentTasksFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    // Группировка задач по разделам
    const beforeTasks = filteredTasks.filter(task => task.section === 'before');
    const duringTasks = filteredTasks.filter(task => task.section === 'during');
    const afterTasks = filteredTasks.filter(task => task.section === 'after');
    
    // Добавление задач в раздел "До переезда"
    if (beforeTasks.length > 0) {
        beforeTasks.forEach(task => {
            beforeMovingTasks.appendChild(createTaskCard(task));
        });
    } else {
        beforeMovingTasks.innerHTML = '<div class="empty-section">Нет задач в этом разделе. Добавьте первую задачу!</div>';
    }
    
    // Добавление задач в раздел "Во время переезда"
    if (duringTasks.length > 0) {
        duringTasks.forEach(task => {
            duringMovingTasks.appendChild(createTaskCard(task));
        });
    } else {
        duringMovingTasks.innerHTML = '<div class="empty-section">Нет задач в этом разделе. Добавьте первую задачу!</div>';
    }
    
    // Добавление задач в раздел "После переезда"
    if (afterTasks.length > 0) {
        afterTasks.forEach(task => {
            afterMovingTasks.appendChild(createTaskCard(task));
        });
    } else {
        afterMovingTasks.innerHTML = '<div class="empty-section">Нет задач в этом разделе. Добавьте первую задачу!</div>';
    }
    
    // Обновление статистики
    updateTasksStatistics();
}

// Функция создания карточки задачи
function createTaskCard(task) {
    const taskCard = document.createElement('div');
    taskCard.className = `task-card ${task.completed ? 'completed' : ''}`;
    taskCard.dataset.taskId = task.id;
    
    // Создание HTML для карточки задачи
    taskCard.innerHTML = `
        <div class="task-checkbox ${task.completed ? 'checked' : ''}">
            ${task.completed ? '✓' : ''}
        </div>
        <div class="task-content">
            <div class="task-title">${task.title}</div>
            ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
            <div class="task-date">${formatTaskDate(task.date)}</div>
        </div>
        <div class="task-delete" data-task-id="${task.id}">
            🗑️
        </div>
    `;
    
    // Добавление обработчика для чекбокса
    const checkbox = taskCard.querySelector('.task-checkbox');
    checkbox.addEventListener('click', function() {
        toggleTaskCompleted(task.id);
    });
    
    // Добавление обработчика для кнопки удаления
    const deleteButton = taskCard.querySelector('.task-delete');
    deleteButton.addEventListener('click', function(e) {
        e.stopPropagation();
        deleteTask(task.id);
    });
    
    return taskCard;
}

// Функция переключения статуса выполнения задачи
async function toggleTaskCompleted(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        try {
            // Переключаем статус выполнения через API
            const result = await tasksAPI.toggleCompleted(taskId);
            
            // Обновляем локальный массив
            tasks[taskIndex].completed = result.completed;
            
            // Обновляем отображение
            updateTasksDisplay();
        } catch (error) {
            console.error('Error toggling task completed:', error);
            alert('Ошибка при обновлении статуса задачи');
        }
    }
}

// Функция удаления задачи
async function deleteTask(taskId) {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
        try {
            // Удаляем задачу через API
            await tasksAPI.delete(taskId);
            
            // Удаляем задачу из локального массива
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                tasks.splice(taskIndex, 1);
            }
            
            // Обновляем отображение
            updateTasksDisplay();
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Ошибка при удалении задачи');
        }
    }
}

// Функция обновления статистики задач
function updateTasksStatistics() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const remaining = total - completed;
    
    // Обновление текста статистики
    tasksSummary.textContent = `${completed} из ${total} выполнена`;
    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    remainingTasks.textContent = remaining;
    
    // Обновление подзаголовка с правильной формой слова
    const completedText = getTaskPluralForm(completed);
    const totalText = getTaskPluralForm(total);
    tasksSummary.textContent = `${completed} ${completedText} из ${total} ${totalText} выполнено`;
}

// Обработка вкладок фильтрации задач
tasksTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        // Удаление активного класса у всех вкладок
        tasksTabs.forEach(t => {
            t.classList.remove('active');
            t.classList.add('inactive');
        });
        
        // Добавление активного класса к выбранной вкладке
        this.classList.remove('inactive');
        this.classList.add('active');
        
        // Установка текущего фильтра
        currentTasksFilter = this.dataset.filter;
        
        // Применение фильтра
        updateTasksDisplay();
    });
});

// ========== ФУНКЦИИ ДЛЯ ПРОФИЛЯ ==========

// Функция обновления данных профиля
async function updateProfileData() {
    // Обновляем статистику переезда
    const totalItems = inventoryItems.length;
    const totalBatches = batches.length;
    
    profileTotalItems.textContent = totalItems;
    profileTotalBatches.textContent = totalBatches;
    
    // Обновляем адрес текущего переезда (берем из первой партии)
    if (batches.length > 0) {
        const firstBatch = batches[0];
        currentAddress.textContent = firstBatch.address;
        
        // Обновляем дату начала переезда
        const startDate = new Date(firstBatch.date);
        const formattedDate = startDate.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        moveStartDate.textContent = `Начат: ${formattedDate}`;
    } else {
        currentAddress.textContent = 'Не указан';
        moveStartDate.textContent = 'Начат: --';
    }
    
    // Загружаем историю переездов из API
    try {
        const history = await moveHistoryAPI.getAll();
        moveHistory = history;
        
        // Показываем/скрываем историю переездов
        if (moveHistory.length > 0) {
            // Показываем последний завершенный переезд
            const lastMove = moveHistory[moveHistory.length - 1];
            historyAddress.textContent = lastMove.address;
            
            const endDate = new Date(lastMove.endDate);
            const formattedDate = endDate.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            historyDate.textContent = `Завершен: ${formattedDate}`;
            
            historyStats.textContent = `${lastMove.totalItems} вещей, ${lastMove.totalBatches} партий, ${lastMove.totalBoxes} коробок`;
            
            historyCard.style.display = 'flex';
            historyEmpty.style.display = 'none';
        } else {
            historyCard.style.display = 'none';
            historyEmpty.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading move history:', error);
    }
}

// Обработка кнопки выхода
logoutButton.addEventListener('click', function() {
    if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
        // Здесь должна быть логика выхода из аккаунта
        alert('Выход из аккаунта выполнен');
        // В реальном приложении здесь был бы редирект на страницу входа
    }
});

// ========== ФУНКЦИИ ДЛЯ НОВЫХ МОДАЛЬНЫХ ОКОН ==========

// Обработка открытия модального окна "Как работает приложение"
showHelpButton.addEventListener('click', function() {
    helpModalOverlay.style.display = 'flex';
});

// Обработка закрытия модального окна "Как работает приложение"
closeHelpModal.addEventListener('click', function() {
    helpModalOverlay.style.display = 'none';
});

// Закрытие модального окна "Как работает приложение" при клике вне его
helpModalOverlay.addEventListener('click', function(e) {
    if (e.target === this) {
        helpModalOverlay.style.display = 'none';
    }
});

// Обработка закрытия модального окна "Завершить переезд"
closeFinishMoveModal.addEventListener('click', function() {
    finishMoveModalOverlay.style.display = 'none';
});

// Закрытие модального окна "Завершить переезд" при клике вне его
finishMoveModalOverlay.addEventListener('click', function(e) {
    if (e.target === this) {
        finishMoveModalOverlay.style.display = 'none';
    }
});

// Обработка модального окна QR-кода
qrDoneButton.addEventListener('click', function() {
    qrCodeModalOverlay.style.display = 'none';
});

qrCodeModalOverlay.addEventListener('click', function(e) {
    if (e.target === this) {
        qrCodeModalOverlay.style.display = 'none';
    }
});

qrPrintButton.addEventListener('click', function() {
    window.print();
});

qrSaveButton.addEventListener('click', function() {
    // Здесь можно добавить функционал сохранения как изображение
    alert('Функция сохранения как изображение будет реализована');
});

qrShareButton.addEventListener('click', function() {
    // Здесь можно добавить функционал поделиться
    alert('Функция поделиться будет реализована');
});

// Обработка кнопки "Отмена" в окне завершения переезда
cancelFinishMove.addEventListener('click', function() {
    finishMoveModalOverlay.style.display = 'none';
});

// Обработка кнопки "Завершить" в окне завершения переезда
confirmFinishMove.addEventListener('click', async function() {
    finishMoveModalOverlay.style.display = 'none';
    hasShownFinishMoveModal = true;
    
    try {
        // Сохраняем текущий переезд в историю через API
        const currentMove = {
            address: batches.length > 0 ? batches[0].address : 'Не указан',
            startDate: batches.length > 0 ? batches[0].date : new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            totalItems: inventoryItems.length,
            totalBatches: batches.length,
            totalBoxes: boxes.length,
            completedTasks: tasks.filter(task => task.completed).length,
            totalTasks: tasks.length
        };
        
        await finishMoveAPI.finish(currentMove);
        
        // Очищаем все локальные данные
        inventoryItems = [];
        batches = [];
        boxes = [];
        tasks = [];
        currentFilter = 'all';
        currentSearchQuery = '';
        currentTasksFilter = 'all';
        
        // Обновляем все отображения
        updateInventoryDisplay();
        updateBoxesDisplay();
        updateBatchesDisplay();
        updateTasksDisplay();
        updateUnpackingDisplay();
        await updateProfileData();
        
        alert('Переезд успешно завершен! Данные перемещены в историю.');
    } catch (error) {
        console.error('Error finishing move:', error);
        alert('Ошибка при завершении переезда');
    }
});

// Функция проверки и показа модального окна завершения переезда
function checkAndShowFinishMoveModal() {
    // Проверяем условие: все коробки распакованы
    const allBoxesUnpacked = boxes.length > 0 && boxes.every(box => box.unpacked);
    
    // Показываем окно только если все коробки распакованы и окно еще не показывалось
    if (allBoxesUnpacked && !hasShownFinishMoveModal) {
        // Добавляем небольшую задержку для лучшего UX
        setTimeout(() => {
            finishMoveModalOverlay.style.display = 'flex';
        }, 500);
    }
}

// ========== ОБЩИЕ ФУНКЦИИ ==========

// Функция навигации между страницами
function showPage(pageId) {
    // Скрыть все страницы
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Показать выбранную страницу
    document.getElementById(pageId).classList.add('active');
    
    // Обновить активные элементы меню
    updateActiveMenu(pageId);
    
    // Если переходим на страницу инвентаря, обновляем отображение
    if (pageId === 'inventory-page') {
        updateInventoryDisplay();
    }
    
    // Если переходим на страницу коробок, обновляем отображение
    if (pageId === 'boxes-page') {
        updateBoxesDisplay();
    }
    
    // Если переходим на страницу партий, обновляем отображение
    if (pageId === 'delivery-page') {
        updateBatchesDisplay();
    }
    
    // Если переходим на страницу задач, обновляем отображение
    if (pageId === 'tasks-page') {
        updateTasksDisplay();
    }
    
    // Если переходим на страницу распаковки, обновляем отображение
    if (pageId === 'unpacking-page') {
        updateUnpackingDisplay();
    }
    
    // Если переходим на страницу профиля, обновляем данные
    if (pageId === 'profile-page') {
        updateProfileData();
    }
}

// Функция обновления активного меню
function updateActiveMenu(activePage) {
    // Сбросить все элементы меню
    const menuPages = ['inventory', 'boxes', 'scanner', 'delivery', 'unpacking', 'tasks', 'profile'];
    
    menuPages.forEach(page => {
        const menuIcon = document.getElementById(`${page}-icon`);
        const menuText = document.getElementById(`${page}-text`);
        
        if (menuIcon && menuText) {
            menuIcon.classList.remove('active');
            menuIcon.classList.add('inactive');
            menuText.classList.remove('active');
            menuText.classList.add('inactive');
        }
    });
    
    // Установить активные элементы в зависимости от страницы
    const pageKey = activePage.replace('-page', '');
    const activeIcon = document.getElementById(`${pageKey}-icon`);
    const activeText = document.getElementById(`${pageKey}-text`);
    
    if (activeIcon && activeText) {
        activeIcon.classList.remove('inactive');
        activeIcon.classList.add('active');
        activeText.classList.remove('inactive');
        activeText.classList.add('active');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async function() {
    // Установить текущую дату в форму создания партии
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('batchDate').value = today;
    
    // Установить текущее время в форму создания партии
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('batchTime').value = `${hours}:${minutes}`;
    
    // Установить дату по умолчанию для задач (завтра)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('taskDate').valueAsDate = tomorrow;
    
    // Загружаем все данные из API
    await loadAllData();
});