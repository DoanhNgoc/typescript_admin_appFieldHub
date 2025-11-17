import { useEffect, useState } from "react";
import { onSnapshot, query, collection, where, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { getDocDataFromRef } from "./firestoreUtils";

export default function useUserBookings(userId: string) {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const q = query(
            collection(db, "bookings"),
            where("user_id", "==", doc(db, "users", userId))
        );

        // 📌 REALTIME LISTENER
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const rawBookings = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

            if (!rawBookings.length) {
                setBookings([]);
                setLoading(false);
                return;
            }

            // Resolve all reference documents
            const resolved = await Promise.all(
                rawBookings.map(async (b: any) => {
                    let field: any = null;
                    let sport: any = null;
                    let status: any = null;

                    // FIELD
                    if (b.field_id) {
                        if (typeof b.field_id === "string") {
                            const fieldSnap = await getDoc(doc(db, "fields", b.field_id));
                            field = fieldSnap.exists() ? { id: fieldSnap.id, ...fieldSnap.data() } : null;
                        } else field = await getDocDataFromRef(b.field_id);
                    }

                    // SPORT
                    if (field?.sport) {
                        if (typeof field.sport === "string") {
                            const sportSnap = await getDoc(doc(db, "sports", field.sport));
                            sport = sportSnap.exists() ? { id: sportSnap.id, ...sportSnap.data() } : null;
                        } else sport = await getDocDataFromRef(field.sport);
                    }

                    // STATUS
                    if (b.status_id) {
                        if (typeof b.status_id === "string") {
                            const parts = b.status_id.split("/");
                            const fixed =
                                parts.length > 2 ? `${parts.at(-2)}/${parts.at(-1)}` : b.status_id;

                            const statusSnap = await getDoc(
                                doc(db, fixed.split("/")[0], fixed.split("/")[1])
                            );
                            status = statusSnap.exists() ? { id: statusSnap.id, ...statusSnap.data() } : null;
                        } else status = await getDocDataFromRef(b.status_id);
                    }

                    return { ...b, field, sport, status };
                })
            );

            setBookings(resolved);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    return { bookings, loading };
}
