import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './subscriptions.css';
import { Filter } from 'lucide-react';

type Timeframe = 'monthly' | 'yearly';

interface ProductShare {
  name: string;
  value: number;
  color: string;
}

interface SubscriptionData {
  plans: Array<{ name: string; price: string; users: number }>;
  barChartData: Array<{ month: string; value: number }>;
  targets: {
    [key: string]: { percentage: number; color: string };
  };
  productShares: Record<Timeframe, ProductShare[]>;
  revenueTrends: Array<{ month: string; revenue: number }>;
}

interface ClientData {
  name: string;
  plan: string;
}

interface ClientDetails {
  name: string;
  plan: string;
  startDate: string;
  renewalDate: string;
  usageStats: {
    storage: { used: number; total: number };
    apiCalls: { used: number; total: number };
    users: { used: number; total: number };
    projects: { used: number; total: number };
  };
}

export const SubscriptionPlans: React.FC = () => {
  const [popularityTimeframe, setPopularityTimeframe] = useState<Timeframe>('monthly');
  const [selectedClient, setSelectedClient] = useState<ClientDetails | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentPlan, setCurrentPlan] = useState<'Basic' | 'Premium' | 'Platinum'>('Basic');

  const subscriptionData: SubscriptionData & { clients: ClientData[] } = {
    plans: [
      { name: 'Basic', price: '₹999', users: 30 },
      { name: 'Premium', price: '₹1,999', users: 45 },
      { name: 'Platinum', price: '₹2,999', users: 25 }
    ],
    barChartData: [
      { month: 'Jan', value: 65 },
      { month: 'Feb', value: 55 },
      { month: 'Mar', value: 78 },
      { month: 'Apr', value: 82 },
      { month: 'May', value: 72 },
      { month: 'Jun', value: 70 },
      { month: 'Jul', value: 85 },
      { month: 'Aug', value: 62 },
      { month: 'Sep', value: 68 },
      { month: 'Oct', value: 71 },
      { month: 'Nov', value: 75 },
      { month: 'Dec', value: 80 }
    ],
    targets: {
      weekly: { percentage: 30, color: '#FD7F20' },
      monthly: { percentage: 35, color: '#FC2E20' },
      yearly: { percentage: 35, color: '#FDB750' }
    },
    productShares: {
      monthly: [
        { name: 'Basic', value: 30, color: '#FF7B9C' },
        { name: 'Premium', value: 45, color: '#9C27B0' },
        { name: 'Platinum', value: 25, color: '#E91E63' }
      ],
      yearly: [
        { name: 'Basic', value: 35, color: '#FF7B9C' },
        { name: 'Premium', value: 40, color: '#9C27B0' },
        { name: 'Platinum', value: 25, color: '#E91E63' }
      ]
    },
    revenueTrends: [
      { month: 'Jan', revenue: 25000 },
      { month: 'Feb', revenue: 35000 },
      { month: 'Mar', revenue: 32000 },
      { month: 'Apr', revenue: 45000 },
      { month: 'May', revenue: 48000 },
      { month: 'Jun', revenue: 52000 },
      { month: 'Jul', revenue: 58000 },
      { month: 'Aug', revenue: 42000 },
      { month: 'Sep', revenue: 46000 },
      { month: 'Oct', revenue: 50000 },
      { month: 'Nov', revenue: 54000 },
      { month: 'Dec', revenue: 60000 }
    ],
    clients: [
      { name: 'Acme Corp', plan: 'Premium' },
      { name: 'TechStart Inc', plan: 'Basic' },
      { name: 'Global Services', plan: 'Platinum' },
      { name: 'Innovate Solutions', plan: 'Premium' }
    ]
  };

  const COLORS = ['#FD7F20', '#FC2E20', '#FDB750'];

  const handleViewDetails = (clientName: string) => {
    const client = subscriptionData.clients.find(c => c.name === clientName);
    
    const clientDetails: ClientDetails = {
      name: clientName,
      plan: client?.plan || '',
      startDate: '2023-04-01',
      renewalDate: '2024-04-01',
      usageStats: {
        storage: { used: 7500, total: 10000 },
        apiCalls: { used: 7500, total: 10000 },
        users: { used: 75, total: 100 },
        projects: { used: 15, total: 20 }
      }
    };
    setSelectedClient(clientDetails);
    setShowModal(true);
  };

  const filteredClients = subscriptionData.clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || client.plan.toLowerCase() === selectedFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleUpgrade = () => {
    if (currentPlan === 'Basic') {
      setCurrentPlan('Premium');
    } else if (currentPlan === 'Premium') {
      setCurrentPlan('Platinum');
    }
  };

  const handleDowngrade = () => {
    if (currentPlan === 'Platinum') {
      setCurrentPlan('Premium');
    } else if (currentPlan === 'Premium') {
      setCurrentPlan('Basic');
    }
  };

  const churnRateData = [
    { month: 'Jan', churnRate: 5 },
    { month: 'Feb', churnRate: 4 },
    { month: 'Mar', churnRate: 6 },
    { month: 'Apr', churnRate: 3 },
    { month: 'May', churnRate: 5 },
    { month: 'Jun', churnRate: 4 },
    { month: 'Jul', churnRate: 7 },
    { month: 'Aug', churnRate: 6 },
    { month: 'Sep', churnRate: 5 },
    { month: 'Oct', churnRate: 4 },
    { month: 'Nov', churnRate: 3 },
    { month: 'Dec', churnRate: 5 },
  ];

  return (
    <div className="subscription-dashboard">
      <div className="dashboard-header">
        <h1>Subscription Management</h1>
        <div className="user-limits">
          <span>User Limits: 100</span>
          <span>Starting Price: ₹999</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Plan Cards */}
        <div className="plan-summary-cards">
          {[
            { name: 'Basic', color: COLORS[0], price: '₹999', users: subscriptionData.plans[0].users },
            { name: 'Premium', color: COLORS[1], price: '₹1,999', users: subscriptionData.plans[1].users },
            { name: 'Platinum', color: COLORS[2], price: '₹2,999', users: subscriptionData.plans[2].users }
          ].map((plan, index) => (
            <div key={index} className="plan-summary-card" style={{ borderLeftColor: plan.color }}>
              <div className="plan-info">
                <h4>{plan.name}</h4>
                <span className="plan-usage">{plan.users}%</span>
              </div>
              <div className="plan-details">
                <span className="price">{plan.price}</span>
              </div>
            </div>
          ))}
          
          {/* Add Churn Rate Card */}
          <div className="churn-rate-card">
            <h4>Churn Rate</h4>
            <div className="churn-value">2.3%</div>
          </div>
        </div>

        {/* First Row: Subscription Trends and Product Share */}
        <div className="charts-container">
          <div className="chart-section">
            <h3>Subscription Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subscriptionData.barChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="value" 
                  fill="#FD7F20" 
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Product Share Pie Chart */}
          <div className="chart-section">
            <div className="chart-header">
              <h3>Popularity Plan</h3>
              <div className="toggle-buttons">
                <button 
                  className={popularityTimeframe === 'monthly' ? 'active' : ''} 
                  onClick={() => setPopularityTimeframe('monthly')}
                >
                  Monthly
                </button>
                <button 
                  className={popularityTimeframe === 'yearly' ? 'active' : ''} 
                  onClick={() => setPopularityTimeframe('yearly')}
                >
                  Yearly
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subscriptionData.productShares[popularityTimeframe]}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                >
                  {subscriptionData.productShares[popularityTimeframe].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="legend">
              {subscriptionData.productShares[popularityTimeframe].map((entry, index) => (
                <div key={index} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: entry.color }}></span>
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Self-Service Section */}
        <div className="self-service-section">
          <h3>Client Self-Service Options</h3>
          <div className="current-plan">Current Plan: {currentPlan}</div>
          <div className="plan-actions">
            <button className="upgrade-btn" onClick={handleUpgrade} disabled={currentPlan === 'Platinum'}>
              Upgrade
            </button>
            <button className="downgrade-btn" onClick={handleDowngrade} disabled={currentPlan === 'Basic'}>
              Downgrade
            </button>
          </div>
        </div>

        {/* Last Row: Subscription Target and Revenue */}
        <div className="charts-bottom-container">
          {/* Subscription Targets */}
          <div className="targets-section">
            <div className="targets-card">
              <h3>Subscription Target</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(subscriptionData.targets).map(([key, value]) => ({
                      name: key,
                      value: value.percentage
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.values(subscriptionData.targets).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="legend">
                {Object.entries(subscriptionData.targets).map(([key, value], index) => (
                  <div key={index} className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: value.color }}></span>
                    <span>{key}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue Trends */}
          <div className="revenue-section">
            <div className="chart-section">
              <h3>Revenue Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subscriptionData.revenueTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Bar 
                    dataKey="revenue" 
                    fill="#4CAF50" 
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Churn Rate Bar Graph Section */}
        <div className="chart-section">
          <h3>Churn Rate Over Last 12 Months</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={churnRateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="churnRate" fill="#FC2E20" barSize={15} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Client Details Section */}
        <div className="client-details-section">
          <h3>Client Details</h3>
          <div className="client-search">
            <div className="search-filter-container">
              <input 
                type="text" 
                placeholder="Search clients..." 
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="filter-dropdown">
                <select 
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">
                    <Filter size={16} /> Filter Plans
                  </option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="platinum">Platinum</option>
                </select>
                <Filter className="filter-icon" size={16} />
              </div>
            </div>
          </div>
          <div className="client-list">
            <div className="client-header">
              <span>Name</span>
              <span>Plan</span>
              <span>Action</span>
            </div>
            {filteredClients.map((client, index) => (
              <div key={index} className="client-row">
                <span>{client.name}</span>
                <span>
                  <div className={`plan-badge ${client.plan.toLowerCase()}`}>
                    {client.plan}
                  </div>
                </span>
                <button 
                  className="view-details-btn" 
                  onClick={() => handleViewDetails(client.name)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && selectedClient && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedClient.name}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="client-info">
                <div className="info-row">
                  <span>Plan:</span>
                  <span>
                    <div className={`plan-badge ${selectedClient.plan.toLowerCase()}`}>
                      {selectedClient.plan}
                    </div>
                  </span>
                </div>
                <div className="info-row">
                  <span>Start Date:</span>
                  <span>{selectedClient.startDate}</span>
                </div>
                <div className="info-row">
                  <span>Renewal Date:</span>
                  <span>{selectedClient.renewalDate}</span>
                </div>
              </div>
              
              <h3>Usage Statistics</h3>
              <div className="usage-stats">
                {Object.entries(selectedClient.usageStats).map(([key, value]) => (
                  <div key={key} className="stat-item">
                    <div className="stat-header">
                      <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                      <span>{value.used} / {value.total}</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress" 
                        style={{ 
                          width: `${(value.used / value.total) * 100}%`,
                          backgroundColor: selectedClient.plan === 'Basic' ? '#FD7F20' :
                                 selectedClient.plan === 'Premium' ? '#FC2E20' :
                                 '#FDB750'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans; 

