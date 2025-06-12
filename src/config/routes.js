import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';
import InventoryPage from '@/components/pages/InventoryPage';
import PurchaseOrdersPage from '@/components/pages/PurchaseOrdersPage';
import SalesOrdersPage from '@/components/pages/SalesOrdersPage';
import SuppliersPage from '@/components/pages/SuppliersPage';
import CustomersPage from '@/components/pages/CustomersPage';
import InvoicesPage from '@/components/pages/InvoicesPage';
import ProductDetailsPage from '@/components/pages/ProductDetailsPage';
import OrderDetailsPage from '@/components/pages/OrderDetailsPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
    id: 'home',
label: 'Home',
    path: '/',
    icon: 'Home',
    component: HomePage
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: DashboardPage
  },
  inventory: {
    id: 'inventory',
    label: 'Inventory',
    path: '/inventory',
    icon: 'Package',
    component: InventoryPage
  },
  purchaseOrders: {
    id: 'purchaseOrders',
    label: 'Purchase Orders',
    path: '/purchase-orders',
    icon: 'ShoppingCart',
    component: PurchaseOrdersPage
  },
  salesOrders: {
    id: 'salesOrders',
    label: 'Sales Orders',
    path: '/sales-orders',
    icon: 'TrendingUp',
    component: SalesOrdersPage
  },
  suppliers: {
    id: 'suppliers',
    label: 'Suppliers',
    path: '/suppliers',
    icon: 'Truck',
    component: SuppliersPage
  },
  customers: {
    id: 'customers',
    label: 'Customers',
    path: '/customers',
    icon: 'Users',
    component: CustomersPage
  },
  invoices: {
    id: 'invoices',
    label: 'Invoices',
    path: '/invoices',
    icon: 'FileText',
    component: InvoicesPage
  },
  productDetails: {
    id: 'productDetails',
    path: '/product/:id',
    component: ProductDetailsPage,
    hidden: true
  },
  orderDetails: {
    id: 'orderDetails',
    path: '/order/:type/:id',
    component: OrderDetailsPage,
    hidden: true
  },
  notFound: {
    id: 'notFound',
    path: '*',
component: NotFoundPage,
    hidden: true
  }
};

export const routeArray = Object.values(routes);