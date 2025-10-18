import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { countFieldsBySport } from "../utils/countFieldsBySport";

export function useAreaFields(userId: string | null) {
    const [areas, setAreas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                // Lấy tất cả areas có owner_id = userId
                const q = query(collection(db, "areas"), where("owner_id", "==", `/users/${userId}`));
                const snapshot = await getDocs(q);

                const results: any[] = [];

                for (const doc of snapshot.docs) {
                    const area = { id: doc.id, ...doc.data() };
                    const fieldCounts = await countFieldsBySport(doc.id);
                    results.push({ ...area, fieldCounts });
                }

                setAreas(results);
            } catch (err) {
                console.error(" Lỗi khi lấy areas:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    return { areas, loading };
}
