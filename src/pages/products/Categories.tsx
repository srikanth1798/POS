import React from 'react';
import { useProducts } from '../../context/ProductContext';

const Categories: React.FC = () => {
	const { products } = useProducts();

	// Get unique categories from products
	const categories = [...new Set(Object.values(products).map(product => product.serviceType))];

	return (
		<div className="categories-container">
			<h1>Product Categories</h1>
			<div className="categories-grid">
				{categories.map((category) => (
					<div key={category} className="category-card">
						<h2>{category}</h2>
						<p>
							{Object.values(products).filter(product => product.serviceType === category).length} Products
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default Categories;