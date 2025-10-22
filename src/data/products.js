// src/data/products.js

// STEP 1: Import all your local images
import img1 from '../assets/first.jpg';
import img2 from '../assets/second.jpg';
import img3 from '../assets/third.jpg';
import img4 from '../assets/fourth.jpg';
import img5 from '../assets/fifth.jpg';
import img6 from '../assets/sixth.jpg';
import img7 from '../assets/seventh.jpg';
import img8 from '../assets/eight.jpg';
import img9 from '../assets/nineth.jpg';
import img10 from '../assets/tenth.jpg';
import img11 from '../assets/eleventh.jpg';
import img12 from '../assets/twelfth.jpg';
import img13 from '../assets/thirteenth.jpg';
import img14 from '../assets/fourteenth.jpg';
import img15 from '../assets/fifteenth.jpg';
import img16 from '../assets/sixteenth.jpg';
import img17 from '../assets/seventeenth.jpg';
import img18 from '../assets/eighteenth.jpg';
import img19 from '../assets/ninetinth.jpg';
import img20 from '../assets/twenty.jpg';
import img21 from '../assets/twentyone.jpg';
import img22 from '../assets/twentytwo.jpg';
import img23 from '../assets/twentythree.jpg';
import img24 from '../assets/twentyfour.jpg';
import img25 from '../assets/twentyfive.jpg';
import img26 from '../assets/twentysix.jpg';
import img27 from '../assets/twentyseven.jpg';
import img28 from '../assets/twentyeight.jpg';
import img29 from '../assets/twentynine.jpg';
import img30 from '../assets/thirty.jpg';
import img31 from '../assets/thirtyone.jpg';
import img32 from '../assets/thirtytwo.jpg';
import img33 from '../assets/thirtythree.webp';
import img34 from '../assets/thirtyfour.webp';
import img35 from '../assets/thirtyfive.webp';
import img36 from '../assets/thirtysix.webp';
import img37 from '../assets/thirtyseven.webp';
import img38 from '../assets/thirtyeight.jpg'

export const products = [
  // --- MEN'S PRODUCTS ---
  { id: 1, name: 'Classic Jacket', type: 'Jacket', category: 'men', price: 1299, image: 'https://i.pinimg.com/736x/de/b5/54/deb554f072129d585b813409a34742b9.jpg' },
  { id: 7, name: 'Classic T-Shirt', type: 'T-Shirt', category: 'men', price: 599, image: 'https://i.pinimg.com/736x/86/5c/dc/865cdc8154e718fab8a3492dbbeaa6d3.jpg' },
  { id: 8, name: 'Cotton Shirt', type: 'Shirt', category: 'men', price: 999, image: 'https://i.pinimg.com/1200x/34/85/87/348587bffe99d11205193f96415dd3fe.jpg' },
  { id: 10, name: 'Urban Denim Jacket', type: 'Jacket', category: 'men', price: 1349, image: 'https://i.pinimg.com/1200x/c5/37/7c/c5377c80a499b632a290ec946fa33fe6.jpg' },
  { id: 11, name: 'Bomber Jacket', type: 'Jacket', category: 'men', price: 1399, image: 'https://i.pinimg.com/1200x/c5/37/7c/c5377c80a499b632a290ec946fa33fe6.jpg' },
  { id: 12, name: 'Windbreaker Jacket', type: 'Jacket', category: 'men', price: 1299, image: 'https://i.pinimg.com/1200x/c5/37/7c/c5377c80a499b632a290ec946fa33fe6.jpg' },
  { id: 9, name: 'Rugged Denim Jacket', type: 'Jacket', category: 'men', price: 1199, image: img32 },
  { id: 2, name: 'Slim Fit Chinos', type: 'Pants', category: 'men', price: 849, image: img38 },
  
  // --- KIDS' PRODUCTS ---
  { id: 5, name: 'Dinosaur Graphic Tee', type: 'T-Shirt', category: 'kids', price: 399, image: 'https://i.pinimg.com/1200x/c5/37/7c/c5377c80a499b632a290ec946fa33fe6.jpg' },
  { id: 6, name: 'Cozy Knit Sweater', type: 'Sweater', category: 'kids', price: 699, image: 'https://i.pinimg.com/1200x/c5/37/7c/c5377c80a499b632a290ec946fa33fe6.jpg' },
  { id: 20, name: 'Space Explorer Tee', type: 'T-Shirt', category: 'kids', price: 349, image: img33 },
  { id: 21, name: 'Rainbow Print Shirt', type: 'Shirt', category: 'kids', price: 499, image: img34 },
  { id: 22, name: 'Little Bear Hoodie', type: 'Jacket', category: 'kids', price: 799, image: img35 },
  { id: 23, name: 'Jungle Adventure Tee', type: 'T-Shirt', category: 'kids', price: 399, image: img36 },
  { id: 24, name: 'Kids Playtime Jeans', type: 'Jeans', category: 'kids', price: 629, image: img37 },
  { id: 25, name: 'Rocket Ship T-Shirt', type: 'T-Shirt', category: 'kids', price: 349, image: img33 },
  { id: 26, name: 'Fuzzy Bear Jacket', type: 'Jacket', category: 'kids', price: 899, image: img35 },

  // --- WOMEN'S PRODUCTS (Types randomized) ---
  { id: 3, name: 'Summer Vibe Top', type: 'Top', category: 'women', price: 1099, image: img1 },
  { id: 4, name: 'High-Waist Jeans', type: 'Jeans', category: 'women', price: 949, image: img2 },
  { id: 13, name: 'Elegant Evening Gown', type: 'Gown', category: 'women', price: 1199, image: img3 },
  { id: 14, name: 'Casual Denim Jacket', type: 'Jacket', category: 'women', price: 1399, image: img7 },
  { id: 15, name: 'Bohemian Maxi Dress', type: 'Dress', category: 'women', price: 1249, image: img6 },
  { id: 16, name: 'Chic Office Blouse', type: 'Shirt', category: 'women', price: 1049, image: img5 },
  { id: 17, name: 'Pleated A-Line Skirt', type: 'Skirt', category: 'women', price: 899, image: img8 },
  { id: 18, name: 'Cozy Knit Sweater', type: 'Sweater', category: 'women', price: 999, image: img4 },
  { id: 19, name: 'Midnight Sparkle Gown', type: 'Gown', category: 'women', price: 1399, image: img9 },
  { id: 27, name: 'Floral Print Dress', type: 'Dress', category: 'women', price: 1129, image: img10 },
  { id: 28, name: 'Silky Camisole Top', type: 'Top', category: 'women', price: 959, image: img11 },
  { id: 29, name: 'Weekend Getaway Jacket', type: 'Jacket', category: 'women', price: 1299, image: img12 },
  { id: 30, name: 'Ruffled Sundress', type: 'Dress', category: 'women', price: 1099, image: img13 },
  { id: 31, name: 'Button-Down Shirt', type: 'Shirt', category: 'women', price: 799, image: img14 },
  { id: 32, name: 'Formal Evening Dress', type: 'Dress', category: 'women', price: 1349, image: img15 },
  { id: 33, 'name': 'Asymmetrical Skirt', type: 'Skirt', category: 'women', price: 849, image: img16 },
  { id: 34, name: 'Lace Detail Top', type: 'Top', category: 'women', price: 999, image: img17 },
  { id: 35, name: 'Fitted Blazer', type: 'Jacket', category: 'women', price: 1199, image: img18 },
  { id: 36, name: 'Classic White T-Shirt', type: 'T-Shirt', category: 'women', price: 499, image: img19 },
  { id: 37, name: 'Satin Midi Dress', type: 'Dress', category: 'women', price: 1099, image: img20 },
  { id: 38, name: 'Cropped Sweater', type: 'Sweater', category: 'women', price: 1299, image: img21 },
  { id: 39, name: 'High-Slit Gown', type: 'Gown', category: 'women', price: 999, image: img22 },
  { id: 40, name: 'Puff-Sleeve Top', type: 'Top', category: 'women', price: 1399, image: img23 },
  { id: 41, name: 'Denim Skirt', type: 'Skirt', category: 'women', price: 1159, image: img24 },
  { id: 42, name: 'Party-Ready Dress', type: 'Dress', category: 'women', price: 899, image: img25 },
  { id: 43, name: 'Turtleneck Sweater', type: 'Sweater', category: 'women', price: 1049, image: img26 },
  { id: 44, name: 'Business Casual Shirt', type: 'Shirt', category: 'women', price: 1299, image: img27 },
  { id: 45, name: 'Vintage Wash Jeans', type: 'Jeans', category: 'women', price: 999, image: img28 },
  { id: 46, name: 'Leather Biker Jacket', type: 'Jacket', category: 'women', price: 1199, image: img29 },
  { id: 47, name: 'Little Black Dress', type: 'Dress', category: 'women', price: 1099, image: img30 },
  { id: 48, name: 'Graphic Print T-Shirt', type: 'T-Shirt', category: 'women', price: 599, image: img31 },
  { id: 49, name: 'Flowy Summer Top', type: 'Top', category: 'women', price: 1099, image: img1 },
  { id: 50, name: 'Casual Office Shirt', type: 'Shirt', category: 'women', price: 1049, image: img5 },
  { id: 51, name: 'Brunch Date Dress', type: 'Dress', category: 'women', price: 1099, image: img13 },
  { id: 52, name: 'Simple & Sweet Top', type: 'Top', category: 'women', price: 999, image: img17 },
  { id: 53, name: 'Autumnal Jacket', type: 'Jacket', category: 'women', price: 1199, image: img18 },
  { id: 54, name: 'Garden Party Gown', type: 'Gown', category: 'women', price: 1399, image: img23 },
];