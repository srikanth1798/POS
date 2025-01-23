import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  Package, 
  CreditCard, 
  Users, 
  BarChart2, 
  HeadphonesIcon
} from 'lucide-react';
import './Sidebar.css';

const menuItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: '/',
    icon: <LayoutDashboard size={20} />
  },
  {
    id: 'services',
    title: 'Services',
    path: '/services',
    icon: <Settings size={20} />,
    subItems: [
      { id: 'service-catalog', title: 'Service Catalog', path: '/services/catalog' },
      { id: 'service-requests', title: 'Service Requests', path: '/services/requests' },
      { id: 'analytics', title: 'Analytics', path: '/services/analytics' }
    ]
  },
  {
    id: 'product-management',
    title: 'Product Management',
    path: '/products',
    icon: <Package size={20} />,
    subItems: [
      { id: 'all-products', title: 'All Products', path: '/products/all' },
      { id: 'categories', title: 'Categories', path: '/products/categories' },
      { id: 'inventory', title: 'Inventory', path: '/products/inventory' }
    ]
  },
  {
    id: 'subscriptions',
    title: 'Subscriptions',
    path: '/subscriptions',
    icon: <CreditCard size={20} />,
    subItems: [
      { id: 'plans', title: 'Plans', path: '/subscriptions/plans' },
      { id: 'billing', title: 'Billing', path: '/subscriptions/billing' }
    ]
  },
  {
    id: 'client-management',
    title: 'Client Management',
    path: '/clients',
    icon: <Users size={20} />,
    subItems: [
      { id: 'all-clients', title: 'All Clients', path: '/clients/all' },
      { id: 'segments', title: 'Segments', path: '/clients/segments' }
    ]
  },
  {
    id: 'reports',
    title: 'Reports',
    path: '/reports',
    icon: <BarChart2 size={20} />,
    subItems: [
      { id: 'overview', title: 'Overview', path: '/reports/overview' },
      { id: 'sales-reports', title: 'Sales Reports', path: '/reports/sales' },
      { id: 'performance', title: 'Performance', path: '/reports/performance' }
    ]
  },
  {
    id: 'support',
    title: 'Support System',
    path: '/support/Ticket',
    icon: <HeadphonesIcon size={20} />
    // subItems: [
    //   { id: 'tickets', title: 'Tickets', path: '/support/tickets' },
    //   { id: 'knowledge-base', title: 'Knowledge Base', path: '/support/kb' }
    // ]
  }
];

const Sidebar = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Hotel PoS Admin</h2>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <div key={item.id} className="nav-item">
            {item.subItems ? (
              <div 
                className="menu-item"
                onClick={() => {
                  setExpandedItems(prev => 
                    prev.includes(item.id) 
                      ? prev.filter(id => id !== item.id)
                      : [...prev, item.id]
                  );
                }}
              >
                <div className="menu-item-content">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
                <span className="expand-icon">
                  {expandedItems.includes(item.id) ? '▼' : '▶'}
                </span>
              </div>
            ) : (
              <NavLink 
                to={item.path}
                className={({ isActive }) => 
                  `menu-item ${isActive ? 'active' : ''}`
                }
              >
                <div className="menu-item-content">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
              </NavLink>
            )}
            
            {item.subItems && expandedItems.includes(item.id) && (
              <div className="submenu">
                {item.subItems.map(subItem => (
                  <NavLink 
                    key={subItem.id}
                    to={subItem.path}
                    className={({ isActive }) => 
                      `submenu-item ${isActive ? 'active' : ''}`
                    }
                  >
                    {subItem.title}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 