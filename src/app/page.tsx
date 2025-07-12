import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import Categories from '@/components/Categories';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import Chat from '@/components/Chat';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Newsletter />
      <Footer />
      <Cart />
      <Chat />
    </main>
  )
}