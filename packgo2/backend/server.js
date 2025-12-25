const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Database initialization
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
    // Items table
    db.run(`CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        room TEXT NOT NULL,
        category TEXT NOT NULL,
        batchId INTEGER,
        fragile INTEGER DEFAULT 0,
        packed INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (batchId) REFERENCES batches(id)
    )`);

    // Batches table
    db.run(`CREATE TABLE IF NOT EXISTS batches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        address TEXT NOT NULL,
        itemLimit INTEGER NOT NULL,
        currentItems INTEGER DEFAULT 0,
        priority TEXT NOT NULL,
        status TEXT DEFAULT 'planned',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Boxes table
    db.run(`CREATE TABLE IF NOT EXISTS boxes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        room TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL,
        batchId INTEGER,
        icon TEXT DEFAULT '📦',
        unpacked INTEGER DEFAULT 0,
        itemsCount INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (batchId) REFERENCES batches(id)
    )`);

    // Tasks table
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        section TEXT NOT NULL,
        date TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Move history table
    db.run(`CREATE TABLE IF NOT EXISTS move_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        address TEXT,
        startDate TEXT,
        endDate TEXT,
        totalItems INTEGER,
        totalBatches INTEGER,
        totalBoxes INTEGER,
        completedTasks INTEGER,
        totalTasks INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Profile table
    db.run(`CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT DEFAULT 'Фамилия Имя',
        email TEXT DEFAULT 'name@example.com',
        currentAddress TEXT,
        moveStartDate TEXT,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Initialize profile if not exists
    db.run(`INSERT OR IGNORE INTO profile (id, name, email) VALUES (1, 'Фамилия Имя', 'name@example.com')`);
});

// ========== ITEMS API ==========

// Get all items
app.get('/api/items', (req, res) => {
    db.all('SELECT * FROM items ORDER BY id DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows.map(row => ({
            ...row,
            fragile: row.fragile === 1,
            packed: row.packed === 1
        })));
    });
});

// Get item by ID
app.get('/api/items/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM items WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Item not found' });
            return;
        }
        res.json({
            ...row,
            fragile: row.fragile === 1,
            packed: row.packed === 1
        });
    });
});

// Create item
app.post('/api/items', (req, res) => {
    const { name, room, category, batchId, fragile, packed } = req.body;
    
    db.run(
        'INSERT INTO items (name, room, category, batchId, fragile, packed) VALUES (?, ?, ?, ?, ?, ?)',
        [name, room, category, batchId || null, fragile ? 1 : 0, packed ? 1 : 0],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            // Update batch currentItems count
            if (batchId) {
                db.run('UPDATE batches SET currentItems = currentItems + 1 WHERE id = ?', [batchId]);
            }
            
            res.json({
                id: this.lastID,
                name,
                room,
                category,
                batchId: batchId || null,
                fragile: fragile || false,
                packed: packed || false
            });
        }
    );
});

// Update item
app.put('/api/items/:id', (req, res) => {
    const id = req.params.id;
    const { name, room, category, batchId, fragile, packed } = req.body;
    
    // Get old batchId before update
    db.get('SELECT batchId FROM items WHERE id = ?', [id], (err, oldItem) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        db.run(
            'UPDATE items SET name = ?, room = ?, category = ?, batchId = ?, fragile = ?, packed = ? WHERE id = ?',
            [name, room, category, batchId || null, fragile ? 1 : 0, packed ? 1 : 0, id],
            function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                
                // Update batch counts if batchId changed
                if (oldItem && oldItem.batchId && oldItem.batchId !== batchId) {
                    db.run('UPDATE batches SET currentItems = currentItems - 1 WHERE id = ?', [oldItem.batchId]);
                }
                if (batchId && (!oldItem || oldItem.batchId !== batchId)) {
                    db.run('UPDATE batches SET currentItems = currentItems + 1 WHERE id = ?', [batchId]);
                }
                
                res.json({ success: true });
            }
        );
    });
});

// Toggle item packed status
app.patch('/api/items/:id/toggle-packed', (req, res) => {
    const id = req.params.id;
    db.get('SELECT packed FROM items WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Item not found' });
            return;
        }
        
        const newPacked = row.packed === 1 ? 0 : 1;
        db.run('UPDATE items SET packed = ? WHERE id = ?', [newPacked, id], (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ packed: newPacked === 1 });
        });
    });
});

// Delete item
app.delete('/api/items/:id', (req, res) => {
    const id = req.params.id;
    
    // Get batchId before deletion
    db.get('SELECT batchId FROM items WHERE id = ?', [id], (err, item) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        db.run('DELETE FROM items WHERE id = ?', [id], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            // Update batch currentItems count
            if (item && item.batchId) {
                db.run('UPDATE batches SET currentItems = currentItems - 1 WHERE id = ?', [item.batchId]);
            }
            
            res.json({ success: true });
        });
    });
});

// ========== BATCHES API ==========

// Get all batches
app.get('/api/batches', (req, res) => {
    db.all('SELECT * FROM batches ORDER BY id DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get batch by ID
app.get('/api/batches/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM batches WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Batch not found' });
            return;
        }
        res.json(row);
    });
});

// Create batch
app.post('/api/batches', (req, res) => {
    const { name, date, time, address, itemLimit, priority, status } = req.body;
    
    db.run(
        'INSERT INTO batches (name, date, time, address, itemLimit, priority, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, date, time, address, itemLimit, priority, status || 'planned'],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                id: this.lastID,
                name,
                date,
                time,
                address,
                itemLimit,
                currentItems: 0,
                priority,
                status: status || 'planned'
            });
        }
    );
});

// Update batch
app.put('/api/batches/:id', (req, res) => {
    const id = req.params.id;
    const { name, date, time, address, itemLimit, priority, status } = req.body;
    
    db.run(
        'UPDATE batches SET name = ?, date = ?, time = ?, address = ?, itemLimit = ?, priority = ?, status = ? WHERE id = ?',
        [name, date, time, address, itemLimit, priority, status, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ success: true });
        }
    );
});

// Delete batch
app.delete('/api/batches/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM batches WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true });
    });
});

// ========== BOXES API ==========

// Get all boxes
app.get('/api/boxes', (req, res) => {
    db.all('SELECT * FROM boxes ORDER BY id DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows.map(row => ({
            ...row,
            unpacked: row.unpacked === 1,
            items: [] // Items array can be populated separately if needed
        })));
    });
});

// Get box by ID
app.get('/api/boxes/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM boxes WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Box not found' });
            return;
        }
        res.json({
            ...row,
            unpacked: row.unpacked === 1,
            items: []
        });
    });
});

// Create box
app.post('/api/boxes', (req, res) => {
    const { name, room, description, status, batchId, icon } = req.body;
    
    // Determine icon based on room if not provided
    let boxIcon = icon || '📦';
    if (!icon) {
        switch(room) {
            case 'kitchen': boxIcon = '🍽️'; break;
            case 'bedroom': boxIcon = '🛏️'; break;
            case 'bathroom': boxIcon = '🛁'; break;
            case 'living-room': boxIcon = '📺'; break;
            case 'office': boxIcon = '📚'; break;
        }
    }
    
    db.run(
        'INSERT INTO boxes (name, room, description, status, batchId, icon) VALUES (?, ?, ?, ?, ?, ?)',
        [name, room, description || '', status, batchId || null, boxIcon],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                id: this.lastID,
                name,
                room,
                description: description || '',
                status,
                batchId: batchId || null,
                icon: boxIcon,
                unpacked: false,
                itemsCount: 0,
                items: []
            });
        }
    );
});

// Update box
app.put('/api/boxes/:id', (req, res) => {
    const id = req.params.id;
    const { name, room, description, status, batchId, icon, unpacked, itemsCount } = req.body;
    
    db.run(
        'UPDATE boxes SET name = ?, room = ?, description = ?, status = ?, batchId = ?, icon = ?, unpacked = ?, itemsCount = ? WHERE id = ?',
        [name, room, description || '', status, batchId || null, icon || '📦', unpacked ? 1 : 0, itemsCount || 0, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ success: true });
        }
    );
});

// Toggle box unpacked status
app.patch('/api/boxes/:id/toggle-unpacked', (req, res) => {
    const id = req.params.id;
    db.get('SELECT unpacked FROM boxes WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Box not found' });
            return;
        }
        
        const newUnpacked = row.unpacked === 1 ? 0 : 1;
        db.run('UPDATE boxes SET unpacked = ? WHERE id = ?', [newUnpacked, id], (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ unpacked: newUnpacked === 1 });
        });
    });
});

// Delete box
app.delete('/api/boxes/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM boxes WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true });
    });
});

// ========== TASKS API ==========

// Get all tasks
app.get('/api/tasks', (req, res) => {
    db.all('SELECT * FROM tasks ORDER BY id DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows.map(row => ({
            ...row,
            completed: row.completed === 1
        })));
    });
});

// Get task by ID
app.get('/api/tasks/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.json({
            ...row,
            completed: row.completed === 1
        });
    });
});

// Create task
app.post('/api/tasks', (req, res) => {
    const { title, description, section, date, completed } = req.body;
    
    db.run(
        'INSERT INTO tasks (title, description, section, date, completed) VALUES (?, ?, ?, ?, ?)',
        [title, description || '', section, date, completed ? 1 : 0],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                id: this.lastID,
                title,
                description: description || '',
                section,
                date,
                completed: completed || false
            });
        }
    );
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
    const id = req.params.id;
    const { title, description, section, date, completed } = req.body;
    
    db.run(
        'UPDATE tasks SET title = ?, description = ?, section = ?, date = ?, completed = ? WHERE id = ?',
        [title, description || '', section, date, completed ? 1 : 0, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ success: true });
        }
    );
});

// Toggle task completed status
app.patch('/api/tasks/:id/toggle-completed', (req, res) => {
    const id = req.params.id;
    db.get('SELECT completed FROM tasks WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        
        const newCompleted = row.completed === 1 ? 0 : 1;
        db.run('UPDATE tasks SET completed = ? WHERE id = ?', [newCompleted, id], (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ completed: newCompleted === 1 });
        });
    });
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM tasks WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true });
    });
});

// ========== PROFILE API ==========

// Get profile
app.get('/api/profile', (req, res) => {
    db.get('SELECT * FROM profile WHERE id = 1', (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            // Create default profile
            db.run('INSERT INTO profile (id, name, email) VALUES (1, ?, ?)', 
                ['Фамилия Имя', 'name@example.com'], 
                function(err) {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    res.json({ id: 1, name: 'Фамилия Имя', email: 'name@example.com', currentAddress: null, moveStartDate: null });
                }
            );
            return;
        }
        res.json(row);
    });
});

// Update profile
app.put('/api/profile', (req, res) => {
    const { name, email, currentAddress, moveStartDate } = req.body;
    
    db.run(
        'UPDATE profile SET name = ?, email = ?, currentAddress = ?, moveStartDate = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = 1',
        [name, email, currentAddress, moveStartDate],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ success: true });
        }
    );
});

// ========== MOVE HISTORY API ==========

// Get move history
app.get('/api/move-history', (req, res) => {
    db.all('SELECT * FROM move_history ORDER BY id DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Create move history entry
app.post('/api/move-history', (req, res) => {
    const { address, startDate, endDate, totalItems, totalBatches, totalBoxes, completedTasks, totalTasks } = req.body;
    
    db.run(
        'INSERT INTO move_history (address, startDate, endDate, totalItems, totalBatches, totalBoxes, completedTasks, totalTasks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [address, startDate, endDate, totalItems, totalBatches, totalBoxes, completedTasks, totalTasks],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                id: this.lastID,
                address,
                startDate,
                endDate,
                totalItems,
                totalBatches,
                totalBoxes,
                completedTasks,
                totalTasks
            });
        }
    );
});

// ========== STATISTICS API ==========

// Get statistics
app.get('/api/statistics', (req, res) => {
    db.all('SELECT COUNT(*) as total FROM items', (err, itemsResult) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        db.all('SELECT COUNT(*) as total FROM batches', (err, batchesResult) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            db.all('SELECT COUNT(*) as total FROM boxes', (err, boxesResult) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                
                db.all('SELECT COUNT(*) as total FROM tasks', (err, tasksResult) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    
                    res.json({
                        totalItems: itemsResult[0].total,
                        totalBatches: batchesResult[0].total,
                        totalBoxes: boxesResult[0].total,
                        totalTasks: tasksResult[0].total
                    });
                });
            });
        });
    });
});

// ========== FINISH MOVE API ==========

// Finish move (clear all data and save to history)
app.post('/api/finish-move', async (req, res) => {
    const { address, startDate, endDate } = req.body;
    
    // Get statistics before clearing
    db.get('SELECT COUNT(*) as total FROM items', (err, itemsResult) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        db.get('SELECT COUNT(*) as total FROM batches', (err, batchesResult) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            db.get('SELECT COUNT(*) as total FROM boxes', (err, boxesResult) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                
                db.get('SELECT COUNT(*) as completed FROM tasks WHERE completed = 1', (err, completedTasksResult) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    
                    db.get('SELECT COUNT(*) as total FROM tasks', (err, totalTasksResult) => {
                        if (err) {
                            res.status(500).json({ error: err.message });
                            return;
                        }
                        
                        // Save to history
                        db.run(
                            'INSERT INTO move_history (address, startDate, endDate, totalItems, totalBatches, totalBoxes, completedTasks, totalTasks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                            [
                                address,
                                startDate,
                                endDate,
                                itemsResult.total,
                                batchesResult.total,
                                boxesResult.total,
                                completedTasksResult.completed,
                                totalTasksResult.total
                            ],
                            function(err) {
                                if (err) {
                                    res.status(500).json({ error: err.message });
                                    return;
                                }
                                
                                // Clear all data
                                db.run('DELETE FROM items', (err) => {
                                    if (err) {
                                        res.status(500).json({ error: err.message });
                                        return;
                                    }
                                    
                                    db.run('DELETE FROM batches', (err) => {
                                        if (err) {
                                            res.status(500).json({ error: err.message });
                                            return;
                                        }
                                        
                                        db.run('DELETE FROM boxes', (err) => {
                                            if (err) {
                                                res.status(500).json({ error: err.message });
                                                return;
                                            }
                                            
                                            db.run('DELETE FROM tasks', (err) => {
                                                if (err) {
                                                    res.status(500).json({ error: err.message });
                                                    return;
                                                }
                                                
                                                res.json({ success: true });
                                            });
                                        });
                                    });
                                });
                            }
                        );
                    });
                });
            });
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});

