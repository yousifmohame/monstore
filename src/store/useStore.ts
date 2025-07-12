/** @format */

import { create } from "zustand";
import { auth, db } from "../lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  colorId?: string | null;
  colorName?: string | null;
  sizeId?: string | null;
  sizeName?: string | null;
  variantId?: string | null;
  productId: string;
}

interface StoreState {
  getCurrentUserId(): unknown;
  updateProductStock(id: string, arg1: number): unknown;
  // Cart
  cart: CartItem[];
  addToCart: (
    item: Omit<CartItem, "productId"> & { id: string }
  ) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;

  // Wishlist
  wishlist: string[];
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<void>;

  // UI
  isCartOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Category Filter
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  // Initialize store with user data
  initializeUserData: (userId: string) => Promise<void>;
}

export const useStore = create<StoreState>()((set, get) => ({
  // Cart
  cart: [],
  addToCart: async (item) => {
    try {
      set({ isLoading: true });
      const userId = get().getCurrentUserId() as string;
      if (!userId) {
        console.error("User not authenticated");
        set({ isLoading: false });
        return;
      }

      // Add productId to the item
      const cartItem = { ...item, productId: item.id };

      // Check if item already exists in cart
      const existingItemIndex = get().cart.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItemIndex !== -1) {
        // Update existing item
        const updatedCart = [...get().cart];
        updatedCart[existingItemIndex].quantity += item.quantity;

        // Update in Firestore
        const cartItemRef = doc(db, "users", userId, "cart", item.id);
        await updateDoc(cartItemRef, {
          quantity: updatedCart[existingItemIndex].quantity,
          updatedAt: serverTimestamp(),
        });

        set({ cart: updatedCart });
      } else {
        // Add new item
        const cartItemRef = doc(db, "users", userId, "cart", item.id);
        await setDoc(cartItemRef, {
          ...cartItem,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        set({ cart: [...get().cart, cartItem] });
      }

      // Update product stock
      await get().updateProductStock(item.id, -item.quantity);

      set({ isLoading: false });
    } catch (error) {
      console.error("Error adding to cart:", error);
      set({ isLoading: false });
    }
  },
  removeFromCart: async (itemId) => {
    try {
      set({ isLoading: true });
      const userId = get().getCurrentUserId() as string;
      if (!userId) {
        console.error("User not authenticated");
        set({ isLoading: false });
        return;
      }

      // Get the item to restore stock
      const item = get().cart.find((item) => item.id === itemId);
      if (item) {
        // Delete from Firestore
        const cartItemRef = doc(db, "users", userId, "cart", itemId);
        await deleteDoc(cartItemRef);

        // Restore product stock
        await get().updateProductStock(item.productId, item.quantity);
      }

      set({ cart: get().cart.filter((item) => item.id !== itemId) });
      set({ isLoading: false });
    } catch (error) {
      console.error("Error removing from cart:", error);
      set({ isLoading: false });
    }
  },
  updateQuantity: async (itemId, quantity) => {
    try {
      set({ isLoading: true });
      const userId = get().getCurrentUserId() as string;
      if (!userId) {
        console.error("User not authenticated");
        set({ isLoading: false });
        return;
      }

      if (quantity <= 0) {
        await get().removeFromCart(itemId);
        set({ isLoading: false });
        return;
      }

      // Get the current item
      const currentItem = get().cart.find((item) => item.id === itemId);
      if (!currentItem) {
        set({ isLoading: false });
        return;
      }

      // Calculate quantity difference
      const quantityDiff = quantity - currentItem.quantity;

      // Update in Firestore
      const cartItemRef = doc(db, "users", userId, "cart", itemId);
      await updateDoc(cartItemRef, {
        quantity: quantity,
        updatedAt: serverTimestamp(),
      });

      // Update product stock
      await get().updateProductStock(currentItem.productId, -quantityDiff);

      set({
        cart: get().cart.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        ),
      });

      set({ isLoading: false });
    } catch (error) {
      console.error("Error updating quantity:", error);
      set({ isLoading: false });
    }
  },
  clearCart: async () => {
    try {
      set({ isLoading: true });
      const userId = get().getCurrentUserId() as string;
      if (!userId) {
        console.error("User not authenticated");
        set({ isLoading: false });
        return;
      }

      // Restore all product stocks
      const batch = writeBatch(db);
      for (const item of get().cart) {
        // Restore product stock
        const productRef = doc(db, "products", item.productId);
        batch.update(productRef, {
          stock: increment(item.quantity),
        });

        // Delete cart item
        const cartItemRef = doc(db, "users", userId, "cart", item.id);
        batch.delete(cartItemRef);
      }

      await batch.commit();
      set({ cart: [] });
      set({ isLoading: false });
    } catch (error) {
      console.error("Error clearing cart:", error);
      set({ isLoading: false });
    }
  },
  getTotalItems: () => {
    return get().cart.reduce((sum, item) => sum + item.quantity, 0);
  },
  getTotalPrice: () => {
    return get().cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  },

  // Wishlist
  wishlist: [],
  addToWishlist: async (productId) => {
    try {
      set({ isLoading: true });
      const userId = get().getCurrentUserId() as string;
      if (!userId) {
        console.error("User not authenticated");
        set({ isLoading: false });
        return;
      }

      if (!get().wishlist.includes(productId)) {
        // Add to Firestore
        const wishlistRef = doc(db, "users", userId, "wishlist", productId);
        await setDoc(wishlistRef, {
          productId,
          createdAt: serverTimestamp(),
        });

        set({ wishlist: [...get().wishlist, productId] });
      }

      set({ isLoading: false });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      set({ isLoading: false });
    }
  },
  removeFromWishlist: async (productId) => {
    try {
      set({ isLoading: true });
      const userId = get().getCurrentUserId() as string;
      if (!userId) {
        console.error("User not authenticated");
        set({ isLoading: false });
        return;
      }

      // Remove from Firestore
      const wishlistRef = doc(db, "users", userId, "wishlist", productId);
      await deleteDoc(wishlistRef);

      set({ wishlist: get().wishlist.filter((id) => id !== productId) });
      set({ isLoading: false });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      set({ isLoading: false });
    }
  },
  isInWishlist: (productId) => {
    return get().wishlist.includes(productId);
  },
  clearWishlist: async () => {
    try {
      set({ isLoading: true });
      const userId = get().getCurrentUserId() as string;
      if (!userId) {
        console.error("User not authenticated");
        set({ isLoading: false });
        return;
      }

      // Delete all wishlist items
      const batch = writeBatch(db);
      for (const productId of get().wishlist) {
        const wishlistRef = doc(db, "users", userId, "wishlist", productId);
        batch.delete(wishlistRef);
      }

      await batch.commit();
      set({ wishlist: [] });
      set({ isLoading: false });
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      set({ isLoading: false });
    }
  },

  // UI
  isCartOpen: false,
  setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

  // Search
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Category Filter
  selectedCategory: "",
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  // Loading state
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  // Helper functions
  getCurrentUserId: () => {
    // Get current user ID from Firebase Auth
    const currentUser = auth.currentUser;
    return currentUser?.uid;
  },

  updateProductStock: async (productId: string, quantityChange: number) => {
    try {
      // Update product stock in Firestore
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, {
        stock: increment(-quantityChange), // Negative because we're decreasing stock
      });
    } catch (error) {
      console.error("Error updating product stock:", error);
    }
  },

  // Initialize user data
  initializeUserData: async (userId: string) => {
    try {
      set({ isLoading: true });

      // Fetch cart items
      const cartQuery = collection(db, "users", userId, "cart");
      const cartSnapshot = await getDocs(cartQuery);
      const cartItems: CartItem[] = [];

      cartSnapshot.forEach((doc) => {
        cartItems.push({ id: doc.id, ...doc.data() } as CartItem);
      });

      // Fetch wishlist items
      const wishlistQuery = collection(db, "users", userId, "wishlist");
      const wishlistSnapshot = await getDocs(wishlistQuery);
      const wishlistItems: string[] = [];

      wishlistSnapshot.forEach((doc) => {
        wishlistItems.push(doc.id);
      });

      set({
        cart: cartItems,
        wishlist: wishlistItems,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error initializing user data:", error);
      set({ isLoading: false });
    }
  },
}));
