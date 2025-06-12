import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import * as invoiceService from '../services/api/invoiceService';
import * as salesOrderService from '../services/api/salesOrderService';
import * as customerService from '../services/api/customerService';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [invoicesData, ordersData, customersData] = await Promise.all([
        invoiceService.getAll(),
        salesOrderService.getAll(),
        customerService.getAll()
      ]);
      setInvoices(invoicesData);
      setSalesOrders(ordersData);
      setCustomers(customersData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    
    if (!selectedOrderId) {
      toast.error('Please select a sales order');
      return;
    }

    try {
      const selectedOrder = salesOrders.find(order => order.id === selectedOrderId);
      if (!selectedOrder) {
        toast.error('Selected order not found');
        return;
      }

      const invoiceData = {
        salesOrderId: selectedOrder.id,
        customerId: selectedOrder.customerId,
        totalAmount: selectedOrder.totalAmount,
        status: 'pending'
      };

      await invoiceService.create(invoiceData);
      toast.success('Invoice created successfully');
      setShowCreateModal(false);
      setSelectedOrderId('');
      loadData();
    } catch (err) {
      toast.error('Failed to create invoice');
    }
  };

  const handleUpdateStatus = async (invoiceId, newStatus) => {
    try {
      await invoiceService.update(invoiceId, { status: newStatus });
      toast.success(`Invoice status updated to ${newStatus}`);
      loadData();
    } catch (err) {
      toast.error('Failed to update invoice status');
    }
  };

  const handlePrintInvoice = (invoice) => {
    // Create a basic print view
    const printWindow = window.open('', '_blank');
    const customer = customers.find(c => c.id === invoice.customerId);
    const salesOrder = salesOrders.find(o => o.id === invoice.salesOrderId);

    const printContent = `
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .invoice-details { margin-bottom: 20px; }
            .customer-details { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f5f5f5; }
            .total { text-align: right; font-size: 18px; font-weight: bold; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>StockFlow Pro</h1>
            <h2>INVOICE</h2>
          </div>
          
          <div class="invoice-details">
            <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
            <p><strong>Invoice Date:</strong> ${new Date(invoice.issueDate).toLocaleDateString()}</p>
            <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${invoice.status.toUpperCase()}</p>
          </div>
          
          <div class="customer-details">
            <h3>Bill To:</h3>
            <p><strong>${customer?.companyName || 'Unknown Customer'}</strong></p>
            <p>${customer?.contactPerson || ''}</p>
            <p>${customer?.email || ''}</p>
            <p>${customer?.phone || ''}</p>
            <p>${customer?.address || ''}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${salesOrder?.items?.map(item => `
                <tr>
                  <td>Sales Order Item</td>
                  <td>${item.quantity}</td>
                  <td>$${item.unitPrice?.toFixed(2) || '0.00'}</td>
                  <td>$${((item.quantity * item.unitPrice) || 0).toFixed(2)}</td>
                </tr>
              `).join('') || '<tr><td colspan="4">No items found</td></tr>'}
            </tbody>
          </table>
          
          <div class="total">
            <p>Total Amount: $${invoice.totalAmount?.toFixed(2) || '0.00'}</p>
          </div>
          
          <div style="margin-top: 50px; text-align: center;">
            <button onclick="window.print()">Print Invoice</button>
            <button onclick="window.close()">Close</button>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.companyName : 'Unknown Customer';
  };

  const getOrderNumber = (orderId) => {
    const order = salesOrders.find(o => o.id === orderId);
    return order ? order.orderNumber : 'Unknown Order';
  };

  // Filter sales orders that don't already have invoices
  const availableOrders = salesOrders.filter(order => 
    order.status === 'delivered' && 
    !invoices.some(invoice => invoice.salesOrderId === order.id)
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Invoices</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={availableOrders.length === 0}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Generate Invoice
        </button>
      </div>

      {availableOrders.length === 0 && invoices.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex">
            <ApperIcon name="Info" size={20} className="text-amber-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">No Delivered Orders</h3>
              <p className="text-sm text-amber-700 mt-1">
                Invoices can only be generated from delivered sales orders. Create and deliver sales orders first.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Invoices Grid */}
      {invoices.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="FileText" size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Invoices Generated</h3>
          <p className="text-gray-500 mb-4">
            {availableOrders.length > 0 
              ? 'Generate your first invoice from a delivered sales order'
              : 'Complete sales orders to generate invoices'
            }
          </p>
          {availableOrders.length > 0 && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate Invoice
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invoices.map((invoice, index) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 break-words">
                    {invoice.invoiceNumber}
                  </h3>
                  <p className="text-sm text-gray-500 break-words">
                    {getCustomerName(invoice.customerId)}
                  </p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {invoice.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Issue Date:</span>
                  <span className="text-gray-900">
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Due Date:</span>
                  <span className="text-gray-900">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order:</span>
                  <span className="text-gray-900 break-words">
                    {getOrderNumber(invoice.salesOrderId)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-900">Amount:</span>
                  <span className="text-gray-900">
                    ${invoice.totalAmount?.toLocaleString() || '0'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedInvoice(invoice)}
                    className="text-primary hover:text-blue-700 text-sm font-medium transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handlePrintInvoice(invoice)}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                  >
                    Print
                  </button>
                </div>
                
                {invoice.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateStatus(invoice.id, 'sent')}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                    >
                      Mark Sent
                    </button>
                  </div>
                )}
                
                {invoice.status === 'sent' && (
                  <button
                    onClick={() => handleUpdateStatus(invoice.id, 'paid')}
                    className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                  >
                    Mark Paid
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Generate Invoice</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Delivered Sales Order
                </label>
                <select
                  required
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Choose an order...</option>
                  {availableOrders.map(order => (
                    <option key={order.id} value={order.id}>
                      {order.orderNumber} - {getCustomerName(order.customerId)} - ${order.totalAmount?.toLocaleString() || '0'}
                    </option>
                  ))}
                </select>
                
                {availableOrders.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    No delivered orders available for invoicing
                  </p>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedOrderId}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Invoice Details</h3>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                    <p className="text-gray-900 break-words">{selectedInvoice.invoiceNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      selectedInvoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      selectedInvoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      selectedInvoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                      selectedInvoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedInvoice.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer</label>
                    <p className="text-gray-900 break-words">{getCustomerName(selectedInvoice.customerId)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sales Order</label>
                    <p className="text-gray-900 break-words">{getOrderNumber(selectedInvoice.salesOrderId)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Issue Date</label>
                    <p className="text-gray-900">{new Date(selectedInvoice.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <p className="text-gray-900">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${selectedInvoice.totalAmount?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handlePrintInvoice(selectedInvoice)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Print Invoice
                  </button>
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Invoices;