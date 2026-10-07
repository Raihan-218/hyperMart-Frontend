import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard/productCards.jsx';
import styles from './ProductCollection.module.css';
import { getProductsByCategory } from '../services/productService.js';

const PAGE_SIZE = 12;

export default function ProductCollection({ category, title, description }) {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ search: '', type: '', minPrice: '', maxPrice: '', sort: 'newest' });
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    const params = { page: pagination.page, limit: PAGE_SIZE, sort: filters.sort };
    if (filters.search.trim()) params.search = filters.search.trim();
    if (filters.type) params.type = filters.type;
    if (filters.minPrice !== '') params.minPrice = filters.minPrice;
    if (filters.maxPrice !== '') params.maxPrice = filters.maxPrice;
    getProductsByCategory(category, params)
      .then(({ data }) => {
        if (!active) return;
        setProducts(data.products || []);
        setPagination(data.pagination || { page: 1, pages: 1, total: (data.products || []).length });
        setTypes(data.types || [...new Set((data.products || []).map((item) => item.type).filter(Boolean))]);
      })
      .catch((requestError) => { if (active) setError(requestError?.response?.data?.message || requestError?.message || 'Could not load products.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [category, pagination.page, filters]);

  const changeFilter = (name, value) => {
    setPagination((current) => ({ ...current, page: 1 }));
    setFilters((current) => ({ ...current, [name]: value }));
  };

  return (
    <section className={`container ${styles.collection}`}>
      <h1>{title}</h1>
      <p className={styles.description}>{description}</p>
      <div className={styles.filters} aria-label="Filter products">
        <input value={filters.search} onChange={(event) => changeFilter('search', event.target.value)} placeholder="Search products" aria-label="Search products" />
        <select value={filters.type} onChange={(event) => changeFilter('type', event.target.value)} aria-label="Product type">
          <option value="">All types</option>{types.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <input type="number" min="0" value={filters.minPrice} onChange={(event) => changeFilter('minPrice', event.target.value)} placeholder="Min ₹" aria-label="Minimum price" />
        <input type="number" min="0" value={filters.maxPrice} onChange={(event) => changeFilter('maxPrice', event.target.value)} placeholder="Max ₹" aria-label="Maximum price" />
        <select value={filters.sort} onChange={(event) => changeFilter('sort', event.target.value)} aria-label="Sort products">
          <option value="newest">Newest</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option><option value="rating">Top rated</option><option value="name">Name</option>
        </select>
      </div>
      <p className={styles.resultCount}>{pagination.total} products</p>
      {error && <p className={styles.error} role="alert">{error}</p>}
      {loading ? <p aria-live="polite">Loading products…</p> : products.length ? (
        <div className={styles.grid}>{products.map((product) => <ProductCard key={product._id || product.id} product={product} />)}</div>
      ) : <p>No products match these filters.</p>}
      {pagination.pages > 1 && <nav className={styles.pagination} aria-label="Product pages">
        <button type="button" onClick={() => setPagination((current) => ({ ...current, page: current.page - 1 }))} disabled={pagination.page <= 1}>Previous</button>
        <span>Page {pagination.page} of {pagination.pages}</span>
        <button type="button" onClick={() => setPagination((current) => ({ ...current, page: current.page + 1 }))} disabled={pagination.page >= pagination.pages}>Next</button>
      </nav>}
    </section>
  );
}
