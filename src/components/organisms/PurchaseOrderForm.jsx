import React from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import OrderItemFields from '@/components/organisms/OrderItemFields';
import ApperIcon from '@/components/ApperIcon';

const PurchaseOrderForm = ({
  formData,
  onFormChange,
  onSubmit,
  onCancel,
  suppliers,
  products,
  addOrderItem,
  removeOrderItem,
  updateOrderItem,
  calculateOrderTotal
}) => {
  return (
    &lt;form onSubmit={onSubmit} className="space-y-6"&gt;
      &lt;FormField
        label="Supplier"
        id="supplierId"
        type="select"
        required
        value={formData.supplierId}
        onChange={(e) => onFormChange('supplierId', e.target.value)}
      &gt;
        &lt;option value=""&gt;Select Supplier&lt;/option&gt;
        {suppliers.map(supplier =&gt; (
          &lt;option key={supplier.id} value={supplier.id}&gt;{supplier.name}&lt;/option&gt;
        ))}
      &lt;/FormField&gt;

      &lt;div&gt;
        &lt;div className="flex items-center justify-between mb-4"&gt;
          &lt;label className="block text-sm font-medium text-gray-700"&gt;Order Items&lt;/label&gt;
          &lt;Button
            type="button"
            variant="secondary"
            className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            onClick={addOrderItem}
          &gt;
            &lt;ApperIcon name="Plus" size={14} className="mr-1" /&gt;
            Add Item
          &lt;/Button&gt;
        &lt;/div&gt;
        
        &lt;div className="space-y-4"&gt;
          {formData.items.map((item, index) =&gt; (
            &lt;OrderItemFields
              key={index}
              item={item}
              index={index}
              products={products}
              updateOrderItem={updateOrderItem}
              removeOrderItem={removeOrderItem}
              isRemovable={formData.items.length &gt; 1}
            /&gt;
          ))}
        &lt;/div&gt;

        &lt;div className="mt-4 p-4 bg-blue-50 rounded-lg"&gt;
          &lt;div className="flex justify-between items-center"&gt;
            &lt;span className="text-sm font-medium text-gray-700"&gt;Order Total:&lt;/span&gt;
            &lt;span className="text-lg font-semibold text-gray-900"&gt;
              ${calculateOrderTotal(formData.items).toFixed(2)}
            &lt;/span&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      
      &lt;div className="flex justify-end space-x-3 pt-6 border-t border-gray-200"&gt;
        &lt;Button type="button" variant="secondary" onClick={onCancel}&gt;
          Cancel
        &lt;/Button&gt;
        &lt;Button type="submit" variant="primary"&gt;
          Create Order
        &lt;/Button&gt;
      &lt;/div&gt;
    &lt;/form&gt;
  );
};

export default PurchaseOrderForm;