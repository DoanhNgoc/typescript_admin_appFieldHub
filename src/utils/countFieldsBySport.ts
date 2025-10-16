import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

export async function countFieldsBySport(areaId: string) {
    try {
        // Lấy tất cả các field có area_id tương ứng
        const q = query(collection(db, "fields"), where("area_id", "==", `/areas/${areaId}`));
        const snapshot = await getDocs(q);

        const counts: Record<string, number> = {};

        snapshot.forEach((doc) => {
            const data = doc.data();
            const sportRef = typeof data.sport === "string" ? data.sport.split("/").pop() : data.sport?.id;
            if (sportRef) {
                counts[sportRef] = (counts[sportRef] || 0) + 1;
            }
        });

        return counts; // Ví dụ: { BongChuyen: 2, BongDa: 5 }
    } catch (error) {
        console.error("🔥 Lỗi khi đếm fields:", error);
        return {};
    }
}
