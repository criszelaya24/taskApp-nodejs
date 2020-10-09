const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

const userOne = {
    name: 'User one',
    email: 'userOne@gmail.com',
    password: '1234567',
    age: '20',
};

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
});

describe('Testing endpoint User', () => {
    test('Creating User', async() => {
        await request(app)
            .post('/users')
            .send({
                name: 'Testing Jest',
                email: 'testJest@gmail.com',
                password: '1234567',
            })
            .expect(201);
    });

    test('Should login user', async() => {
        await request(app).post('/users/login').send({
            email: userOne.email,
            password: userOne.password,
        }).expect(200);
    });

    test('Should fail login user with wrong password', async() => {
        await request(app).post('/users/login').send({
            email: userOne.email,
            password: '123',
        }).expect(400);
    });

    test('Should fail login user with non existing one', async() => {
        await request(app).post('/users/login').send({
            email: 'nonExisting@fail.com',
            password: '123',
        }).expect(400);
    });
});