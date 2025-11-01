import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
interface values {
    user: any;
    sport: any;
    onAccepted?: () => void; // thêm prop callback
}

export default function AcceptPartner({ user, sport, onAccepted }: values) {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleAccept = async () => {
        if (!user?.documentInfo?.id) return;
        setLoading(true);
        try {
            const ownerDocRef = doc(db, "owner_documents", user.documentInfo.id);
            const approvedStatusRef = doc(db, "status", "5");
            const userRef = doc(db, "users", user.id); // 🔥 Reference thật trong Firestore

            await updateDoc(ownerDocRef, {
                status_id: approvedStatusRef,
            });

            alert("✅ Đã xác nhận hợp tác thành công!");
            setShow(false);

            // Gọi callback để cha cập nhật UI
            if (onAccepted) onAccepted();
            const reasonContent = `chúc mừng ${user.name} và fieldhub đã hợp tác thành công\n Cùng phát triển và tạo 1 môi trường thể thao lành mạnh cùng fieldhub`

            await addDoc(collection(db, "notifications"), {
                title: "thông báo hợp tác",
                subtitle: reasonContent,
                field_name: "fieldhub",
                created_at: serverTimestamp(),
                is_read: false,
                user_id: userRef, // 👈 Reference
            });

        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            alert("❌ Cập nhật thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button variant="success" onClick={handleShow} className="fw-bold m-1">
                Xác nhận
            </Button>

            <Modal show={show} onHide={handleClose} animation={false} centered>
                <Modal.Header closeButton className="bg-header text-light">
                    <Modal.Title>Xác nhận hợp tác</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="px-3 py-1 border rounded-4 border-black">
                        <p className="m-1 p-0 fw-bold">Họ và tên: {user.name}</p>
                        <p className="m-1 p-0 fw-bold">Tên trụ sở: {user.nameStore}</p>
                        <p className="m-1 p-0 fw-bold">
                            Mô hình hoạt động:{" "}
                            {sport.length !== 0 ? (
                                sport.map((item: any, key: number) => (
                                    <span key={key}>
                                        {item.sportDoc.name}
                                        {key < sport.length - 1 ? ", " : ""}
                                    </span>
                                ))
                            ) : (
                                <span className="text-small text-secondary">chưa xác định</span>
                            )}
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={handleClose}>
                        Thoát
                    </Button>
                    <Button variant="success" onClick={handleAccept} disabled={loading}>
                        {loading ? "Đang xử lý..." : "Xác nhận"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
