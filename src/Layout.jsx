import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { routes } from './config/routes';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = Object.values(routes).filter(route => !route.hidden);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-surface-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Package" size={20} className="text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">StockFlow Pro</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <ApperIcon name={item.icon} size={18} className="mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleMobileMenu}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 w-80 h-full bg-white z-50 lg:hidden"
            >
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <ApperIcon name="Package" size={20} className="text-white" />
                  </div>
                  <span className="text-lg font-semibold text-gray-900">StockFlow Pro</span>
                </div>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
              <nav className="px-4 py-6 space-y-2 overflow-y-auto">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={toggleMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <ApperIcon name={item.icon} size={18} className="mr-3" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 z-30">
          <div className="flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mr-2"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            
            <div className="relative max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ApperIcon name="Search" size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products, orders..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <ApperIcon name="Bell" size={20} className="text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-surface-50">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;