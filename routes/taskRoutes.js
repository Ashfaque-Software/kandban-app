import express from 'express';
import Task from '../models/Task.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create task
router.post('/', protect, async (req, res) => {
    const { title, description, dueDate } = req.body;
    try {
        const task = new Task({
            title,
            description,
            dueDate,
            user: req.user._id,
        });
        const createdTask = await task.save();
        res.status(201).json(createdTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all tasks (with pagination)
router.get('/', protect, async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    try {
        const count = await Task.countDocuments();
        const tasks = await Task.find()
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ tasks, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update task status
router.put('/:id', protect, async (req, res) => {
    const { status } = req.body;
    try {
        const task = await Task.findById(req.params.id);
        if (task) {
            task.status = status;
            const updatedTask = await task.save();
            res.json(updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete task
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task) {
            await task.remove();
            res.json({ message: 'Task removed' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
