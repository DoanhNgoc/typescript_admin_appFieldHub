import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { db } from "../firebase/config";

interface Props {
    owner_documents_id: string; // 👈 chỉ cần truyền id của owner_documents
}

export default function ReasonRefusalOfOwner({ owner_documents_id }: Props) {
    const [reasons, setReasons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReasons = async () => {
            try {
                // 🔹 Query ReasonRefusal theo reference owner_documents_id
                const ref = collection(db, "ReasonRefusal");
                const q = query(
                    ref,
                    where("owner_documents_id", "==", doc(db, "owner_documents", owner_documents_id))
                );

                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((d) => ({
                    id: d.id,
                    ...d.data(),
                }));
                setReasons(data);
            } catch (err) {
                console.error("Lỗi khi lấy lý do từ chối:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReasons();
    }, [owner_documents_id]);

    if (loading) return <div>Đang tải...</div>;

    return (
        <>
            {reasons.length > 0 ? (
                reasons.map((r) => <p className="align-middle m-0 p-0" key={r.id}>{r.content}</p>)
            ) : (
                <p className="align-middle m-0 p-0">Không có lý do từ chối nào.</p>
            )}
        </>
    );
}
