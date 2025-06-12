import productsData from '../mockData/products.json';
import { delay } from '../index';

let products = [...productsData];

const generateId = () => Date.now().toString();

export const getAll = async () => {
  await delay(300);
  return [...products];
};

export const getById = async (id) => {
  await delay(200);
  const product = products.find(p => p.id === id);
  if (!product) {
    throw new Error('Product not found');
  }
  return { ...product };
};

export const create = async (productData) => {
  await delay(400);
  const newProduct = {
    ...productData,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  products.push(newProduct);
  return { ...newProduct };
};

export const update = async (id, updateData) => {
  await delay(300);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Product not found');
  }
  products[index] = { ...products[index], ...updateData, updatedAt: new Date().toISOString() };
  return { ...products[index] };
};

export const delete_ = async (id) => {
  await delay(300);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Product not found');
  }
  const deleted = products.splice(index, 1)[0];
  return { ...deleted };
};

// Export delete as both delete_ and delete for compatibility
export { delete_ as delete };