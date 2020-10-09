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

        res.status(201).send(task);
    } catch (error) {
        sendError(res, error);
    }
});

router.get('/tasks', auth, async (req, res) => {
    try {
        const find = { owner: req.user._id };
        let limit = 0;
        let skip = 0;
        const sort = {};

        if (req.query.completed) find['completed'] = req.query.completed;

        if (req.query.limit) limit = parseInt(req.query.limit);

        if (req.query.skip) skip = parseInt(req.query.skip);

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');

            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        const tasks = await Task.find(find).select({}).limit(limit).skip(skip).sort(sort);

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