import { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc } from "firebase/firestore";
import { db } from "../firebase/config";

interface Field {
  id: string;
  name: string;
  sport: string;
  [key: string]: any;
}

interface Booking {
  id: string;
  field_id: any; // Firestore DocumentReference
  field_name: string;
  user_id: string;
  start_time: any;
  end_time: any;
  status: string;
  price: number;
  [key: string]: any;
}

export default function usePartnerBookings(fields: Field[]) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fields || fields.length === 0) return;

    const fetchAllBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const allBookings: Booking[] = [];

        // Chia nhỏ vì Firestore where-in giới hạn 10 giá trị
        const fieldChunks = [];
        for (let i = 0; i < fields.length; i += 10) {
          fieldChunks.push(fields.slice(i, i + 10));
        }

        for (const chunk of fieldChunks) {
          // Tạo mảng DocumentReference thật
          const fieldRefs = chunk.map((f) => doc(db, "fields", f.id));

          const q = query(
            collection(db, "bookings"),
            where("field_id", "in", fieldRefs)
          );

          const snap = await getDocs(q);
          snap.forEach((docSnap) => {
            allBookings.push({ id: docSnap.id, ...docSnap.data() } as Booking);
          });
        }

        setBookings(allBookings);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };  

    fetchAllBookings();
  }, [fields]);

  return { bookings, loading, error };
}
