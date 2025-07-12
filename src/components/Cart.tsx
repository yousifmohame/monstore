'use client'

import React, { useEffect } from 'react'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'
import Link from 'next/link'

const Cart = () => {
  const {
    cart,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    getTotalItems,
    isLoading
  } = useStore()
  const { user } = useAuth()

  // Don't show cart if user is not logged in
  if (!user) {
    return null
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={() => setCartOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          <motion.div 
            className="absolute left-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <ShoppingBag className="h-6 w-6" />
                  سلة التسوق ({getTotalItems()})
                </h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingBag className="h-20 w-20 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg mb-4">سلة التسوق فارغة</p>
                    <Link href="/products">
                      <button
                        onClick={() => setCartOpen(false)}
                        className="btn-primary"
                      >
                        ابدأ التسوق
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <motion.div 
                        key={item.id} 
                        className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 line-clamp-2 mb-1">
                            {item.name}
                          </h3>
                          
                          {/* Display color and size if available */}
                          {(item.colorName || item.sizeName) && (
                            <div className="text-sm text-gray-600 mb-1">
                              {item.colorName && (
                                <span className="ml-2">اللون: {item.colorName}</span>
                              )}
                              {item.sizeName && (
                                <span>الحجم: {item.sizeName}</span>
                              )}
                            </div>
                          )}
                          
                          <p className="text-primary-600 font-bold text-lg">
                            {item.price} ريال
                          </p>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-8 text-center font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="border-t border-gray-200 p-6 space-y-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>المجموع:</span>
                    <span className="text-primary-600">{getTotalPrice().toFixed(2)} ريال</span>
                  </div>
                  
                  <Link href="/checkout">
                    <button 
                      className="w-full btn-primary text-lg py-4 flex items-center justify-center"
                      onClick={() => setCartOpen(false)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="loading-spinner"></div>
                      ) : (
                        'إتمام الطلب'
                      )}
                    </button>
                  </Link>
                  
                  <button
                    onClick={() => setCartOpen(false)}
                    className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    متابعة التسوق
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Cart