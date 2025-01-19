import { jest } from '@jest/globals';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Customer from '../models/Customer.js';
import { register, login } from '../controllers/user.js';
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from '../controllers/customer.js';

jest.mock('bcryptjs', () => ({
  genSaltSync: jest.fn(() => 'salt'),
  hashSync: jest.fn(() => 'hashedPassword'),
  compare: jest.fn(() => true),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'token'),
}));

jest.mock('../models/User.js');
jest.mock('../models/Customer.js');

describe('Server Tests', () => {
  let req, res, next;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      cookie: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe('User Controller', () => {
    beforeEach(() => {
      req = {
        body: {
          username: 'testuser',
          password: 'password123',
          email: 'test@example.com',
        },
      };
    });

    it('should register new user', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue(req.body);

      await register(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('User has been created.');
    });

    it('should not register user if email exists', async () => {
      User.findOne = jest.fn().mockResolvedValue(req.body);

      await register(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.send).toHaveBeenCalledWith({
        message: 'User with given email already exists',
      });
    });

    it('should login user successfully', async () => {
      const user = {
        _id: 'userId',
        username: 'testuser',
        password: 'hashedPassword',
        isAdmin: false,
        _doc: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'hashedPassword',
        },
      };

      User.findOne = jest.fn().mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue('token');

      await login(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({
        username: req.body.username,
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(
        req.body.password,
        user.password,
      );

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT,
      );

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        details: { username: 'testuser', email: 'test@example.com' },
        isAdmin: false,
      });

      expect(res.cookie).toHaveBeenCalledWith('access_token', 'token', {
        httpOnly: true,
      });
    });

    it('should return error for invalid username', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);

      await login(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error('User not found!'));
    });

    it('should return error for invalid password', async () => {
      const user = {
        _id: 'userId',
        username: 'testuser',
        password: 'hashedPassword',
      };
      User.findOne = jest.fn().mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await login(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new Error('Wrong password or username!'),
      );
    });
  });

  describe('Customer Controller', () => {
    beforeEach(() => {
      req = {
        body: {
          name: 'Test Customer',
          service: 'Test Service',
          email: 'customer@test.com',
          phone: '1234567890',
        },
        params: {
          userId: 'testUserId',
        },
      };
    });

    it('should create customer', async () => {
      const newCustomer = { ...req.body, _id: 'customerId' };
      Customer.prototype.save = jest.fn().mockResolvedValue(newCustomer);

      await createCustomer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(newCustomer);
    });

    it('should delete customer', async () => {
      Customer.findByIdAndDelete = jest.fn().mockResolvedValue(true);

      req.params.id = 'customerId';
      await deleteCustomer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith('the Customer has been deleted');
    });

    it('should get customers', async () => {
      const customers = [{ _id: 'customerId', name: 'Test Customer' }];
      Customer.find = jest.fn().mockResolvedValue(customers);

      await getCustomers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(customers);
    });

    it('should update customer', async () => {
      const updatedCustomer = { ...req.body, _id: 'customerId' };
      Customer.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedCustomer);

      req.params.id = 'customerId';
      await updateCustomer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedCustomer);
    });
  });
});
