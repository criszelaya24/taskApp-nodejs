/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../src/app');
const { setupDatabase, userToLogin } = require('./fixtures/db');

beforeEach(setupDatabase);

describe('Task suits', () => {
    test('create Task', async() => {
        const res = await request(app).post('/tasks').send({
            description: 'New Test',
            completed: false,
        }).set('Authorization', `Bearer ${userToLogin.token}`);

        expect(res.body.owner).toEqual(userToLogin._id);
        expect(res.status).toEqual(201);
    });
});