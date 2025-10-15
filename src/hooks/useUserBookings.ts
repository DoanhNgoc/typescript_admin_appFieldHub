import { useEffect, useState } from "react";
import { useCollectionData } from "./useCollectionData";
import { getDocDataFromRef } from "./firestoreUtils";
import { doc } from "firebase/firestore";
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

                    // nếu có sport thì lấy thêm
                    let sport: any = null;
                    if (field?.sport) {
                        sport = await getDocDataFromRef(field.sport);
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
