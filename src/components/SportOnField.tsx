import { getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
interface values {
    fieldRef: any
}

export default function SportOnField({ fieldRef }: values) {
    const [sportName, setSportName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!fieldRef) return;

        const fetchSport = async () => {
            try {
                // Lấy document field
                const fieldSnap = await getDoc(fieldRef);
                if (!fieldSnap.exists()) {
                    console.warn("Không tìm thấy field:", fieldRef.path);
                    setSportName(null);
                    setLoading(false);
                    return;
                }

                const fieldData = fieldSnap.data() as { sport?: any };

                if (!fieldData?.sport) {
                    console.warn("Field không có sport:", fieldData);
                    setSportName(null);
                    setLoading(false);
                    return;
                }

                // Nếu sport là DocumentReference → getDoc để lấy sport.name
                if (typeof fieldData.sport === "object" && "path" in fieldData.sport) {
                    const sportSnap = await getDoc(fieldData.sport);
                    if (sportSnap.exists()) {
                        const sportData = sportSnap.data() as { name?: string };
                        setSportName(sportData.name || null);
                    } else {
                        setSportName(null);
                    }
                } else {
                    // Nếu sport chỉ là string
                    setSportName(fieldData.sport.name || fieldData.sport || null);
                }
            } catch (error) {
                console.error("❌ Lỗi khi lấy sport.name:", error);
                setSportName(null);
            } finally {
                setLoading(false);
            }
        };

        fetchSport();
    }, [fieldRef]);




    return <>
        {loading
            ?
            <span>
                <Spinner animation="grow" variant="info" />
            </span>
            :
            <div>{sportName !== null ? <span>{sportName}</span> : <span className="text-small text-secondary">Chưa xác định</span>}</div>
        }
    </>;
}