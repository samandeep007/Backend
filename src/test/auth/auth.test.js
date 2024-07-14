import { loginUser } from '../../controllers/user.controller.js';
import { User } from '../../models/user.model.js';
import { ApiError } from '../../utils/apiError.js';

jest.mock('../../models/user.model.js');

describe('loginUser function', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error when neither email nor username is provided', async () => {
    req.body = { password: 'password123' };

    await loginUser(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next.mock.calls[0][0].statusCode).toBe(400);
    expect(next.mock.calls[0][0].message).toBe('Username or email required');
  });

  it('should return an error when user does not exist', async () => {
    req.body = { email: 'nonexistent@example.com', password: 'password123' };
    User.findOne.mockResolvedValue(null);
  
    await loginUser(req, res, next);
  
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 404,
      message: 'User does not exist'
    }));
  });

  it('should throw an error when password is incorrect', async () => {
    req.body = { email: 'user@example.com', password: 'wrongpassword' };
    const mockUser = {
      isPasswordCorrect: jest.fn().mockResolvedValue(false)
    };
    User.findOne.mockResolvedValue(mockUser);

    await loginUser(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next.mock.calls[0][0].statusCode).toBe(401);
    expect(next.mock.calls[0][0].message).toBe('password incorrect | Invalid user credentials');
  });

  it('should throw an error when generateRefreshAndAccessTokens fails', async () => {
    req.body = { email: 'user@example.com', password: 'correctpassword' };
    const mockUser = {
      _id: 'user123',
      isPasswordCorrect: jest.fn().mockResolvedValue(true)
    };
    User.findOne.mockResolvedValue(mockUser);
    User.findById.mockRejectedValue(new Error('Token generation failed'));

    await loginUser(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should throw an error when User.findById fails after successful login', async () => {
    req.body = { email: 'user@example.com', password: 'correctpassword' };
    const mockUser = {
      _id: 'user123',
      isPasswordCorrect: jest.fn().mockResolvedValue(true)
    };
    User.findOne.mockResolvedValue(mockUser);
    User.findById.mockRejectedValue(new Error('Database error'));

    await loginUser(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});