import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import authRouter from '../../routes/user.routes.js'; // Adjust path as necessary
import { User } from '../../models/user.model.js'; // Adjust path as necessary
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { expect } from 'chai'; // Chai for assertions
import sinon from 'sinon'; // Sinon for spies

let mongoServer;
const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Auth API Integration Tests', () => {
    let signSpy;

    beforeEach(() => {
        signSpy = sinon.spy(jwt, 'sign'); // Spy on jwt.sign
    });

    afterEach(() => {
        signSpy.restore(); // Restore the original function
    });

    it('POST /api/auth/signup - should create a new user', async () => {
        const userData = { username: 'testuser', password: 'testpassword', fullName: 'john doe', email: 'john@example.com' };

        const response = await request(app)
            .post('/api/auth/signup')
            .send(userData);

        expect(response.status).to.equal(201);
        expect(response.body.username).to.equal(userData.username);
    });

    it('POST /api/auth/login - should log in a user and return a token', async () => {
        const user = new User({ username: 'testuser', password: 'testpassword', fullName: 'john doe', email: 'john@example.com' });
        await user.save();

        signSpy.returns('mock-token'); // Mock the return value of jwt.sign

        const response = await request(app)
            .post('/api/auth/login')
            .send({ username: 'testuser', password: 'testpassword' });

        expect(response.status).to.equal(200); // Assuming 200 is the success status code for login
        expect(response.body.token).to.exist;
    });
});
