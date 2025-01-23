"use client";

import React, { useState } from "react";
import {
  FileText,
  Users,
  TrendingUp,
  TrendingDown,
  Store,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import "./dashboard.css";

const cardData = [
  {
    title: "Total Clients",
    value: "3,456",
    change: "+12.5%",
    icon: <Users />,
  },
  {
    title: "New Clients Today",
    value: "15",
    change: "+3.1%",
    icon: <Users />,
  },
  {
    title: "Total Outlets",
    value: "120",
    change: "-2.5%",
    icon: <Store />,
  },
  {
    title: "Active Outlets",
    value: "95",
    change: "+5.2%",
    icon: <Store />,
  },
];

const barChartData = [
  { name: "Jan", sales: 65 },
  { name: "Feb", sales: 55 },
  { name: "Mar", sales: 78 },
  { name: "Apr", sales: 78 },
  { name: "May", sales: 72 },
  { name: "Jun", sales: 70 },
  { name: "Jul", sales: 85 },
  { name: "Aug", sales: 90 },
  { name: "Sep", sales: 75 },
  { name: "Oct", sales: 70 },
  { name: "Nov", sales: 65 },
  { name: "Dec", sales: 75 },
];

const serviceData = [
  { name: "Order Management", value: 30 },
  { name: "Inventory Management", value: 25 },
  { name: "Reports and Analytics", value: 20 },
  { name: "Multilocation Management", value: 15 },
  { name: "Table Management", value: 10 },
];

const clientTargetData = [
  { name: "Weekly%", value: 30 },
  { name: "Monthly%", value: 35 },
  { name: "Yearly%", value: 35 },
];

const subscriptionTargetData = [
  { name: "Weekly%", value: 40 },
  { name: "Monthly%", value: 35 },
  { name: "Yearly%", value: 25 },
];

const SERVICE_COLORS = ["#FD7F20", "#FC2E20", "#FDB750", "#010100"];
const CLIENT_COLORS = ["#FD7F20", "#FC2E20", "#FDB750"];

const revenueTrendData = [
  { name: "Jan", revenue: 70 },
  { name: "Feb", revenue: 68 },
  { name: "Mar", revenue: 90 },
  { name: "Apr", revenue: 100 },
  { name: "May", revenue: 95 },
  { name: "Jun", revenue: 110 },
  { name: "Jul", revenue: 115 },
  { name: "Aug", revenue: 120 },
  { name: "Sep", revenue: 105 },
  { name: "Oct", revenue: 95 },
  { name: "Nov", revenue: 90 },
  { name: "Dec", revenue: 135 },
];

const newClientsData = {
  today: [
    { time: "00:00", clients: 2 },
    { time: "02:00", clients: 1 },
    { time: "04:00", clients: 0 },
    { time: "06:00", clients: 1 },
    { time: "08:00", clients: 3 },
    { time: "10:00", clients: 5 },
    { time: "12:00", clients: 4 },
    { time: "14:00", clients: 6 },
    { time: "16:00", clients: 8 },
    { time: "18:00", clients: 7 },
    { time: "20:00", clients: 5 },
    { time: "22:00", clients: 3 },
  ],
  monthly: [
    { time: "Week 1", clients: 15 },
    { time: "Week 2", clients: 20 },
    { time: "Week 3", clients: 18 },
    { time: "Week 4", clients: 25 },
  ],
  yearly: [
    { time: "Jan", clients: 45 },
    { time: "Feb", clients: 52 },
    { time: "Mar", clients: 49 },
    { time: "Apr", clients: 60 },
    { time: "May", clients: 55 },
    { time: "Jun", clients: 58 },
    { time: "Jul", clients: 62 },
    { time: "Aug", clients: 65 },
    { time: "Sep", clients: 60 },
    { time: "Oct", clients: 58 },
    { time: "Nov", clients: 55 },
    { time: "Dec", clients: 50 },
  ],
};

const pendingInvoices = [
  { 
    refCode: "87305920", 
    customer: "Sarah Smith", 
    amount: "8,500.00", 
    status: "Due" 
  },
  { 
    refCode: "87305918", 
    customer: "Mike Johnson", 
    amount: "4,200.00", 
    status: "Due" 
  },
  { 
    refCode: "87305916", 
    customer: "Emma Davis", 
    amount: "6,700.50", 
    status: "Due" 
  },
];

const completedInvoices = [
  { 
    refCode: "87305910", 
    customer: "David Wilson", 
    amount: "9,800.00", 
    status: "Completed" 
  },
  { 
    refCode: "87305909", 
    customer: "Lisa Anderson", 
    amount: "7,600.00", 
    status: "Completed" 
  },
  { 
    refCode: "87305908", 
    customer: "Tom Brown", 
    amount: "4,900.50", 
    status: "Completed" 
  },
];

const recentInvoices = [
  { 
    refCode: "87305915", 
    customer: "John Doe", 
    amount: "12,200.00", 
    status: "Due" 
  },
  { 
    refCode: "87305913", 
    customer: "Victor James", 
    amount: "3,000.00", 
    status: "Paid" 
  },
  { 
    refCode: "87305912", 
    customer: "Jonathan Ronan", 
    amount: "5,300.50", 
    status: "Paid" 
  },
];

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | 'monthly' | 'yearly'>('today');
  const [targetView, setTargetView] = useState<'clients' | 'subscriptions'>('clients');
  const [invoiceView, setInvoiceView] = useState<'recent' | 'pending' | 'completed'>('recent');

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard Overview</h1>
          <p className="welcome-text">Welcome back, admin!</p>
        </div>
        <button className="download-btn">
          <FileText size={16} />
          Download Report
        </button>
      </div>

      <div className="cards">
        {cardData.map((card, index) => (
          <div key={index} className="card">
            <div className="card-header">
              <div>
              <div className="card-title">{card.title}</div>
                <div className="card-value">{card.value}</div>
                <div className={`card-change ${parseFloat(card.change) > 0 ? 'positive' : 'negative'}`}>
                  {parseFloat(card.change) > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {card.change}
                </div>
              </div>
              <div className="card-icon">
              {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart sales-overview">
          <h3>Sales Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="#f0f0f0"
              />
              <XAxis 
                dataKey="name" 
                axisLine={{ stroke: '#f0f0f0' }}
                tickLine={false}
                dy={10}
                tick={{ 
                  fontSize: 12,
                  textAnchor: 'middle',
                  fill: '#666'
                }}
              />
              <YAxis 
                axisLine={{ stroke: '#f0f0f0' }}
                tickLine={false}
                ticks={[0, 25, 50, 75, 100]}
                tick={{
                  fontSize: 12,
                  fill: '#666'
                }}
              />
              <Tooltip cursor={false} />
              <Bar 
                dataKey="sales" 
                fill="#FD7F20" 
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-row">
          <div className="chart services-chart">
            <h3>Top 5 Services</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                  data={serviceData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                >
                  {serviceData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={SERVICE_COLORS[index % SERVICE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip cursor={false} />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              {serviceData.map((entry, index) => (
                <div key={index} className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: SERVICE_COLORS[index] }}></span>
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart clients-chart">
            <div className="chart-header">
              <h3>{targetView === 'clients' ? 'Clients Target' : 'Subscriptions Target'}</h3>
              <button 
                className="toggle-btn"
                onClick={() => setTargetView(targetView === 'clients' ? 'subscriptions' : 'clients')}
              >
                Switch to {targetView === 'clients' ? 'Subscriptions' : 'Clients'}
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={targetView === 'clients' ? clientTargetData : subscriptionTargetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(targetView === 'clients' ? clientTargetData : subscriptionTargetData).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CLIENT_COLORS[index % CLIENT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip cursor={false} />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              {(targetView === 'clients' ? clientTargetData : subscriptionTargetData).map((entry, index) => (
                <div key={index} className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: CLIENT_COLORS[index] }}></span>
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart revenue-trend">
          <h3>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis 
                dataKey="name" 
                axisLine={{ stroke: '#f0f0f0' }}
                tickLine={false}
                dy={10}
                tick={{ 
                  fontSize: 12,
                  textAnchor: 'middle',
                  fill: '#666'
                }}
              />
              <YAxis 
                axisLine={{ stroke: '#f0f0f0' }}
                tickLine={false}
                ticks={[0, 35, 70, 105, 140]}
                tick={{
                  fontSize: 12,
                  fill: '#666'
                }}
              />
              <Tooltip cursor={false} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#FC2E20" 
                strokeWidth={2}
                dot={{ fill: "#FC2E20", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart new-clients">
          <div className="chart-header">
            <h3>New Clients Added</h3>
            <div className="time-toggle">
              <button 
                className={`toggle-btn ${timeRange === 'today' ? 'active' : ''}`}
                onClick={() => setTimeRange('today')}
              >
                Today
              </button>
              <button 
                className={`toggle-btn ${timeRange === 'monthly' ? 'active' : ''}`}
                onClick={() => setTimeRange('monthly')}
              >
                Month
              </button>
              <button 
                className={`toggle-btn ${timeRange === 'yearly' ? 'active' : ''}`}
                onClick={() => setTimeRange('yearly')}
              >
                Year
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={newClientsData[timeRange]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis 
                dataKey="time" 
                axisLine={{ stroke: '#f0f0f0' }}
                tickLine={false}
                dy={10}
                tick={{ 
                  fontSize: 12,
                  textAnchor: 'middle',
                  fill: '#666'
                }}
              />
              <YAxis 
                axisLine={{ stroke: '#f0f0f0' }}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: '#666'
                }}
              />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar 
                dataKey="clients" 
                fill="#FDB750" 
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="table-container">
        <div className="chart-header">
          <h3>
            {invoiceView === 'recent' 
              ? 'Recent Invoices' 
              : invoiceView === 'pending' 
                ? 'Pending Invoices' 
                : 'Completed Invoices'}
          </h3>
          <div className="time-toggle">
            <button 
              className={`toggle-btn ${invoiceView === 'recent' ? 'active' : ''}`}
              onClick={() => setInvoiceView('recent')}
            >
              Recent
            </button>
            <button 
              className={`toggle-btn ${invoiceView === 'pending' ? 'active' : ''}`}
              onClick={() => setInvoiceView('pending')}
            >
              Pending
            </button>
            <button 
              className={`toggle-btn ${invoiceView === 'completed' ? 'active' : ''}`}
              onClick={() => setInvoiceView('completed')}
            >
              Completed
            </button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>REF. CODE</th>
              <th>CUSTOMER</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {(invoiceView === 'recent' 
              ? recentInvoices || []
              : invoiceView === 'pending' 
                ? pendingInvoices || []
                : completedInvoices || []
            ).map((invoice: { refCode: string; customer: string; amount: string; status: string }) => (
              <tr key={invoice.refCode}>
                <td>{invoice.refCode}</td>
                <td>{invoice.customer}</td>
                <td>${invoice.amount}</td>
                <td>
                  <span className={`status-badge ${invoice.status.toLowerCase()}`}>
                    {invoice.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
