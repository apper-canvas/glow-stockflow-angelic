import ordersData from '../mockData/salesOrders.json';
import { delay } from '../index';

let orders = [...ordersData];

const generateOrderNumber = () => `SO-${Date.now()}`;
const generateId = () => Date.now().toString();

export const getAll = async () => {
  await delay(300);
  return [...orders];
};

export const getById = async (id) => {
  await delay(200);
  const order = orders.find(o => o.id === id);
  if (!order) {
    throw new Error('Sales order not found');
  }
  return { ...order };
};

export const create = async (orderData) => {
  await delay(400);
  const totalAmount = orderData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  
  const newOrder = {
    ...orderData,
    id: generateId(),
    orderNumber: generateOrderNumber(),
    orderDate: new Date().toISOString(),
    shipDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    totalAmount,
    createdAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  return { ...newOrder };
};

export const update = async (id, updateData) => {
  await delay(300);
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) {
    throw new Error('Sales order not found');
  }
  
  // Recalculate total if items are updated
  if (updateData.items) {
    updateData.totalAmount = updateData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }
  
  orders[index] = { ...orders[index], ...updateData, updatedAt: new Date().toISOString() };
  return { ...orders[index] };
};

export const delete_ = async (id) => {
  await delay(300);
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) {
    throw new Error('Sales order not found');
  }
  const deleted = orders.splice(index, 1)[0];
  return { ...deleted };
};

export { delete_ as delete };