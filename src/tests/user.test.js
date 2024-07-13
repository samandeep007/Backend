import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app'; // Import your Express app
import { User } from '../models/user.model'; // Adjust the path as needed
import jwt from 'jsonwebtoken';

const { expect } = chai;
chai.use(chaiHttp);

describe('User API', () => {
  let token;

  before(async () => {
    // Create a test user
    await User.create({
      email: 'testuser@example.com',
      password: 'password123',
    });
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user account', (done) => {
      chai.request(app)
        .post('/api/auth/signup')
        .send({ email: 'newuser@example.com', password: 'password123' })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('user');
          done();
        });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should log in and return an access token', (done) => {
      chai.request(app)
        .post('/api/auth/login')
        .send({ email: 'testuser@example.com', password: 'password123' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          token = res.body.token;
          done();
        });
    });
  });
});
