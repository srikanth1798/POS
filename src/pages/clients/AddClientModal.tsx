import { useState } from 'react';
import './ClientManagement.css';
import { 
  Lock, 
  Grid, 
  Fingerprint, 
  Scan, 
  KeyRound,
  ShieldCheck 
} from 'lucide-react';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (clientData: any) => void;
}

interface Service {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  segment: 'basic' | 'standard' | 'premium';
  billingCycle: 'monthly' | 'yearly';
  selectedServices: Set<string>;
  totalAmount: number;
  outlet: {
    name: string;
    type: 'retail' | 'restaurant' | 'warehouse' | 'franchise';
    address: string;
    city: string;
    district: string;
    state: string;
    country: string;
    pincode: string;
  };
  payment: {
    method: 'credit_card' | 'bank_transfer' | 'upi' | 'cash';
    terms: 'prepaid' | 'postpaid';
    billingAddress: string;
    gst: string;
  };
  credentials: {
    username: string;
    password: string;
    forcePasswordChange: boolean;
    authMethods: {
      password: boolean;
      pattern: boolean;
      biometric: boolean;
      faceId: boolean;
      otp: boolean;
      securityKey: boolean;
    };
  };
  subscription: {
    startDate: string;
  };
}

export const AddClientModal = ({ isOpen, onClose, onAdd }: AddClientModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    segment: 'basic',
    billingCycle: 'monthly',
    selectedServices: new Set<string>(),
    totalAmount: 0,
    outlet: {
      name: '',
      type: 'retail',
      address: '',
      city: '',
      district: '',
      state: '',
      country: '',
      pincode: ''
    },
    payment: {
      method: 'credit_card',
      terms: 'prepaid',
      billingAddress: '',
      gst: ''
    },
    credentials: {
      username: '',
      password: '',
      forcePasswordChange: true,
      authMethods: {
        password: true,
        pattern: false,
        biometric: false,
        faceId: false,
        otp: false,
        securityKey: false
      }
    },
    subscription: {
      startDate: new Date().toISOString().split('T')[0]
    }
  });

  const [showPassword, setShowPassword] = useState(false);

  const services: Service[] = [
    { id: 'sales', name: 'Sales Management', monthlyPrice: 150, yearlyPrice: 1500 },
    { id: 'inventory', name: 'Inventory Management', monthlyPrice: 175, yearlyPrice: 1750 },
    { id: 'billing', name: 'Billing Management', monthlyPrice: 145, yearlyPrice: 1450 },
    { id: 'order', name: 'Order Management', monthlyPrice: 175, yearlyPrice: 1750 },
    { id: 'employee', name: 'Employee Management', monthlyPrice: 145, yearlyPrice: 1450 },
    { id: 'menu', name: 'Menu Management', monthlyPrice: 145, yearlyPrice: 1450 },
  ];

  const segments = [
    { 
      value: 'basic', 
      label: 'Basic', 
      discount: 0,
      description: 'No discount'
    },
    { 
      value: 'standard', 
      label: 'Standard', 
      discount: 10,
      description: 'Save 10% on all services'
    },
    { 
      value: 'premium', 
      label: 'Premium', 
      discount: 20,
      description: 'Save 20% on all services'
    }
  ];

  const handleServiceToggle = (service: Service) => {
    const newSelected = new Set(formData.selectedServices);
    let newTotal = calculateTotal(newSelected, service.id);
    
    if (newSelected.has(service.id)) {
      newSelected.delete(service.id);
    } else {
      newSelected.add(service.id);
    }
    
    setFormData({ ...formData, selectedServices: newSelected, totalAmount: newTotal });
  };

  const calculateTotal = (selectedServices: Set<string>, toggledServiceId?: string, overrideSegment?: string) => {
    let total = 0;
    const servicesList = new Set(selectedServices);
    
    if (toggledServiceId) {
      if (servicesList.has(toggledServiceId)) {
        servicesList.delete(toggledServiceId);
      } else {
        servicesList.add(toggledServiceId);
      }
    }

    servicesList.forEach(serviceId => {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        total += formData.billingCycle === 'monthly' ? service.monthlyPrice : service.yearlyPrice;
      }
    });

    // Apply segment discount using overrideSegment or current segment
    const segment = segments.find(s => s.value === (overrideSegment || formData.segment));
    if (segment) {
      total = total * (1 - segment.discount / 100);
    }

    return Number(total.toFixed(2));
  };

  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData({
      ...formData,
      credentials: {
        ...formData.credentials,
        password
      }
    });
  };

  const handleSubmit = () => {
    const endDate = calculateEndDate(formData.subscription.startDate, formData.billingCycle);

    const clientData = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      segment: formData.segment,
      joinDate: new Date(formData.subscription.startDate).toLocaleDateString(),
      services: formData.selectedServices ? Array.from(formData.selectedServices).map(id => ({
        name: services.find(s => s.id === id)?.name || '',
        price: services.find(s => s.id === id)?.monthlyPrice || 0,
        status: 'ACTIVE' as const,
        features: []
      })) : [],
      totalAmount: formData.totalAmount,
      billingCycle: formData.billingCycle,
      outlet: formData.outlet,
      subscription: {
        startDate: formData.subscription.startDate,
        endDate: endDate,
        duration: formData.billingCycle === 'yearly' ? '12 months' : '1 month',
        status: 'active' as const
      },
      payment: {
        ...formData.payment,
        lastPayment: {
          date: formData.subscription.startDate,
          amount: formData.totalAmount,
          status: 'paid' as const
        },
        nextBilling: new Date(new Date(formData.subscription.startDate).setMonth(new Date(formData.subscription.startDate).getMonth() + 1)).toISOString()
      },
      company: {
        name: '',
        registration: '',
        taxId: '',
        address: formData.payment.billingAddress
      }
    };

    onAdd(clientData);
    onClose();
  };

  const calculateEndDate = (startDate: string, billingCycle: 'monthly' | 'yearly') => {
    const start = new Date(startDate);
    const end = new Date(start);
    
    if (billingCycle === 'yearly') {
      end.setFullYear(end.getFullYear() + 1);
    } else {
      end.setMonth(end.getMonth() + 1);
    }
    
    return end.toISOString();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Client</h2>
          <button 
            className="close-modal-btn" 
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>
              Phone <span className="required">*</span>
            </label>
            <input
              type="tel"
              className="form-input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>
              Segment <span className="required">*</span>
            </label>
            <div className="segment-selection">
              {segments.map(segment => (
                <div
                  key={segment.value}
                  className={`segment-option ${formData.segment === segment.value ? 'selected' : ''}`}
                  onClick={() => {
                    setFormData({
                      ...formData,
                      segment: segment.value as 'basic' | 'standard' | 'premium',
                      totalAmount: calculateTotal(formData.selectedServices)
                    });
                  }}
                >
                  <div className="segment-header">
                    <span className="segment-name">{segment.label}</span>
                    {segment.discount > 0 && (
                      <span className="segment-discount-badge">
                        {segment.discount}% OFF
                      </span>
                    )}
                  </div>
                  <p className="segment-description">{segment.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <div className="services-header">
              <label className="services-title">Select Services</label>
              <div className="billing-options">
                <select
                  className="billing-cycle-select"
                  value={formData.billingCycle}
                  onChange={(e) => {
                    const cycle = e.target.value as 'monthly' | 'yearly';
                    setFormData({
                      ...formData,
                      billingCycle: cycle,
                      totalAmount: calculateTotal(formData.selectedServices)
                    });
                  }}
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <div className="price-details">
                  {formData.segment !== 'basic' && (
                    <div className="original-price">
                      ${calculateTotal(formData.selectedServices, undefined, 'basic')}/
                      {formData.billingCycle}
                    </div>
                  )}
                  <span className="total-amount">
                    ${formData.totalAmount}/{formData.billingCycle}
                  </span>
                </div>
              </div>
            </div>
            <div className="services-grid">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`service-card ${formData.selectedServices.has(service.id) ? 'selected' : ''}`}
                  onClick={() => handleServiceToggle(service)}
                >
                  <div className="service-header">
                    <div className="service-info">
                      <input
                        type="checkbox"
                        checked={formData.selectedServices.has(service.id)}
                        onChange={() => handleServiceToggle(service)}
                        className="service-checkbox"
                      />
                      <span className="service-name">{service.name}</span>
                    </div>
                    <span className="service-price">
                      ${formData.billingCycle === 'monthly' ? service.monthlyPrice : service.yearlyPrice}/
                      {formData.billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <h3 className="section-title">Outlet Details</h3>
            <div className="outlet-grid">
              <div>
                <label>
                  Outlet Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.outlet.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    outlet: { ...formData.outlet, name: e.target.value }
                  })}
                />
              </div>
              <div>
                <label>
                  Outlet Type <span className="required">*</span>
                </label>
                <select
                  className="form-input"
                  value={formData.outlet.type}
                  onChange={(e) => setFormData({
                    ...formData,
                    outlet: { ...formData.outlet, type: e.target.value as any }
                  })}
                >
                  <option value="retail">Retail Store</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="franchise">Franchise</option>
                </select>
              </div>
              <div>
                <label>
                  Address <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.outlet.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    outlet: { ...formData.outlet, address: e.target.value }
                  })}
                />
              </div>
              <div>
                <label>
                  Country <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.outlet.country}
                  onChange={(e) => setFormData({
                    ...formData,
                    outlet: { ...formData.outlet, country: e.target.value }
                  })}
                />
              </div>
              <div>
                <label>
                  State <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.outlet.state}
                  onChange={(e) => setFormData({
                    ...formData,
                    outlet: { ...formData.outlet, state: e.target.value }
                  })}
                />
              </div>
              <div>
                <label>
                  District <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.outlet.district}
                  onChange={(e) => setFormData({
                    ...formData,
                    outlet: { ...formData.outlet, district: e.target.value }
                  })}
                />
              </div>
              <div>
                <label>
                  City <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.outlet.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    outlet: { ...formData.outlet, city: e.target.value }
                  })}
                />
              </div>
              <div>
                <label>
                  PIN Code <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.outlet.pincode}
                  onChange={(e) => setFormData({
                    ...formData,
                    outlet: { ...formData.outlet, pincode: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <h3 className="section-title">Payment Details</h3>
            <div className="payment-grid">
              <div>
                <label>
                  Payment Method <span className="required">*</span>
                </label>
                <div className="payment-methods">
                  {[
                    { value: 'credit_card', label: 'Credit Card' },
                    { value: 'bank_transfer', label: 'Bank Transfer' },
                    { value: 'upi', label: 'UPI' },
                    { value: 'cash', label: 'Cash' }
                  ].map(method => (
                    <div
                      key={method.value}
                      className={`payment-method ${formData.payment.method === method.value ? 'selected' : ''}`}
                      onClick={() => setFormData({
                        ...formData,
                        payment: { ...formData.payment, method: method.value as any }
                      })}
                    >
                      {method.label}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label>
                  Payment Terms <span className="required">*</span>
                </label>
                <div className="payment-terms">
                  <div
                    className={`term-option ${formData.payment.terms === 'prepaid' ? 'selected' : ''}`}
                    onClick={() => setFormData({
                      ...formData,
                      payment: { ...formData.payment, terms: 'prepaid' }
                    })}
                  >
                    Prepaid
                  </div>
                  <div
                    className={`term-option ${formData.payment.terms === 'postpaid' ? 'selected' : ''}`}
                    onClick={() => setFormData({
                      ...formData,
                      payment: { ...formData.payment, terms: 'postpaid' }
                    })}
                  >
                    Postpaid
                  </div>
                </div>
              </div>
              <div>
                <label>
                  Billing Address <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.payment.billingAddress}
                  onChange={(e) => setFormData({
                    ...formData,
                    payment: { ...formData.payment, billingAddress: e.target.value }
                  })}
                />
              </div>
              <div>
                <label>
                  GST Number <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.payment.gst}
                  onChange={(e) => setFormData({
                    ...formData,
                    payment: { ...formData.payment, gst: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <h3 className="section-title">Login Credentials</h3>
            <div className="credentials-section">
              <div className="credentials-header">
                <span className="credentials-title">Set Client Login Details</span>
                <button 
                  type="button" 
                  className="generate-password-btn"
                  onClick={generatePassword}
                >
                  Generate Password
                </button>
              </div>
              
              <div className="form-group">
                <label>
                  Username <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.credentials.username}
                  onChange={(e) => setFormData({
                    ...formData,
                    credentials: {
                      ...formData.credentials,
                      username: e.target.value
                    }
                  })}
                  placeholder="Enter username"
                />
              </div>

              <div className="form-group">
                <label>
                  Password <span className="required">*</span>
                </label>
                <div className="password-input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    value={formData.credentials.password}
                    onChange={(e) => setFormData({
                      ...formData,
                      credentials: {
                        ...formData.credentials,
                        password: e.target.value
                      }
                    })}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="password-requirements">
                  Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.
                </div>
              </div>

              <div className="force-change-password">
                <input
                  type="checkbox"
                  id="forcePasswordChange"
                  checked={formData.credentials.forcePasswordChange}
                  onChange={(e) => setFormData({
                    ...formData,
                    credentials: {
                      ...formData.credentials,
                      forcePasswordChange: e.target.checked
                    }
                  })}
                />
                <label htmlFor="forcePasswordChange">
                  Force password change on first login
                </label>
              </div>

              <div className="auth-methods-section">
                <h4 className="auth-methods-title">Authentication Methods</h4>
                <div className="auth-methods-grid">
                  <div className="auth-method-item">
                    <div className="auth-method-content">
                      <span className="auth-method-icon">
                        <Lock size={20} />
                      </span>
                      <span className="auth-method-label">Password</span>
                      {formData.credentials.authMethods.password && (
                        <span className="required-badge">Required</span>
                      )}
                    </div>
                    <div className="auth-method-toggle">
                      <input
                        type="checkbox"
                        checked={formData.credentials.authMethods.password}
                        disabled={true}
                        onChange={() => {}}
                      />
                    </div>
                  </div>

                  <div className="auth-method-item">
                    <div className="auth-method-content">
                      <span className="auth-method-icon">
                        <Grid size={20} />
                      </span>
                      <span className="auth-method-label">Pattern Lock</span>
                    </div>
                    <div className="auth-method-toggle">
                      <input
                        type="checkbox"
                        checked={formData.credentials.authMethods.pattern}
                        onChange={(e) => setFormData({
                          ...formData,
                          credentials: {
                            ...formData.credentials,
                            authMethods: {
                              ...formData.credentials.authMethods,
                              pattern: e.target.checked
                            }
                          }
                        })}
                      />
                    </div>
                  </div>

                  <div className="auth-method-item">
                    <div className="auth-method-content">
                      <span className="auth-method-icon">
                        <Fingerprint size={20} />
                      </span>
                      <span className="auth-method-label">Biometric</span>
                    </div>
                    <div className="auth-method-toggle">
                      <input
                        type="checkbox"
                        checked={formData.credentials.authMethods.biometric}
                        onChange={(e) => setFormData({
                          ...formData,
                          credentials: {
                            ...formData.credentials,
                            authMethods: {
                              ...formData.credentials.authMethods,
                              biometric: e.target.checked
                            }
                          }
                        })}
                      />
                    </div>
                  </div>

                  <div className="auth-method-item">
                    <div className="auth-method-content">
                      <span className="auth-method-icon">
                        <Scan size={20} />
                      </span>
                      <span className="auth-method-label">Face ID</span>
                    </div>
                    <div className="auth-method-toggle">
                      <input
                        type="checkbox"
                        checked={formData.credentials.authMethods.faceId}
                        onChange={(e) => setFormData({
                          ...formData,
                          credentials: {
                            ...formData.credentials,
                            authMethods: {
                              ...formData.credentials.authMethods,
                              faceId: e.target.checked
                            }
                          }
                        })}
                      />
                    </div>
                  </div>

                  <div className="auth-method-item">
                    <div className="auth-method-content">
                      <span className="auth-method-icon">
                        <ShieldCheck size={20} />
                      </span>
                      <span className="auth-method-label">OTP</span>
                    </div>
                    <div className="auth-method-toggle">
                      <input
                        type="checkbox"
                        checked={formData.credentials.authMethods.otp}
                        onChange={(e) => setFormData({
                          ...formData,
                          credentials: {
                            ...formData.credentials,
                            authMethods: {
                              ...formData.credentials.authMethods,
                              otp: e.target.checked
                            }
                          }
                        })}
                      />
                    </div>
                  </div>

                  <div className="auth-method-item">
                    <div className="auth-method-content">
                      <span className="auth-method-icon">
                        <KeyRound size={20} />
                      </span>
                      <span className="auth-method-label">Security Key</span>
                    </div>
                    <div className="auth-method-toggle">
                      <input
                        type="checkbox"
                        checked={formData.credentials.authMethods.securityKey}
                        onChange={(e) => setFormData({
                          ...formData,
                          credentials: {
                            ...formData.credentials,
                            authMethods: {
                              ...formData.credentials.authMethods,
                              securityKey: e.target.checked
                            }
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Subscription Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={formData.subscription.startDate}
                  onChange={(e) => setFormData({
                    ...formData,
                    subscription: {
                      ...formData.subscription,
                      startDate: e.target.value
                    }
                  })}
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={calculateEndDate(formData.subscription.startDate, formData.billingCycle).split('T')[0]}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="add-button" onClick={handleSubmit}>Add Client</button>
        </div>
      </div>
    </div>
  );
}; 