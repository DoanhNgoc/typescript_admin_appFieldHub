import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import type { User, UserCredential } from "firebase/auth";

import { auth } from "../firebase/config";

interface UseAuthReturn {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<UserCredential>;
}
export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);
    const login = async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential;
        } catch (error: any) {
            console.error("🔥 Chi tiết lỗi đăng nhập:", error.code, error.message);
            throw error;
        }
    };

    return { user, loading, login };
}
