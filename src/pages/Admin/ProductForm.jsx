import React, { useEffect, useRef, useState } from 'react';
import styles from './AddProductPage.module.css';

const toFormValues = (product) => ({
  name: product?.name || '',
  description: product?.description || '',
  price: product?.price ?? '',
  category: product?.category || 'men',
  type: product?.type || '',
});

const ProductForm = ({ product, title, submitLabel, onSubmit }) => {
  const [formData, setFormData] = useState(() => toFormValues(product));
  const [images, setImages] = useState([]);
  const [colors, setColors] = useState(() => (product?.colors || []).map((color) => ({
    name: color.name || '',
    hex: color.hex || '',
  })));
  const [sizes, setSizes] = useState(() => [...(product?.sizes || [])]);
  const [inventory, setInventory] = useState(() => (product?.inventory || []).map((item) => ({ ...item })));
  const [existingImages, setExistingImages] = useState(() => (product?.images || []).map((image) => ({ ...image, keep: true })));
  const previewUrls = useRef(new Set());
  const initialVariantSync = useRef(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const colorNamesKey = JSON.stringify(colors.map((color) => color.name.trim()).filter(Boolean));
  const sizeNamesKey = JSON.stringify(sizes.map((size) => size.trim()).filter(Boolean));

  useEffect(() => {
    const preserveExistingInventory = initialVariantSync.current;
    initialVariantSync.current = false;
    setInventory((currentInventory) => {
      const validColors = JSON.parse(colorNamesKey);
      const validSizes = JSON.parse(sizeNamesKey);
      const nextInventory = preserveExistingInventory
        ? [...currentInventory]
        : currentInventory.filter((item) => validColors.includes(item.color) && validSizes.includes(item.size));
      validColors.forEach((color) => {
        validSizes.forEach((size) => {
          const existing = currentInventory.find(
            (item) => item.color === color && item.size === size
          );
          if (!existing) nextInventory.push({ color, size, stock: 0 });
        });
      });
      return nextInventory;
    });
  }, [colorNamesKey, sizeNamesKey]);

  useEffect(() => () => {
    previewUrls.current.forEach((preview) => URL.revokeObjectURL(preview));
  }, []);

  const changeField = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const selectImages = (event) => {
    const selected = Array.from(event.target.files || []);
    const selectedImages = selected.map((file) => {
      const preview = URL.createObjectURL(file);
      previewUrls.current.add(preview);
      return { file, preview };
    });
    setImages((current) => [
      ...current,
      ...selectedImages,
    ]);
    event.target.value = '';
  };

  const updateStock = (colorName, sizeName, value) => {
    setInventory((current) => current.map((item) => (
      item.color === colorName && item.size === sizeName
        ? { ...item, stock: value }
        : item
    )));
  };

  const updateColor = (index, field, value) => {
    const currentColor = colors[index];
    setColors((current) => current.map((color, colorIndex) => (
      colorIndex === index ? { ...color, [field]: value } : color
    )));
    if (field === 'name' && currentColor?.name.trim()) {
      setInventory((current) => current.map((item) => (
        item.color === currentColor.name.trim()
          ? { ...item, color: value.trim() }
          : item
      )));
    }
  };

  const updateSize = (index, value) => {
    const currentSize = sizes[index];
    setSizes((current) => current.map((size, sizeIndex) => (
      sizeIndex === index ? value : size
    )));
    if (currentSize?.trim()) {
      setInventory((current) => current.map((item) => (
        item.size === currentSize.trim()
          ? { ...item, size: value.trim() }
          : item
      )));
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const validColors = colors.filter((color) => color.name.trim()).map((color) => ({
        name: color.name.trim(),
        ...(color.hex.trim() ? { hex: color.hex.trim() } : {}),
      }));
      const validSizes = [...new Set(sizes.map((size) => size.trim()).filter(Boolean))];
      const validInventory = inventory.map((item) => ({
        color: item.color,
        size: item.size,
        stock: Number(item.stock),
      }));
      const retainedImages = existingImages.filter((image) => image.keep !== false);

      if (!product && validColors.length === 0) {
        throw new Error('Add at least one color before saving this product.');
      }
      if (retainedImages.length + images.length > 5) {
        throw new Error('A product can have no more than 5 images.');
      }
      if (retainedImages.length + images.length === 0) {
        throw new Error('Keep or add at least one product image.');
      }

      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      payload.append('price', String(formData.price));
      payload.append('category', formData.category);
      payload.append('type', formData.type);
      payload.append('colors', JSON.stringify(validColors));
      payload.append('sizes', JSON.stringify(validSizes));
      payload.append('inventory', JSON.stringify(validInventory));
      if (product) payload.append('existingImages', JSON.stringify(retainedImages));
      images.forEach(({ file }) => payload.append('images', file));

      const response = await onSubmit(payload);
      if (response?.updatedProduct?.images) {
        setExistingImages(response.updatedProduct.images.map((image) => ({ ...image, keep: true })));
        images.forEach((image) => {
          URL.revokeObjectURL(image.preview);
          previewUrls.current.delete(image.preview);
        });
        setImages([]);
      }
      setSuccess(response?.message || 'Product saved successfully.');
    } catch (submitError) {
      setError(submitError?.response?.data?.message || (typeof submitError === 'string' ? submitError : submitError?.message) || 'Unable to save the product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={styles.formCard}>
      <h1 className={styles.title}>{title}</h1>
      {error && <p className={styles.errorMessage} role="alert">{error}</p>}
      {success && <p className={styles.successMessage} role="status">{success}</p>}

      <form onSubmit={submit} className={styles.form}>
        <section className={styles.section}>
          <h2>Product information</h2>
          <div className={styles.formGroup}>
            <label htmlFor="product-name">Product name</label>
            <input id="product-name" type="text" name="name" value={formData.name} onChange={changeField} required maxLength={160} className={styles.input} placeholder="e.g. Classic Denim Jacket" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="product-description">Description</label>
            <textarea id="product-description" name="description" value={formData.description} onChange={changeField} required maxLength={5000} className={styles.textarea} placeholder="Product details..." />
          </div>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="product-category">Category</label>
              <select id="product-category" name="category" value={formData.category} onChange={changeField} className={styles.select}>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="product-type">Type</label>
              <input id="product-type" type="text" name="type" value={formData.type} onChange={changeField} required maxLength={100} className={styles.input} placeholder="e.g. Jacket, T-Shirt" />
            </div>
          </div>
          {product && (
            <p className={styles.note}>
              Customer rating: {Number(product.averageRating || 0).toFixed(1)} / 5
              {' · '}{Number(product.numReviews || 0)} reviews (managed by customer reviews)
            </p>
          )}
        </section>

        <section className={styles.section}>
          <h2>Pricing</h2>
          <div className={styles.formGroup}>
            <label htmlFor="product-price">Price (₹)</label>
            <input id="product-price" type="number" name="price" value={formData.price} onChange={changeField} required min="0" step="0.01" className={styles.input} />
          </div>
          <p className={styles.note}>Discounted price and brand are not fields in the current product model.</p>
        </section>

        <section className={styles.section}>
          <h2>Product images</h2>
          <p className={styles.note}>Keep images by leaving them selected. Removed images are detached from this product when you save.</p>
          {existingImages.length > 0 && (
            <div className={styles.imageGrid}>
              {existingImages.map((image, index) => (
                <label className={styles.imageCard} key={`${image.public_id || image.url}-${index}`}>
                  <img src={image.url} alt={`${formData.name || 'Product'} image ${index + 1}`} />
                  <span><input type="checkbox" checked={image.keep !== false} onChange={(event) => {
                    setExistingImages((current) => current.map((item, imageIndex) => imageIndex === index
                      ? { ...item, keep: event.target.checked }
                      : item));
                  }} /> Keep image</span>
                </label>
              ))}
            </div>
          )}
          <div className={styles.formGroup}>
            <label htmlFor="product-images">Add images (up to 5 total)</label>
            <input id="product-images" type="file" multiple accept="image/*" onChange={selectImages} className={styles.fileInput} />
          </div>
          {images.length > 0 && (
            <div className={styles.imageGrid}>
              {images.map((image, index) => (
                <div className={styles.imageCard} key={`${image.file.name}-${index}`}>
                  <img src={image.preview} alt={`New product image ${index + 1}`} />
                  <button type="button" className={styles.removeColor} onClick={() => {
                    URL.revokeObjectURL(image.preview);
                    previewUrls.current.delete(image.preview);
                    setImages((current) => current.filter((_, imageIndex) => imageIndex !== index));
                  }}>Remove image</button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h2>Variants and inventory</h2>
          <fieldset className={styles.colorEditor}>
            <legend>Colors</legend>
            <p>Colors belong to this product. Hex values are optional.</p>
            {colors.map((color, index) => (
              <div className={styles.colorRow} key={`color-${index}`}>
                <input type="text" value={color.name} onChange={(event) => updateColor(index, 'name', event.target.value)} className={styles.input} placeholder="Color name" aria-label={`Color ${index + 1} name`} />
                <input type="text" value={color.hex} onChange={(event) => setColors((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, hex: event.target.value } : item))} className={styles.input} placeholder="#RRGGBB (optional)" pattern="^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$" aria-label={`Color ${index + 1} hex value`} />
                <button type="button" className={styles.removeColor} onClick={() => setColors((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
              </div>
            ))}
            <button type="button" className={styles.addColor} onClick={() => setColors((current) => [...current, { name: '', hex: '' }])}>+ Add color</button>
          </fieldset>

          <fieldset className={styles.colorEditor}>
            <legend>Sizes</legend>
            <p>Define the sizes supported by this product.</p>
            {sizes.map((size, index) => (
              <div className={styles.colorRow} key={`size-${index}`}>
                <input type="text" value={size} onChange={(event) => updateSize(index, event.target.value)} className={styles.input} placeholder="S, M, L, 28, 30..." aria-label={`Size ${index + 1}`} />
                <button type="button" className={styles.removeColor} onClick={() => setSizes((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
              </div>
            ))}
            <button type="button" className={styles.addColor} onClick={() => setSizes((current) => [...current, ''])}>+ Add size</button>
          </fieldset>

          {inventory.length > 0 && (
            <fieldset className={styles.colorEditor}>
              <legend>Stock by variant</legend>
              <p>Existing stock is retained for matching color and size combinations.</p>
              <div className={styles.inventoryTable}>
                <strong className={styles.inventoryHeader}>Color</strong>
                <strong className={styles.inventoryHeader}>Size</strong>
                <strong className={styles.inventoryHeader}>Quantity</strong>
                {inventory.map((item) => (
                  <React.Fragment key={`${item.color}-${item.size}`}>
                    <span className={styles.inventoryCell}>{item.color}</span>
                    <span className={styles.inventoryCell}>{item.size}</span>
                    <input type="number" min="0" step="1" value={item.stock} onChange={(event) => updateStock(item.color, item.size, event.target.value)} className={styles.inventoryInput} aria-label={`${item.color} ${item.size} stock`} />
                  </React.Fragment>
                ))}
              </div>
            </fieldset>
          )}
        </section>

        <p className={styles.note}>The current product model has no active/inactive field; products can only be removed using the existing delete behavior.</p>
        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton} disabled={saving}>{saving ? 'Saving…' : submitLabel}</button>
        </div>
      </form>
    </section>
  );
};

export default ProductForm;
