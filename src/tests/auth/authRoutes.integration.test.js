import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import authRouter from '../../routes/user.routes.js'; 
import { User } from '../../models/user.model.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;
const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Auth API Integration Tests', () => {
    it('POST /api/auth/signup - should create a new user', async () => {
        const userData = { username: 'testuser', password: 'testpassword' };

        const response = await request(app)
            .post('/api/auth/signup')
            .send(userData);

        expect(response.status).toBe(201);
        expect(response.body.username).toBe(userData.username);
    });

    it('POST /api/auth/login - should log in a user and return a token', async () => {
        const passwordHash = await bcrypt.hash('testpassword', 10);
        const user = new User({ username: 'testuser', password: passwordHash });
        await user.save();

        jest.spyOn(jwt, 'sign').mockReturnValue('mock-token');

        const response = await request(app)
            .post('/api/auth/login')
            .send({ username: 'testuser', password: 'testpassword' });

        expect(response.status).toBe(200);
        expect(response.body.token).toBe('mock-token');
    });
});
