import customersData from '../mockData/customers.json';
import { delay } from '../index';

let customers = [...customersData];

const generateId = () => Date.now().toString();

export const getAll = async () => {
  await delay(300);
  return [...customers];
};

export const getById = async (id) => {
  await delay(200);
  const customer = customers.find(c => c.id === id);
  if (!customer) {
    throw new Error('Customer not found');
  }
  return { ...customer };
};

export const create = async (customerData) => {
  await delay(400);
  const newCustomer = {
    ...customerData,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  customers.push(newCustomer);
  return { ...newCustomer };
};

export const update = async (id, updateData) => {
  await delay(300);
  const index = customers.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Customer not found');
  }
  customers[index] = { ...customers[index], ...updateData, updatedAt: new Date().toISOString() };
  return { ...customers[index] };
};

export const delete_ = async (id) => {
  await delay(300);
  const index = customers.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Customer not found');
  }
  const deleted = customers.splice(index, 1)[0];
  return { ...deleted };
};

export { delete_ as delete };