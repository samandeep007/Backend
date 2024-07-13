import request from 'supertest';
import express from 'express';
import authRouter from '../../routes/user.routes.js'; // Adjust path as necessary
import { User } from '../../models/user.model.js'; // Adjust path as necessary
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

jest.mock('../../models/user.models'); // Mock User model
jest.mock('bcrypt'); // Mock bcrypt
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn(),
}));

describe('Auth Routes Unit Tests', () => {
    it('POST /api/auth/signup - should create a new user', async () => {
        const userData = { username: 'testuser', password: 'testpassword' };
        User.create = jest.fn().mockResolvedValue(userData);

        const response = await request(app)
            .post('/api/auth/signup')
            .send(userData);

        expect(response.status).toBe(201);
        expect(response.body.username).toBe(userData.username);
    });

    it('POST /api/auth/login - should log in a user and return a token', async () => {
        const userData = { username: 'testuser', password: 'testpassword' };
        User.findOne = jest.fn().mockResolvedValue(userData);
        bcrypt.compare = jest.fn().mockResolvedValue(true);
        jwt.sign = jest.fn().mockReturnValue('mock-token');

        const response = await request(app)
            .post('/api/auth/login')
            .send(userData);

        expect(response.status).toBe(200);
        expect(response.body.token).toBe('mock-token');
    });
});
