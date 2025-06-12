import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DashboardMetrics from '@/components/organisms/DashboardMetrics';
import LowStockAlerts from '@/components/organisms/LowStockAlerts';
import RecentOrdersList from '@/components/organisms/RecentOrdersList';
import LoadingIndicator from '@/components/molecules/LoadingIndicator';
import ErrorState from '@/components/molecules/ErrorState';
import * as productService from '@/services/api/productService';
import * as purchaseOrderService from '@/services/api/purchaseOrderService';
import * => salesOrderService from '@/services/api/salesOrderService';

const DashboardPage = () => {
  const [inventory, setInventory] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() =&gt; {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () =&gt; {
    setLoading(true);
    setError(null);
    
    try {
      const [products, purchaseOrders, salesOrders] = await Promise.all([
        productService.getAll(),
        purchaseOrderService.getAll(),
        salesOrderService.getAll()
      ]);

      setInventory(products);
      
      const lowStock = products.filter(product =&gt; product.quantity &lt;= product.reorderPoint);
      setLowStockItems(lowStock);

      const allOrders = [
        ...purchaseOrders.map(order =&gt; ({ ...order, type: 'purchase' })),
        ...salesOrders.map(order =&gt; ({ ...order, type: 'sales' }))
      ].sort((a, b) =&gt; new Date(b.orderDate) - new Date(a.orderDate)).slice(0, 5);
      
      setRecentOrders(allOrders);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReorder = async (productId) =&gt; {
    try {
      const product = inventory.find(p =&gt; p.id === productId);
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

  const handleStockAdjustment = async (productId, newQuantity) =&gt; {
    try {
      const product = inventory.find(p =&gt; p.id === productId);
      if (!product) return;

      await productService.update(productId, { quantity: newQuantity });
      toast.success(`Stock updated for ${product.name}`);
      loadDashboardData();
    } catch (err) {
      toast.error('Failed to update stock');
    }
  };

  if (loading) {
    return &lt;LoadingIndicator /&gt;;
  }

  if (error) {
    return (
      &lt;ErrorState
        title="Error Loading Dashboard"
        message={error}
        onRetry={loadDashboardData}
      /&gt;
    );
  }

  const totalInventoryValue = inventory.reduce((sum, product) =&gt; sum + (product.quantity * product.unitPrice), 0);
  const pendingPurchaseOrders = recentOrders.filter(order =&gt; order.type === 'purchase' &amp;&amp; order.status === 'pending').length;
  const pendingSalesOrders = recentOrders.filter(order =&gt; order.type === 'sales' &amp;&amp; order.status === 'pending').length;

  return (
    &lt;div className="p-6 space-y-6 max-w-full overflow-hidden"&gt;
      &lt;DashboardMetrics
        totalInventoryValue={totalInventoryValue}
        pendingPurchaseOrders={pendingPurchaseOrders}
        pendingSalesOrders={pendingSalesOrders}
        lowStockItemsCount={lowStockItems.length}
      /&gt;

      &lt;div className="grid grid-cols-1 lg:grid-cols-2 gap-6"&gt;
        &lt;LowStockAlerts
          lowStockItems={lowStockItems}
          onQuickReorder={handleQuickReorder}
          onStockAdjustment={handleStockAdjustment}
        /&gt;

        &lt;RecentOrdersList recentOrders={recentOrders} /&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

export default DashboardPage;