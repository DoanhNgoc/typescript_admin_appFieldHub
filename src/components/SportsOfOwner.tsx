import { useEffect, useState } from "react";
import { collection, getDocs, query, where, getDoc, DocumentReference } from "firebase/firestore";
import { db } from "../firebase/config";
import { Spinner } from "react-bootstrap";

interface Props {
    user_id: string;
}

export default function SportsOfOwner({ user_id }: Props) {
    const [sportsNames, setSportsNames] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSports = async () => {
            try {
                // 🔹 Lấy tất cả areas có owner_id = user_id
                const areasRef = collection(db, "areas");
                const q = query(areasRef, where("owner_id", "==", `/users/${user_id}`));
                const snapshot = await getDocs(q);

                const sportRefs: DocumentReference[] = [];

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.sports && Array.isArray(data.sports)) {
                        data.sports.forEach((ref: DocumentReference) => {
                            sportRefs.push(ref);
                        });
                    }
                });

                // 🔹 Lấy tên sport từ reference
                const sportNames = await Promise.all(
                    sportRefs.map(async (ref) => {
                        const snap = await getDoc(ref);
                        return snap.exists() ? (snap.data().name as string) : "";
                    })
                );

                // 🔹 Xóa trùng
                const uniqueNames = Array.from(new Set(sportNames.filter(Boolean)));

                setSportsNames(uniqueNames);
            } catch (err) {
                console.error("Lỗi khi lấy sport:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSports();
    }, [user_id]);

    if (sportsNames.length === 0) return <span>Không có môn thể thao nào</span>;

    return (
        <>
            {
                loading ?
                    <Spinner animation="grow" variant="info" /> :
                    sportsNames.map((name, idx) => (
                        <span key={idx}>
                            {name}
                            {idx < sportsNames.length - 1 ? ", " : ""}
                        </span>
                    ))
            }

        </>
    );
}
