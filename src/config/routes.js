import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Inventory from '../pages/Inventory';
import PurchaseOrders from '../pages/PurchaseOrders';
import SalesOrders from '../pages/SalesOrders';
import Suppliers from '../pages/Suppliers';
import Customers from '../pages/Customers';
import Invoices from '../pages/Invoices';
import ProductDetails from '../pages/ProductDetails';
import OrderDetails from '../pages/OrderDetails';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  inventory: {
    id: 'inventory',
    label: 'Inventory',
    path: '/inventory',
    icon: 'Package',
    component: Inventory
  },
  purchaseOrders: {
    id: 'purchaseOrders',
    label: 'Purchase Orders',
    path: '/purchase-orders',
    icon: 'ShoppingCart',
    component: PurchaseOrders
  },
  salesOrders: {
    id: 'salesOrders',
    label: 'Sales Orders',
    path: '/sales-orders',
    icon: 'TrendingUp',
    component: SalesOrders
  },
  suppliers: {
    id: 'suppliers',
    label: 'Suppliers',
    path: '/suppliers',
    icon: 'Truck',
    component: Suppliers
  },
  customers: {
    id: 'customers',
    label: 'Customers',
    path: '/customers',
    icon: 'Users',
    component: Customers
  },
  invoices: {
    id: 'invoices',
    label: 'Invoices',
    path: '/invoices',
    icon: 'FileText',
    component: Invoices
  },
  productDetails: {
    id: 'productDetails',
    path: '/product/:id',
    component: ProductDetails,
    hidden: true
  },
  orderDetails: {
    id: 'orderDetails',
    path: '/order/:type/:id',
    component: OrderDetails,
    hidden: true
  },
  notFound: {
    id: 'notFound',
    path: '*',
    component: NotFound,
    hidden: true
  }
};

export const routeArray = Object.values(routes);