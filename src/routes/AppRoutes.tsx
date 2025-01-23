import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/dashboard/Dashboard';
import React from 'react';

// Services
const ServiceCatalog = React.lazy(() => import('../pages/services/ServiceCatalog'));
const ServiceRequests = React.lazy(() => import('../pages/services/ServiceRequests'));
const Analytics = React.lazy(() => import('../pages/services/Analytics'));

// Products
const AllProducts = React.lazy(() => import('../pages/products/AllProducts'));
const Categories = React.lazy(() => import('../pages/products/Categories'));
// const Inventory = React.lazy(() => import('../pages/products/Inventory'));

// Subscriptions
const SubscriptionPlans = React.lazy(() => import('../pages/subscriptions/SubscriptionPlans'));
const Billing = React.lazy(() => import('../pages/subscriptions/Billing'));

// Clients
const AllClients = React.lazy(() => import('../pages/clients/AllClients'));
// import Segments from '../pages/clients/Segments';

// Reports
const ReportsOverview = React.lazy(() => import('../pages/reports/Overview'));
const SalesReports = React.lazy(() => import('../pages/reports/SalesReports'));
const Performance = React.lazy(() => import('../pages/reports/Performance'));

// // Support
const Tickets = React.lazy(() => import('../pages/support/Ticket'));
const KnowledgeBase = React.lazy(() => import('../pages/support/emp'));

const AppRoutes = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        
        {/* Services Routes */}
        <Route path="/services/catalog" element={<ServiceCatalog />} />
        <Route path="/services/requests" element={<ServiceRequests />} />
        <Route path="/services/analytics" element={<Analytics />} />
        
        {/* Products Routes */}
        <Route path="/products/all" element={<AllProducts />} />
        <Route path="/products/categories" element={<Categories />} />
        {/* <Route path="/products/inventory" element={<Inventory />} /> */}
        
        {/* Subscriptions Routes */}
        <Route path="/subscriptions/plans" element={<SubscriptionPlans />} />
        <Route path="/subscriptions/billing" element={<Billing />} />
        
        {/* Clients Routes */}
        <Route path="/clients/all" element={<AllClients />} />
        {/* <Route path="/clients/segments" element={<Segments />} /> */}
        
        {/* Reports Routes */}
        <Route path="/reports/overview" element={<ReportsOverview />} />
        <Route path="/reports/sales" element={<SalesReports />} />
        <Route path="/reports/performance" element={<Performance />} />
        
        {/* Support Routes */}
        { <Route path="/support/ticket" element={<Tickets />} /> }
        {<Route path="/support/emp" element={<KnowledgeBase />} /> }
      </Routes>
    </React.Suspense>
  );
};

export default AppRoutes; 