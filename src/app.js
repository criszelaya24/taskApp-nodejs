const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const sendError = require('./utils/sendError');
const User = require('./models/User'),
    Task = require('./models/Task');

app.use(express.json());

app.get('/', (req, res) => res.send({ hello: 'Hello World!' }));

app.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();

        res.send(201, user);
    } catch (error) {
        sendError(res, error);
    }
});

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);

    try {
        await task.save();

        res.send((201, task));
    } catch (error) {
        sendError(res, error);
    }
});

app.all('*', (req, res) => {
    sendError(res, {
        error: 'Endpoint not found',
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
