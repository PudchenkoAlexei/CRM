import { mockCustomers } from '../mockData.js';

export const createCustomer = async (req, res, next) => {
  try {
    const newCustomer = {
      _id: String(mockCustomers.length + 1),
      ...req.body,
      status: 'not started',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockCustomers.push(newCustomer);
    res.status(200).json(newCustomer);
  } catch (err) {
    next(err);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    const index = mockCustomers.findIndex((c) => c._id === req.params.id);
    if (index === -1) {
      return res.status(404).json('Customer not found');
    }

    mockCustomers.splice(index, 1);
    res.status(200).json('The customer has been deleted');
  } catch (err) {
    next(err);
  }
};

export const getCustomers = async (req, res, next) => {
  try {
    const customers = mockCustomers.filter(
      (c) => c.company === req.params.userId,
    );
    res.status(200).json(customers);
  } catch (err) {
    next(err);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const customerIndex = mockCustomers.findIndex(
      (c) => c._id === req.params.id,
    );
    if (customerIndex === -1) {
      return res.status(404).json('Customer not found');
    }

    mockCustomers[customerIndex] = {
      ...mockCustomers[customerIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    res.status(200).json(mockCustomers[customerIndex]);
  } catch (err) {
    next(err);
  }
};
