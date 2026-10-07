import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../../services/productService';
import styles from './AddProductPage.module.css';

const AddProductPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'men',
        type: '',
    });
    const [images, setImages] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const updateColor = (index, field, value) => {
        setColors((currentColors) => currentColors.map((color, colorIndex) => (
            colorIndex === index ? { ...color, [field]: value } : color
        )));
    };

    const updateSize = (index, value) => {
        setSizes((currentSizes) => currentSizes.map((size, sizeIndex) => (
            sizeIndex === index ? value : size
        )));
    };

    const updateInventoryStock = (colorName, sizeName, value) => {
        setInventory((currentInventory) => currentInventory.map((item) => (
            item.color === colorName && item.size === sizeName
                ? { ...item, stock: Number(value) || 0 }
                : item
        )));
    };

    useEffect(() => {
        const validColors = colors.filter((color) => color.name.trim());
        const validSizes = sizes.filter((size) => size.trim());

        setInventory((currentInventory) => {
            const nextInventory = [];
            validColors.forEach((color) => {
                validSizes.forEach((size) => {
                    const existing = currentInventory.find((item) => item.color === color.name.trim() && item.size === size.trim());
                    nextInventory.push(existing || { color: color.name.trim(), size: size.trim(), stock: 0 });
                });
            });
            return nextInventory;
        });
    }, [colors, sizes]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const validColors = colors.filter((color) => color.name.trim()).map((color) => ({
                name: color.name.trim(),
                ...(color.hex.trim() ? { hex: color.hex.trim() } : {}),
            }));
            const validSizes = sizes.filter((size) => size.trim());
            const validInventory = inventory.filter((item) => item.color && item.size);

            if (!validColors.length) {
                throw new Error('Add at least one color before saving this product.');
            }

            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('category', formData.category);
            data.append('type', formData.type);
            data.append('colors', JSON.stringify(validColors));
            data.append('sizes', JSON.stringify(validSizes));
            data.append('inventory', JSON.stringify(validInventory));

            for (let i = 0; i < images.length; i++) {
                data.append('images', images[i]);
            }

            await addProduct(data);
            alert('Product Added Successfully!');
            navigate('/admin/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message || 'Failed to add product');
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

                    <fieldset className={styles.colorEditor}>
                        <legend>Product colors</legend>
                        <p>Colors belong to this product. Hex values are optional.</p>
                        {colors.map((color, index) => (
                            <div className={styles.colorRow} key={`color-${index}`}>
                                <input
                                    type="text"
                                    value={color.name}
                                    onChange={(event) => updateColor(index, 'name', event.target.value)}
                                    className={styles.input}
                                    placeholder="Color name"
                                    aria-label={`Color ${index + 1} name`}
                                />
                                <input
                                    type="text"
                                    value={color.hex}
                                    onChange={(event) => updateColor(index, 'hex', event.target.value)}
                                    className={styles.input}
                                    placeholder="#RRGGBB (optional)"
                                    pattern="^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$"
                                    aria-label={`Color ${index + 1} hex value`}
                                />
                                <button type="button" className={styles.removeColor} onClick={() => setColors((current) => current.filter((_, colorIndex) => colorIndex !== index))} aria-label={`Remove color ${index + 1}`}>
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button type="button" className={styles.addColor} onClick={() => setColors((current) => [...current, { name: '', hex: '' }])}>
                            + Add Color
                        </button>
                    </fieldset>

                    <fieldset className={styles.colorEditor}>
                        <legend>Available sizes</legend>
                        <p>Define the sizes that this product supports.</p>
                        {sizes.map((size, index) => (
                            <div className={styles.colorRow} key={`size-${index}`}>
                                <input
                                    type="text"
                                    value={size}
                                    onChange={(event) => updateSize(index, event.target.value)}
                                    className={styles.input}
                                    placeholder="S, M, L, 28, 30..."
                                    aria-label={`Size ${index + 1}`}
                                />
                                <button type="button" className={styles.removeColor} onClick={() => setSizes((current) => current.filter((_, sizeIndex) => sizeIndex !== index))} aria-label={`Remove size ${index + 1}`}>
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button type="button" className={styles.addColor} onClick={() => setSizes((current) => [...current, ''])}>
                            + Add Size
                        </button>
                    </fieldset>

                    {colors.some((color) => color.name.trim()) && sizes.some((size) => size.trim()) && (
                        <fieldset className={styles.colorEditor}>
                            <legend>Inventory stock</legend>
                            <p>Set the stock count for each color-size combination.</p>
                            <div className={styles.inventoryTable}>
                                <div className={styles.inventoryHeader}>Color</div>
                                <div className={styles.inventoryHeader}>Size</div>
                                <div className={styles.inventoryHeader}>Stock</div>
                                {colors.filter((color) => color.name.trim()).map((color) => (
                                    sizes.filter((size) => size.trim()).map((size) => {
                                        const item = inventory.find((entry) => entry.color === color.name.trim() && entry.size === size.trim()) || { color: color.name.trim(), size: size.trim(), stock: 0 };
                                        return (
                                            <React.Fragment key={`${color.name.trim()}-${size.trim()}`}>
                                                <div className={styles.inventoryCell}>{color.name.trim()}</div>
                                                <div className={styles.inventoryCell}>{size.trim()}</div>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={item.stock}
                                                    onChange={(event) => updateInventoryStock(color.name.trim(), size.trim(), event.target.value)}
                                                    className={styles.inventoryInput}
                                                    aria-label={`${color.name.trim()} ${size.trim()} stock`}
                                                />
                                            </React.Fragment>
                                        );
                                    })
                                ))}
                            </div>
                        </fieldset>
                    )}

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
