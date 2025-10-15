import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
    collection,
    getDocs,
    query,
    where,
    onSnapshot,
    type Query,
    type QueryDocumentSnapshot,
    type QuerySnapshot,
    type DocumentData,
    type WhereFilterOp,
} from "firebase/firestore";

interface QueryCondition {
    field: string;
    op: WhereFilterOp;
    value: any;
}

export function useCollectionData(
    collectionName: string,
    conditions: QueryCondition[] = [],
    realtime = false
) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!collectionName) return;

        let q: Query<DocumentData> = collection(db, collectionName);

        if (conditions.length > 0) {
            const wheres = conditions.map((c) => where(c.field, c.op, c.value));
            q = query(q, ...wheres);
        }

        if (realtime) {
            const unsub = onSnapshot(q, (snap: QuerySnapshot<DocumentData>) => {
                const docs = snap.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setData(docs);
                setLoading(false);
            });
            return () => unsub();
        } else {
            getDocs(q).then((snap: QuerySnapshot<DocumentData>) => {
                const docs = snap.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setData(docs);
                setLoading(false);
            });
        }
    }, [collectionName, JSON.stringify(conditions), realtime]);

    return { data, loading };
}
