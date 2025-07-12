/** @format */

import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  updateDoc,
  increment,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";

// ... (واجهات Product, ProductFilter, ProductVariant, ProductImage تبقى كما هي) ...
export interface ProductImage {
  imageUrl: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  colorId: string | null;
  sizeId: string | null;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  nameAr: string;
  name: string;
  descriptionAr: string;
  description: string;
  detailedDescriptionAr?: string;
  detailedDescription?: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  sku: string;
  stock: number;
  categoryId: string;
  rating: number;
  reviewsCount: number;
  tags?: string[];
  tagsAr?: string[];
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  onSale: boolean;
  isActive: boolean;
  hasVariants: boolean;
  colors?: string[];
  sizes?: string[];
  variants?: ProductVariant[];
  images: ProductImage[];
  category?: any;
  weight?: number;
  createdAt: any;
  updatedAt: any;
}

export interface ProductFilter {
  category?: string;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  onSale?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}


export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  // ... (دوال fetchProducts و fetchProductBySlug و updateProductStock تبقى كما هي) ...
  const fetchProducts = async (
    filters?: ProductFilter,
    itemsPerPage: number = 20
  ) => {
    try {
      setLoading(true);
      setError(null);

      let productsQuery = collection(db, "products");
      let constraints: any[] = [];

      // Apply filters
      if (filters) {
        if (filters.category) {
          constraints.push(where("categoryId", "==", filters.category));
        }

        if (filters.featured) {
          constraints.push(where("featured", "==", true));
        }

        if (filters.newArrival) {
          constraints.push(where("newArrival", "==", true));
        }

        if (filters.bestSeller) {
          constraints.push(where("bestSeller", "==", true));
        }

        if (filters.onSale) {
          constraints.push(where("onSale", "==", true));
        }

        if (filters.inStock) {
          constraints.push(where("stock", ">", 0));
        }

        // Note: For search, minPrice, and maxPrice, we need to filter in memory
        // as Firestore doesn't support full-text search or multiple range queries
      }

      // Add ordering and pagination
      constraints.push(orderBy("createdAt", "desc"));
      constraints.push(limit(itemsPerPage));

      // Add startAfter if we have a last visible document
      if (lastVisible) {
        constraints.push(startAfter(lastVisible));
      }

      const q = query(productsQuery, ...constraints);
      const querySnapshot = await getDocs(q);

      // Check if we have more products
      setHasMore(querySnapshot.docs.length === itemsPerPage);

      // Set the last visible document for pagination
      if (querySnapshot.docs.length > 0) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      } else {
        setLastVisible(null);
      }

      const fetchedProducts: Product[] = [];

      // Process each product document
      for (const document of querySnapshot.docs) {
        const productData = document.data() as Product;

        // Fetch category data
        if (productData.categoryId) {
          const categoryDoc = await getDoc(
            doc(db, "categories", productData.categoryId)
          );
          if (categoryDoc.exists()) {
            productData.category = {
              ...categoryDoc.data(),
              id: categoryDoc.id,
            };
          }
        }

        // Apply in-memory filters
        let includeProduct = true;

        if (filters?.search) {
          const searchTerms = filters.search.toLowerCase();
          const searchableFields = [
            productData.nameAr?.toLowerCase(),
            productData.name?.toLowerCase(),
            productData.descriptionAr?.toLowerCase(),
            productData.description?.toLowerCase(),
            ...(productData.tags || []).map((tag) => tag.toLowerCase()),
            ...(productData.tagsAr || []).map((tag) => tag.toLowerCase()),
          ];

          includeProduct = searchableFields.some(
            (field) => field && field.includes(searchTerms)
          );
        }

        if (filters?.minPrice !== undefined) {
          const price = productData.salePrice || productData.price;
          includeProduct = includeProduct && price >= filters.minPrice;
        }

        if (filters?.maxPrice !== undefined) {
          const price = productData.salePrice || productData.price;
          includeProduct = includeProduct && price <= filters.maxPrice;
        }

        if (includeProduct) {
          fetchedProducts.push({
            ...productData,
            id: document.id,
          });
        }
      }

      if (lastVisible) {
        // Append to existing products for pagination
        setProducts((prev) => [...prev, ...fetchedProducts]);
      } else {
        // Replace products for new search/filter
        setProducts(fetchedProducts);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductBySlug = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);

      const productsRef = collection(db, "products");
      const q = query(productsRef, where("slug", "==", slug), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Product not found");
        return null;
      }

      const productDoc = querySnapshot.docs[0];
      const productData = productDoc.data() as Product;

      // Fetch category data
      if (productData.categoryId) {
        const categoryDoc = await getDoc(
          doc(db, "categories", productData.categoryId)
        );
        if (categoryDoc.exists()) {
          productData.category = { id: categoryDoc.id, ...categoryDoc.data() };
        }
      }

      return {
        ...productData,
        id: productDoc.id,
      };
    } catch (error: any) {
      console.error("Error fetching product by slug:", error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProductStock = async (
    productId: string,
    quantityChange: number
  ) => {
    try {
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, {
        stock: increment(quantityChange),
      });

      // Update local state
      setProducts(
        products.map((product) =>
          product.id === productId
            ? { ...product, stock: product.stock + quantityChange }
            : product
        )
      );

      return true;
    } catch (error) {
      console.error("Error updating product stock:", error);
      return false;
    }
  };


  const addProduct = async (
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">,
    imageFiles: File[]
  ) => {
    try {
      setLoading(true);

      const productsRef = collection(db, "products");
      const newProductRef = doc(productsRef);
      const productId = newProductRef.id;

      // Upload images to Firebase Storage
      const images: ProductImage[] = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const imageRef = ref(storage, `products/${productId}/${file.name}`);
        
        await uploadBytes(imageRef, file);
        const imageUrl = await getDownloadURL(imageRef);

        images.push({
          imageUrl,
          altText: productData.nameAr,
          sortOrder: i,
          isPrimary: i === 0,
        });
      }

      const timestamp = serverTimestamp();
      await setDoc(newProductRef, {
        ...productData,
        images, // Use the array of uploaded image URLs
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      setLoading(false);
      return productId;
    } catch (error: any) {
      console.error("Error adding product:", error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const updateProduct = async (
    productId: string,
    productData: Partial<Product>,
    newImageFiles?: File[],
    imagesToDelete?: string[]
  ) => {
    try {
      setLoading(true);

      const productRef = doc(db, "products", productId);
      const productDoc = await getDoc(productRef);

      if (!productDoc.exists()) {
        throw new Error("Product not found");
      }

      const currentProduct = productDoc.data() as Product;
      let updatedImages = [...(currentProduct.images || [])];

      // Delete images from Storage if specified
      if (imagesToDelete && imagesToDelete.length > 0) {
        for (const imageUrl of imagesToDelete) {
          try {
            const imagePath = decodeURIComponent(imageUrl.split("/o/")[1].split("?")[0]);
            const imageRef = ref(storage, imagePath);
            await deleteObject(imageRef);
          } catch (error) {
            console.error("Error deleting image:", error);
          }
        }
        updatedImages = updatedImages.filter(img => !imagesToDelete.includes(img.imageUrl));
      }

      // Upload new images to Storage
      if (newImageFiles && newImageFiles.length > 0) {
        for (let i = 0; i < newImageFiles.length; i++) {
          const file = newImageFiles[i];
          const imageRef = ref(storage, `products/${productId}/${file.name}`);
          
          await uploadBytes(imageRef, file);
          const imageUrl = await getDownloadURL(imageRef);

          updatedImages.push({
            imageUrl,
            altText: productData.nameAr || currentProduct.nameAr,
            sortOrder: updatedImages.length,
            isPrimary: updatedImages.length === 0,
          });
        }
      }

      await updateDoc(productRef, {
        ...productData,
        images: updatedImages,
        updatedAt: serverTimestamp(),
      });

      setProducts(
        products.map((product) =>
          product.id === productId
            ? { ...product, ...productData, images: updatedImages }
            : product
        )
      );

      setLoading(false);
      return true;
    } catch (error: any) {
      console.error("Error updating product:", error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };
  
  // ... (دالة deleteProduct تبقى كما هي) ...
  const deleteProduct = async (productId: string) => {
    try {
      setLoading(true);

      const productRef = doc(db, "products", productId);
      const productDoc = await getDoc(productRef);

      if (!productDoc.exists()) {
        throw new Error("Product not found");
      }

      const productData = productDoc.data() as Product;

      // Delete images from storage
      if (productData.images && productData.images.length > 0) {
        for (const image of productData.images) {
          try {
            // Extract the path from the URL
            const imagePath = decodeURIComponent(
              image.imageUrl.split("/o/")[1].split("?")[0]
            );
            const imageRef = ref(storage, imagePath);
            await deleteObject(imageRef);
          } catch (error) {
            console.error("Error deleting image:", error);
          }
        }
      }

      // Delete product document
      await deleteDoc(productRef);

      // Update local state
      setProducts(products.filter((product) => product.id !== productId));

      setLoading(false);
      return true;
    } catch (error: any) {
      console.error("Error deleting product:", error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const resetPagination = () => {
    setLastVisible(null);
    setHasMore(true);
  };

  return {
    products,
    loading,
    error,
    hasMore,
    fetchProducts,
    fetchProductBySlug,
    updateProductStock,
    addProduct,
    updateProduct,
    deleteProduct,
    resetPagination,
  };
};
