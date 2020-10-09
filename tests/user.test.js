const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

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

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
    await new User(userToLogin).save();

    const res = await request(app).post('/users/login').send({
        email: userToLogin.email,
        password: userToLogin.password,
    });

    userToLogin.token = res.body.token;
    userToLogin._id = res.body.user._id;
});

describe('Testing endpoint User', () => {
    test('Creating User', async() => {
        const res = await request(app)
            .post('/users')
            .send(userToCreate);

        expect(res.status).toEqual(201);
        expect(res.type).toEqual('application/json');
        expect(res.body.user.name).toEqual(userToCreate.name);
    });

    test('Should login user', async() => {
        const res = await request(app).post('/users/login').send({
            email: userOne.email,
            password: userOne.password,
        });

        expect(res.status).toEqual(200);
        expect(res.body.user.email).toEqual(userOne.email);
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

    test('should get access to user info', async() => {
        const res = await request(app).get(`/users/${userToLogin._id}`).set('Authorization', `Bearer ${userToLogin.token}`);

        expect(res.body.email).toEqual(userToLogin.email);
        expect(res.status).toEqual(200);
    });

    test('should not get access to user info', async() => {
        const res = await request(app).get(`/users/${userToLogin._id}`);

        expect(res.body.error).toEqual('Please authenticate.');
        expect(res.status).toEqual(401);
    });

    test('should delete user info', async() => {
        const res = await request(app).delete(`/users/${userToLogin._id}`).set('Authorization', `Bearer ${userToLogin.token}`);
        const user = await User.findById(userToLogin._id);

        expect(res.body.data).toEqual(true);
        expect(res.status).toEqual(200);
        expect(user).toBeNull();
    });

    test('should not delete user', async() => {
        const res = await request(app).delete(`/users/${userToLogin._id}`);

        expect(res.body.error).toEqual('Please authenticate.');
        expect(res.status).toEqual(401);
    });
});