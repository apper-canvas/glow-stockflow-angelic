import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Modal from '@/components/molecules/Modal';
import LoadingIndicator from '@/components/molecules/LoadingIndicator';
import ErrorState from '@/components/molecules/ErrorState';
import SalesOrderForm from '@/components/organisms/SalesOrderForm';
import OrderTable from '@/components/organisms/OrderTable';
import * as salesOrderService from '@/services/api/salesOrderService';
import * as customerService from '@/services/api/customerService';
import * as productService from '@/services/api/productService';
import { useNavigate } from 'react-router-dom';

const SalesOrdersPage = () =&gt; {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerId: '',
    items: [{ productId: '', quantity: 1, unitPrice: 0 }],
    status: 'pending'
  });

  useEffect(() =&gt; {
    loadData();
  }, []);

  const loadData = async () =&gt; {
    setLoading(true);
    setError(null);
    
    try {
      const [ordersData, customersData, productsData] = await Promise.all([
        salesOrderService.getAll(),
        customerService.getAll(),
        productService.getAll()
      ]);
      setOrders(ordersData);
      setCustomers(customersData);
      setProducts(productsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load sales orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) =&gt; {
    e.preventDefault();
    try {
      await salesOrderService.create(newOrder);
      toast.success('Sales order created successfully');
      setShowCreateModal(false);
      setNewOrder({
        customerId: '',
        items: [{ productId: '', quantity: 1, unitPrice: 0 }],
        status: 'pending'
      });
      loadData();
    } catch (err) {
      toast.error('Failed to create sales order');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) =&gt; {
    try {
      await salesOrderService.update(orderId, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      loadData();
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const addOrderItem = () =&gt; {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { productId: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const removeOrderItem = (index) =&gt; {
    if (newOrder.items.length &gt; 1) {
      setNewOrder({
        ...newOrder,
        items: newOrder.items.filter((_, i) =&gt; i !== index)
      });
    }
  };

  const updateOrderItem = (index, field, value) =&gt; {
    const updatedItems = newOrder.items.map((item, i) =&gt; {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        
        if (field === 'productId' &amp;&amp; value) {
          const product = products.find(p =&gt; p.id === value);
          if (product) {
            updatedItem.unitPrice = product.unitPrice;
          }
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  const getCustomerName = (order) =&gt; {
    const customer = customers.find(c =&gt; c.id === order.customerId);
    return customer ? customer.companyName : 'Unknown Customer';
  };

  const calculateOrderTotal = (orderItems) =&gt; {
    return orderItems.reduce((total, item) =&gt; total + (item.quantity * item.unitPrice), 0);
  };

  if (loading) {
    return &lt;LoadingIndicator /&gt;;
  }

  if (error) {
    return (
      &lt;ErrorState
        title="Error Loading Sales Orders"
        message={error}
        onRetry={loadData}
      /&gt;
    );
  }

  return (
    &lt;div className="p-6 space-y-6 max-w-full overflow-hidden"&gt;
      &lt;div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"&gt;
        &lt;h1 className="text-2xl font-bold text-gray-900"&gt;Sales Orders&lt;/h1&gt;
        &lt;Button onClick={() =&gt; setShowCreateModal(true)}&gt;
          &lt;ApperIcon name="Plus" size={16} className="mr-2" /&gt;
          Create Order
        &lt;/Button&gt;
      &lt;/div&gt;

      &lt;OrderTable
        orders={orders}
        type="sales"
        onCreateOrder={() =&gt; setShowCreateModal(true)}
        getContactName={getCustomerName}
        onUpdateStatus={handleUpdateStatus}
        onViewOrder={(order) =&gt; navigate(`/order/sales/${order.id}`)}
      /&gt;

      &lt;Modal
        isOpen={showCreateModal}
        onClose={() =&gt; setShowCreateModal(false)}
        title="Create Sales Order"
        size="lg"
      &gt;
        &lt;SalesOrderForm
          formData={newOrder}
          onFormChange={(field, value) =&gt; setNewOrder(prev =&gt; ({ ...prev, [field]: value }))}
          onSubmit={handleCreateOrder}
          onCancel={() =&gt; setShowCreateModal(false)}
          customers={customers}
          products={products}
          addOrderItem={addOrderItem}
          removeOrderItem={removeOrderItem}
          updateOrderItem={updateOrderItem}
          calculateOrderTotal={calculateOrderTotal}
        /&gt;
      &lt;/Modal&gt;
    &lt;/div&gt;
  );
};

export default SalesOrdersPage;