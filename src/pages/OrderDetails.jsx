import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import * as purchaseOrderService from '../services/api/purchaseOrderService';
import * as salesOrderService from '../services/api/salesOrderService';
import * as supplierService from '../services/api/supplierService';
import * as customerService from '../services/api/customerService';
import * as productService from '../services/api/productService';

const OrderDetails = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [contact, setContact] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrder();
  }, [type, id]);

  const loadOrder = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let orderData;
      let contactData;
      
      if (type === 'purchase') {
        orderData = await purchaseOrderService.getById(id);
        if (orderData.supplierId) {
          contactData = await supplierService.getById(orderData.supplierId);
        }
      } else if (type === 'sales') {
        orderData = await salesOrderService.getById(id);
        if (orderData.customerId) {
          contactData = await customerService.getById(orderData.customerId);
        }
      } else {
        throw new Error('Invalid order type');
      }

      setOrder(orderData);
      setContact(contactData);

      // Load all products for name lookup
      const productsData = await productService.getAll();
      setProducts(productsData);
    } catch (err) {
      setError(err.message || 'Failed to load order');
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const getContactName = () => {
    if (!contact) return 'Unknown';
    return type === 'purchase' ? contact.name : contact.companyName;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8 shadow-sm animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-40"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Order Not Found</h3>
          <p className="text-gray-500 mb-4">{error || 'The requested order could not be found'}</p>
          <button
            onClick={() => navigate(type === 'purchase' ? '/purchase-orders' : '/sales-orders')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-8 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 break-words">{order.orderNumber}</h1>
              <p className="text-lg text-gray-500 mt-1">
                {type === 'purchase' ? 'Purchase Order' : 'Sales Order'}
              </p>
            </div>
            <button
              onClick={() => navigate(type === 'purchase' ? '/purchase-orders' : '/sales-orders')}
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
              Back to Orders
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Information</label>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order Number:</span>
                    <span className="text-gray-900 font-medium break-words">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'approved' || order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'received' || order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order Date:</span>
                    <span className="text-gray-900">{new Date(order.orderDate).toLocaleDateString()}</span>
                  </div>
                  {(order.expectedDate || order.shipDate) && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        {type === 'purchase' ? 'Expected Date:' : 'Ship Date:'}
                      </span>
                      <span className="text-gray-900">
                        {new Date(order.expectedDate || order.shipDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {type === 'purchase' ? 'Supplier Information' : 'Customer Information'}
                </label>
                {contact ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Company:</span>
                      <span className="text-gray-900 font-medium break-words">{getContactName()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contact:</span>
                      <span className="text-gray-900 break-words">{contact.contactPerson}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="text-gray-900 break-words">{contact.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span className="text-gray-900 break-words">{contact.phone}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Contact information not available</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Order Items</label>
            {order.items && order.items.length > 0 ? (
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 break-words">
                          {getProductName(item.productId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${item.unitPrice?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${((item.quantity * item.unitPrice) || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="bg-gray-50 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${order.totalAmount?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 border border-gray-200 rounded-lg">
                <ApperIcon name="Package" size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No items found in this order</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetails;