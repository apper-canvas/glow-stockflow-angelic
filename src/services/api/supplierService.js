import suppliersData from '../mockData/suppliers.json';
import { delay } from '../index';

let suppliers = [...suppliersData];

const generateId = () => Date.now().toString();

export const getAll = async () => {
  await delay(300);
  return [...suppliers];
};

export const getById = async (id) => {
  await delay(200);
  const supplier = suppliers.find(s => s.id === id);
  if (!supplier) {
    throw new Error('Supplier not found');
  }
  return { ...supplier };
};

export const create = async (supplierData) => {
  await delay(400);
  const newSupplier = {
    ...supplierData,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  suppliers.push(newSupplier);
  return { ...newSupplier };
};

export const update = async (id, updateData) => {
  await delay(300);
  const index = suppliers.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error('Supplier not found');
  }
  suppliers[index] = { ...suppliers[index], ...updateData, updatedAt: new Date().toISOString() };
  return { ...suppliers[index] };
};

export const delete_ = async (id) => {
  await delay(300);
  const index = suppliers.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error('Supplier not found');
  }
  const deleted = suppliers.splice(index, 1)[0];
  return { ...deleted };
};

export { delete_ as delete };