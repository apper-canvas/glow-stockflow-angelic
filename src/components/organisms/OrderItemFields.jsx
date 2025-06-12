import React from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const OrderItemFields = ({ item, index, products, updateOrderItem, removeOrderItem, isRemovable }) => {
  return (
    &lt;div className="grid grid-cols-12 gap-3 items-end p-4 bg-gray-50 rounded-lg"&gt;
      &lt;div className="col-span-5"&gt;
        &lt;FormField
          label="Product"
          id={`product-${index}`}
          type="select"
          required
          value={item.productId}
          onChange={(e) => updateOrderItem(index, 'productId', e.target.value)}
          className="text-sm"
        &gt;
          &lt;option value=""&gt;Select Product&lt;/option&gt;
          {products.map(product =&gt; (
            &lt;option key={product.id} value={product.id}&gt;{product.name}&lt;/option&gt;
          ))}
        &lt;/FormField&gt;
      &lt;/div&gt;
      
      &lt;div className="col-span-2"&gt;
        &lt;FormField
          label="Qty"
          id={`quantity-${index}`}
          type="number"
          required
          min="1"
          value={item.quantity}
          onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
          className="text-sm"
        /&gt;
      &lt;/div&gt;
      
      &lt;div className="col-span-3"&gt;
        &lt;FormField
          label="Unit Price"
          id={`unitPrice-${index}`}
          type="number"
          required
          min="0"
          step="0.01"
          value={item.unitPrice}
          onChange={(e) => updateOrderItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
          className="text-sm"
        /&gt;
      &lt;/div&gt;
      
      &lt;div className="col-span-2 flex justify-end"&gt;
        {isRemovable &amp;&amp; (
          &lt;Button
            type="button"
            variant="icon"
            className="text-red-600 hover:text-red-700"
            onClick={() => removeOrderItem(index)}
          &gt;
            &lt;ApperIcon name="Trash2" size={16} /&gt;
          &lt;/Button&gt;
        )}
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

export default OrderItemFields;