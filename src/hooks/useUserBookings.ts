import { useEffect, useState } from "react";
import { useCollectionData } from "./useCollectionData";
import { getDocDataFromRef } from "./firestoreUtils";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function useUserBookings(userId: string) {
    const [bookings, setBookings] = useState<any[]>([]);
    const { data: rawBookings, loading } = useCollectionData("bookings", [
        { field: "user_id", op: "==", value: doc(db, "users", userId) },
    ]);
    useEffect(() => {
        if (!rawBookings.length) return;

        const fetchRefs = async () => {
            const resolved = await Promise.all(
                rawBookings.map(async (b) => {
                    // ép kiểu field về dạng có thể có sport
                    const field: any = await getDocDataFromRef(b.field_id);

                    const status = await getDocDataFromRef(b.status_id);

                    let sport: any = null;
                    if (field.sport) {
                        // vì field.sport là id string nên tạo doc ref thủ công
                        const sportRef = doc(db, "sports", field.sport);
                        const sportSnap = await getDoc(sportRef);
                        if (sportSnap.exists()) {
                            sport = { id: sportSnap.id, ...sportSnap.data() };
                        }
                    }
                    return { ...b, field, status, sport };
                })
            );
            setBookings(resolved);
        };

        fetchRefs();
    }, [rawBookings]);

    return { bookings, loading };
}
