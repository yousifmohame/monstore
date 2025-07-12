'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X, Heart, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';
import SearchBar from './SearchBar';
import AdminNotifications from './AdminNotifications';
import Image from 'next/image';
import logo from "../../public/LOGO-KYOTAKO.png";

const Header = () => {
  const { cart, wishlist, isCartOpen, setCartOpen } = useStore();
  const { user, profile, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navigationItems = [
    { href: '/', label: 'الرئيسية' },
    { href: '/products', label: 'المنتجات' },
    { href: '/categories', label: 'الفئات' },
    { href: '/deals', label: 'العروض' },
    { href: '/about', label: 'من نحن' },
    { href: '/contact', label: 'اتصل بنا' },
  ];

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-effect shadow-lg border-b border-anime-pink/20">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 space-x-reverse">
            <motion.div
              className="text-3xl font-bold anime-gradient bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              <div style={{ padding: "10px" }}>
                <Image src={logo} alt='Logo' width={100} height={100} />
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 space-x-reverse">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar className="w-full" />
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Admin Notifications */}
            {user && profile?.isAdmin && (
              <AdminNotifications />
            )}

            {/* Wishlist */}
            {user && (
              <Link href="/wishlist">
                <motion.button
                  className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className="h-6 w-6" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </motion.button>
              </Link>
            )}

            {/* Cart */}
            {user && (
              <motion.button
                onClick={() => setCartOpen(!isCartOpen)}
                className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.button>
            )}

            {/* User Menu */}
            <div className="relative">
              <motion.button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <User className="h-6 w-6" />
              </motion.button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="font-semibold text-gray-800">{profile?.fullName}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>الملف الشخصي</Link>
                        <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>طلباتي</Link>
                        <Link href="/wishlist" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>قائمة الأمنيات</Link>
                        {profile?.isAdmin && (
                          <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>لوحة الإدارة</Link>
                        )}
                        <hr className="my-2 border-gray-200" />
                        <button onClick={handleLogout} className="block w-full text-right px-4 py-2 text-red-600 hover:bg-red-50">تسجيل الخروج</button>
                      </>
                    ) : (
                      <>
                        <Link href="/auth/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>تسجيل الدخول</Link>
                        <Link href="/auth/register" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>إنشاء حساب جديد</Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-primary-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden pb-4 overflow-hidden"
          >
            <div className="mb-4 md:hidden"><SearchBar className="w-full" /></div>
            <nav>
              <ul className="space-y-2">
                {navigationItems.map((item, index) => (
                  <motion.li key={item.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                    <Link href={item.href} className="block py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 px-4 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
