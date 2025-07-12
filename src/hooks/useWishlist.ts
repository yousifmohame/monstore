import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product?: any;
  createdAt: any;
}

export const useWishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const wishlistRef = collection(db, 'users', user.id, 'wishlist');
      const wishlistSnapshot = await getDocs(wishlistRef);
      
      const wishlistItems: WishlistItem[] = [];
      wishlistSnapshot.forEach((doc) => {
        wishlistItems.push({
          id: doc.id,
          userId: user.id,
          productId: doc.id,
          createdAt: doc.data().createdAt,
        });
      });
      
      setWishlist(wishlistItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const addToWishlist = async (productId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      const wishlistRef = doc(db, 'users', user.id, 'wishlist', productId);
      await setDoc(wishlistRef, {
        productId,
        createdAt: serverTimestamp()
      });
      
      // Add to local state
      setWishlist([...wishlist, {
        id: productId,
        userId: user.id,
        productId,
        createdAt: new Date()
      }]);
      
      setLoading(false);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      setLoading(false);
      throw error;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      const wishlistRef = doc(db, 'users', user.id, 'wishlist', productId);
      await deleteDoc(wishlistRef);
      
      // Remove from local state
      setWishlist(wishlist.filter(item => item.productId !== productId));
      
      setLoading(false);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      setLoading(false);
      throw error;
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.productId === productId);
  };

  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    refetch: fetchWishlist,
  };
};