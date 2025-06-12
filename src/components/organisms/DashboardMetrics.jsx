import React from 'react';
import MetricCard from '@/components/molecules/MetricCard';

const DashboardMetrics = ({ totalInventoryValue, pendingPurchaseOrders, pendingSalesOrders, lowStockItemsCount }) => {
  return (
    &lt;div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"&gt;
      &lt;MetricCard
        title="Total Inventory Value"
        value={`$${totalInventoryValue.toLocaleString()}`}
        icon="DollarSign"
        iconColor="bg-green-100"
        animate
        delay={0.1}
      /&gt;

      &lt;MetricCard
        title="Pending Purchase Orders"
        value={pendingPurchaseOrders}
        icon="ShoppingCart"
        iconColor="bg-blue-100"
        animate
        delay={0.2}
      /&gt;

      &lt;MetricCard
        title="Pending Sales Orders"
        value={pendingSalesOrders}
        icon="TrendingUp"
        iconColor="bg-purple-100"
        animate
        delay={0.3}
      /&gt;

      &lt;MetricCard
        title="Low Stock Items"
        value={lowStockItemsCount}
        icon="AlertTriangle"
        iconColor="bg-red-100"
        animate
        delay={0.4}
      /&gt;
    &lt;/div&gt;
  );
};

export default DashboardMetrics;