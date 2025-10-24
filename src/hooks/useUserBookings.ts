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
        if (!rawBookings?.length) return;

        const fetchRefs = async () => {
            const resolved = await Promise.all(
                rawBookings.map(async (b) => {
                    let field: any = null;
                    let sport: any = null;
                    let status: any = null;

                    // ✅ FIELD
                    if (b.field_id) {
                        if (typeof b.field_id === "string") {
                            const fieldSnap = await getDoc(doc(db, "fields", b.field_id));
                            field = fieldSnap.exists() ? { id: fieldSnap.id, ...fieldSnap.data() } : null;
                        } else {
                            field = await getDocDataFromRef(b.field_id);
                        }
                    }

                    // ✅ SPORT
                    if (field?.sport) {
                        if (typeof field.sport === "string") {
                            const sportSnap = await getDoc(doc(db, "sports", field.sport));
                            sport = sportSnap.exists() ? { id: sportSnap.id, ...sportSnap.data() } : null;
                        } else {
                            sport = await getDocDataFromRef(field.sport);
                        }
                    }

                    // ✅ STATUS — xử lý lỗi “status/status/rejected”
                    if (b.status_id) {
                        if (typeof b.status_id === "string") {
                            const parts = b.status_id.split("/");
                            const fixedPath =
                                parts.length > 2
                                    ? `${parts[parts.length - 2]}/${parts[parts.length - 1]}`
                                    : b.status_id;
                            const statusSnap = await getDoc(
                                doc(db, fixedPath.split("/")[0], fixedPath.split("/")[1])
                            );
                            status = statusSnap.exists() ? { id: statusSnap.id, ...statusSnap.data() } : null;
                        } else {
                            status = await getDocDataFromRef(b.status_id);
                        }
                    }

                    return { ...b, field, sport, status };
                })
            );
            setBookings(resolved);
        };

        fetchRefs();
    }, [rawBookings]);

    return { bookings, loading };
}
