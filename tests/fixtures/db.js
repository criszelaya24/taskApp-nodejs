const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const userOne = {
    name: 'User one',
    email: 'userOne@gmail.com',
    password: '1234567',
    age: '20',
};

const userToLogin = {
    name: 'Testing auth',
    email: 'auth@gmail.com',
    password: '1234567',
};

const userToCreate = {
    name: 'Testing Jest',
    email: 'testJest@gmail.com',
    password: '1234567',
};

const setupDatabase = async() => {
    await User.deleteMany();
    await new User(userOne).save();
    await new User(userToLogin).save();

    const res = await request(app).post('/users/login').send({
        email: userToLogin.email,
        password: userToLogin.password,
    });

    userToLogin.token = res.body.token;
    userToLogin._id = res.body.user._id;
};

module.exports = {
    setupDatabase,
    userToCreate,
    userToLogin,
    userOne,
};