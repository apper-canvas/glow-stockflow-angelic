import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ErrorState from '@/components/molecules/ErrorState';

const OrderDetailsPanel = ({ order, contact, products, loading, error, type, id, loadOrder, getContactName, getProductName }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      &lt;div className="p-6"&gt;
        &lt;div className="max-w-4xl mx-auto"&gt;
          &lt;div className="bg-white rounded-lg p-8 shadow-sm animate-pulse"&gt;
            &lt;div className="h-8 bg-gray-200 rounded w-64 mb-6"&gt;&lt;/div&gt;
            &lt;div className="space-y-4"&gt;
              &lt;div className="h-4 bg-gray-200 rounded w-32"&gt;&lt;/div&gt;
              &lt;div className="h-4 bg-gray-200 rounded w-48"&gt;&lt;/div&gt;
              &lt;div className="h-4 bg-gray-200 rounded w-40"&gt;&lt;/div&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    );
  }

  if (error || !order) {
    return (
      &lt;ErrorState
        title="Order Not Found"
        message={error || 'The requested order could not be found'}
        onRetry={() => loadOrder(type, id)}
        retryButtonText="Reload Order"
        className="p-6 flex items-center justify-center min-h-96"
      /&gt;
    );
  }

  return (
    &lt;div className="p-6 max-w-full overflow-hidden"&gt;
      &lt;div className="max-w-4xl mx-auto"&gt;
        &lt;motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-8 shadow-sm border border-gray-100"
        &gt;
          &lt;div className="flex items-center justify-between mb-8"&gt;
            &lt;div&gt;
              &lt;h1 className="text-3xl font-bold text-gray-900 break-words"&gt;{order.orderNumber}&lt;/h1&gt;
              &lt;p className="text-lg text-gray-500 mt-1"&gt;
                {type === 'purchase' ? 'Purchase Order' : 'Sales Order'}
              &lt;/p&gt;
            &lt;/div&gt;
            &lt;Button
              variant="ghost"
              onClick={() => navigate(type === 'purchase' ? '/purchase-orders' : '/sales-orders')}
            &gt;
              &lt;ApperIcon name="ArrowLeft" size={16} className="mr-2" /&gt;
              Back to Orders
            &lt;/Button&gt;
          &lt;/div&gt;

          &lt;div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"&gt;
            &lt;div className="space-y-6"&gt;
              &lt;div&gt;
                &lt;label className="block text-sm font-medium text-gray-700 mb-2"&gt;Order Information&lt;/label&gt;
                &lt;div className="space-y-3"&gt;
                  &lt;div className="flex justify-between"&gt;
                    &lt;span className="text-gray-500"&gt;Order Number:&lt;/span&gt;
                    &lt;span className="text-gray-900 font-medium break-words"&gt;{order.orderNumber}&lt;/span&gt;
                  &lt;/div&gt;
                  &lt;div className="flex justify-between"&gt;
                    &lt;span className="text-gray-500"&gt;Status:&lt;/span&gt;
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
                  &lt;div className="flex justify-between"&gt;
                    &lt;span className="text-gray-500"&gt;Order Date:&lt;/span&gt;
                    &lt;span className="text-gray-900"&gt;{new Date(order.orderDate).toLocaleDateString()}&lt;/span&gt;
                  &lt;/div&gt;
                  {(order.expectedDate || order.shipDate) &amp;&amp; (
                    &lt;div className="flex justify-between"&gt;
                      &lt;span className="text-gray-500"&gt;
                        {type === 'purchase' ? 'Expected Date:' : 'Ship Date:'}
                      &lt;/span&gt;
                      &lt;span className="text-gray-900"&gt;
                        {new Date(order.expectedDate || order.shipDate).toLocaleDateString()}
                      &lt;/span&gt;
                    &lt;/div&gt;
                  )}
                &lt;/div&gt;
              &lt;/div&gt;
            &lt;/div&gt;

            &lt;div className="space-y-6"&gt;
              &lt;div&gt;
                &lt;label className="block text-sm font-medium text-gray-700 mb-2"&gt;
                  {type === 'purchase' ? 'Supplier Information' : 'Customer Information'}
                &lt;/label&gt;
                {contact ? (
                  &lt;div className="space-y-3"&gt;
                    &lt;div className="flex justify-between"&gt;
                      &lt;span className="text-gray-500"&gt;Company:&lt;/span&gt;
                      &lt;span className="text-gray-900 font-medium break-words"&gt;{getContactName()}&lt;/span&gt;
                    &lt;/div&gt;
                    &lt;div className="flex justify-between"&gt;
                      &lt;span className="text-gray-500"&gt;Contact:&lt;/span&gt;
                      &lt;span className="text-gray-900 break-words"&gt;{contact.contactPerson}&lt;/span&gt;
                    &lt;/div&gt;
                    &lt;div className="flex justify-between"&gt;
                      &lt;span className="text-gray-500"&gt;Email:&lt;/span&gt;
                      &lt;span className="text-gray-900 break-words"&gt;{contact.email}&lt;/span&gt;
                    &lt;/div&gt;
                    &lt;div className="flex justify-between"&gt;
                      &lt;span className="text-gray-500"&gt;Phone:&lt;/span&gt;
                      &lt;span className="text-gray-900 break-words"&gt;{contact.phone}&lt;/span&gt;
                    &lt;/div&gt;
                  &lt;/div&gt;
                ) : (
                  &lt;p className="text-gray-500"&gt;Contact information not available&lt;/p&gt;
                )}
              &lt;/div&gt;
            &lt;/div&gt;
          &lt;/div&gt;

          &lt;div&gt;
            &lt;label className="block text-sm font-medium text-gray-700 mb-4"&gt;Order Items&lt;/label&gt;
            {order.items &amp;&amp; order.items.length &gt; 0 ? (
              &lt;div className="overflow-hidden border border-gray-200 rounded-lg"&gt;
                &lt;table className="w-full"&gt;
                  &lt;thead className="bg-gray-50"&gt;
                    &lt;tr&gt;
                      &lt;th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"&gt;
                        Product
                      &lt;/th&gt;
                      &lt;th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"&gt;
                        Quantity
                      &lt;/th&gt;
                      &lt;th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"&gt;
                        Unit Price
                      &lt;/th&gt;
                      &lt;th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"&gt;
                        Total
                      &lt;/th&gt;
                    &lt;/tr&gt;
                  &lt;/thead&gt;
                  &lt;tbody className="bg-white divide-y divide-gray-200"&gt;
                    {order.items.map((item, index) =&gt; (
                      &lt;tr key={index} className="hover:bg-gray-50 transition-colors"&gt;
                        &lt;td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 break-words"&gt;
                          {getProductName(item.productId)}
                        &lt;/td&gt;
                        &lt;td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"&gt;
                          {item.quantity}
                        &lt;/td&gt;
                        &lt;td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"&gt;
                          ${item.unitPrice?.toFixed(2) || '0.00'}
                        &lt;/td&gt;
                        &lt;td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"&gt;
                          ${((item.quantity * item.unitPrice) || 0).toFixed(2)}
                        &lt;/td&gt;
                      &lt;/tr&gt;
                    ))}
                  &lt;/tbody&gt;
                &lt;/table&gt;
                
                &lt;div className="bg-gray-50 px-6 py-4"&gt;
                  &lt;div className="flex justify-between items-center"&gt;
                    &lt;span className="text-lg font-medium text-gray-900"&gt;Total Amount:&lt;/span&gt;
                    &lt;span className="text-2xl font-bold text-gray-900"&gt;
                      ${order.totalAmount?.toFixed(2) || '0.00'}
                    &lt;/span&gt;
                  &lt;/div&gt;
                &lt;/div&gt;
              &lt;/div&gt;
            ) : (
              &lt;div className="text-center py-8 border border-gray-200 rounded-lg"&gt;
                &lt;ApperIcon name="Package" size={48} className="text-gray-300 mx-auto mb-4" /&gt;
                &lt;p className="text-gray-500"&gt;No items found in this order&lt;/p&gt;
              &lt;/div&gt;
            )}
          &lt;/div&gt;
        &lt;/motion.div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

export default OrderDetailsPanel;