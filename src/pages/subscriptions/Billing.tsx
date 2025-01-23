import { useState } from 'react';
import { Download, Search, Filter, Calendar, ArrowUpDown, Mail, XCircle, RefreshCw, X } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Transaction {
  id: string;
  subscriberName: string;
  date: string;
  paymentMethod: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  invoiceUrl?: string;
}

interface SubscriberDetails {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  businessAddress: string;
  plan: string;
  activationDate: string;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Overdue';
  billingHistory: Transaction[];
}

interface PlanPopularity {
  name: string;
  subscribers: number;
  color: string;
}

interface RegionData {
  region: string;
  subscribers: number;
}

export const Billing = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [selectedSubscriber, setSelectedSubscriber] = useState<SubscriberDetails | null>(null);
  const [showModal, setShowModal] = useState(false);

  const transactions: Transaction[] = [
    {
      id: 'TRX-001',
      subscriberName: 'John Doe',
      date: '2024-03-15',
      paymentMethod: 'Credit Card',
      amount: 999,
      status: 'Completed',
      invoiceUrl: '/invoices/TRX-001.pdf'
    },
    {
      id: 'TRX-002',
      subscriberName: 'Jane Smith',
      date: '2024-03-14',
      paymentMethod: 'UPI',
      amount: 1999,
      status: 'Pending',
      invoiceUrl: '/invoices/TRX-002.pdf'
    },
    // Add more sample transactions...
  ];

  const planPopularityData: PlanPopularity[] = [
    { name: 'Basic', subscribers: 120, color: '#4CAF50' },
    { name: 'Premium', subscribers: 80, color: '#2196F3' },
    { name: 'Platinum', subscribers: 40, color: '#9C27B0' }
  ];

  const regionData: RegionData[] = [
    { region: 'North', subscribers: 85 },
    { region: 'South', subscribers: 95 },
    { region: 'East', subscribers: 65 },
    { region: 'West', subscribers: 75 },
    { region: 'Central', subscribers: 55 }
  ];

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleViewDetails = (subscriberId: string) => {
    // This would typically fetch subscriber details from your API
    const subscriberDetails: SubscriberDetails = {
      id: subscriberId,
      fullName: 'John Doe',
      email: 'john@restaurant.com',
      phone: '+91 98765 43210',
      businessName: "John's Restaurant",
      businessAddress: '123 Food Street, Cuisine City, 400001',
      plan: 'Premium',
      activationDate: '2024-01-01',
      expiryDate: '2024-12-31',
      status: 'Active',
      billingHistory: [
        {
          id: 'TRX-001',
          subscriberName: 'John Doe',
          date: '2024-03-15',
          paymentMethod: 'Credit Card',
          amount: 999,
          status: 'Completed'
        },
        // Add more history items...
      ]
    };
    setSelectedSubscriber(subscriberDetails);
    setShowModal(true);
  };

  const handleSendReminder = (email: string) => {
    // Implement reminder email logic
    console.log(`Sending reminder to ${email}`);
  };

  const handleRenewPlan = (subscriberId: string) => {
    // Implement renewal logic
    console.log(`Renewing plan for ${subscriberId}`);
  };

  const handleCancelSubscription = (subscriberId: string) => {
    // Implement cancellation logic
    console.log(`Cancelling subscription for ${subscriberId}`);
  };

  return (
    <div className="transactions-page">
      <div className="page-header">
        <div className="header-title">
          <h1>Transactions</h1>
          <p className="subtitle">View and manage all payment transactions</p>
        </div>
        <div className="header-actions">
          <button className="primary-button">
            <Download size={16} />
            Export Transactions
          </button>
        </div>
      </div>

      <div className="transactions-summary">
        <div className="summary-card">
          <h3>Total Transactions</h3>
          <div className="amount">₹1,45,250</div>
          <div className="trend positive">+15.2% vs last month</div>
        </div>
        <div className="summary-card">
          <h3>Successful Payments</h3>
          <div className="amount">142</div>
          <div className="trend positive">98.6% success rate</div>
        </div>
        <div className="summary-card">
          <h3>Failed Transactions</h3>
          <div className="amount">2</div>
          <div className="trend negative">1.4% failure rate</div>
        </div>
        <div className="summary-card">
          <h3>Pending Payments</h3>
          <div className="amount">5</div>
          <div className="trend neutral">Awaiting confirmation</div>
        </div>
      </div>

      <div className="analytics-section">
        <div className="chart-container">
          <h3>Plan Distribution</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planPopularityData}
                  dataKey="subscribers"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {planPopularityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h3>Geographical Distribution</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="subscribers" fill="#4CAF50">
                  {regionData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={`hsl(122, 39%, ${45 + (index * 5)}%)`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by transaction ID or subscriber..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <div className="filter-item">
            <Filter size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="filter-item">
            <Calendar size={16} />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="transactions-table">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>
                Transaction ID
                {sortConfig.key === 'id' && <ArrowUpDown size={16} />}
              </th>
              <th onClick={() => handleSort('subscriberName')}>
                Subscriber
                {sortConfig.key === 'subscriberName' && <ArrowUpDown size={16} />}
              </th>
              <th onClick={() => handleSort('date')}>
                Date
                {sortConfig.key === 'date' && <ArrowUpDown size={16} />}
              </th>
              <th onClick={() => handleSort('paymentMethod')}>
                Payment Method
                {sortConfig.key === 'paymentMethod' && <ArrowUpDown size={16} />}
              </th>
              <th onClick={() => handleSort('amount')}>
                Amount
                {sortConfig.key === 'amount' && <ArrowUpDown size={16} />}
              </th>
              <th onClick={() => handleSort('status')}>
                Status
                {sortConfig.key === 'status' && <ArrowUpDown size={16} />}
              </th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} onClick={() => handleViewDetails(transaction.id)}>
                <td className="transaction-id">{transaction.id}</td>
                <td>{transaction.subscriberName}</td>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.paymentMethod}</td>
                <td className="amount">₹{transaction.amount}</td>
                <td>
                  <span className={`status-badge ${transaction.status.toLowerCase()}`}>
                    {transaction.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="icon-button"
                    onClick={() => window.open(transaction.invoiceUrl, '_blank')}
                    title="Download Invoice"
                  >
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="page-button" disabled>Previous</button>
        <div className="page-numbers">
          <button className="page-number active">1</button>
          <button className="page-number">2</button>
          <button className="page-number">3</button>
          <span>...</span>
          <button className="page-number">10</button>
        </div>
        <button className="page-button">Next</button>
      </div>

      {showModal && selectedSubscriber && (
        <div className="modal">
          <div className="modal-content subscriber-details">
            <div className="modal-header">
              <h2>Subscriber Details</h2>
              <button className="icon-button" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="details-grid">
                <div className="details-section">
                  <h3>Personal Information</h3>
                  <div className="info-group">
                    <label>Full Name</label>
                    <span>{selectedSubscriber.fullName}</span>
                  </div>
                  <div className="info-group">
                    <label>Email</label>
                    <span>{selectedSubscriber.email}</span>
                  </div>
                  <div className="info-group">
                    <label>Phone</label>
                    <span>{selectedSubscriber.phone}</span>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Business Details</h3>
                  <div className="info-group">
                    <label>Business Name</label>
                    <span>{selectedSubscriber.businessName}</span>
                  </div>
                  <div className="info-group">
                    <label>Address</label>
                    <span>{selectedSubscriber.businessAddress}</span>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Subscription Details</h3>
                  <div className="info-group">
                    <label>Current Plan</label>
                    <span className="plan-badge">{selectedSubscriber.plan}</span>
                  </div>
                  <div className="info-group">
                    <label>Status</label>
                    <span className={`status-badge ${selectedSubscriber.status.toLowerCase()}`}>
                      {selectedSubscriber.status}
                    </span>
                  </div>
                  <div className="info-group">
                    <label>Activation Date</label>
                    <span>{new Date(selectedSubscriber.activationDate).toLocaleDateString()}</span>
                  </div>
                  <div className="info-group">
                    <label>Expiry Date</label>
                    <span>{new Date(selectedSubscriber.expiryDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="action-buttons modal-actions">
                <button 
                  className="action-button primary"
                  onClick={() => handleRenewPlan(selectedSubscriber.id)}
                >
                  <RefreshCw size={16} />
                  Renew Plan
                </button>
                <button 
                  className="action-button warning"
                  onClick={() => handleSendReminder(selectedSubscriber.email)}
                >
                  <Mail size={16} />
                  Send Reminder
                </button>
                <button 
                  className="action-button danger"
                  onClick={() => handleCancelSubscription(selectedSubscriber.id)}
                >
                  <XCircle size={16} />
                  Cancel Subscription
                </button>
              </div>

              <div className="billing-history">
                <h3>Billing History</h3>
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Payment Method</th>
                      <th>Status</th>
                      <th>Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSubscriber.billingHistory.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{new Date(transaction.date).toLocaleDateString()}</td>
                        <td className="amount">₹{transaction.amount}</td>
                        <td>{transaction.paymentMethod}</td>
                        <td>
                          <span className={`status-badge ${transaction.status.toLowerCase()}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td>
                          <button className="icon-button">
                            <Download size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing; 