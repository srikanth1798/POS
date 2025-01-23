import { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  serviceType: 'Order Management' | 'Employee Management' | 'Table Management' | 'Inventory Management' | 'Billing Management';
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
  // Order Management Products
  1: {
    id: 1,
    name: "Basic POS System",
    serviceType: "Order Management",
    features: ["Basic order processing", "Simple inventory tracking", "Basic reporting"],
    price: 299.99,
    description: "Perfect for small businesses starting their digital journey",
    status: 'active'
  },
  2: {
    id: 2,
    name: "Advanced POS Suite",
    serviceType: "Order Management",
    features: ["Advanced order processing", "Real-time analytics", "Multi-branch support"],
    price: 499.99,
    description: "Complete solution for growing businesses",
    status: 'active'
  },

  // Employee Management Products
  3: {
    id: 3,
    name: "HR Basic",
    serviceType: "Employee Management",
    features: ["Staff scheduling", "Attendance tracking", "Leave management"],
    price: 199.99,
    description: "Essential HR tools for small teams",
    status: 'active'
  },
  4: {
    id: 4,
    name: "HR Enterprise",
    serviceType: "Employee Management",
    features: ["Advanced scheduling", "Performance tracking", "Payroll integration"],
    price: 399.99,
    description: "Comprehensive HR solution",
    status: 'active'
  },

  // Table Management Products
  5: {
    id: 5,
    name: "Table Basic",
    serviceType: "Table Management",
    features: ["Basic reservations", "Simple floor plan", "Wait list"],
    price: 149.99,
    description: "Simple table management solution",
    status: 'active'
  },
  6: {
    id: 6,
    name: "Table Pro",
    serviceType: "Table Management",
    features: ["Advanced reservations", "Dynamic floor plans", "Customer preferences"],
    price: 299.99,
    description: "Professional table management system",
    status: 'active'
  },

  // Inventory Management Products
  7: {
    id: 7,
    name: "Stock Basic",
    serviceType: "Inventory Management",
    features: ["Basic stock tracking", "Low stock alerts", "Simple reporting"],
    price: 199.99,
    description: "Basic inventory control system",
    status: 'active'
  },
  8: {
    id: 8,
    name: "Stock Advanced",
    serviceType: "Inventory Management",
    features: ["Advanced tracking", "Automated ordering", "Supplier management"],
    price: 399.99,
    description: "Advanced inventory management solution",
    status: 'active'
  },

  // Billing Management Products
  9: {
    id: 9,
    name: "Billing Basic",
    serviceType: "Billing Management",
    features: ["Invoice generation", "Basic payment processing", "Simple reports"],
    price: 149.99,
    description: "Basic billing solution",
    status: 'active'
  },
  10: {
    id: 10,
    name: "Billing Pro",
    serviceType: "Billing Management",
    features: ["Advanced invoicing", "Multiple payment gateways", "Financial analytics"],
    price: 299.99,
    description: "Professional billing management system",
    status: 'active'
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