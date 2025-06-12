import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import * as productService from '../services/api/productService';
import * as purchaseOrderService from '../services/api/purchaseOrderService';
import * as salesOrderService from '../services/api/salesOrderService';

const MainFeature = () => {
  const [inventory, setInventory] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [products, purchaseOrders, salesOrders] = await Promise.all([
        productService.getAll(),
        purchaseOrderService.getAll(),
        salesOrderService.getAll()
      ]);

      setInventory(products);
      
      // Calculate low stock items
      const lowStock = products.filter(product => product.quantity <= product.reorderPoint);
      setLowStockItems(lowStock);

      // Get recent orders (combine purchase and sales)
      const allOrders = [
        ...purchaseOrders.map(order => ({ ...order, type: 'purchase' })),
        ...salesOrders.map(order => ({ ...order, type: 'sales' }))
      ].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).slice(0, 5);
      
      setRecentOrders(allOrders);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReorder = async (productId) => {
    try {
      const product = inventory.find(p => p.id === productId);
      if (!product) return;

      const orderData = {
        supplierId: product.supplierId,
        items: [{
          productId: product.id,
          quantity: product.reorderPoint * 2,
          unitPrice: product.unitPrice
        }],
        status: 'pending'
      };

      await purchaseOrderService.create(orderData);
      toast.success(`Reorder created for ${product.name}`);
      loadDashboardData();
    } catch (err) {
      toast.error('Failed to create reorder');
    }
  };

  const handleStockAdjustment = async (productId, newQuantity) => {
    try {
      const product = inventory.find(p => p.id === productId);
      if (!product) return;

      await productService.update(productId, { quantity: newQuantity });
      toast.success(`Stock updated for ${product.name}`);
      loadDashboardData();
    } catch (err) {
      toast.error('Failed to update stock');
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalInventoryValue = inventory.reduce((sum, product) => sum + (product.quantity * product.unitPrice), 0);
  const pendingPurchaseOrders = recentOrders.filter(order => order.type === 'purchase' && order.status === 'pending').length;
  const pendingSalesOrders = recentOrders.filter(order => order.type === 'sales' && order.status === 'pending').length;

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Inventory Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${totalInventoryValue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" size={24} className="text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Purchase Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingPurchaseOrders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="ShoppingCart" size={24} className="text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Sales Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingSalesOrders}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={24} className="text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-semibold text-red-600">{lowStockItems.length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" size={24} className="text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Low Stock Alerts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Low Stock Alerts</h3>
            <ApperIcon name="AlertTriangle" size={20} className="text-red-600" />
          </div>
          
          {lowStockItems.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="CheckCircle" size={48} className="text-green-500 mx-auto mb-4" />
              <h4 className="text-sm font-medium text-gray-900 mb-2">All Stock Levels Good</h4>
              <p className="text-sm text-gray-500">No items below reorder point</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Current: {item.quantity} | Reorder Point: {item.reorderPoint}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleQuickReorder(item.id)}
                      className="px-3 py-1 text-xs bg-primary text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Reorder
                    </button>
                    <button
                      onClick={() => {
                        const newQuantity = prompt(`Enter new quantity for ${item.name}:`, item.quantity);
                        if (newQuantity && !isNaN(newQuantity)) {
                          handleStockAdjustment(item.id, parseInt(newQuantity));
                        }
                      }}
                      className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                      Adjust
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
            <ApperIcon name="Clock" size={20} className="text-gray-600" />
          </div>
          
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Package" size={48} className="text-gray-300 mx-auto mb-4" />
              <h4 className="text-sm font-medium text-gray-900 mb-2">No Recent Orders</h4>
              <p className="text-sm text-gray-500">Orders will appear here once created</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentOrders.map((order) => (
                <div key={`${order.type}-${order.id}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      order.type === 'purchase' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      <ApperIcon 
                        name={order.type === 'purchase' ? 'ShoppingCart' : 'TrendingUp'} 
                        size={16} 
                        className={order.type === 'purchase' ? 'text-blue-600' : 'text-purple-600'} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      ${order.totalAmount?.toLocaleString() || '0'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MainFeature;