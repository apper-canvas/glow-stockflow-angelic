import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import EmptyState from '@/components/molecules/EmptyState';

const ProductListTable = ({ products, searchTerm, selectedSupplier, onAddProduct, onUpdateQuantity, onDeleteProduct }) => {
  if (products.length === 0) {
    return (
      &lt;EmptyState
        icon="Package"
        title="No Products Found"
        description={
          searchTerm || selectedSupplier
            ? 'Try adjusting your filters'
            : 'Add your first product to get started'
        }
        buttonText="Add Product"
        onButtonClick={onAddProduct}
      /&gt;
    );
  }

  return (
    &lt;div className="overflow-x-auto"&gt;
      &lt;table className="w-full"&gt;
        &lt;thead className="bg-gray-50 border-b border-gray-200"&gt;
          &lt;tr&gt;
            &lt;th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"&gt;Product&lt;/th&gt;
            &lt;th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"&gt;SKU&lt;/th&gt;
            &lt;th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"&gt;Stock&lt;/th&gt;
            &lt;th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"&gt;Reorder Point&lt;/th&gt;
            &lt;th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"&gt;Unit Price&lt;/th&gt;
            &lt;th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"&gt;Location&lt;/th&gt;
            &lt;th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"&gt;Actions&lt;/th&gt;
          &lt;/tr&gt;
        &lt;/thead&gt;
        &lt;tbody className="bg-white divide-y divide-gray-200"&gt;
          {products.map((product, index) => (
            &lt;motion.tr
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-gray-50 transition-colors"
            &gt;
              &lt;td className="px-6 py-4 whitespace-nowrap"&gt;
                &lt;div&gt;
                  &lt;div className="text-sm font-medium text-gray-900 break-words"&gt;{product.name}&lt;/div&gt;
                  &lt;div className="text-sm text-gray-500 break-words"&gt;{product.description}&lt;/div&gt;
                &lt;/div&gt;
              &lt;/td&gt;
              &lt;td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"&gt;
                {product.sku}
              &lt;/td&gt;
              &lt;td className="px-6 py-4 whitespace-nowrap"&gt;
                &lt;div className="flex items-center space-x-2"&gt;
                  &lt;span className={`text-sm font-medium ${
                    product.quantity &lt;= product.reorderPoint ? 'text-red-600' : 'text-gray-900'
                  }`}&gt;
                    {product.quantity}
                  &lt;/span&gt;
                  {product.quantity &lt;= product.reorderPoint &amp;&amp; (
                    &lt;ApperIcon name="AlertTriangle" size={16} className="text-red-500" /&gt;
                  )}
                &lt;/div&gt;
              &lt;/td&gt;
              &lt;td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"&gt;
                {product.reorderPoint}
              &lt;/td&gt;
              &lt;td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"&gt;
                ${product.unitPrice.toFixed(2)}
              &lt;/td&gt;
              &lt;td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"&gt;
                {product.location}
              &lt;/td&gt;
              &lt;td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"&gt;
                &lt;Button
                  variant="text"
                  onClick={() => {
                    const newQuantity = prompt(`Enter new quantity for ${product.name}:`, product.quantity);
                    if (newQuantity &amp;&amp; !isNaN(newQuantity)) {
                      onUpdateQuantity(product.id, newQuantity);
                    }
                  }}
                &gt;
                  &lt;ApperIcon name="Edit" size={16} /&gt;
                &lt;/Button&gt;
                &lt;Button
                  variant="text"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => onDeleteProduct(product.id)}
                &gt;
                  &lt;ApperIcon name="Trash2" size={16} /&gt;
                &lt;/Button&gt;
              &lt;/td&gt;
            &lt;/motion.tr&gt;
          ))}
        &lt;/tbody&gt;
      &lt;/table&gt;
    &lt;/div&gt;
  );
};

export default ProductListTable;