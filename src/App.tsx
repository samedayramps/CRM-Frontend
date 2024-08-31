// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

// Import components
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/CustomerList';
import CustomerDetail from './pages/CustomerDetail';
import CustomerEdit from './pages/CustomerEdit';
import CustomerNew from './pages/CustomerNew';
import JobList from './pages/JobList';
import JobDetail from './pages/JobDetail';
import JobEdit from './pages/JobEdit';
import JobNew from './pages/JobNew';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

          {/* Customer routes */}
          <Route path="/customers" element={<PrivateRoute><CustomerList /></PrivateRoute>} />
          <Route path="/customers/new" element={<PrivateRoute><CustomerNew /></PrivateRoute>} />
          <Route path="/customers/:id" element={<PrivateRoute><CustomerDetail /></PrivateRoute>} />
          <Route path="/customers/:id/edit" element={<PrivateRoute><CustomerEdit /></PrivateRoute>} />

          {/* Job routes */}
          <Route path="/jobs" element={<PrivateRoute><JobList /></PrivateRoute>} />
          <Route path="/jobs/new" element={<PrivateRoute><JobNew /></PrivateRoute>} />
          <Route path="/jobs/:id" element={<PrivateRoute><JobDetail /></PrivateRoute>} />
          <Route path="/jobs/:id/edit" element={<PrivateRoute><JobEdit /></PrivateRoute>} />

          {/* Settings route */}
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

          {/* 404 Not Found route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;