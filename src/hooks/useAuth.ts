/** @format */

import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  getAuth,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string | null;
  fullName: string | null;
  isAdmin: boolean;
}

interface Profile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  avatarUrl?: string;
  profileImage?: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const userProfile = await fetchUserProfile(firebaseUser);
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          fullName: firebaseUser.displayName,
          isAdmin: userProfile?.isAdmin || false,
        });
        setProfile(userProfile);
      } else {
        // User is signed out
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (
    firebaseUser: FirebaseUser
  ): Promise<Profile | null> => {
    try {
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          id: userDoc.id,
          email: data.email,
          fullName: data.fullName,
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          postalCode: data.postalCode || "",
          profileImage: data.profileImage || "",
          isAdmin: data.isAdmin || false,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      const userProfile = await fetchUserProfile(firebaseUser);

      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email,
        fullName: firebaseUser.displayName,
        isAdmin: userProfile?.isAdmin || false,
      });

      setProfile(userProfile);

      return { user: firebaseUser };
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(
        error.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة"
      );
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    phone: string = "",
    address: string = "",
    city: string = "",
    postalCode: string = ""
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, {
        displayName: fullName,
      });

      const userDocRef = doc(db, "users", firebaseUser.uid);
      const timestamp = serverTimestamp();

      const userData = {
        email,
        fullName,
        phone,
        address,
        city,
        postalCode,
        isAdmin: false,
        profileImage: "",
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await setDoc(userDocRef, userData);

      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email,
        fullName: firebaseUser.displayName,
        isAdmin: false,
      });

      setProfile({
        id: firebaseUser.uid,
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Profile);

      return { user: firebaseUser };
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(error.message || "حدث خطأ أثناء إنشاء الحساب");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const changeUserPassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    const user = auth.currentUser;

    if (!user || !user.email) {
      throw new Error("User not logged in");
    }

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  };

  const getIdToken = async (forceRefresh = false) => {
    if (!auth.currentUser) {
      throw new Error("User not authenticated");
    }
    return await auth.currentUser.getIdToken(forceRefresh);
  };

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isAdmin: profile?.isAdmin ?? false,
    login,
    register,
    logout,
    changeUserPassword,
    getIdToken, // Add this to the returned object
  };
};