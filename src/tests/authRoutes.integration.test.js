import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import authRouter from '../routes/user.routes.js'; // Adjust path as necessary
import { User } from '../models/user.model.js'; // Adjust path as necessary
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;
const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    // Ensure mongoose is not already connected
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Auth API Integration Tests', () => {
    let signSpy;

    beforeEach(() => {
        // Spy on jwt.sign
        signSpy = jest.spyOn(jwt, 'sign');
    });

    afterEach(async () => {
        // Restore the original function
        signSpy.mockRestore();
        // Clean up the database
        await User.deleteMany({});
    });

    test('POST /api/auth/signup - should create a new user', async () => {
        const userData = {
            username: `testuser-${Date.now()}`, // Ensure unique username
            email: `john-${Date.now()}@example.com`, // Ensure unique email
            fullName: 'John Doe',
            password: 'testpassword'
        };

        const response = await request(app)
            .post('/api/auth/signup')
            .send(userData);

        expect(response.status).toBe(200); // Updated to match your implementation
        expect(response.body.data.username).toBe(userData.username);

        // Check if the user is saved properly in the database
        const savedUser = await User.findOne({ username: userData.username });
        expect(savedUser).not.toBeNull();
    });

    test('POST /api/auth/login - should log in a user and return a token', async () => {
        const username = `testuser-${Date.now()}`;
        const user = new User({
            username,
            email: `john-${Date.now()}@example.com`,
            fullName: 'John Doe',
            password: 'testpassword'
        });
        await user.save();

        // Mock the return value of jwt.sign
        signSpy.mockReturnValue('mock-token');

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                username,
                password: 'testpassword'
            });

        expect(response.status).toBe(200); // Status code should be 200
        expect(response.body.data.accessToken).toBe('mock-token'); // Ensure the token is as expected
        expect(response.body.data.refreshToken).toBe('mock-token');
    });
});
