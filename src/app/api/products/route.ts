/** @format */
export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const category = searchParams.get("category");
    const featured = searchParams.get("featured") === "true";
    const newArrival = searchParams.get("newArrival") === "true";
    const bestSeller = searchParams.get("bestSeller") === "true";
    const onSale = searchParams.get("onSale") === "true";
    const search = searchParams.get("search");
    const limitParam = searchParams.get("limit");
    const lastDocId = searchParams.get("lastDocId");

    // Build query
    let productsQuery = collection(db, "products");
    let constraints: any[] = [];

    // Apply filters
    if (category) {
      // First, try to find category by slug
      const categoriesRef = collection(db, "categories");
      const categoryQuery = query(categoriesRef, where("slug", "==", category));
      const categorySnapshot = await getDocs(categoryQuery);

      if (!categorySnapshot.empty) {
        const categoryId = categorySnapshot.docs[0].id;
        constraints.push(where("categoryId", "==", categoryId));
      } else {
        // If not found by slug, try by ID
        constraints.push(where("categoryId", "==", category));
      }
    }

    if (featured) {
      constraints.push(where("featured", "==", true));
    }

    if (newArrival) {
      constraints.push(where("newArrival", "==", true));
    }

    if (bestSeller) {
      constraints.push(where("bestSeller", "==", true));
    }

    if (onSale) {
      constraints.push(where("onSale", "==", true));
    }

    // Add ordering
    constraints.push(orderBy("createdAt", "desc"));

    // Add pagination
    const limitValue = limitParam ? parseInt(limitParam) : 20;
    constraints.push(limit(limitValue));

    // Add startAfter if lastDocId is provided
    if (lastDocId) {
      const lastDocRef = doc(db, "products", lastDocId);
      const lastDocSnap = await getDoc(lastDocRef);

      if (lastDocSnap.exists()) {
        constraints.push(startAfter(lastDocSnap));
      }
    }

    // Execute query
    const q = query(productsQuery, ...constraints);
    const querySnapshot = await getDocs(q);

    // Process results
    const products: any[] = [];

    for (const document of querySnapshot.docs) {
      const productData = document.data();

      // Fetch category data
      let category = null;
      if (productData.categoryId) {
        const categoryDoc = await getDoc(
          doc(db, "categories", productData.categoryId)
        );
        if (categoryDoc.exists()) {
          category = { id: categoryDoc.id, ...categoryDoc.data() };
        }
      }

      // Apply search filter in memory if needed
      if (search) {
        const searchLower = search.toLowerCase();
        const nameMatch =
          productData.nameAr?.toLowerCase().includes(searchLower) ||
          productData.name?.toLowerCase().includes(searchLower);
        const descMatch =
          productData.descriptionAr?.toLowerCase().includes(searchLower) ||
          productData.description?.toLowerCase().includes(searchLower);
        const tagsMatch =
          productData.tags?.some((tag: string) =>
            tag.toLowerCase().includes(searchLower)
          ) ||
          productData.tagsAr?.some((tag: string) =>
            tag.toLowerCase().includes(searchLower)
          );

        if (!nameMatch && !descMatch && !tagsMatch) {
          continue; // Skip this product if it doesn't match the search
        }
      }

      products.push({
        id: document.id,
        ...productData,
        category,
      });
    }

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Products API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
