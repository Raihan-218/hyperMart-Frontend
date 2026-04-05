# HyperMart Frontend

A modern, responsive e-commerce frontend application built with **React**, **Vite**, and **Tailwind CSS**. HyperMart is a full-featured fashion retail platform with shopping cart functionality, user authentication, and an admin dashboard.

---

## 📋 Project Overview

**HyperMart** is a fashion e-commerce platform that allows customers to browse, search, and purchase clothing items across multiple categories (Men, Women, Kids). The application includes user authentication, a shopping cart system, product details with reviews, and an admin dashboard for order management.

**Repository:** https://github.com/Raihan-218/hyperMart-Frontend  
**Current Branch:** `dev`

---

## ✅ Completed Features

### 1. **Core Application Setup**
- ✅ React 19.1 with Vite (v7.1.12) for fast development
- ✅ React Router v7.9.3 for client-side routing
- ✅ Tailwind CSS v3.4 with dark mode support (class-based)
- ✅ ESLint configuration for code quality
- ✅ Module CSS for component-scoped styling
- ✅ Lucide React icons integration

### 2. **Authentication System**
- ✅ **Login Page** (`LoginPage.jsx`)
  - Email and password validation
  - Integration with backend authentication API
  - Error handling and user feedback
  - Redirect to dashboard for admin users
  
- ✅ **Sign-Up Page** (`SignUpPage.jsx`)
  - User registration with full name, email, and password
  - Backend integration for user creation
  - Input validation
  - Automatic redirect to login on success

- ✅ **Auth Context** (`AuthContext.jsx`)
  - Global authentication state management
  - Persistent user data in localStorage
  - Custom `useAuth()` hook for easy access
  - Login/Logout functionality

### 3. **Shopping Cart System**
- ✅ **Cart Context** (`CartContext.jsx`)
  - Global cart state management with Context API
  - Custom `useCart()` hook
  - Functions: `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`
  - Support for product variants (color, size) with unique cart item IDs
  - Persistent cart logic ready for localStorage integration

- ✅ **Cart Page** (`CartPage.jsx`)
  - Display all cart items with images, prices, and variants
  - Quantity adjustment controls (+ and -)
  - Item removal functionality
  - Order summary with subtotal and total calculation
  - Free shipping display
  - "Continue Shopping" button for empty cart
  - Responsive layout with grid system

### 4. **Product Management**
- ✅ **Product Data** (`products.js`)
  - 38+ product entries across three categories
  - Product information: ID, name, category, type, price, image URL
  - Categories: Men, Women, Kids
  - Types: Jackets, T-Shirts, Shirts, Dresses, etc.

- ✅ **Product Card Component** (`ProductCard.jsx`)
  - Reusable product card with image, name, and price
  - Hover overlay with "View Details" text
  - Links to product detail page
  - Responsive design

- ✅ **Product Details Page** (`productDetails.jsx`)
  - Full product information display
  - Image gallery placeholder
  - Color and size selection
  - Quantity selector
  - "Add to Cart" functionality with success message
  - Wishlist toggle feature
  - Stock status indicator (Out of Stock overlay)
  - Customer reviews section with star ratings
  - Review submission form
  - Similar products recommendation
  - Cross-category product recommendations

### 5. **Category Pages**
- ✅ **Men's Page** (`MensPage.jsx`)
  - Filter products by type (Jacket, T-Shirt, Shirt, etc.)
  - Dynamic sub-category filtering
  - Product grid display
  - Active filter highlighting

- ✅ **Women's Page** (`WomensPage.jsx`)
  - Similar filtering capabilities as Men's page
  - Dedicated women's product collection

- ✅ **Kids' Page** (`KidsPage.jsx`)
  - Filtered kids' collection
  - Same layout and filtering patterns

### 6. **Home Page**
- ✅ **HomePage** (`homePage.jsx`)
  - Hero section with call-to-action button
  - Featured Men's collection (5 products)
  - Featured Women's collection (5 products)
  - Featured Kids' collection (5 products)
  - "View All" links to category pages
  - Responsive product grid layout

### 7. **Navigation & Layout**
- ✅ **Navbar** (`Navbar.jsx`)
  - Responsive navigation with logo/brand name
  - Category links (Home, Men, Women, Kids, About, Help)
  - Dark/Light theme toggle with icons
  - Shopping cart icon with item count badge
  - User authentication display (Login/Logout/Profile)
  - Admin panel link (visible only to admins)
  - Lucide React icons for visual clarity

- ✅ **Footer** (`Footer.jsx`)
  - Four-column layout (Brand, Shop, Help, Newsletter)
  - Navigation links to all major pages
  - Newsletter signup form with email input
  - Social media icons (Facebook, Twitter, Instagram)
  - Copyright and current year display
  - Dark mode support

### 8. **Admin Features**
- ✅ **AdminRoute Component** (`AdminRoute.jsx`)
  - Protected route wrapper for admin-only pages
  - Role-based access control
  - Redirects non-admin users to home page
  - Redirects unauthenticated users to login page

- ✅ **Admin Dashboard** (`AdminDashboard.jsx`)
  - Displays all customer orders in table format
  - Fetches orders from backend API (`/admin/orders`)
  - Loading state handling
  - Error handling with user feedback
  - Displays: Order ID, Customer Email, Total Amount, Status
  - "View/Edit" button for each order (placeholder)
  - Status badge styling

### 9. **Styling & Theming**
- ✅ **Tailwind CSS Integration**
  - Dark mode support with class-based approach
  - Responsive breakpoints (mobile-first design)
  - Utility-first CSS framework
  - Custom color schemes for light/dark modes

- ✅ **Module CSS Files**
  - `Navbar.module.css` - Navigation styling
  - `Footer.module.css` - Footer styling (using Tailwind)
  - `ProductCards.module.css` - Product card styling
  - `HomePage.Module.css` - Home page sections
  - `CartPage.module.css` - Shopping cart layout
  - `AuthForm.module.css` - Login/Signup form styling
  - `productDetails.module.css` - Product detail page styling
  - `AdminDashboard.module.css` - Admin dashboard table styling
  - `CategoryPage.module.css` - Category page filtering

### 10. **Environment Configuration**
- ✅ **Vite Configuration** (`vite.config.js`)
  - React plugin with Fast Refresh support
  - Optimized build setup

- ✅ **Tailwind Configuration** (`tailwind.config.js`)
  - Dark mode class-based configuration
  - CSS content paths configured

- ✅ **PostCSS Configuration** (`postcss.config.js`)
  - Autoprefixer for CSS compatibility
  - Tailwind CSS processing

---

## 📋 Pending Features & Work to be Implemented

### High Priority (Core Functionality)

1. **Cart Persistence**
   - [ ] Save cart items to localStorage
   - [ ] Load cart from localStorage on app startup
   - [ ] Sync cart across browser sessions

2. **Checkout & Payment**
   - [ ] Checkout page with shipping form
   - [ ] Payment integration (Stripe/Razorpay)
   - [ ] Order confirmation page
   - [ ] Order receipt email
   - [ ] Order status tracking page

3. **User Profile Page**
   - [ ] Display user information (name, email, phone)
   - [ ] Edit profile functionality
   - [ ] Address management (multiple addresses)
   - [ ] Order history view
   - [ ] Wishlist view and management
   - [ ] Payment method management

4. **Search & Filter Enhancement**
   - [ ] Global search functionality
   - [ ] Advanced filtering (price range, color, size, rating)
   - [ ] Sorting options (price low-to-high, newest, bestsellers)
   - [ ] Search results page

5. **Product Reviews & Ratings**
   - [ ] Backend integration for saving reviews
   - [ ] User authentication for reviews
   - [ ] Average rating calculation and display
   - [ ] Review pagination
   - [ ] Helpful/Unhelpful voting on reviews

6. **Wishlist Feature**
   - [ ] Add/remove items from wishlist
   - [ ] Persistent wishlist storage (localStorage/database)
   - [ ] Move from wishlist to cart
   - [ ] Wishlist sharing functionality
   - [ ] Share wishlist via email/link

### Medium Priority (Enhanced UX)

7. **Product Image Gallery**
   - [ ] Multiple product images per product
   - [ ] Image zoom functionality
   - [ ] Image carousel/slider
   - [ ] Image preview on hover

8. **Notifications & Toast Messages**
   - [ ] Toast notification library (React Toastify)
   - [ ] Success notifications for add-to-cart
   - [ ] Error notifications for failed operations
   - [ ] Info notifications for stock updates

9. **Loading States & Skeleton Screens**
   - [ ] Skeleton loading for product cards
   - [ ] Loading spinner for data fetching
   - [ ] Page transition animations

10. **About & Help Pages**
    - [ ] About us page with company information
    - [ ] FAQ page with common questions
    - [ ] Contact us form with email integration
    - [ ] Terms & Conditions page
    - [ ] Privacy Policy page

### Medium Priority (Admin Dashboard Enhancement)

11. **Admin Dashboard Expansion**
    - [ ] Order details view/modal
    - [ ] Update order status
    - [ ] Add/Edit/Delete products
    - [ ] Manage product inventory
    - [ ] User management panel
    - [ ] Sales statistics and charts
    - [ ] Revenue reports
    - [ ] Refund management

12. **Analytics Dashboard**
    - [ ] Sales by category charts
    - [ ] Top-selling products
    - [ ] Customer demographics
    - [ ] Monthly revenue trends
    - [ ] Export reports (PDF/Excel)

### Low Priority (Nice-to-Have Features)

13. **Responsive Design Improvements**
    - [ ] Mobile hamburger menu for navbar
    - [ ] Mobile-optimized cart
    - [ ] Touch-friendly buttons and inputs
    - [ ] Mobile product gallery

14. **Performance Optimization**
    - [ ] Image lazy loading
    - [ ] Code splitting by routes
    - [ ] Caching strategies
    - [ ] Bundle size optimization
    - [ ] API response caching

15. **Additional Features**
    - [ ] Product comparison tool
    - [ ] Size guide with images
    - [ ] Product availability notifications
    - [ ] Seasonal/promo banners
    - [ ] Email marketing integration
    - [ ] Social media sharing buttons
    - [ ] Live chat support
    - [ ] Product reviews email notifications

16. **Testing**
    - [ ] Unit tests with Vitest/Jest
    - [ ] Component tests with React Testing Library
    - [ ] E2E tests with Cypress/Playwright
    - [ ] Integration tests for API calls
    - [ ] Performance testing

17. **Documentation**
    - [ ] Component documentation with Storybook
    - [ ] API documentation
    - [ ] Setup guide for developers
    - [ ] Contributing guidelines
    - [ ] Deployment instructions

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running (for full functionality)

### Installation

```bash
# Clone the repository
git clone https://github.com/Raihan-218/hyperMart-Frontend.git
cd hyperMart-Frontend

# Install dependencies
npm install

# Create .env file with backend URL
echo "VITE_BACKEND_URL=http://localhost:5000" > .env

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm lint
```

### Environment Variables
Create a `.env` file in the root directory:
```
VITE_BACKEND_URL=http://localhost:5000
```

---

## 📁 Project Structure

```
src/
├── assets/               # Images and static assets
├── components/
│   ├── Navbar/          # Navigation component
│   ├── Footer/          # Footer component
│   ├── ProductCard/     # Reusable product card
│   └── AdminRoute.jsx   # Protected admin route
├── context/
│   ├── AuthContext.jsx  # Authentication state
│   └── CartContext.jsx  # Shopping cart state
├── data/
│   └── products.js      # Product database
├── pages/
│   ├── HomePage/        # Home page
│   ├── MensPage/        # Men's category
│   ├── WomensPage/      # Women's category
│   ├── KidsPage/        # Kids' category
│   ├── LoginPage/       # Login page
│   ├── SignUp/          # Signup page
│   ├── CartPage/        # Shopping cart
│   ├── productDetails/  # Product detail page
│   └── Admin/           # Admin pages
├── App.jsx              # Main app component
└── main.jsx             # React entry point
```

---

## 🎨 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.1.1 | Frontend framework |
| React Router | 7.9.3 | Client-side routing |
| Vite | 7.1.12 | Build tool & dev server |
| Tailwind CSS | 3.4.17 | Utility-first CSS |
| Lucide React | 0.544.0 | Icon library |
| PostCSS | 8.5.6 | CSS processing |
| Autoprefixer | 10.4.21 | CSS vendor prefixes |
| ESLint | 9.36.0 | Code linting |

---

## 🔐 Authentication Flow

1. **Sign Up**: User enters full name, email, password → Backend creates user account
2. **Login**: User enters email, password → Backend validates and returns user with role
3. **Context Storage**: User data stored in AuthContext and localStorage
4. **Protected Routes**: Admin routes check role before rendering
5. **Logout**: Clears user from context and localStorage, redirects to login

---

## 🛒 Shopping Cart Flow

1. **View Product**: User navigates to product detail page
2. **Select Options**: User chooses color, size, and quantity
3. **Add to Cart**: Product with options added to CartContext
4. **Cart Persistence**: (Planned) Save to localStorage
5. **View Cart**: User can adjust quantities or remove items
6. **Checkout**: (Pending) User proceeds to payment

---

## 👨‍💼 Admin Features

- **Protected Access**: Only users with `role: 'admin'` can access admin pages
- **Order Management**: View all customer orders with details
- **Order Status**: Display order status with visual badges
- **Future Enhancements**: Product management, inventory, analytics

---

## 📊 Code Quality & Standards

- ✅ **ESLint**: Configured for React best practices
- ✅ **Module CSS**: Component-scoped styles to avoid conflicts
- ✅ **Custom Hooks**: `useCart()`, `useAuth()` for state management
- ✅ **Responsive Design**: Mobile-first approach with Tailwind
- ✅ **Error Handling**: Try-catch blocks in async operations
- ✅ **User Feedback**: Loading states and error messages

---

## 🐛 Known Issues & Limitations

1. **Cart Persistence**: Cart items not persisted after page refresh (localStorage implementation pending)
2. **Product Images**: Using external URLs; consider hosting locally
3. **Admin Orders**: "View/Edit" button not fully implemented
4. **Search**: No global search functionality yet
5. **Mobile Menu**: Navbar doesn't have hamburger menu on mobile
6. **Payment**: No payment gateway integrated
7. **Email**: No email notifications configured
8. **Analytics**: No tracking or analytics implemented

---

## 🚦 Next Steps (Recommended Priority)

### Phase 1 (1-2 weeks)
1. Implement cart localStorage persistence
2. Create checkout page with shipping form
3. Integrate payment gateway (Razorpay/Stripe)

### Phase 2 (2-3 weeks)
1. Build user profile page
2. Implement order history
3. Add search and advanced filtering

### Phase 3 (3-4 weeks)
1. Enhance admin dashboard with CRUD operations
2. Add product image gallery
3. Implement notifications system

### Phase 4 (Ongoing)
1. Performance optimization
2. Testing (unit, integration, E2E)
3. Mobile responsiveness refinement
4. Analytics and monitoring

---

## 🧪 Testing Commands

```bash
# Run ESLint to check code quality
npm run lint

# (Future) Run unit tests
npm run test

# (Future) Run E2E tests
npm run test:e2e
```

---

## 📈 Performance Metrics

- **Bundle Size**: ~150KB (estimated, before optimization)
- **Build Time**: ~2-3 seconds (Vite)
- **Dev Server Start**: ~500ms (Vite Hot Module Replacement)
- **Lighthouse Score**: To be measured after performance optimization

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open Pull Request to `dev` branch

---

## 📝 Code Review Notes

### Strengths:
✅ Clean component structure with good separation of concerns  
✅ Proper use of React Context API for state management  
✅ Consistent folder organization  
✅ Good use of custom hooks (`useAuth`, `useCart`)  
✅ Responsive design with Tailwind CSS  
✅ Module CSS prevents style conflicts  
✅ Proper error handling in API calls  
✅ Accessible HTML structure with proper labels  

### Areas for Improvement:
🔧 Add PropTypes or TypeScript for type safety  
🔧 Implement localStorage persistence for cart  
🔧 Add loading spinners during data fetching  
🔧 Break down larger components into smaller ones  
🔧 Add comments to complex logic sections  
🔧 Implement proper error boundaries  
🔧 Add form validation feedback  
🔧 Create environment configuration for multiple backends  

### Best Practices Followed:
✅ React functional components with hooks  
✅ Proper context usage for global state  
✅ Component reusability (ProductCard)  
✅ Consistent naming conventions  
✅ Responsive mobile-first design  
✅ Browser localStorage for persistence  
✅ Proper credentials handling in fetch requests  

---

## 📞 Support & Resources

- **Repository**: https://github.com/Raihan-218/hyperMart-Frontend
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Vite**: https://vite.dev
- **React Router**: https://reactrouter.com

---

## 📄 License

This project is part of the HyperMart e-commerce platform owned by Raihan-218.

---

**Last Updated**: November 15, 2025  
**Status**: Development (Beta)  
**Maintainer**: Raihan-218
