const express = require('express');
const app = express();
const environment = require('./settings');

global.API_SETTINGS = environment[process.env.ENV] ? environment[process.env.ENV] : environment['local'];

const sendError = require('./utils/sendError');
const usersRouter = require('./routes/user'),
    taskRouter = require('./routes/task');

app.use(express.json());

app.get('/', (req, res) => res.send({ hello: 'Hello World!' }));

app.use(usersRouter);

app.use(taskRouter);

app.all('*', (req, res) => {
    sendError(res, 'Endpoint not found');
});

module.exports = app;
