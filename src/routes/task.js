const express = require('express');
const Task = require('../models/Task');
const router = new express.Router();
const sendError = require('../utils/sendError');
const auth = require('../middleware/auth');

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id,
    });

    try {
        await task.save();

        res.send((201, task));
    } catch (error) {
        sendError(res, error);
    }
});

router.get('/tasks', auth, async (req, res) => {
    try {
        const tasks = await Task.find({});

        res.send(tasks);
    } catch (e) {
        sendError(res, e);
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findById(_id);

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (e) {
        sendError(res, e);
    }
});

router.patch('/tasks/:id', auth,  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [ 'description', 'completed' ];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (e) {
        sendError(res, e);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete({ '_id': req.params.id, 'owner': req.user._id });

        if (!task) {
            res.status(404).send();
        }

        res.send(200, { data: true });
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;