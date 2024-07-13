import request from 'supertest';
import express from 'express';
import authRouter from '../../routes/user.routes.js'; // Adjust path as necessary
import { User } from '../../models/user.model.js'; // Adjust path as necessary
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { expect } from 'chai'; // Chai for assertions
import sinon from 'sinon'; // Sinon for stubs and spies

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth Routes Unit Tests', () => {
    let createStub;
    let findOneStub;
    let compareStub;
    let signStub;

    beforeEach(() => {
        // Stub methods
        createStub = sinon.stub(User, 'create');
        findOneStub = sinon.stub(User, 'findOne');
        compareStub = sinon.stub(bcrypt, 'compare');
        signStub = sinon.stub(jwt, 'sign');
    });

    afterEach(() => {
        // Restore the original methods
        sinon.restore();
    });

    it('POST /api/auth/signup - should create a new user', async () => {
        const userData = { username: 'testuser', password: 'testpassword', fullName: 'john doe', email: 'test@example.com' };

        // Mock User.create
        createStub.resolves(userData);

        const response = await request(app)
            .post('/api/auth/signup')
            .send(userData);

        expect(response.status).to.equal(201);
        expect(response.body.username).to.equal(userData.username);
    });

    it('POST /api/auth/login - should log in a user and return a token', async () => {
        const userData = { username: 'testuser', password: 'testpassword' };

        // Mock User.findOne, bcrypt.compare, and jwt.sign
        findOneStub.resolves(userData);
        compareStub.resolves(true);
        signStub.returns('mock-token');

        const response = await request(app)
            .post('/api/auth/login')
            .send(userData);

        expect(response.status).to.equal(200);
        expect(response.body.token).to.equal('mock-token');
    });
});
