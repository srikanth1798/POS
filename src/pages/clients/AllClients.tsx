import { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaBell, FaTrash, FaSearch, FaUndo } from 'react-icons/fa';
import './ClientManagement.css';
import { AddClientModal } from './AddClientModal';
import { ClientDetailsModal } from './ClientDetailsModal';
import { EditClientModal } from './EditClientModal';
import { NotificationCard } from './NotificationCard';
import { FilterDialog } from './FilterDialog';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  segment: string;
  joinDate: string;
  services: Array<{
    name: string;
    price: number;
    status: 'ACTIVE' | 'INACTIVE';
    features: string[];
  }>;
  company: {
    name: string;
    registration: string;
    taxId: string;
    address: string;
  };
  totalAmount: number;
  billingCycle: 'monthly' | 'yearly';
  outlet: {
    name: string;
    type: 'retail' | 'restaurant' | 'warehouse' | 'franchise';
    status: 'active' | 'inactive';
    address: string;
    city: string;
    district: string;
    state: string;
    country: string;
    pincode: string;
  };
  subscription: {
    startDate: string;
    endDate: string;
    duration: string;
    status: 'active' | 'expired' | 'pending';
  };
  payment: {
    method: string;
    cardDetails?: string;
    billingAddress: string;
    gstNumber: string;
    lastPayment: {
      date: string;
      amount: number;
      status: 'paid' | 'pending' | 'failed';
    };
    nextBilling: string;
  };
  status?: 'active' | 'inactive' | 'removed';
  credentials: {
    username: string;
    password: string;
    forcePasswordChange: boolean;
    lastPasswordChange?: string;
    authMethods: {
      password: boolean;
      pattern: boolean;
      biometric: boolean;
      faceId: boolean;
      otp: boolean;
      securityKey: boolean;
    };
  };
}

const initialClients: Client[] = [
  {
    id: 'deleted1',
    name: 'Deleted Client 1',
    email: 'deleted1@example.com',
    phone: '123-456-7890',
    segment: 'standard',
    joinDate: '2023-01-01',
    status: 'removed',
    services: [
      {
        name: 'Table Management',
        price: 199.99,
        status: 'INACTIVE',
        features: ['Real-time tracking', 'Automated alerts']
      }
    ],
    company: {
      name: 'Deleted Company 1',
      registration: 'REG123',
      taxId: 'TAX123',
      address: '123 Deleted St'
    },
    totalAmount: 199.99,
    billingCycle: 'monthly',
    outlet: {
      name: 'Deleted Outlet 1',
      type: 'retail',
      status: 'inactive',
      address: '123 Deleted St',
      city: 'City',
      district: 'District',
      state: 'State',
      country: 'Country',
      pincode: '12345'
    },
    subscription: {
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      duration: '12 months',
      status: 'expired'
    },
    payment: {
      method: 'card',
      billingAddress: '123 Deleted St',
      gstNumber: 'GST123',
      lastPayment: {
        date: '2023-01-01',
        amount: 199.99,
        status: 'paid'
      },
      nextBilling: '2023-02-01'
    },
    credentials: {
      username: 'deleted1',
      password: 'password123',
      forcePasswordChange: false,
      lastPasswordChange: '2023-01-01',
      authMethods: {
        password: true,
        pattern: false,
        biometric: false,
        faceId: false,
        otp: false,
        securityKey: false,
      }
    }
  },
  {
    id: 'deleted2',
    name: 'Deleted Client 2',
    email: 'deleted2@example.com',
    phone: '987-654-3210',
    segment: 'premium',
    joinDate: '2023-02-01',
    status: 'removed',
    services: [
      {
        name: 'Inventory Management',
        price: 299.99,
        status: 'INACTIVE',
        features: ['Inventory tracking', 'Stock alerts']
      }
    ],
    company: {
      name: 'Deleted Company 2',
      registration: 'REG456',
      taxId: 'TAX456',
      address: '456 Deleted Ave'
    },
    totalAmount: 299.99,
    billingCycle: 'yearly',
    outlet: {
      name: 'Deleted Outlet 2',
      type: 'restaurant',
      status: 'inactive',
      address: '456 Deleted Ave',
      city: 'City',
      district: 'District',
      state: 'State',
      country: 'Country',
      pincode: '67890'
    },
    subscription: {
      startDate: '2023-02-01',
      endDate: '2024-01-31',
      duration: '12 months',
      status: 'expired'
    },
    payment: {
      method: 'bank',
      billingAddress: '456 Deleted Ave',
      gstNumber: 'GST456',
      lastPayment: {
        date: '2023-02-01',
        amount: 299.99,
        status: 'paid'
      },
      nextBilling: '2024-02-01'
    },
    credentials: {
      username: 'deleted2',
      password: 'password456',
      forcePasswordChange: false,
      lastPasswordChange: '2023-02-01',
      authMethods: {
        password: true,
        pattern: false,
        biometric: false,
        faceId: false,
        otp: false,
        securityKey: false,
      }
    }
  }
];

const toSentenceCase = (str: string) => {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const AllClients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load clients from localStorage on initial render
  const [clients, setClients] = useState<Client[]>(() => {
    const savedClients = localStorage.getItem('clients');
    return savedClients ? JSON.parse(savedClients) : initialClients;
  });

  // Save to localStorage whenever clients change
  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  const [activeFilters, setActiveFilters] = useState({
    segment: {
      basic: false,
      standard: false,
      premium: false
    },
    serviceCategory: {
      subscription: false,
      consulting: false,
      support: false
    },
    showExpiring: false,
    pastClients: {
      inactive: false,
      removed: false
    }
  });

  const filteredClients = clients.filter(client => {
    // Search filter
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());

    // Past clients filters
    const pastClientsFiltersActive = activeFilters.pastClients.inactive || activeFilters.pastClients.removed;
    const matchesPastClients = pastClientsFiltersActive
      ? (
        // Show inactive clients if inactive filter is active
        (activeFilters.pastClients.inactive && (client.outlet?.status === 'inactive' || client.status === 'inactive')) ||
        // Show removed clients if removed filter is active
        (activeFilters.pastClients.removed && client.status === 'removed')
      )
      : // Show only active clients if no past client filters are active
        (client.outlet?.status !== 'inactive' && client.status !== 'removed');

    // Segment filters
    const segmentFiltersActive = Object.values(activeFilters.segment).some(Boolean);
    const matchesSegment = !segmentFiltersActive || (
      (activeFilters.segment.basic && client.segment === 'basic') ||
      (activeFilters.segment.standard && client.segment === 'standard') ||
      (activeFilters.segment.premium && client.segment === 'premium')
    );

    // Service category filters
    const serviceCategoryFiltersActive = Object.values(activeFilters.serviceCategory).some(Boolean);
    const matchesServiceCategory = !serviceCategoryFiltersActive || client.services.some(service => {
      return (
        (activeFilters.serviceCategory.subscription && service.name.toLowerCase().includes('subscription')) ||
        (activeFilters.serviceCategory.consulting && service.name.toLowerCase().includes('consulting')) ||
        (activeFilters.serviceCategory.support && service.name.toLowerCase().includes('support'))
      );
    });

    // Expiring filter
    const matchesExpiring = !activeFilters.showExpiring || (() => {
      try {
        const endDate = new Date(client.subscription.endDate);
        const today = new Date();
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      } catch (error) {
        return false;
      }
    })();

    return matchesSearch && 
           matchesSegment && 
           matchesServiceCategory && 
           matchesExpiring &&
           matchesPastClients;
  });

  const handleAddClient = (clientData: any) => {
    const newClient = {
      ...clientData,
      id: Date.now().toString(),
      company: {
        name: clientData.company?.name || '',
        registration: clientData.company?.registration || '',
        taxId: clientData.company?.taxId || '',
        address: clientData.company?.address || clientData.payment?.billingAddress || ''
      },
      services: clientData.services.map((service: any) => ({
        name: service.name,
        price: service.price,
        status: 'ACTIVE' as const,
        features: [
          'Real-time tracking',
          'Automated alerts',
          'Performance analytics',
          'Custom reporting'
        ]
      })),
      outlet: {
        ...clientData.outlet,
        status: clientData.outlet?.status || 'active'
      },
      subscription: {
        startDate: clientData.subscription?.startDate || new Date().toISOString(),
        endDate: clientData.subscription?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        duration: clientData.billingCycle === 'yearly' ? '12 months' : '1 month',
        status: 'active' as const
      },
      payment: {
        method: clientData.payment?.method || '',
        billingAddress: clientData.payment?.billingAddress || '',
        gstNumber: clientData.payment?.gst || '',
        lastPayment: {
          date: new Date().toISOString(),
          amount: clientData.totalAmount,
          status: 'paid' as const
        },
        nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      status: clientData.outlet?.status || 'active',
      credentials: {
        ...clientData.credentials,
        authMethods: {
          password: true,
          pattern: false,
          biometric: false,
          faceId: false,
          otp: false,
          securityKey: false,
        }
      }
    };

    const newClients = [...clients, newClient];
    setClients(newClients);
    localStorage.setItem('clients', JSON.stringify(newClients));
    setIsModalOpen(false);
  };

  const handleDeleteClient = (clientId: string) => {
    const updatedClients = clients.map(client => 
      client.id === clientId 
        ? { ...client, status: 'removed' as 'removed' }  // Ensure status is a valid type
        : client
    );
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  // Add new restore handler function
  const handleRestoreClient = (clientId: string) => {
    const updatedClients = clients.map(client => 
      client.id === clientId 
        ? { ...client, status: 'active' as 'active' }  // Ensure status is a valid type
        : client
    );
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  // Add state for selected client and details modal
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Add these states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  // Add a new state to track viewed notifications
  const [viewedNotifications, setViewedNotifications] = useState<Set<string>>(new Set());

  // Update the getNotificationColor function
  const getNotificationColor = (client: Client) => {
    // If notification has been viewed, return default color
    if (viewedNotifications.has(client.id)) {
      return '#6B7280'; // Default gray color
    }

    // Check for password change requirement
    if (client.credentials?.forcePasswordChange) {
      return '#F59E0B'; // Warning yellow for credential change
    }

    try {
      const endDate = new Date(client.subscription.endDate);
      const today = new Date();
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // If subscription is active and not expiring soon, return default color
      if (client.subscription.status === 'active' && diffDays > 30) {
        return '#6B7280';
      }

      // For expiring soon or expired subscriptions
      if (diffDays <= 0) {
        return '#EF4444'; // Red for expired
      }
      if (diffDays <= 30) {
        return '#F59E0B'; // Yellow for expiring soon
      }
    } catch (error) {
      return '#6B7280'; // Default color on error
    }

    return '#6B7280'; // Default color
  };

  // Update the notification click handler
  const handleNotificationClick = (client: Client) => {
    // Mark notification as viewed
    setViewedNotifications(prev => new Set([...prev, client.id]));

    // Open notification card
    const clientData: Client = {
      ...client,
      subscription: {
        ...client.subscription,
        startDate: '2024-01-01',
        endDate: '2024-03-01',
        status: 'active' as const,
        duration: '2 months'
      },
      payment: {
        ...client.payment,
        lastPayment: {
          date: '2024-01-01',
          amount: 1000,
          status: 'paid'
        }
      }
    };
    setSelectedClientForNotification(clientData);
    setIsNotificationOpen(true);
  };

  // Update the handleEditClient function to reset notification when plan is renewed
  const handleEditClient = (updatedClient: Client) => {
    const newClients = clients.map(client => {
      if (client.id === updatedClient.id) {
        // If subscription is renewed, remove from viewed notifications
        if (updatedClient.subscription.status === 'active') {
          setViewedNotifications(prev => {
            const newSet = new Set(prev);
            newSet.delete(updatedClient.id);
            return newSet;
          });
        }
        return updatedClient;
      }
      return client;
    });
    setClients(newClients);
    setIsEditModalOpen(false);
  };

  // Add new state
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedClientForNotification, setSelectedClientForNotification] = useState<Client | null>(null);

  // Add state for filter dialog
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Add this helper function
  const getActiveFilterCount = () => {
    return Object.values(activeFilters.segment).filter(Boolean).length +
           Object.values(activeFilters.serviceCategory).filter(Boolean).length +
           (activeFilters.showExpiring ? 1 : 0);
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="clients-container">
      <div className="clients-header">
        <h1 className="clients-title">All Clients</h1>
        <button className="add-client-btn" onClick={() => setIsModalOpen(true)}>
          <span>+</span>
          <span>Add Client</span>
        </button>
      </div>

      <div className="search-section">
        <div className="search-input-container">
          <FaSearch size={16} color="#6B7280" />
          <input
            type="text"
            placeholder="Search clients..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-container">
          <button 
            className={`filter-btn ${getActiveFilterCount() > 0 ? 'has-filters' : ''}`}
            data-count={getActiveFilterCount() || ''}
            onClick={() => setIsFilterOpen(true)}
          >
            Filters
          </button>
        </div>
      </div>

      <div className="clients-table-container">
        <table className="clients-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>CONTACT</th>
              <th>SEGMENT</th>
              <th>ACTIVE SERVICES</th>
              <th>TOTAL AMOUNT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length > 0 ? (
              filteredClients.map(client => (
                <tr key={client.id} className={client.status === 'removed' ? 'removed-client' : ''}>
                  <td className="client-name">
                    <div className="client-name-container">
                      <span>
                        {toSentenceCase(client.name)}
                        {client.status === 'removed' && (
                          <span className="removed-badge">Deleted</span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div className="email">{client.email}</div>
                      <div className="phone">{client.phone}</div>
                    </div>
                  </td>
                  <td>
                    <span className="segment-badge">
                      {client.segment.charAt(0).toUpperCase() + client.segment.slice(1)}
                    </span>
                  </td>
                  <td>{client.services.length} services</td>
                  <td>
                    <div className="amount-cell">
                      ${client.totalAmount}
                      <span className="billing-cycle">/{client.billingCycle}</span>
                    </div>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <div className="action-icon" onClick={() => handleViewClient(client)}>
                        <FaEye />
                      </div>
                      <div className="action-icon" onClick={() => {
                        setClientToEdit(client);
                        setIsEditModalOpen(true);
                      }}>
                        <FaEdit />
                      </div>
                      <div 
                        className="action-icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNotificationClick(client);
                        }}
                      >
                        <FaBell color={getNotificationColor(client)} />
                      </div>
                      {client.status === 'removed' ? (
                        <div 
                          className="action-icon restore" 
                          onClick={() => handleRestoreClient(client.id)}
                          title="Restore client"
                        >
                          <FaUndo />
                        </div>
                      ) : (
                        <div 
                          className="action-icon delete" 
                          onClick={() => handleDeleteClient(client.id)}
                        >
                          <FaTrash />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>
                  <div className="no-data-content">
                    <span className="no-data-icon">🔍</span>
                    <p className="no-data-title">No clients found</p>
                    <p className="no-data-text">Try adjusting your filters or search terms</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddClientModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddClient}
      />

      {selectedClient && (
        <ClientDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          client={selectedClient}
        />
      )}

      {clientToEdit && (
        <EditClientModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          client={clientToEdit}
          onSave={handleEditClient}
        />
      )}

      {selectedClientForNotification && (
        <NotificationCard
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          client={selectedClientForNotification}
        />
      )}

      <FilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(filters) => {
          setActiveFilters(filters);
          setIsFilterOpen(false);
        }}
      />
    </div>
  );
};

export default AllClients; 