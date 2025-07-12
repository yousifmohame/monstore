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
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";

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

  count?: {
    products: number;
  }; // 🔁 عدد المنتجات
  emoji?: string; // 🔁 رمز تعبيري للفئة
  color?: string; // 🔁 لون الخلفية
  subcategories?: string[]; // 🔁 فئات فرعية

  createdAt?: any;
  updatedAt?: any;
}


export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const categoriesRef = collection(db, "categories");
      const q = query(categoriesRef, orderBy("sortOrder", "asc"));
      const querySnapshot = await getDocs(q);

      const fetchedCategories: Category[] = [];

      for (const documnet of querySnapshot.docs) {
        const categoryData = documnet.data() as Category;

        // Count products for this category
        const productsRef = collection(db, "products");
        const productsQuery = query(
          productsRef,
          where("categoryId", "==", documnet.id)
        );
        const productsSnapshot = await getDocs(productsQuery);

        fetchedCategories.push({
          ...categoryData,
          id: documnet.id,
          count: {
            products: productsSnapshot.size,
          },
        });
      }

      setCategories(fetchedCategories);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryBySlug = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);

      const categoriesRef = collection(db, "categories");
      const q = query(categoriesRef, where("slug", "==", slug), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Category not found");
        return null;
      }

      const categoryDoc = querySnapshot.docs[0];
      const categoryData = categoryDoc.data() as Category;

      // Count products for this category
      const productsRef = collection(db, "products");
      const productsQuery = query(
        productsRef,
        where("categoryId", "==", categoryDoc.id)
      );
      const productsSnapshot = await getDocs(productsQuery);

      return {
        ...categoryData,
        id: categoryDoc.id,
        count: {
          products: productsSnapshot.size,
        },
      };
    } catch (error: any) {
      console.error("Error fetching category by slug:", error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (
    categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">,
    imageFile?: File
  ) => {
    try {
      setLoading(true);

      // Create a new category document with a generated ID
      const categoriesRef = collection(db, "categories");
      const newCategoryRef = doc(categoriesRef);
      const categoryId = newCategoryRef.id;

      let imageUrl = categoryData.imageUrl;

      // Upload image if provided
      if (imageFile) {
        const imageRef = ref(
          storage,
          `categories/${categoryId}/${imageFile.name}`
        );
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Add timestamps
      const timestamp = serverTimestamp();

      // Create the category document
      await setDoc(newCategoryRef, {
        ...categoryData,
        imageUrl,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      // Update local state
      const newCategory: Category = {
        id: categoryId,
        ...categoryData,
        imageUrl,
        count: { products: 0 },
      };

      setCategories([...categories, newCategory]);

      setLoading(false);
      return categoryId;
    } catch (error: any) {
      console.error("Error adding category:", error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const updateCategory = async (
    categoryId: string,
    categoryData: Partial<Category>,
    imageFile?: File
  ) => {
    try {
      setLoading(true);

      const categoryRef = doc(db, "categories", categoryId);
      const categoryDoc = await getDoc(categoryRef);

      if (!categoryDoc.exists()) {
        throw new Error("Category not found");
      }

      let imageUrl = categoryData.imageUrl;

      // Upload new image if provided
      if (imageFile) {
        const imageRef = ref(
          storage,
          `categories/${categoryId}/${imageFile.name}`
        );
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);

        // Delete old image if it's in our storage
        const currentCategory = categoryDoc.data() as Category;
        if (
          currentCategory.imageUrl &&
          currentCategory.imageUrl.includes("firebasestorage")
        ) {
          try {
            const oldImagePath = decodeURIComponent(
              currentCategory.imageUrl.split("/o/")[1].split("?")[0]
            );
            const oldImageRef = ref(storage, oldImagePath);
            await deleteObject(oldImageRef);
          } catch (error) {
            console.error("Error deleting old image:", error);
          }
        }
      }

      // Update category document
      await updateDoc(categoryRef, {
        ...categoryData,
        ...(imageUrl && { imageUrl }),
        updatedAt: serverTimestamp(),
      });

      // Update local state
      setCategories(
        categories.map((category) =>
          category.id === categoryId
            ? { ...category, ...categoryData, ...(imageUrl && { imageUrl }) }
            : category
        )
      );

      setLoading(false);
      return true;
    } catch (error: any) {
      console.error("Error updating category:", error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      setLoading(true);

      const categoryRef = doc(db, "categories", categoryId);
      const categoryDoc = await getDoc(categoryRef);

      if (!categoryDoc.exists()) {
        throw new Error("Category not found");
      }

      const categoryData = categoryDoc.data() as Category;

      // Delete image from storage if it's in our storage
      if (
        categoryData.imageUrl &&
        categoryData.imageUrl.includes("firebasestorage")
      ) {
        try {
          const imagePath = decodeURIComponent(
            categoryData.imageUrl.split("/o/")[1].split("?")[0]
          );
          const imageRef = ref(storage, imagePath);
          await deleteObject(imageRef);
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }

      // Delete category document
      await deleteDoc(categoryRef);

      // Update local state
      setCategories(
        categories.filter((category) => category.id !== categoryId)
      );

      setLoading(false);
      return true;
    } catch (error: any) {
      console.error("Error deleting category:", error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    fetchCategoryBySlug,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};
