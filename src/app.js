const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
