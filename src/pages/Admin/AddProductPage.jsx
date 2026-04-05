import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../../services/productService';
import styles from './AddProductPage.module.css'; // We'll create this CSS next

const AddProductPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'men', // Default
        type: '',
    });
    const [images, setImages] = useState([]); // Array of File objects
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('category', formData.category);
            data.append('type', formData.type);

            // Append each file to 'images' key (backend expects upload.array('images', 5))
            for (let i = 0; i < images.length; i++) {
                data.append('images', images[i]);
            }

            await addProduct(data);
            alert('Product Added Successfully!');
            navigate('/admin/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', marginTop: '40px', marginBottom: '40px' }}>
            <div className={styles.formCard}>
                <h1 className={styles.title}>Add New Product</h1>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Name */}
                    <div className={styles.formGroup}>
                        <label>Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className={styles.input}
                            placeholder="e.g. Classic Denim Jacket"
                        />
                    </div>

                    {/* Description */}
                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className={styles.textarea}
                            placeholder="Product details..."
                        />
                    </div>

                    {/* Price & Type Row */}
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Type</label>
                            <input
                                type="text"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                                className={styles.input}
                                placeholder="e.g. Jacket, T-Shirt"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div className={styles.formGroup}>
                        <label>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={styles.select}
                        >
                            <option value="men">Men</option>
                            <option value="women">Women</option>
                            <option value="kids">Kids</option>
                        </select>
                    </div>

                    {/* Images */}
                    <div className={styles.formGroup}>
                        <label>Product Images (Max 5)</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                            className={styles.fileInput}
                        />
                        <small>Selected: {images.length} files</small>
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? 'Adding Product...' : 'Add Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProductPage;
