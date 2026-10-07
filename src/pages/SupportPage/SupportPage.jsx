import React from 'react';
import { Link } from 'react-router-dom';

const SUPPORT_ITEMS = {
  about: {
    title: 'About HyperMart',
    eyebrow: 'Our story',
    description: 'HyperMart brings together fashion, everyday essentials, and family-friendly style in one easy shopping experience.',
    bullets: [
      'Curated collections across men, women, and kids.',
      'Quality-focused product listings with clear size and stock choices.',
      'A customer-first experience across browsing, cart, and order tracking.'
    ],
  },
  help: {
    title: 'Help Center',
    eyebrow: 'Support',
    description: 'Need assistance with an order, product question, or account issue? Our support team is here to help.',
    bullets: [
      'Order and delivery support for current purchases.',
      'Helpful information for sizing, returns, and delivery updates.',
      'Account assistance for sign-in, profile, and checkout questions.'
    ],
  },
  contact: {
    title: 'Contact Us',
    eyebrow: 'Get in touch',
    description: 'Reach out to HyperMart for product questions, order status, or general support.',
    bullets: [
      'Email: support@hypermart.example',
      'Phone: +91 98765 43210',
      'Hours: Monday to Saturday, 9:00 AM to 7:00 PM IST.'
    ],
  },
  faq: {
    title: 'Frequently Asked Questions',
    eyebrow: 'FAQs',
    description: 'Answers to the most common shopping and account questions.',
    bullets: [
      'Orders are created once checkout is completed and validated by the backend.',
      'Sizes and stock information appear on each product detail page before purchase.',
      'You can manage your wishlist, profile details, and order history from your account.'
    ],
  },
  'track-order': {
    title: 'Track Your Order',
    eyebrow: 'Delivery updates',
    description: 'Stay updated on order status, shipping milestones, and estimated delivery progress.',
    bullets: [
      'Orders move from Pending to Processing to Shipped as they are fulfilled.',
      'Use your profile page to review recent order activity and summary details.',
      'For shipping questions, contact support with your order number.'
    ],
  },
  returns: {
    title: 'Shipping & Returns',
    eyebrow: 'Policies',
    description: 'We aim to make online shopping easy with transparent shipping and return coverage.',
    bullets: [
      'Free shipping applies on eligible orders above the configured threshold.',
      'Returns are reviewed according to the order status and product condition.',
      'Reach out to support if your return eligibility or delivery status needs review.'
    ],
  },
  'new-arrivals': {
    title: 'New Arrivals',
    eyebrow: 'Fresh picks',
    description: 'Explore the newest styles added to our collection for the season.',
    bullets: [
      'Browse curated drops across men, women, and kids.',
      'Check product detail pages for availability, size, and color choices.',
      'Shop quickly and save favorites to your wishlist for future visits.'
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    eyebrow: 'Your data',
    description: 'HyperMart respects customer privacy and keeps account and order information secure.',
    bullets: [
      'Account details are used only to manage authentication and order processing.',
      'Checkout and review data remain subject to backend validation and access controls.',
      'We keep product and personal information protected in line with standard ecommerce practices.'
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    eyebrow: 'Store policy',
    description: 'By shopping with HyperMart, you agree to the terms and policies covering browsing, checkout, and account use.',
    bullets: [
      'Product details, stock levels, and pricing are subject to validation at the time of purchase.',
      'Users are responsible for account security and safeguarding login credentials.',
      'We may update policies over time to maintain a safe and functional shopping experience.'
    ],
  },
  shipping: {
    title: 'Shipping Information',
    eyebrow: 'Delivery',
    description: 'Delivery times and shipping details are provided to help customers plan their purchases.',
    bullets: [
      'All shipping options and timing should be confirmed at checkout.',
      'Order status updates appear in the profile and order workflow.',
      'Customers can contact support for delivery exceptions or missing shipments.'
    ],
  },
  refunds: {
    title: 'Refund Policy',
    eyebrow: 'Returns',
    description: 'Refund requests are handled according to the order status and the condition of the received goods.',
    bullets: [
      'Refund eligibility depends on product condition and return policy status.',
      'Orders in transit or already fulfilled may require manual review.',
      'Reach out to the support team for order-specific refund guidance.'
    ],
  },
};

const SupportPage = ({ pageKey = 'about' }) => {
  const support = SUPPORT_ITEMS[pageKey] || SUPPORT_ITEMS.about;

  return (
    <main className="container mx-auto px-4 py-12 text-slate-800 dark:text-slate-100">
      <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-[#262626] dark:bg-[#0D0D0D]">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
          {support.eyebrow}
        </p>
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{support.title}</h1>
        <p className="mb-6 text-base leading-7 text-slate-600 dark:text-[#A1A1AA]">{support.description}</p>

        <ul className="space-y-3 text-slate-700 dark:text-slate-200">
          {support.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700">
            Continue shopping
          </Link>
          <Link to="/help" className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-[#303030] dark:text-slate-200 dark:hover:bg-[#161616]">
            Help center
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SupportPage;
