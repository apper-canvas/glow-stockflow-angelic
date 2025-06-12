// Service exports
export * as productService from './api/productService';
export * as purchaseOrderService from './api/purchaseOrderService';
export * as salesOrderService from './api/salesOrderService';
export * as supplierService from './api/supplierService';
export * as customerService from './api/customerService';
export * as invoiceService from './api/invoiceService';

// Utility function for delays
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));