import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function useFirestoreDoc(collectionName: string, docId: string | null) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!collectionName || !docId) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const docRef = doc(db, collectionName, docId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setData({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setData(null);
                }
            } catch (error) {
                console.error(`Error fetching ${collectionName}/${docId}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [collectionName, docId]);

    return { data, loading };
}
