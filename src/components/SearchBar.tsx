'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { mockProducts } from '@/lib/mockData';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export default function SearchBar({ className = '', placeholder = 'ابحث عن منتجات الأنمي...' }: SearchBarProps) {
  const { searchQuery, setSearchQuery } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Update local search query when global search query changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (localSearchQuery.trim()) {
      // Filter products based on search query
      const filtered = mockProducts.filter(product =>
        product.nameAr.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
        product.name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
        product.descriptionAr?.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
        product.category.nameAr.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(localSearchQuery.toLowerCase()))) ||
        (product.tagsAr && product.tagsAr.some(tag => tag.toLowerCase().includes(localSearchQuery.toLowerCase())))
      );
      setSearchResults(filtered.slice(0, 6)); // Limit to 6 results
    } else {
      setSearchResults([]);
    }
  }, [localSearchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to recent searches
      const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recent-searches', JSON.stringify(updated));
      
      setSearchQuery(query);
      setIsOpen(false);
      
      // Navigate to products page with search query
      router.push(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(localSearchQuery);
  };

  const clearSearch = () => {
    setLocalSearchQuery('');
    setSearchQuery('');
    setIsOpen(false);
  };

  const removeRecentSearch = (searchToRemove: string) => {
    const updated = recentSearches.filter(s => s !== searchToRemove);
    setRecentSearches(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
  };

  const popularSearches = ['ناروتو', 'ون بيس', 'أتاك أون تايتان', 'ديمون سلاير', 'دراغون بول'];

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full px-4 py-3 pr-12 pl-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-right"
        />
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        {localSearchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </form>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
          >
            {localSearchQuery.trim() ? (
              // Search Results
              <div className="p-4">
                {searchResults.length > 0 ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-500 mb-3">نتائج البحث</h3>
                    <div className="space-y-2">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          onClick={() => {
                            handleSearch(localSearchQuery);
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <Image
                            src={product.images[0]?.imageUrl || '/placeholder.jpg'}
                            alt={product.nameAr}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="flex-1 text-right">
                            <h4 className="font-medium text-gray-800 line-clamp-1">{product.nameAr}</h4>
                            <p className="text-sm text-gray-500">{product.category.nameAr}</p>
                          </div>
                          <div className="text-primary-600 font-bold">
                            {product.salePrice || product.price} ريال
                          </div>
                        </Link>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => {
                        handleSearch(localSearchQuery);
                        setIsOpen(false);
                      }}
                      className="block w-full mt-4 p-3 text-center text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                    >
                      عرض جميع النتائج ({searchResults.length}+)
                    </button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">لا توجد نتائج لـ "{localSearchQuery}"</p>
                  </div>
                )}
              </div>
            ) : (
              // Recent and Popular Searches
              <div className="p-4">
                {recentSearches.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      عمليات البحث الأخيرة
                    </h3>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <div key={index} className="flex items-center justify-between group">
                          <button
                            onClick={() => {
                              setLocalSearchQuery(search);
                              handleSearch(search);
                            }}
                            className="flex-1 text-right p-2 hover:bg-gray-50 rounded transition-colors"
                          >
                            {search}
                          </button>
                          <button
                            onClick={() => removeRecentSearch(search)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    عمليات البحث الشائعة
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setLocalSearchQuery(search);
                          handleSearch(search);
                        }}
                        className="px-3 py-2 bg-gray-100 hover:bg-primary-100 hover:text-primary-600 rounded-full text-sm transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}