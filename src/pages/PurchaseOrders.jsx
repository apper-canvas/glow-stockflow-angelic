import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import * as purchaseOrderService from '../services/api/purchaseOrderService';
import * as supplierService from '../services/api/supplierService';
import * as productService from '../services/api/productService';

const PurchaseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newOrder, setNewOrder] = useState({
    supplierId: '',
    items: [{ productId: '', quantity: 1, unitPrice: 0 }],
    status: 'pending'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [ordersData, suppliersData, productsData] = await Promise.all([
        purchaseOrderService.getAll(),
        supplierService.getAll(),
        productService.getAll()
      ]);
      setOrders(ordersData);
      setSuppliers(suppliersData);
      setProducts(productsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load purchase orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      await purchaseOrderService.create(newOrder);
      toast.success('Purchase order created successfully');
      setShowCreateModal(false);
      setNewOrder({
        supplierId: '',
        items: [{ productId: '', quantity: 1, unitPrice: 0 }],
        status: 'pending'
      });
      loadData();
    } catch (err) {
      toast.error('Failed to create purchase order');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await purchaseOrderService.update(orderId, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      loadData();
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const addOrderItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { productId: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const removeOrderItem = (index) => {
    if (newOrder.items.length > 1) {
      setNewOrder({
        ...newOrder,
        items: newOrder.items.filter((_, i) => i !== index)
      });
    }
  };

  const updateOrderItem = (index, field, value) => {
    const updatedItems = newOrder.items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        
        // Auto-fill unit price when product is selected
        if (field === 'productId' && value) {
          const product = products.find(p => p.id === value);
          if (product) {
            updatedItem.unitPrice = product.unitPrice;
          }
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Unknown Supplier';
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const calculateOrderTotal = (orderItems) => {
    return orderItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Purchase Orders</h3>
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
        <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Create Order
        </button>
      </div>

      {/* Orders Grid */}
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="ShoppingCart" size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Purchase Orders</h3>
          <p className="text-gray-500 mb-4">Create your first purchase order to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Order
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 break-words">
                    {order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-500 break-words">
                    {getSupplierName(order.supplierId)}
                  </p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'received' ? 'bg-green-100 text-green-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order Date:</span>
                  <span className="text-gray-900">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </span>
                </div>
                {order.expectedDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Expected:</span>
                    <span className="text-gray-900">
                      {new Date(order.expectedDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Items:</span>
                  <span className="text-gray-900">{order.items?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">
                    ${order.totalAmount?.toLocaleString() || '0'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="text-primary hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  View Details
                </button>
                
                {order.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'approved')}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                      className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                
                {order.status === 'approved' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'received')}
                    className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                  >
                    Mark Received
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Create Purchase Order</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
              <form onSubmit={handleCreateOrder} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                  <select
                    required
                    value={newOrder.supplierId}
                    onChange={(e) => setNewOrder({...newOrder, supplierId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">Order Items</label>
                    <button
                      type="button"
                      onClick={addOrderItem}
                      className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      <ApperIcon name="Plus" size={14} className="mr-1" />
                      Add Item
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {newOrder.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 items-end p-4 bg-gray-50 rounded-lg">
                        <div className="col-span-5">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Product</label>
                          <select
                            required
                            value={item.productId}
                            onChange={(e) => updateOrderItem(index, 'productId', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="">Select Product</option>
                            {products.map(product => (
                              <option key={product.id} value={product.id}>{product.name}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Qty</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        
                        <div className="col-span-3">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Unit Price</label>
                          <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateOrderItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        
                        <div className="col-span-2 flex justify-end">
                          {newOrder.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeOrderItem(index)}
                              className="p-2 text-red-600 hover:text-red-700 transition-colors"
                            >
                              <ApperIcon name="Trash2" size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Order Total:</span>
                      <span className="text-lg font-semibold text-gray-900">
                        ${calculateOrderTotal(newOrder.items).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Order
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Order Number</label>
                    <p className="text-gray-900 break-words">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      selectedOrder.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      selectedOrder.status === 'received' ? 'bg-green-100 text-green-800' :
                      selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Supplier</label>
                    <p className="text-gray-900 break-words">{getSupplierName(selectedOrder.supplierId)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Order Date</label>
                    <p className="text-gray-900">{new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Order Items</label>
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedOrder.items?.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm text-gray-900 break-words">
                              {getProductName(item.productId)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">${item.unitPrice?.toFixed(2) || '0.00'}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              ${((item.quantity * item.unitPrice) || 0).toFixed(2)}
                            </td>
                          </tr>
                        )) || []}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <div className="text-lg font-semibold text-gray-900">
                      Total: ${selectedOrder.totalAmount?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrders;