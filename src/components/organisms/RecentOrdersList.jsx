import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/molecules/Card';

const RecentOrdersList = ({ recentOrders }) => {
  return (
    &lt;Card animate delay={0.6}&gt;
      &lt;div className="flex items-center justify-between mb-4"&gt;
        &lt;h3 className="text-lg font-medium text-gray-900"&gt;Recent Orders&lt;/h3&gt;
        &lt;ApperIcon name="Clock" size={20} className="text-gray-600" /&gt;
      &lt;/div&gt;
      
      {recentOrders.length === 0 ? (
        &lt;div className="text-center py-8"&gt;
          &lt;ApperIcon name="Package" size={48} className="text-gray-300 mx-auto mb-4" /&gt;
          &lt;h4 className="text-sm font-medium text-gray-900 mb-2"&gt;No Recent Orders&lt;/h4&gt;
          &lt;p className="text-sm text-gray-500"&gt;Orders will appear here once created&lt;/p&gt;
        &lt;/div&gt;
      ) : (
        &lt;div className="space-y-3 max-h-64 overflow-y-auto"&gt;
          {recentOrders.map((order) =&gt; (
            &lt;div key={`${order.type}-${order.id}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"&gt;
              &lt;div className="flex items-center space-x-3"&gt;
                &lt;div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  order.type === 'purchase' ? 'bg-blue-100' : 'bg-purple-100'
                }`}&gt;
                  &lt;ApperIcon 
                    name={order.type === 'purchase' ? 'ShoppingCart' : 'TrendingUp'} 
                    size={16} 
                    className={order.type === 'purchase' ? 'text-blue-600' : 'text-purple-600'} 
                  /&gt;
                &lt;/div&gt;
                &lt;div className="flex-1 min-w-0"&gt;
                  &lt;p className="text-sm font-medium text-gray-900"&gt;
                    {order.orderNumber}
                  &lt;/p&gt;
                  &lt;p className="text-xs text-gray-500"&gt;
                    {new Date(order.orderDate).toLocaleDateString()}
                  &lt;/p&gt;
                &lt;/div&gt;
              &lt;/div&gt;
              &lt;div className="flex items-center space-x-2"&gt;
                &lt;span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'completed' || order.status === 'received' || order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'shipped' || order.status === 'approved' || order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}&gt;
                  {order.status}
                &lt;/span&gt;
                &lt;span className="text-sm font-medium text-gray-900"&gt;
                  ${order.totalAmount?.toLocaleString() || '0'}
                &lt;/span&gt;
              &lt;/div&gt;
            &lt;/div&gt;
          ))}
        &lt;/div&gt;
      )}
    &lt;/Card&gt;
  );
};

export default RecentOrdersList;