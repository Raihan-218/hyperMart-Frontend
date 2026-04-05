import React, { useState, useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './productDetails.module.css';
import ProductCard from '../../components/ProductCard/productCards.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { getProductById } from '../../services/productService.js';

// --- Helper Components ---
const StarRating = ({ rating, onRating, readOnly = false }) => (
  <div className={`${styles.starRating} ${!readOnly ? styles.starRatingInput : ''}`}>
    {[...Array(5)].map((_, index) => (
      <span
        key={index}
        className={index < rating ? styles.starFilled : styles.starEmpty}
        onClick={() => !readOnly && onRating(index + 1)}
      >
        ★
      </span>
    ))}
  </div>
);

// A simple (static) list of reviews to start with
const demoReviews = [
  { id: 1, author: 'Ananya Sharma', rating: 5, text: "Absolutely love this jacket! The fit is perfect and the quality is amazing." },
  { id: 2, author: 'Rohan Verma', rating: 4, text: "Great product. The material is comfortable, but I wish there were more colors." },
];

// --- Main Component ---
const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();

  // --- New State for Functionality ---
  const [selectedColor, setSelectedColor] = useState('Black');
  const [selectedSize, setSelectedSize] = useState('M');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCartMsg, setAddedToCartMsg] = useState('');
  const [reviews, setReviews] = useState(demoReviews);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log(product)
        console.log("FINAL IMAGE URL:", product?.images?.[0]?.url );
        const response = await getProductById(id);

        const data = response.data.product;

        console.log("API DATA:", data);

        if (!data) {
          setError("Product not found");
          return;
        }

        setProduct(data);

      } catch (err) {
        console.error("Failed to fetch product", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct(); // ✅ CALL HERE (OUTSIDE function)

  }, [id]); // ✅ DEPENDENCY

  // 3. Simulate "In Stock" data. (e.g., odd-numbered IDs are out of stock)
  // Ensure product exists before accessing properties
  // const inStock = product && product._|id % 2 === 0;
  const inStock = true // until real inventory logic

  if (loading) return <div className="container" style={{ margin: '4rem 0' }}>Loading...</div>;
  if (error) return <div className="container" style={{ margin: '4rem 0', color: 'red' }}>{error}</div>;

  if (!product) {
    return <div className="container" style={{ textAlign: 'center', margin: '4rem 0' }}><h2>Product Not Found!</h2></div>;
  }

  // --- Event Handlers ---
  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted); // Toggle the state
  };

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, 1);
    setAddedToCartMsg('Added to cart!');
    setTimeout(() => setAddedToCartMsg(''), 3000); // Clear message after 3s
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (newReviewText.trim() === '' || newReviewRating === 0) {
      alert('Please leave a rating and a comment.');
      return;
    }
    const newReview = {
      id: Date.now(),
      author: 'New User', // In a real app, this would come from user auth
      rating: newReviewRating,
      text: newReviewText,
    };
    setReviews([newReview, ...reviews]); // Add new review to the top
    setNewReviewRating(0); // Reset form
    setNewReviewText('');
  };

  // --- Dynamic Data for Filtering ---
  // Placeholder for dynamic recommendations
  const similarProducts = [];
  const recommendedProducts = [];
  const colors = ['Black', 'Navy', 'Graphite'];
  const sizes = ['S', 'M', 'L', 'XL'];

  return (
    <div className="container">
      {/* --- Main Product Section --- */}
      <div className={styles.productView}>
        {/* Left Side: Image Gallery */}
        <div className={styles.imageGallery}>
          {/* 4. Show "Out of Stock" overlay if not in stock */}
          {!inStock && <div className={styles.outOfStockOverlay}>Out of Stock</div>}
          <img src={product.images?.[0]?.url} alt={product.name} className={styles.mainImage} />
        </div>


        {/* Right Side: Product Details & Actions */}
        <div className={styles.productDetails}>
          <h1 className={styles.productName}>{product.name}</h1>
          <div className={styles.priceAndReviews}>
            <p className={styles.productPrice}>₹{product.price}</p>
            <div className={styles.miniReview}>
              <StarRating rating={4} readOnly={true} />
              <span>({reviews.length} Reviews)</span>
            </div>
          </div>
          <p className={styles.productDescription}>
            A timeless classic, this {product.type} is crafted from premium materials for ultimate comfort and durability.
          </p>

          {/* Color Options (Already works) */}
          <div className={styles.optionGroup}>
            <label>Color:</label>
            <div className={styles.colorSwatches}>
              {colors.map(color => (
                <button
                  key={color}
                  className={`${styles.swatch} ${selectedColor === color ? styles.activeSwatch : ''}`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Size Options (Already works) */}
          <div className={styles.optionGroup}>
            <label>Size:</label>
            <div className={styles.sizeSelector}>
              {sizes.map(size => (
                <button
                  key={size}
                  className={`${styles.sizeButton} ${selectedSize === size ? styles.activeSize : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Success Message */}
          {addedToCartMsg && <div className={styles.successMessage}>{addedToCartMsg}</div>}

          {/* 6. Actions: Add to Cart & Wishlist */}
          <div className={styles.actions}>
            <button
              className={styles.addToCartButton}
              onClick={handleAddToCart}
              disabled={!inStock} // Disable button if out of stock
            >
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button
              className={`${styles.wishlistButton} ${isWishlisted ? styles.wishlisted : ''}`}
              onClick={handleWishlistToggle}
            >
              {isWishlisted ? '♥ Added to Wishlist' : '♡ Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {/* --- Customer Reviews Section --- */}
      <div className={styles.reviewsSection}>
        <h2 className={styles.sectionTitle}>Customer Reviews</h2>

        {/* 7. New Review Form */}
        <form className={styles.reviewForm} onSubmit={handleReviewSubmit}>
          <h3>Write a Review</h3>
          <div className={styles.optionGroup}>
            <label>Your Rating:</label>
            <StarRating rating={newReviewRating} onRating={setNewReviewRating} />
          </div>
          <div className={styles.optionGroup}>
            <label htmlFor="reviewText">Your Review:</label>
            <textarea
              id="reviewText"
              className={styles.reviewTextarea}
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              placeholder="What did you like or dislike?"
            />
          </div>
          <button type="submit" className={styles.submitReviewButton}>Submit Review</button>
        </form>

        {/* 8. Dynamic Review List */}
        <div className={styles.reviewList}>
          {reviews.map(review => (
            <div className={styles.reviewCard} key={review.id}>
              <div className={styles.reviewHeader}>
                <strong>{review.author}</strong>
                <StarRating rating={review.rating} readOnly={true} />
              </div>
              <p>{review.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- Recommendations Sections --- */}
      <div className={styles.recommendations}>
        {/* ... (rest is the same) ... */}
      </div>
    </div>
  );
};

export default ProductDetailPage;