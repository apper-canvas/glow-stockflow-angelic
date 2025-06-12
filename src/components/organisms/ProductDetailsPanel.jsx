import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ErrorState from '@/components/molecules/ErrorState';

const ProductDetailsPanel = ({ product, supplier, loading, error, productId, loadProduct }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      &lt;div className="p-6"&gt;
        &lt;div className="max-w-4xl mx-auto"&gt;
          &lt;div className="bg-white rounded-lg p-8 shadow-sm animate-pulse"&gt;
            &lt;div className="h-8 bg-gray-200 rounded w-64 mb-6"&gt;&lt;/div&gt;
            &lt;div className="grid grid-cols-1 md:grid-cols-2 gap-8"&gt;
              &lt;div className="space-y-4"&gt;
                &lt;div className="h-4 bg-gray-200 rounded w-32"&gt;&lt;/div&gt;
                &lt;div className="h-6 bg-gray-200 rounded w-48"&gt;&lt;/div&gt;
                &lt;div className="h-4 bg-gray-200 rounded w-40"&gt;&lt;/div&gt;
              &lt;/div&gt;
              &lt;div className="space-y-4"&gt;
                &lt;div className="h-4 bg-gray-200 rounded w-32"&gt;&lt;/div&gt;
                &lt;div className="h-4 bg-gray-200 rounded w-24"&gt;&lt;/div&gt;
                &lt;div className="h-4 bg-gray-200 rounded w-36"&gt;&lt;/div&gt;
              &lt;/div&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    );
  }

  if (error || !product) {
    return (
      &lt;ErrorState
        title="Product Not Found"
        message={error || 'The requested product could not be found'}
        onRetry={() => loadProduct(productId)}
        retryButtonText="Reload Product"
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
            &lt;h1 className="text-3xl font-bold text-gray-900 break-words"&gt;{product.name}&lt;/h1&gt;
            &lt;Button
              variant="ghost"
              onClick={() => navigate('/inventory')}
            &gt;
              &lt;ApperIcon name="ArrowLeft" size={16} className="mr-2" /&gt;
              Back to Inventory
            &lt;/Button&gt;
          &lt;/div&gt;

          &lt;div className="grid grid-cols-1 md:grid-cols-2 gap-8"&gt;
            &lt;div className="space-y-6"&gt;
              &lt;div&gt;
                &lt;label className="block text-sm font-medium text-gray-700 mb-2"&gt;Product Information&lt;/label&gt;
                &lt;div className="space-y-3"&gt;
                  &lt;div className="flex justify-between"&gt;
                    &lt;span className="text-gray-500"&gt;SKU:&lt;/span&gt;
                    &lt;span className="text-gray-900 font-medium break-words"&gt;{product.sku}&lt;/span&gt;
                  &lt;/div&gt;
                  &lt;div className="flex justify-between"&gt;
                    &lt;span className="text-gray-500"&gt;Name:&lt;/span&gt;
                    &lt;span className="text-gray-900 font-medium break-words"&gt;{product.name}&lt;/span&gt;
                  &lt;/div&gt;
                  &lt;div className="flex justify-between"&gt;
                    &lt;span className="text-gray-500"&gt;Description:&lt;/span&gt;
                    &lt;span className="text-gray-900 break-words"&gt;{product.description || 'No description'}&lt;/span&gt;
                  &lt;/div&gt;
                &lt;/div&gt;
              &lt;/div&gt;

              &lt;div&gt;
                &lt;label className="block text-sm font-medium text-gray-700 mb-2"&gt;Stock Information&lt;/label&gt;
                &lt;div className="space-y-3"&gt;
                  &lt;div className="flex justify-between"&gt;
                    &lt;span className="text-gray-500"&gt;Current Stock:&lt;/span&gt;
                    &lt;span className={`font-medium ${
                      product.quantity &lt;= product.reorderPoint ? 'text-red-600' : 'text-gray-900'
                    }`}&gt;
                      {product.quantity}
                      {product.quantity &lt;= product.reorderPoint &amp;&amp; (
                        &lt;ApperIcon name="AlertTriangle" size={16} className="inline ml-2 text-red-500" /&gt;
                      )}
                    &lt;/span&gt;
                  &lt;/div&gt;
                  &lt;div className="flex justify-between"&gt;
                    &lt;span className="text-gray-500"&gt;Reorder Point:&lt;/span&gt;
                    &lt;span className="text-gray-900 font-medium"&gt;{product.reorderPoint}&lt;/span&gt;
                  &lt;/div&gt;
                  &lt;div className="flex justify-between"&gt;
                    &lt;span className="text-gray-500"&gt;Location:&lt;/span&gt;
                    &lt;span className="text-gray-900 break-words"&gt;{product.location || 'Not specified'}&lt;/span&gt;
                  &lt;/div&gt;
                &lt;/div&gt;
              &lt;/div&gt;
            &lt;/div&gt;

            &lt;div className="space-y-6"&gt;
              &lt;div&gt;
                &lt;label className="block text-sm font-medium text-gray-700 mb-2"&gt;Pricing&lt;/label&gt;
                &lt;div className="space-y-3"&gt;
                  &lt;div className="flex justify-between"&gt;
                    &lt;span className="text-gray-500"&gt;Unit Price:&lt;/span&gt;
                    &lt;span className="text-gray-900 font-medium"&gt;${product.unitPrice.toFixed(2)}&lt;/span&gt;
                  &lt;/div&gt;
                  &lt;div className="flex justify-between"&gt;
                    &lt;span className="text-gray-500"&gt;Total Value:&lt;/span&gt;
                    &lt;span className="text-gray-900 font-medium"&gt;
                      ${(product.quantity * product.unitPrice).toFixed(2)}
                    &lt;/span&gt;
                  &lt;/div&gt;
                &lt;/div&gt;
              &lt;/div&gt;

              {supplier &amp;&amp; (
                &lt;div&gt;
                  &lt;label className="block text-sm font-medium text-gray-700 mb-2"&gt;Supplier Information&lt;/label&gt;
                  &lt;div className="space-y-3"&gt;
                    &lt;div className="flex justify-between"&gt;
                      &lt;span className="text-gray-500"&gt;Company:&lt;/span&gt;
                      &lt;span className="text-gray-900 font-medium break-words"&gt;{supplier.name}&lt;/span&gt;
                    &lt;/div&gt;
                    &lt;div className="flex justify-between"&gt;
                      &lt;span className="text-gray-500"&gt;Contact:&lt;/span&gt;
                      &lt;span className="text-gray-900 break-words"&gt;{supplier.contactPerson}&lt;/span&gt;
                    &lt;/div&gt;
                    &lt;div className="flex justify-between"&gt;
                      &lt;span className="text-gray-500"&gt;Email:&lt;/span&gt;
                      &lt;span className="text-gray-900 break-words"&gt;{supplier.email}&lt;/span&gt;
                    &lt;/div&gt;
                    &lt;div className="flex justify-between"&gt;
                      &lt;span className="text-gray-500"&gt;Phone:&lt;/span&gt;
                      &lt;span className="text-gray-900 break-words"&gt;{supplier.phone}&lt;/span&gt;
                    &lt;/div&gt;
                  &lt;/div&gt;
                &lt;/div&gt;
              )}
            &lt;/div&gt;
          &lt;/div&gt;

          {product.quantity &lt;= product.reorderPoint &amp;&amp; (
            &lt;div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg"&gt;
              &lt;div className="flex items-start"&gt;
                &lt;ApperIcon name="AlertTriangle" size={20} className="text-red-600 mr-3 mt-0.5" /&gt;
                &lt;div&gt;
                  &lt;h3 className="text-sm font-medium text-red-800"&gt;Low Stock Alert&lt;/h3&gt;
                  &lt;p className="text-sm text-red-700 mt-1"&gt;
                    This product is at or below its reorder point. Consider creating a purchase order to restock.
                  &lt;/p&gt;
                &lt;/div&gt;
              &lt;/div&gt;
            &lt;/div&gt;
          )}
        &lt;/motion.div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

export default ProductDetailsPanel;