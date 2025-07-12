/** @format */
export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    // Query products by slug
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("slug", "==", slug), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    const productDoc = querySnapshot.docs[0];
    const productData = productDoc.data();

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

    return NextResponse.json({
      id: productDoc.id,
      ...productData,
      category,
    });
  } catch (error: any) {
    console.error("Product API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
