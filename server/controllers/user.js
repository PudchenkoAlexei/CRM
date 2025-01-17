import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { mockUsers } from '../mockData.js';

export const register = async (req, res, next) => {
  try {
    const existingUser = mockUsers.find((u) => u.email === req.body.email);
    if (existingUser) {
      return res.status(409).json({
        message: 'User with given email already exists',
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = {
      _id: String(mockUsers.length + 1),
      ...req.body,
      password: hash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    res.status(200).json('User has been created.');
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = mockUsers.find((u) => u.username === req.body.username);
    if (!user) {
      return res.status(404).json('User not found!');
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      return res.status(400).json('Wrong password or username!');
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT || 'your-secret-key',
    );

    const { password, ...otherDetails } = user;
    res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails } });
  } catch (err) {
    next(err);
  }
};
