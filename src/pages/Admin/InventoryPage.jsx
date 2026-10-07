import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/productService.js';
import { updateProduct } from '../../services/productService.js';
import styles from './InventoryPage.module.css';

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    getProducts({ page, limit: 12, search: search.trim() || undefined })
      .then(({ data }) => { if (active) { setProducts(data.products || []); setPages(data.pagination?.pages || 1); setDrafts({}); } })
      .catch((err) => { if (active) setError(err?.response?.data?.message || err?.message || 'Unable to load inventory.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, search]);

  const changeStock = (product, index, value) => {
    const key = product._id;
    const current = drafts[key] || (product.inventory || []).map((variant) => ({ ...variant }));
    const next = current.map((variant, variantIndex) => variantIndex === index ? { ...variant, stock: value } : variant);
    setDrafts((all) => ({ ...all, [key]: next }));
  };

  const save = async (product) => {
    setSaving(product._id); setError(''); setMessage('');
    try {
      const inventory = (drafts[product._id] || product.inventory || []).map((variant) => ({ ...variant, stock: Number(variant.stock) }));
      const { data } = await updateProduct(product._id, { inventory });
      setProducts((all) => all.map((item) => item._id === product._id ? data.updatedProduct : item));
      setDrafts((all) => { const next = { ...all }; delete next[product._id]; return next; });
      setMessage(`${product.name} inventory saved.`);
    } catch (err) { setError(err?.response?.data?.message || (typeof err === 'string' ? err : err?.message) || 'Unable to save inventory.'); }
    finally { setSaving(''); }
  };

  return <main className={`container ${styles.page}`}>
    <header className={styles.header}><div><p className={styles.eyebrow}>Admin / Catalog</p><h1>Inventory</h1><p>Review variant stock and update available units.</p></div><Link to="/admin/add-product">Add product</Link></header>
    <label className={styles.search}>Search products<input value={search} onChange={(event) => { setPage(1); setSearch(event.target.value); }} placeholder="Name" /></label>
    {message && <p role="status" className={styles.success}>{message}</p>}{error && <p role="alert" className={styles.error}>{error}</p>}
    {loading ? <p>Loading inventory…</p> : products.length ? <div className={styles.list}>{products.map((product) => {
      const variants = drafts[product._id] || product.inventory || [];
      const stockTotal = variants.reduce((total, variant) => total + Number(variant.stock || 0), 0);
      return <article className={styles.product} key={product._id}>
        <div className={styles.productHead}><div><h2>{product.name}</h2><p>{product.category} · {product.type}</p></div><div className={styles.productActions}><strong>{stockTotal} units</strong><Link to={`/admin/products/${product._id}/edit`}>Edit product</Link></div></div>
        {variants.length ? <div className={styles.variants}>{variants.map((variant, index) => <label key={`${variant.color}-${variant.size}-${index}`}><span>{variant.color} / {variant.size}</span><input type="number" min="0" value={variant.stock} onChange={(event) => changeStock(product, index, event.target.value)} aria-label={`${product.name}, ${variant.color} ${variant.size} stock`} /></label>)}</div> : <p className={styles.empty}>No size and color inventory has been defined for this product.</p>}
        {variants.length > 0 && <button type="button" disabled={saving === product._id || !drafts[product._id]} onClick={() => save(product)}>{saving === product._id ? 'Saving…' : 'Save stock'}</button>}
      </article>;
    })}</div> : <p>No products found.</p>}
    {pages > 1 && <nav className={styles.pagination} aria-label="Inventory pages"><button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page} of {pages}</span><button disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button></nav>}
  </main>;
}
