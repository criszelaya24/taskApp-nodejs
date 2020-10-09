module.exports = {
    'test': {
        PORT: 3000,
        MONGO_DB: 'mongodb://127.0.0.1:27017/task-manager-api-test',
    },
    'development': {
        PORT: 3000,
        MONGO_DB: 'mongodb://127.0.0.1:27017/task-manager-api',
    },
    'local': {
        PORT: 3000,
        MONGO_DB: 'mongodb://127.0.0.1:27017/task-manager-api',
    },
};
