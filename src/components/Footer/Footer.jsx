import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-6 py-12">
        {/* Top section with links and newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">hyperMart</h3>
            <p className="text-sm">Your one-stop destination for the latest trends in fashion for the whole family.</p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/men" className="hover:text-blue-600">Men</Link></li>
              <li><Link to="/women" className="hover:text-blue-600">Women</Link></li>
              <li><Link to="/kids" className="hover:text-blue-600">Kids</Link></li>
              <li><Link to="/new-arrivals" className="hover:text-blue-600">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-semibold mb-4">Help</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="hover:text-blue-600">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-blue-600">FAQs</Link></li>
              <li><Link to="/track-order" className="hover:text-blue-600">Track Order</Link></li>
              <li><Link to="/returns" className="hover:text-blue-600">Shipping & Returns</Link></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="font-semibold mb-4">Stay Up to Date</h4>
            <p className="text-sm mb-3">Get notified about new arrivals and exclusive offers.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full px-4 py-2 rounded-l-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700">
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom section with social media and copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} hyperMart. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-600"><Facebook size={20} /></a>
            <a href="#" className="hover:text-blue-600"><Twitter size={20} /></a>
            <a href="#" className="hover:text-blue-600"><Instagram size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;