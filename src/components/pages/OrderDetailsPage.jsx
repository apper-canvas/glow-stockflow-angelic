import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import OrderDetailsPanel from '@/components/organisms/OrderDetailsPanel';
import * as purchaseOrderService from '@/services/api/purchaseOrderService';
import * as salesOrderService from '@/services/api/salesOrderService';
import * as supplierService from '@/services/api/supplierService';
import * as customerService from '@/services/api/customerService';
import * as productService from '@/services/api/productService';

const OrderDetailsPage = () =&gt; {
  const { type, id } = useParams();
  const [order, setOrder] = useState(null);
  const [contact, setContact] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() =&gt; {
    loadOrder(type, id);
  }, [type, id]);

  const loadOrder = async (orderType, orderId) =&gt; {
    setLoading(true);
    setError(null);
    
    try {
      let orderData;
      let contactData;
      
      if (orderType === 'purchase') {
        orderData = await purchaseOrderService.getById(orderId);
        if (orderData.supplierId) {
          contactData = await supplierService.getById(orderData.supplierId);
        }
      } else if (orderType === 'sales') {
        orderData = await salesOrderService.getById(orderId);
        if (orderData.customerId) {
          contactData = await customerService.getById(orderData.customerId);
        }
      } else {
        throw new Error('Invalid order type');
      }

      setOrder(orderData);
      setContact(contactData);

      const productsData = await productService.getAll();
      setProducts(productsData);
    } catch (err) {
      setError(err.message || 'Failed to load order');
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId) =&gt; {
    const product = products.find(p =&gt; p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const getContactName = () =&gt; {
    if (!contact) return 'Unknown';
    return type === 'purchase' ? contact.name : contact.companyName;
  };

  return (
    &lt;OrderDetailsPanel
      order={order}
      contact={contact}
      products={products}
      loading={loading}
      error={error}
      type={type}
      id={id}
      loadOrder={loadOrder}
      getContactName={getContactName}
      getProductName={getProductName}
    /&gt;
  );
};

export default OrderDetailsPage;