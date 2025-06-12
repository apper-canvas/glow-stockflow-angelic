import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import EmptyState from '@/components/molecules/EmptyState';
import ApperIcon from '@/components/ApperIcon';

const OrderTable = ({ orders, type, onCreateOrder, getContactName, onUpdateStatus, onViewOrder }) => {
  const icon = type === 'purchase' ? 'ShoppingCart' : 'TrendingUp';
  const title = type === 'purchase' ? 'No Purchase Orders' : 'No Sales Orders';
  const description = `Create your first ${type} order to get started`;
  const buttonText = `Create ${type === 'purchase' ? 'Purchase' : 'Sales'} Order`;

  if (orders.length === 0) {
    return (
      &lt;EmptyState
        icon={icon}
        title={title}
        description={description}
        buttonText={buttonText}
        onButtonClick={onCreateOrder}
      /&gt;
    );
  }

  return (
    &lt;div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"&gt;
      {orders.map((order, index) => (
        &lt;motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        &gt;
          &lt;div className="flex items-start justify-between mb-4"&gt;
            &lt;div&gt;
              &lt;h3 className="text-lg font-medium text-gray-900 break-words"&gt;
                {order.orderNumber}
              &lt;/h3&gt;
              &lt;p className="text-sm text-gray-500 break-words"&gt;
                {getContactName(order)}
              &lt;/p&gt;
            &lt;/div&gt;
            &lt;span className={`px-3 py-1 text-xs font-medium rounded-full ${
              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'approved' || order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
              order.status === 'received' || order.status === 'delivered' ? 'bg-green-100 text-green-800' :
              order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}&gt;
              {order.status}
            &lt;/span&gt;
          &lt;/div&gt;

          &lt;div className="space-y-2 mb-4"&gt;
            &lt;div className="flex justify-between text-sm"&gt;
              &lt;span className="text-gray-500"&gt;Order Date:&lt;/span&gt;
              &lt;span className="text-gray-900"&gt;
                {new Date(order.orderDate).toLocaleDateString()}
              &lt;/span&gt;
            &lt;/div&gt;
            {(order.expectedDate || order.shipDate) &amp;&amp; (
              &lt;div className="flex justify-between text-sm"&gt;
                &lt;span className="text-gray-500"&gt;
                  {type === 'purchase' ? 'Expected:' : 'Ship Date:'}
                &lt;/span&gt;
                &lt;span className="text-gray-900"&gt;
                  {new Date(order.expectedDate || order.shipDate).toLocaleDateString()}
                &lt;/span&gt;
              &lt;/div&gt;
            )}
            &lt;div className="flex justify-between text-sm"&gt;
              &lt;span className="text-gray-500"&gt;Items:&lt;/span&gt;
              &lt;span className="text-gray-900"&gt;{order.items?.length || 0}&lt;/span&gt;
            &lt;/div&gt;
            &lt;div className="flex justify-between text-sm font-medium"&gt;
              &lt;span className="text-gray-900"&gt;Total:&lt;/span&gt;
              &lt;span className="text-gray-900"&gt;
                ${order.totalAmount?.toLocaleString() || '0'}
              &lt;/span&gt;
            &lt;/div&gt;
          &lt;/div&gt;

          &lt;div className="flex items-center justify-between"&gt;
            &lt;Button
              variant="text"
              className="text-sm"
              onClick={() => onViewOrder(order)}
            &gt;
              View Details
            &lt;/Button&gt;
            
            {order.status === 'pending' &amp;&amp; (
              &lt;div className="flex space-x-2"&gt;
                &lt;Button
                  variant="secondary"
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                  onClick={() => onUpdateStatus(order.id, type === 'purchase' ? 'approved' : 'confirmed')}
                &gt;
                  {type === 'purchase' ? 'Approve' : 'Confirm'}
                &lt;/Button&gt;
                &lt;Button
                  variant="secondary"
                  className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                  onClick={() => onUpdateStatus(order.id, 'cancelled')}
                &gt;
                  Cancel
                &lt;/Button&gt;
              &lt;/div&gt;
            )}
            
            {(order.status === 'approved' &amp;&amp; type === 'purchase') &amp;&amp; (
              &lt;Button
                variant="secondary"
                className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                onClick={() => onUpdateStatus(order.id, 'received')}
              &gt;
                Mark Received
              &lt;/Button&gt;
            )}

            {(order.status === 'confirmed' &amp;&amp; type === 'sales') &amp;&amp; (
              &lt;Button
                variant="secondary"
                className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
                onClick={() => onUpdateStatus(order.id, 'shipped')}
              &gt;
                Ship
              &lt;/Button&gt;
            )}

            {(order.status === 'shipped' &amp;&amp; type === 'sales') &amp;&amp; (
              &lt;Button
                variant="secondary"
                className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                onClick={() => onUpdateStatus(order.id, 'delivered')}
              &gt;
                Delivered
              &lt;/Button&gt;
            )}
          &lt;/div&gt;
        &lt;/motion.div&gt;
      ))}
    &lt;/div&gt;
  );
};

export default OrderTable;