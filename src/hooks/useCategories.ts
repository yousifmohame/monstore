/** @format */

import { useState, useCallback } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// 1. واجهة موحدة للفئة
// This interface is the single source of truth for the Category type.
export interface Category {
  id: string;
  nameAr: string;
  name: string;
  slug: string;
  description: string;
  descriptionAr: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  productsCount?: number; // Optional field for pre-aggregated count
  _count?: { // Used for display purposes
    products: number;
  };
  createdAt?: any;
  updatedAt?: any;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. دالة محسّنة لجلب الفئات
  // This function is wrapped in useCallback to prevent infinite loops.
  const fetchCategories = useCallback(async (itemsLimit?: number) => {
    setLoading(true);
    setError(null);
    try {
      const categoriesRef = collection(db, "categories");
      const constraints = [orderBy("sortOrder", "asc")];
      if (itemsLimit) {
        constraints.push(limit(itemsLimit));
      }
      const q = query(categoriesRef, ...constraints);
      const querySnapshot = await getDocs(q);

      const fetchedCategories: Category[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          nameAr: data.nameAr,
          name: data.name,
          slug: data.slug,
          description: data.description,
          descriptionAr: data.descriptionAr,
          imageUrl: data.imageUrl,
          sortOrder: data.sortOrder,
          isActive: data.isActive,
          // Relies on a pre-aggregated field for performance.
          _count: {
            products: data.productsCount || 0, 
          },
        };
      });

      setCategories(fetchedCategories);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created only once.

  // 3. دالة جلب فئة واحدة بالـ Slug
  const fetchCategoryBySlug = useCallback(async (slug: string) => {
    setLoading(true);
    setError(null);
    try {
      const categoriesRef = collection(db, "categories");
      const q = query(categoriesRef, where("slug", "==", slug), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Category not found");
        return null;
      }
      const categoryDoc = querySnapshot.docs[0];
      const categoryData = categoryDoc.data() as Category;

      return {
        ...categoryData,
        id: categoryDoc.id,
        _count: {
            products: categoryData.productsCount || 0,
        },
      };
    } catch (error: any) {
      console.error("Error fetching category by slug:", error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Note: The admin functions (add, update, delete) are in useAdminCategories.ts
  // This hook is for client-side data fetching.

  return {
    categories,
    loading,
    error,
    fetchCategories,
    fetchCategoryBySlug,
  };
};
