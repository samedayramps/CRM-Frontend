// src/components/Layout.tsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'border-b-2 border-blue-500' : '';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-gray-800">CRM</span>
              </Link>
              <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 ${isActive('/')}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/customers"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 ${isActive('/customers')}`}
                >
                  Customers
                </Link>
                <Link
                  to="/jobs"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 ${isActive('/jobs')}`}
                >
                  Jobs
                </Link>
                <Link
                  to="/settings"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 ${isActive('/settings')}`}
                >
                  Settings
                </Link>
                <Link
                  to="/rental-request"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 ${isActive('/rental-request')}`}
                >
                  Rental Request
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;