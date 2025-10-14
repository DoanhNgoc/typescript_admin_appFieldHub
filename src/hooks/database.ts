import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
export const database = async (collectionName: string) => {
    try {
        const snapshot = await getDocs(collection(db, collectionName));
        const dataArray = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return dataArray; // <-- chính là array object nè
    } catch (error) {
        console.error("❌ Lỗi khi lấy dữ liệu Firestore:", error);
        return [];
    }
};