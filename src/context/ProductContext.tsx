import { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  serviceType: 'Order Management' | 'Employee Management' | 'Table Management' | 'Inventory Management' | 'Billing Management';
  tier: 'Basic' | 'Advanced' | 'Pro';
  features: string[];
  price: number;
  description: string;
  status: 'active' | 'inactive';
}

interface ProductContextType {
  products: Record<number, Product>;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const initialProducts: Record<number, Product> = {
  1: {
    id: 1,
    name: "Restaurant POS Basic",
    tier: "Basic",
    serviceType: "Order Management",
    features: ["Basic table management", "Simple order tracking", "Basic kitchen display", "Standard payment processing"],
    price: 49.99,
    description: "Essential restaurant management features for small businesses.",
    status: "active"
  },
  2: {
    id: 2,
    name: "Restaurant POS Advanced",
    tier: "Advanced",
    serviceType: "Order Management",
    features: ["Advanced table management", "Real-time order tracking", "Advanced kitchen display", "Multiple payment methods", "Customer loyalty program"],
    price: 99.99,
    description: "Enhanced restaurant management solution with advanced features.",
    status: "active"
  },
  3: {
    id: 3,
    name: "Restaurant POS Pro",
    tier: "Pro",
    serviceType: "Order Management",
    features: ["Enterprise table management", "AI-powered order tracking", "Multi-kitchen display system", "Global payment processing", "Advanced analytics", "24/7 support"],
    price: 149.99,
    description: "Complete enterprise-grade restaurant management solution.",
    status: "active"
  },
  4: {
    id: 4,
    name: "HR Manager Basic",
    tier: "Basic",
    serviceType: "Employee Management",
    features: ["Basic attendance tracking", "Simple payroll", "Leave management"],
    price: 79.99,
    description: "Essential HR tools for small teams.",
    status: "active"
  },
  5: {
    id: 5,
    name: "HR Manager Advanced",
    tier: "Advanced",
    serviceType: "Employee Management",
    features: ["Advanced attendance tracking", "Automated payroll", "Leave management", "Performance reviews", "Training modules"],
    price: 149.99,
    description: "Comprehensive HR management for growing businesses.",
    status: "active"
  },
  6: {
    id: 6,
    name: "HR Manager Pro",
    tier: "Pro",
    serviceType: "Employee Management",
    features: ["Biometric attendance", "Global payroll", "Advanced leave management", "360° reviews", "Learning management", "HR analytics"],
    price: 199.99,
    description: "Enterprise HR solution with advanced features.",
    status: "active"
  },
  7: {
    id: 7,
    name: "Table Master Basic",
    tier: "Basic",
    serviceType: "Table Management",
    features: ["Basic table layout", "Simple reservations", "Walk-in management", "Basic waiting list"],
    price: 39.99,
    description: "Essential table management features for small restaurants.",
    status: "active"
  },
  8: {
    id: 8,
    name: "Table Master Advanced",
    tier: "Advanced",
    serviceType: "Table Management",
    features: ["Interactive floor plan", "Advanced reservations", "SMS notifications", "Guest preferences", "Table turnover tracking"],
    price: 79.99,
    description: "Advanced table management solution with guest engagement features.",
    status: "active"
  },
  9: {
    id: 9,
    name: "Table Master Pro",
    tier: "Pro",
    serviceType: "Table Management",
    features: ["3D floor planning", "AI-powered seating optimization", "Integration with POS", "VIP guest management", "Analytics dashboard", "Multi-location support"],
    price: 129.99,
    description: "Complete table management system for high-volume restaurants.",
    status: "active"
  },
  10: {
    id: 10,
    name: "Inventory Basic",
    tier: "Basic",
    serviceType: "Inventory Management",
    features: ["Basic stock tracking", "Manual inventory counts", "Simple reports", "Low stock alerts"],
    price: 49.99,
    description: "Essential inventory tracking for small businesses.",
    status: "active"
  },
  11: {
    id: 11,
    name: "Inventory Advanced",
    tier: "Advanced",
    serviceType: "Inventory Management",
    features: ["Barcode scanning", "Automated reordering", "Supplier management", "Inventory forecasting", "Mobile app access"],
    price: 99.99,
    description: "Advanced inventory management with automation features.",
    status: "active"
  },
  12: {
    id: 12,
    name: "Inventory Pro",
    tier: "Pro",
    serviceType: "Inventory Management",
    features: ["Multi-location inventory", "Real-time tracking", "Advanced analytics", "API integration", "Custom reporting", "Warehouse management"],
    price: 149.99,
    description: "Enterprise-grade inventory management solution.",
    status: "active"
  },
  13: {
    id: 13,
    name: "Billing Basic",
    tier: "Basic",
    serviceType: "Billing Management",
    features: ["Basic invoicing", "Payment processing", "Simple reports", "Email receipts"],
    price: 29.99,
    description: "Essential billing features for small businesses.",
    status: "active"
  },
  14: {
    id: 14,
    name: "Billing Advanced",
    tier: "Advanced",
    serviceType: "Billing Management",
    features: ["Custom invoicing", "Multiple payment methods", "Recurring billing", "Payment reminders", "Tax calculations"],
    price: 69.99,
    description: "Advanced billing solution with automation features.",
    status: "active"
  },
  15: {
    id: 15,
    name: "Billing Pro",
    tier: "Pro",
    serviceType: "Billing Management",
    features: ["Multi-currency support", "Advanced reporting", "API integration", "Custom workflow", "Fraud detection", "Enterprise billing"],
    price: 119.99,
    description: "Complete billing system for enterprise businesses.",
    status: "active"
  }
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState(initialProducts);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newId = Math.max(...Object.keys(products).map(Number)) + 1;
    setProducts(prev => ({
      ...prev,
      [newId]: { ...product, id: newId }
    }));
  };

  const updateProduct = (product: Product) => {
    setProducts(prev => ({
      ...prev,
      [product.id]: product
    }));
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => {
      const newProducts = { ...prev };
      delete newProducts[id];
      return newProducts;
    });
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}; 
export default ProductContext;