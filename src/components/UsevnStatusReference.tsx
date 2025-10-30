import { useEffect, useState } from "react";
import { getDoc, DocumentReference } from "firebase/firestore";

interface Value {
    status: DocumentReference; // m truyền reference vào nha
}

export default function UsevnStatusReference({ status }: Value) {
    const [statusName, setStatusName] = useState<string>("");

    useEffect(() => {
        if (!status) return;

        const fetchStatus = async () => {
            try {
                const snap = await getDoc(status);
                if (snap.exists()) {
                    const data = snap.data();
                    setStatusName(data.name);
                }
            } catch (error) {
                console.error("Lỗi lấy status:", error);
            }
        };

        fetchStatus();
    }, [status]);

    if (!statusName) return null;

    switch (statusName) {
        case "pending":
            return "Chờ xác nhận";
        case "approved":
            return "Xác nhận";
        case "canceled":
            return "Hủy";
        case "paid":
            return "Đã thanh toán";
        case "unpaid":
            return "Chưa thanh toán";
        case "completed":
            return "Hoàn thành";
        case "using":
            return "Đang sử dụng";
        default:
            return "Trạng thái không cập nhật";
    }
}
