import request from 'supertest';
import app from '../app.js'; // Adjust the path to where your app is initialized

describe('User Endpoints', () => {
    it('should create a new user', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                username: 'testuser',
                password: 'password123',
                fullName: "Test User",
                email: "test@example.com"
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
    });

    // Add more tests for other user endpoints
});