import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

export function useDocData(collectionName: string, id: string | null, realtime = false) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!collectionName || !id) return;

        const ref = doc(db, collectionName, id);

        if (realtime) {
            const unsub = onSnapshot(ref, (snap) => {
                setData(snap.exists() ? { id: snap.id, ...snap.data() } : null);
                setLoading(false);
            });
            return () => unsub();
        } else {
            getDoc(ref).then((snap) => {
                setData(snap.exists() ? { id: snap.id, ...snap.data() } : null);
                setLoading(false);
            });
        }
    }, [collectionName, id, realtime]);

    return { data, loading };
}
