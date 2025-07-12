/** @format */

import { useState, useCallback } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  productsCount?: number;
  _count?: {
    products: number;
  };
  createdAt?: FirebaseFirestore.Timestamp | Date;
  updatedAt?: FirebaseFirestore.Timestamp | Date;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          _count: {
            products: data.productsCount || 0, 
          },
          createdAt: data.createdAt?.toDate(), // Convert Firestore Timestamp to Date
          updatedAt: data.updatedAt?.toDate(),
        };
      });

      setCategories(fetchedCategories);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      setError(error.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

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
      const categoryData = categoryDoc.data();
      
      return {
        ...categoryData,
        id: categoryDoc.id,
        _count: {
          products: categoryData.productsCount || 0,
        },
        createdAt: categoryData.createdAt?.toDate(),
        updatedAt: categoryData.updatedAt?.toDate(),
      } as Category;
    } catch (error: any) {
      console.error("Error fetching category by slug:", error);
      setError(error.message || "An unknown error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    fetchCategoryBySlug,
  };
};
