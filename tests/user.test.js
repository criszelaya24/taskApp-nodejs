/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const mongoose = require('../src/db/mongoose');
const { setupDatabase, userToCreate, userToLogin, userOne } = require('./fixtures/db');

beforeEach(setupDatabase);

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

    test('should upload img avatar user', async() => {
        const res = await request(app).post(`/users/${userToLogin._id}/avatar`)
            .set('Authorization', `Bearer ${userToLogin.token}`)
            .attach('avatar', 'tests/fixtures/profile-pic.jpg');
        const user = await User.findById(userToLogin._id);

        expect(res.body.data).toEqual(true);
        expect(res.status).toEqual(200);
        expect(user.avatar).toEqual(expect.any(Buffer));
    });

    test('should not upload img avatar user', async() => {
        const res = await request(app).post(`/users/${userToLogin._id}/avatar`)
            .attach('avatar', 'tests/fixtures/profile-pic.jpg');

        expect(res.body.error).toEqual('Please authenticate.');
        expect(res.status).toEqual(401);
    });

    test('should update user info', async() => {
        const newName = 'Testing login update';
        const res = await request(app).patch(`/users/${userToLogin._id}`).send({
            name: newName,
        });

        expect(res.body.name).toEqual(newName);
        expect(res.status).toEqual(200);
    });

    test('should not update a invalid field user info', async() => {
        const res = await request(app).patch(`/users/${userToLogin._id}`).send({
            city: 'lala',
        });

        expect(res.body.error).toEqual('Invalid updates!');
        expect(res.status).toEqual(400);
    });

    test('should return 404 for invalid user', async() => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).patch(`/users/${fakeId}`).send({
            name: 'Fake',
        });
        const user = await User.findById(fakeId);

        expect(res.status).toEqual(404);
        expect(user).toBeNull();
    });
});