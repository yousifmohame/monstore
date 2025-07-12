/** @format */
import { useState } from "react";
import { useAuth } from "./useAuth"; // Assuming this provides currentUser and auth methods
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
  setDoc,
  updateDoc,
  serverTimestamp,
  writeBatch,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useStore } from "@/store/useStore";

// Interfaces
export interface OrderItem {
  productId: string;
  productName: string;
  productNameAr: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variantId?: string;
  color?: string;
  size?: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PAID" | "PENDING" | "FAILED";
  paymentMethod: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  trackingUrl?: string;
  notes?: string;
  items: OrderItem[];
  shippedAt?: any;
  deliveredAt?: any;
  createdAt: any;
  updatedAt: any;
}

export const useOrders = () => {
  const { user } = useAuth();
  const { clearCart } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = async (
    itemsPerPage: number = 10,
    isAdmin: boolean = false
  ) => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      let ordersQuery;
      if (isAdmin) {
        // Admin can see all orders
        ordersQuery = collection(db, "orders");
      } else {
        // Regular users can only see their own orders
        ordersQuery = collection(db, "orders");
        ordersQuery = query(ordersQuery, where("userId", "==", user.id));
      }
      // Add ordering and pagination
      let constraints: any[] = [
        orderBy("createdAt", "desc"),
        limit(itemsPerPage),
      ];
      // Add startAfter if we have a last visible document
      if (lastVisible) {
        constraints.push(startAfter(lastVisible));
      }
      const q = query(ordersQuery, ...constraints);
      const querySnapshot = await getDocs(q);
      // Check if we have more orders
      setHasMore(querySnapshot.docs.length === itemsPerPage);
      // Set the last visible document for pagination
      if (querySnapshot.docs.length > 0) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      } else {
        setLastVisible(null);
      }
      const fetchedOrders: Order[] = [];
      querySnapshot.forEach((doc) => {
        fetchedOrders.push({
          id: doc.id,
          ...doc.data(),
        } as Order);
      });
      if (lastVisible) {
        // Append to existing orders for pagination
        setOrders((prev) => [...prev, ...fetchedOrders]);
      } else {
        // Replace orders for new search/filter
        setOrders(fetchedOrders);
      }
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderById = async (orderId: string) => {
    if (!user) return null;
    try {
      setLoading(true);
      setError(null);
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await getDoc(orderRef);
      if (!orderDoc.exists()) {
        setError("Order not found");
        return null;
      }
      const orderData = orderDoc.data() as Order;
      // Check if the user is allowed to view this order
      if (orderData.userId !== user.id && !user.isAdmin) {
        setError("You are not authorized to view this order");
        return null;
      }
      return {
        ...orderData,
        id: orderDoc.id,
      };
    } catch (error: any) {
      console.error("Error fetching order:", error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };


  // Inside useOrders hook
const fetchOrderByOrderNumber = async (orderNumber: string) => {
  try {
    if (!user) {
      console.error('Authentication required - No user found');
      throw new Error('Authentication required');
    }

    setLoading(true);
    setError(null);
    
    const cleanOrderNumber = orderNumber.trim().toUpperCase();
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("orderNumber", "==", cleanOrderNumber));
    
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error(`Order ${cleanOrderNumber} not found`);
    }

    const orderDoc = querySnapshot.docs[0];
    const orderData = orderDoc.data() as Order;

    // Verify order ownership
    if (orderData.userId !== user.id && !user.isAdmin) {
      throw new Error('Unauthorized access to order');
    }

    return {
      ...orderData,
      id: orderDoc.id
    };

  } catch (error: any) {
    console.error('Order fetch error:', error.message);
    setError(error.message);
    return null;
  } finally {
    setLoading(false);
  }
};

  const createOrder = async (
    orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">
  ) => {
    if (!user) return null;
    try {
      setLoading(true);
      setError(null);
      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;
      // Create a new order document with a generated ID
      const ordersRef = collection(db, "orders");
      const newOrderRef = doc(ordersRef);
      const orderId = newOrderRef.id;
      // Add timestamps and order number
      const timestamp = serverTimestamp();
      // Create the order document
      await setDoc(newOrderRef, {
        ...orderData,
        userId: user.id,
        orderNumber,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      // Clear the cart after successful order creation
      await clearCart();
      // Update local state
      const newOrder: Order = {
        id: orderId,
        orderNumber,
        ...orderData,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setOrders([newOrder, ...orders]);
      return orderId;
    } catch (error: any) {
      console.error("Error creating order:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    status: Order["status"],
    trackingInfo?: { trackingNumber: string; trackingUrl: string }
  ) => {
    if (!user || !user.isAdmin) return false;
    try {
      setLoading(true);
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await getDoc(orderRef);
      if (!orderDoc.exists()) {
        throw new Error("Order not found");
      }
      const updateData: any = {
        status,
        updatedAt: serverTimestamp(),
      };
      // Add tracking info if provided
      if (trackingInfo) {
        updateData.trackingNumber = trackingInfo.trackingNumber;
        updateData.trackingUrl = trackingInfo.trackingUrl;
      }
      // Add shipped/delivered dates based on status
      if (status === "SHIPPED") {
        updateData.shippedAt = serverTimestamp();
      } else if (status === "DELIVERED") {
        updateData.deliveredAt = serverTimestamp();
      }
      // Update order document
      await updateDoc(orderRef, updateData);
      // Update local state
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status,
                ...(trackingInfo && {
                  trackingNumber: trackingInfo.trackingNumber,
                  trackingUrl: trackingInfo.trackingUrl,
                }),
                ...(status === "SHIPPED" && { shippedAt: new Date() }),
                ...(status === "DELIVERED" && { deliveredAt: new Date() }),
                updatedAt: new Date(),
              }
            : order
        )
      );
      return true;
    } catch (error: any) {
      console.error("Error updating order status:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!user) return false;
    try {
      setLoading(true);
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await getDoc(orderRef);
      if (!orderDoc.exists()) {
        throw new Error("Order not found");
      }
      const orderData = orderDoc.data() as Order;
      // Check if the user is allowed to cancel this order
      if (orderData.userId !== user.id && !user.isAdmin) {
        throw new Error("You are not authorized to cancel this order");
      }
      // Check if the order can be cancelled
      if (orderData.status === "SHIPPED" || orderData.status === "DELIVERED") {
        throw new Error(
          "Cannot cancel an order that has been shipped or delivered"
        );
      }
      // Update order status
      await updateDoc(orderRef, {
        status: "CANCELLED",
        updatedAt: serverTimestamp(),
      });
      // Restore product stock
      const batch = writeBatch(db);
      for (const item of orderData.items) {
        const productRef = doc(db, "products", item.productId);
        // If the product has variants and a variantId is specified
        if (item.variantId) {
          const productDoc = await getDoc(productRef);
          if (productDoc.exists()) {
            const productData = productDoc.data();
            const variants = productData.variants || [];
            const updatedVariants = variants.map((variant: any) =>
              variant.id === item.variantId
                ? { ...variant, stock: variant.stock + item.quantity }
                : variant
            );
            batch.update(productRef, { variants: updatedVariants });
          }
        } else {
          // Regular product without variants
          batch.update(productRef, { stock: increment(item.quantity) });
        }
      }
      await batch.commit();
      // Update local state
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? { ...order, status: "CANCELLED", updatedAt: new Date() }
            : order
        )
      );
      return true;
    } catch (error: any) {
      console.error("Error cancelling order:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPagination = () => {
    setLastVisible(null);
    setHasMore(true);
  };

  return {
    orders,
    loading,
    error,
    hasMore,
    fetchOrders,
    fetchOrderById,
    createOrder,
    updateOrderStatus,
    fetchOrderByOrderNumber,
    cancelOrder,
    resetPagination,
  };
};