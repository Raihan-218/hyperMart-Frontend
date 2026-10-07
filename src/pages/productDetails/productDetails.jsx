import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, Heart, ImageOff, Minus, Plus, RotateCcw, ShieldCheck, Star, Truck } from 'lucide-react';
import styles from './productDetails.module.css';
import ProductCard from '../../components/ProductCard/productCards.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { getProductById, getProductsByCategory } from '../../services/productService.js';
import { addReview, deleteReview, getReviews } from '../../services/reviewService.js';
import { getWishlist, toggleWishlist } from '../../services/wishlistService.js';

const normalizeColors = (colors = []) => {
  const source = Array.isArray(colors) ? colors : [];
  return source.map((color) => {
    if (typeof color === 'string') return { name: color, hex: '' };
    if (!color || typeof color !== 'object') return null;
    const name = color.name || color.label || color.color || '';
    if (!name) return null;
    return { ...color, name, hex: color.hex || color.value || '' };
  }).filter(Boolean);
};

const normalizeSizes = (sizes = []) => {
  if (!Array.isArray(sizes) || sizes.length === 0) return [];
  return sizes.map((size) => {
    if (typeof size === 'string' || typeof size === 'number') return { name: String(size), available: true };
    const name = size?.name || size?.label || size?.size;
    const stock = Number(size?.stock ?? size?.quantity);
    return {
      ...size,
      name: name == null ? '' : String(name),
      available: size?.available !== false && size?.inStock !== false && !(Number.isFinite(stock) && stock <= 0),
    };
  }).filter((size) => size.name);
};

const getImageUrl = (image) => (typeof image === 'string' ? image : image?.url || '');
const getProductId = (product) => product?._id || product?.id;
const getApiMessage = (error) => error?.response?.data?.message || (typeof error === 'string' ? error : error?.message);
const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

const StarRating = ({ rating = 0, onRating, label = 'Product rating' }) => (
  <div className={styles.starRating} role={onRating ? undefined : 'img'} aria-label={onRating ? undefined : `${label}: ${rating} out of 5`}>
    {[1, 2, 3, 4, 5].map((value) => {
      const fill = Math.max(0, Math.min(1, rating - value + 1)) * 100;
      const star = <><Star aria-hidden="true" className={styles.starOutline} /><span className={styles.starFill} style={{ width: `${fill}%` }}><Star aria-hidden="true" /></span></>;
      return onRating ? (
        <button key={value} type="button" className={styles.ratingButton} onClick={() => onRating(value)} aria-label={`${value} out of 5 stars`} aria-pressed={rating === value}>{star}</button>
      ) : <span key={value} className={styles.ratingStar}>{star}</span>;
    })}
  </div>
);

const ProductSkeleton = () => (
  <div className={`container ${styles.page}`} aria-label="Loading product" aria-busy="true">
    <div className={`${styles.productView} ${styles.skeletonView}`}>
      <div className={`${styles.skeleton} ${styles.skeletonImage}`} />
      <div className={styles.skeletonDetails}>
        <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        <div className={`${styles.skeleton} ${styles.skeletonPrice}`} />
        <div className={`${styles.skeleton} ${styles.skeletonText}`} />
        <div className={`${styles.skeleton} ${styles.skeletonText}`} />
        <div className={`${styles.skeleton} ${styles.skeletonOptions}`} />
        <div className={`${styles.skeleton} ${styles.skeletonOptions}`} />
        <div className={`${styles.skeleton} ${styles.skeletonActions}`} />
      </div>
    </div>
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedProductsError, setRelatedProductsError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [wishlistedIds, setWishlistedIds] = useState([]);
  const [reviewsError, setReviewsError] = useState('');
  const [wishlistError, setWishlistError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [brokenImage, setBrokenImage] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [formError, setFormError] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });

  useEffect(() => {
    let active = true;
    const loadProduct = async () => {
      setLoading(true);
      setError('');
      setProduct(null);
      setRelatedProducts([]);
      setRelatedProductsError('');
      setReviews([]);
      setReviewsError('');
      setWishlistError('');

      try {
        const productResponse = await getProductById(id);
        const data = productResponse.data?.product;
        if (!active) return;
        if (!data) {
          setProduct(null);
          return;
        }

        setProduct(data);
        setSelectedImage(0);
        const productColors = normalizeColors(data.colors || data.productColors || data.colorOptions);
        const inventoryColorNames = [...new Set((Array.isArray(data.inventory) ? data.inventory : [])
          .map((variant) => variant.color)
          .filter(Boolean))];
        const availableColors = [
          ...productColors,
          ...inventoryColorNames
            .filter((name) => !productColors.some((color) => color.name === name))
            .map((name) => ({ name, hex: '' })),
        ];
        setSelectedColor(availableColors[0] || null);
        setSelectedSize('');
        setQuantity(1);

        getReviews(id)
          .then((reviewsResponse) => {
            if (active) setReviews(reviewsResponse.data?.reviews || []);
          })
          .catch((reviewsFetchError) => {
            if (active) setReviewsError(getApiMessage(reviewsFetchError) || 'Reviews could not be loaded.');
          });

        if (isAuthenticated) {
          getWishlist()
            .then((wishlistResponse) => {
              if (active) {
                setWishlistedIds((wishlistResponse.data?.wishlist || []).map((item) => String(item?._id || item)));
              }
            })
            .catch((wishlistFetchError) => {
              if (active) setWishlistError(getApiMessage(wishlistFetchError) || 'Wishlist status could not be loaded.');
            });
        } else {
          setWishlistedIds([]);
        }

        if (data.category) {
          getProductsByCategory(data.category)
            .then((relatedResponse) => {
              if (!active) return;
              const items = relatedResponse.data?.products || relatedResponse.data || [];
              const currentId = String(getProductId(data));
              const sameCategory = (Array.isArray(items) ? items : []).filter((item) => String(getProductId(item)) !== currentId);
              const sameType = data.type
                ? sameCategory.filter((item) => item.type?.toLowerCase() === data.type.toLowerCase())
                : [];
              setRelatedProducts([...sameType, ...sameCategory.filter((item) => !sameType.includes(item))].slice(0, 4));
            })
            .catch((relatedError) => {
              if (active) {
                setRelatedProductsError(getApiMessage(relatedError) || 'Related products could not be loaded.');
              }
            });
        }
      } catch (fetchError) {
        if (active) setError(getApiMessage(fetchError) || 'Something went wrong while loading this product.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProduct();
    return () => { active = false; };
  }, [id, retryCount, isAuthenticated]);

  useEffect(() => {
    setCartMessage('');
    setFormError('');
  }, [selectedColor, selectedSize, quantity]);

  const isWishlisted = useMemo(() => {
    if (!product) return false;
    return wishlistedIds.includes(String(product._id || product.id));
  }, [product, wishlistedIds]);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      setFormError('Please sign in to save products to your wishlist.');
      return;
    }

    if (!product) return;

    try {
      const productId = String(product._id || product.id);
      const response = await toggleWishlist(productId);
      const nextWishlist = response.data?.wishlist || [];
      setWishlistedIds(nextWishlist.map((item) => String(item?._id || item)));
      setWishlistError('');
      setCartMessage(response.data?.message || 'Wishlist updated');
    } catch (wishlistError) {
      setWishlistError(getApiMessage(wishlistError) || 'Unable to update your wishlist right now.');
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      setFormError('Please sign in to leave a review.');
      return;
    }
    if (!reviewForm.rating) {
      setFormError('Please select a rating before submitting your review.');
      return;
    }

    setSubmittingReview(true);
    try {
      await addReview(id, {
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment.trim(),
      });
      const updatedReviews = await getReviews(id);
      setReviews(updatedReviews.data?.reviews || []);
      setReviewsError('');
      setReviewForm({ rating: 0, comment: '' });
      setCartMessage('Your review has been submitted.');
    } catch (reviewError) {
      setFormError(getApiMessage(reviewError) || 'Unable to submit your review right now.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (commentId) => {
    if (!commentId || !isAuthenticated) return;

    setDeletingReviewId(commentId);
    try {
      await deleteReview(commentId);
      const updatedReviews = await getReviews(id);
      setReviews(updatedReviews.data?.reviews || []);
      setReviewsError('');
      setCartMessage('Your review comment has been removed.');
    } catch (deleteError) {
      setReviewsError(getApiMessage(deleteError) || 'Unable to remove this review right now.');
    } finally {
      setDeletingReviewId(null);
    }
  };

  if (loading) return <ProductSkeleton />;

  if (error) {
    return (
      <main className={`container ${styles.page}`}>
        <section className={styles.statePanel} role="alert">
          <h1>Unable to load product</h1>
          <p>{error}</p>
          <button type="button" className={styles.primaryButton} onClick={() => setRetryCount((count) => count + 1)}>Try Again</button>
        </section>
      </main>
    );
  }

  if (!product) {
    return (
      <main className={`container ${styles.page}`}>
        <section className={styles.statePanel}>
          <h1>Product Not Found</h1>
          <p>The product you&apos;re looking for may have been removed.</p>
          <button type="button" className={styles.primaryButton} onClick={() => navigate('/')}>Continue Shopping</button>
        </section>
      </main>
    );
  }

  const images = (Array.isArray(product.images) ? product.images : []).map(getImageUrl).filter(Boolean);
  const currentImage = images[selectedImage] || images[0];
  const inventory = Array.isArray(product.inventory) ? product.inventory : [];
  const productColors = normalizeColors(product.colors || []);
  const colorOptions = [
    ...productColors,
    ...[...new Set(inventory.map((variant) => variant.color).filter(Boolean))]
      .filter((name) => !productColors.some((color) => color.name === name))
      .map((name) => ({ name, hex: '' })),
  ];
  const explicitSizes = normalizeSizes(product.sizes || []);
  const inventorySizes = [...new Set(inventory.map((variant) => variant.size).filter(Boolean))];
  const sizeOptions = explicitSizes.length ? explicitSizes : inventorySizes.map((name) => ({ name, available: true }));
  const allSizeOptions = [
    ...sizeOptions,
    ...inventorySizes
      .filter((name) => !sizeOptions.some((size) => size.name === name))
      .map((name) => ({ name, available: true })),
  ];
  const availableSizeOptions = allSizeOptions.map((size) => ({
    ...size,
    available: size.available && (
      inventory.length === 0 ||
      inventory.some((variant) => variant.size === size.name && (!selectedColor || variant.color === selectedColor.name) && Number(variant.stock) > 0)
    ),
  }));
  const selectedVariant = inventory.find((variant) => variant.color === selectedColor?.name && variant.size === selectedSize);
  const stockLimit = inventory.length && selectedColor && selectedSize ? Number(selectedVariant?.stock || 0) : null;
  const outOfStock = stockLimit === 0;
  const maxQuantity = stockLimit == null ? Infinity : stockLimit;
  const suppliedRating = Number(product.averageRating ?? product.rating ?? 0);
  const reviewAverage = reviews.length ? reviews.reduce((total, review) => total + Number(review.rating || 0), 0) / reviews.length : 0;
  const rating = reviews.length
    ? reviewAverage
    : Number.isFinite(suppliedRating) && suppliedRating > 0
      ? suppliedRating
      : 0;
  const reviewCount = reviews.length || Number(product.numReviews || 0);
  const regularPrice = Number(product.price);
  const mrp = Number(product.mrp ?? product.originalPrice ?? product.compareAtPrice);
  const hasMrp = Number.isFinite(mrp) && Number.isFinite(regularPrice) && mrp > regularPrice;
  const material = product.material || product.materials;
  const care = product.careInstructions || product.care;

  const moveImage = (direction) => {
    if (images.length < 2) return;
    setSelectedImage((index) => (index + direction + images.length) % images.length);
    setImageLoading(true);
    setBrokenImage('');
  };

  const handleAddToCart = async () => {
    setFormError('');
    setCartMessage('');

    if (colorOptions.length > 0 && !selectedColor) {
      setFormError('Please select a color.');
      return;
    }
    if (availableSizeOptions.length > 0 && !selectedSize) {
      setFormError('Please select a size.');
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 1 || (Number.isFinite(stockLimit) && quantity > stockLimit)) {
      setFormError('Choose a valid quantity available for this product.');
      return;
    }
    if (stockLimit === 0) {
      setFormError('This product is currently out of stock.');
      return;
    }
    if (inventory.length > 0 && (!selectedVariant || quantity > Number(selectedVariant.stock || 0))) {
      setFormError('This color and size combination is unavailable in the selected quantity.');
      return;
    }
    if (!isAuthenticated) {
      setFormError('Please sign in before adding items to your cart.');
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(product, selectedColor?.name || null, selectedSize || null, quantity);
      setCartMessage(`${product.name} added to your cart.`);
    } catch (cartError) {
      setFormError(getApiMessage(cartError) || 'Unable to add this item to your cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (value) => Number.isFinite(Number(value)) ? currency.format(Number(value)) : '';

  return (
    <main className={`container ${styles.page}`}>
      <section className={styles.productView}>
        <div className={styles.galleryColumn}>
          <div className={styles.imageGallery}>
            {currentImage && brokenImage !== currentImage ? (
              <>
                {imageLoading && <div className={`${styles.imagePlaceholder} ${styles.imageLoading}`} aria-hidden="true" />}
                <img
                  key={currentImage}
                  src={currentImage}
                  alt={product.name || 'Product image'}
                  className={`${styles.mainImage} ${imageLoading ? styles.mainImageLoading : ''}`}
                  onLoad={() => setImageLoading(false)}
                  onError={() => { setBrokenImage(currentImage); setImageLoading(false); }}
                />
              </>
            ) : (
              <div className={styles.imagePlaceholder} role="img" aria-label="Product image unavailable">
                <ImageOff aria-hidden="true" />
                <span>{images.length ? 'Image unavailable' : 'No product image'}</span>
              </div>
            )}
            {images.length > 1 && (
              <>
                <button type="button" className={`${styles.galleryArrow} ${styles.galleryPrevious}`} onClick={() => moveImage(-1)} aria-label="Previous image"><ChevronLeft /></button>
                <button type="button" className={`${styles.galleryArrow} ${styles.galleryNext}`} onClick={() => moveImage(1)} aria-label="Next image"><ChevronRight /></button>
                <span className={styles.imageCounter}>{selectedImage + 1} / {images.length}</span>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className={styles.thumbnailList} aria-label="Product images">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={`${styles.thumbnailButton} ${selectedImage === index ? styles.thumbnailSelected : ''}`}
                  onClick={() => { setSelectedImage(index); setImageLoading(true); setBrokenImage(''); }}
                  aria-label={`Show product image ${index + 1}`}
                  aria-pressed={selectedImage === index}
                >
                  <img src={image} alt="" onError={(event) => { event.currentTarget.hidden = true; }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.productDetails}>
          <p className={styles.eyebrow}>{[product.category, product.type].filter(Boolean).join(' / ')}</p>
          <h1 className={styles.productName}>{product.name}</h1>
          <div className={styles.ratingSummary}>
            {rating > 0 ? (
              <>
                <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
                <StarRating rating={rating} />
                <span className={styles.ratingCount}>{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span>
              </>
            ) : <span className={styles.ratingCount}>No reviews yet</span>}
          </div>

          <div className={styles.priceBlock}>
            <span className={styles.productPrice}>{formatPrice(product.price)}</span>
            {hasMrp && <><span className={styles.mrpPrice}>MRP {formatPrice(mrp)}</span><span className={styles.discount}>{Math.round(((mrp - regularPrice) / mrp) * 100)}% OFF</span></>}
          </div>

          {product.description && <p className={styles.productDescription}>{product.description}</p>}

          {colorOptions.length > 0 && (
            <div className={styles.optionGroup}>
              <div className={styles.optionHeading}><span>Color:</span><span className={styles.selectedOption}>{selectedColor?.name}</span></div>
              <div className={styles.colorSwatches} role="group" aria-label="Choose a color">
                {colorOptions.map((color, index) => (
                  <button
                    key={color._id || `${color.name}-${index}`}
                    type="button"
                    className={`${styles.swatchOption} ${!color.hex ? styles.colorNameOption : ''} ${selectedColor?.name === color.name ? styles.activeSwatch : ''}`}
                    onClick={() => {
                      setSelectedColor(color);
                      if (selectedSize && inventory.length) {
                        const variantStock = inventory.find((variant) => variant.color === color.name && variant.size === selectedSize)?.stock;
                        if (Number(variantStock) > 0) {
                          setQuantity((current) => Math.min(current, Number(variantStock)));
                        } else {
                          setSelectedSize('');
                          setQuantity(1);
                        }
                      }
                    }}
                    aria-label={color.name}
                    aria-pressed={selectedColor?.name === color.name}
                    title={color.name}
                  >
                    {color.hex ? <span className={styles.swatch} style={{ '--swatch-color': color.hex }} /> : <span>{color.name}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {availableSizeOptions.length > 0 && (
            <div className={styles.optionGroup}>
              <div className={styles.optionHeading}><span>Select Size</span><button type="button" className={styles.textButton} onClick={() => setFormError('Check the size information provided with this product or contact support for fit guidance.')}>Size Guide</button></div>
              <div className={styles.sizeSelector} role="group" aria-label="Choose a size">
                {availableSizeOptions.map((size) => (
                  <button
                    key={size.name}
                    type="button"
                    className={`${styles.sizeButton} ${selectedSize === size.name ? styles.activeSize : ''}`}
                    onClick={() => {
                      setSelectedSize(size.name);
                      if (selectedColor && inventory.length) {
                        const variantStock = inventory.find((variant) => variant.color === selectedColor.name && variant.size === size.name)?.stock;
                        setQuantity((current) => Math.min(current, Math.max(1, Number(variantStock) || 1)));
                      }
                    }}
                    disabled={!size.available}
                    aria-pressed={selectedSize === size.name}
                  >{size.name}</button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.quantityGroup}>
            <span className={styles.optionHeading}>Quantity</span>
            <div className={styles.quantityControl}>
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity <= 1} aria-label="Decrease quantity"><Minus size={17} /></button>
              <output aria-live="polite">{quantity}</output>
              <button type="button" onClick={() => setQuantity((value) => Math.min(maxQuantity === Infinity ? value + 1 : maxQuantity, value + 1))} disabled={maxQuantity === Infinity ? false : quantity >= maxQuantity} aria-label="Increase quantity"><Plus size={17} /></button>
            </div>
            {stockLimit != null && <span className={styles.stockNote}>{outOfStock ? 'Out of stock' : `${stockLimit} available`}</span>}
          </div>

          <div className={styles.purchaseActions}>
            <button type="button" className={styles.addToCartButton} onClick={handleAddToCart} disabled={addingToCart || outOfStock || (inventory.length > 0 && (!selectedColor || !selectedSize))}>
              {addingToCart ? 'Adding…' : outOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button type="button" className={`${styles.wishlistButton} ${isWishlisted ? styles.wishlistActive : ''}`} onClick={handleWishlistToggle} aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
              <Heart aria-hidden="true" fill={isWishlisted ? 'currentColor' : 'none'} /> <span>{isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>
          {formError && <p className={styles.errorMessage} role="alert">{formError}</p>}
          {cartMessage && <p className={styles.successMessage} role="status"><Check aria-hidden="true" />{cartMessage}</p>}
          {wishlistError && <p className={styles.errorMessage} role="alert">{wishlistError}</p>}

          <div className={styles.deliveryInfo}>
            <div><Truck aria-hidden="true" /><span>Delivery options shown at checkout</span></div>
            <div><RotateCcw aria-hidden="true" /><span>Return terms follow store policy</span></div>
            <div><ShieldCheck aria-hidden="true" /><span>Secure checkout</span></div>
            <div><Check aria-hidden="true" /><span>Quality checked</span></div>
          </div>
        </div>
      </section>

      <section className={styles.informationSection} aria-labelledby="product-info-heading">
        <h2 id="product-info-heading" className={styles.sectionTitle}>Product Information</h2>
        {product.description && <p className={styles.informationDescription}>{product.description}</p>}
        <dl className={styles.informationList}>
          {product.category && <div><dt>Category</dt><dd>{product.category}</dd></div>}
          {product.type && <div><dt>Product type</dt><dd>{product.type}</dd></div>}
          {material && <div><dt>Material</dt><dd>{Array.isArray(material) ? material.join(', ') : material}</dd></div>}
          {care && <div><dt>Care</dt><dd>{care}</dd></div>}
        </dl>
      </section>

      <section className={styles.reviewsSection} aria-labelledby="reviews-heading">
        <div className={styles.sectionHeading}>
          <div><p className={styles.eyebrow}>Customer feedback</p><h2 id="reviews-heading" className={styles.sectionTitle}>Customer Reviews</h2></div>
          {rating > 0 && <div className={styles.reviewTotals}><strong>{rating.toFixed(1)}</strong><StarRating rating={rating} /><span>{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span></div>}
        </div>

        <form className={styles.reviewForm} onSubmit={handleReviewSubmit}>
          <div className={styles.reviewFormHeader}>
            <label htmlFor="review-rating">Your rating</label>
            <StarRating rating={reviewForm.rating} onRating={(value) => setReviewForm((current) => ({ ...current, rating: value }))} label="Review rating" />
          </div>
          <textarea id="review-comment" value={reviewForm.comment} onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))} placeholder="Share your experience with this product..." rows={4} />
          <button type="submit" className={styles.primaryButton} disabled={submittingReview || !reviewForm.rating}>
            {submittingReview ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>

        {reviewsError && <p className={styles.errorMessage} role="alert">{reviewsError}</p>}
        {reviews.length ? (
          <div className={styles.reviewList}>
            {reviews.map((review, index) => {
              const author = review.user?.fullName || review.user?.name || review.author || 'Customer';
              const isOwner = !!user && !!review.user && String(review.user._id || review.user.id || '') === String(user._id || user.id || '');
              const comments = Array.isArray(review.comments)
                ? review.comments
                : [{ text: review.comment || review.text, _id: review._id || review.id }].filter((entry) => entry?.text);

              return (
                <article className={styles.reviewCard} key={review._id || review.id || `${author}-${index}`}>
                  <div className={styles.reviewHeader}> 
                    <strong>{author}</strong>
                    <StarRating rating={Number(review.rating) || 0} label={`${author}'s rating`} />
                  </div>
                  {comments.map((comment, commentIndex) => {
                    const commentId = comment?._id || `${review._id || review.id || author}-${commentIndex}`;
                    return (
                      <div key={commentId} className={styles.reviewCommentBlock}>
                        <p>{comment?.text}</p>
                        {isOwner && (
                          <button
                            type="button"
                            className={styles.textButton}
                            onClick={() => handleDeleteReview(commentId)}
                            disabled={deletingReviewId === commentId}
                          >
                            {deletingReviewId === commentId ? 'Deleting...' : 'Delete'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {(review.verifiedPurchase || review.isVerifiedPurchase) && <span className={styles.verifiedPurchase}><Check size={15} aria-hidden="true" />Verified Purchase</span>}
                </article>
              );
            })}
          </div>
        ) : !reviewsError ? (
          <div className={styles.emptyReviews}><Star aria-hidden="true" /><p>No reviews yet</p></div>
        ) : null}
      </section>

      {relatedProducts.length > 0 && (
        <section className={styles.recommendations} aria-labelledby="related-heading">
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Selected for you</p><h2 id="related-heading" className={styles.sectionTitle}>You May Also Like</h2></div><Link to={`/${product.category}`} className={styles.textButton}>View collection</Link></div>
          <div className={styles.productCarousel}>
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={getProductId(relatedProduct)} product={{ ...relatedProduct, _id: getProductId(relatedProduct) }} />
            ))}
          </div>
        </section>
      )}
      {relatedProductsError && (
        <p className={styles.errorMessage} role="status">{relatedProductsError}</p>
      )}
    </main>
  );
};

export default ProductDetailPage;