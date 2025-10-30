import { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc } from "firebase/firestore";
import { db } from "../firebase/config";

export function useReviewByBookingId(bookingId: string | null) {
    const [review, setReview] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!bookingId) return;

        const fetchReview = async () => {
            setLoading(true);
            try {
                const bookingRef = doc(db, "bookings", bookingId);
                const q = query(collection(db, "reviews"), where("booking_id", "==", bookingRef));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    setReview({ id: snap.docs[0].id, ...snap.docs[0].data() });
                } else {
                    setReview(null);
                }
            } catch (err) {
                console.error("Error fetching review:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReview();
    }, [bookingId]);

    return { review, loading };
}
