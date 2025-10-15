import { collection, doc, getCountFromServer, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { Spinner } from "react-bootstrap";

export default function BookingCount({ userId }: { userId: string }) {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        const fetchCount = async () => {
            const userRef = doc(db, "users", userId);
            const q = query(collection(db, "bookings"), where("user_id", "==", userRef));
            const snap = await getCountFromServer(q);
            setCount(snap.data().count);
        };
        fetchCount();
    }, [userId]);

    return <span>{count === null ? <Spinner size="sm" animation="border" /> : count}</span>;
}
