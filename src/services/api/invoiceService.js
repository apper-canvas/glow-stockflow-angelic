import invoicesData from '../mockData/invoices.json';
import { delay } from '../index';

let invoices = [...invoicesData];

const generateInvoiceNumber = () => `INV-${Date.now()}`;
const generateId = () => Date.now().toString();

export const getAll = async () => {
  await delay(300);
  return [...invoices];
};

export const getById = async (id) => {
  await delay(200);
  const invoice = invoices.find(i => i.id === id);
  if (!invoice) {
    throw new Error('Invoice not found');
  }
  return { ...invoice };
};

export const create = async (invoiceData) => {
  await delay(400);
  const issueDate = new Date();
  const dueDate = new Date(issueDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from issue
  
  const newInvoice = {
    ...invoiceData,
    id: generateId(),
    invoiceNumber: generateInvoiceNumber(),
    issueDate: issueDate.toISOString(),
    dueDate: dueDate.toISOString(),
    createdAt: new Date().toISOString()
  };
  
  invoices.push(newInvoice);
  return { ...newInvoice };
};

export const update = async (id, updateData) => {
  await delay(300);
  const index = invoices.findIndex(i => i.id === id);
  if (index === -1) {
    throw new Error('Invoice not found');
  }
  invoices[index] = { ...invoices[index], ...updateData, updatedAt: new Date().toISOString() };
  return { ...invoices[index] };
};

export const delete_ = async (id) => {
  await delay(300);
  const index = invoices.findIndex(i => i.id === id);
  if (index === -1) {
    throw new Error('Invoice not found');
  }
  const deleted = invoices.splice(index, 1)[0];
  return { ...deleted };
};

export { delete_ as delete };