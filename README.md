# HyperMart : Modern Fashion E-Commerce Platform

A full-stack inspired fashion e-commerce frontend built using **React**, **Vite**, **React Router**, **Tailwind CSS**, and **Axios**.
HyperMart provides a sleek shopping experience for Men, Women, and Kids collections with authentication, cart management, admin dashboard support, dark mode, and responsive UI. 

---

## 🚀 Features

### 👕 Customer Features

* Browse products by categories:

  * Men
  * Women
  * Kids
* Product detail pages
* Add to cart functionality
* Shopping cart management
* User authentication
* Protected routes for logged-in users
* Responsive modern UI
* Dark/Light theme toggle
* Dynamic product filtering

### 🔐 Authentication

* User Registration
* Login & Logout
* Persistent authentication using cookies/JWT
* Auth context management

### 🛒 Cart System

* Add products to cart
* Remove products
* Quantity management
* Cart persistence with backend API

### 🛠️ Admin Features

* Admin protected routes
* Admin dashboard
* View customer orders
* Add new products
* Role-based access control

---

# 🧱 Tech Stack

## Frontend

* React 19
* Vite
* React Router DOM
* Tailwind CSS
* CSS Modules
* Axios
* Lucide React Icons

## State Management

* React Context API

  * AuthContext
  * CartContext

## Backend Integration

Connected with REST APIs using Axios.

---

# 📂 Project Structure

```bash
src/
│
├── components/
│   ├── Navbar/
│   ├── Footer/
│   ├── ProductCard/
│   ├── protectedRoute.jsx
│   └── AdminRoute.jsx
│
├── context/
│   ├── AuthContext.jsx
│   └── CartContext.jsx
│
├── pages/
│   ├── HomePage/
│   ├── MensPage/
│   ├── WomensPage/
│   ├── KidsPage/
│   ├── CartPage/
│   ├── LoginPage/
│   ├── SignUp/
│   ├── productDetails/
│   └── Admin/
│
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── cartService.js
│   └── productService.js
│
├── App.jsx
├── main.jsx
└── index.css
```

---

# ⚙️ Installation

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/hypermart-frontend.git
cd hypermart-frontend
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Setup Environment Variables

Create a `.env` file in the root directory.

```env
VITE_BACKEND_URL=http://localhost:5000/api
```

---

## 4️⃣ Run Development Server

```bash
npm run dev
```

Application will run on:

```bash
http://localhost:5173
```

---

# 🏗️ Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

# 🔐 Authentication Flow

The app uses:

* JWT Authentication
* Cookies with `withCredentials`
* Protected routes using React Router
* Context API for global auth state

---

# 🛍️ Product Categories

* Men's Fashion
* Women's Fashion
* Kids Collection

Each category supports:

* Dynamic fetching
* Filtering by product type
* Responsive product grid

---

# 🌙 Dark Mode

HyperMart supports:

* Light Theme
* Dark Theme

Theme preference is stored using `localStorage`.

---

# 🧑‍💻 Admin Panel

Admin users can:

* Access admin dashboard
* View customer orders
* Add new products
* Manage store inventory

Protected using role-based routing.

---

# 📦 API Services

### Authentication APIs

```js
/users/register
/users/login
/users/logout
/users/me
```

### Product APIs

```js
/products
/products/:id
/products/addproducts
```

### Cart APIs

```js
/carts
/carts/add
/carts/remove/:id
/carts/checkout
```

---

# 🎨 UI Highlights

* Smooth animations
* Hover interactions
* Clean card layouts
* Responsive navbar
* Modern typography using Poppins
* Mobile-friendly design

---

# 🚀 Deployment

This project can be deployed easily on:

* Netlify
* Vercel
* Render

### Netlify Redirect Fix

Create a `_redirects` file inside `public/`:

```bash
/* /index.html 200
```

This prevents refresh errors on React routes. 

---

# 📈 Future Improvements

* Payment Gateway Integration
* Order Tracking
* Search & Filters
* Inventory Analytics
* Email Verification
* Mobile App Version
  
# 👨‍💻 Author

Developed by Sheikh Raihan
