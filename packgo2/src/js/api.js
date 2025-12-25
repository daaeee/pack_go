// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

// Items API
export const itemsAPI = {
    getAll: () => apiCall('/items'),
    getById: (id) => apiCall(`/items/${id}`),
    create: (item) => apiCall('/items', {
        method: 'POST',
        body: JSON.stringify(item)
    }),
    update: (id, item) => apiCall(`/items/${id}`, {
        method: 'PUT',
        body: JSON.stringify(item)
    }),
    togglePacked: (id) => apiCall(`/items/${id}/toggle-packed`, {
        method: 'PATCH'
    }),
    delete: (id) => apiCall(`/items/${id}`, {
        method: 'DELETE'
    })
};

// Batches API
export const batchesAPI = {
    getAll: () => apiCall('/batches'),
    getById: (id) => apiCall(`/batches/${id}`),
    create: (batch) => apiCall('/batches', {
        method: 'POST',
        body: JSON.stringify(batch)
    }),
    update: (id, batch) => apiCall(`/batches/${id}`, {
        method: 'PUT',
        body: JSON.stringify(batch)
    }),
    delete: (id) => apiCall(`/batches/${id}`, {
        method: 'DELETE'
    })
};

// Boxes API
export const boxesAPI = {
    getAll: () => apiCall('/boxes'),
    getById: (id) => apiCall(`/boxes/${id}`),
    create: (box) => apiCall('/boxes', {
        method: 'POST',
        body: JSON.stringify(box)
    }),
    update: (id, box) => apiCall(`/boxes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(box)
    }),
    toggleUnpacked: (id) => apiCall(`/boxes/${id}/toggle-unpacked`, {
        method: 'PATCH'
    }),
    delete: (id) => apiCall(`/boxes/${id}`, {
        method: 'DELETE'
    })
};

// Tasks API
export const tasksAPI = {
    getAll: () => apiCall('/tasks'),
    getById: (id) => apiCall(`/tasks/${id}`),
    create: (task) => apiCall('/tasks', {
        method: 'POST',
        body: JSON.stringify(task)
    }),
    update: (id, task) => apiCall(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(task)
    }),
    toggleCompleted: (id) => apiCall(`/tasks/${id}/toggle-completed`, {
        method: 'PATCH'
    }),
    delete: (id) => apiCall(`/tasks/${id}`, {
        method: 'DELETE'
    })
};

// Profile API
export const profileAPI = {
    get: () => apiCall('/profile'),
    update: (profile) => apiCall('/profile', {
        method: 'PUT',
        body: JSON.stringify(profile)
    })
};

// Move History API
export const moveHistoryAPI = {
    getAll: () => apiCall('/move-history'),
    create: (history) => apiCall('/move-history', {
        method: 'POST',
        body: JSON.stringify(history)
    })
};

// Statistics API
export const statisticsAPI = {
    get: () => apiCall('/statistics')
};

// Finish Move API
export const finishMoveAPI = {
    finish: (data) => apiCall('/finish-move', {
        method: 'POST',
        body: JSON.stringify(data)
    })
};

