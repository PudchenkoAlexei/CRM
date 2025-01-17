import bcrypt from 'bcryptjs';

const mockUsers = [
  {
    _id: '1',
    username: 'testuser',
    email: 'test@test.com',
    password: bcrypt.hashSync('test123', 10),
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
  },
];

const mockCustomers = [
  {
    _id: '1',
    name: 'John Doe',
    company: '1',
    service: 'Consulting',
    email: 'john@example.com',
    phone: '+1234567890',
    status: 'not started',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
  },
];

export { mockUsers, mockCustomers };
