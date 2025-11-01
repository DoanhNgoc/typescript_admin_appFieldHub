import { useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

interface values {
    user: any;
    onAccepted?: () => void; // thêm prop callback
}

export default function RefusePartner({ user, onAccepted }: values) {
    const [show, setShow] = useState(false);
    const [reason, setReason] = useState<string>("");
    const [customReason, setCustomReason] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        if (!loading) {
            setShow(false);
            setReason("");
            setCustomReason("");
        }
    };

    const handleShow = () => setShow(true);

    const handleConfirm = async () => {
        if (!reason) {
            alert("Vui lòng chọn lý do từ chối.");
            return;
        }

        if (reason === "other" && !customReason.trim()) {
            alert("Vui lòng nhập lý do cụ thể khi chọn 'Khác'.");
            return;
        }

        if (!user?.documentInfo?.id) return;
        setLoading(true);
        try {
            const ownerDocRef = doc(db, "owner_documents", user.documentInfo.id);
            const approvedStatusRef = doc(db, "status", "4");
            const userRef = doc(db, "users", user.id); // 🔥 Reference thật trong Firestore

            await updateDoc(ownerDocRef, {
                status_id: approvedStatusRef,
            });
            // 2️⃣ Tạo document mới trong ReasonRefusal
            const reasonContent =
                reason === "other"
                    ? customReason
                    : reason === "identification_card"
                        ? "CCCD chưa hợp lệ"
                        : reason === "invalid_license"
                            ? "Giấy phép không được chấp thuận"
                            : "Thông tin không đầy đủ";

            await addDoc(collection(db, "ReasonRefusal"), {
                content: reasonContent,
                owner_documents_id: ownerDocRef,
                created_at: new Date(),
            });
            await addDoc(collection(db, "notifications"), {
                title: "thông báo hợp tác",
                subtitle: reasonContent,
                field_name: "fieldhub",
                created_at: serverTimestamp(),
                is_read: false,
                user_id: userRef, // 👈 Reference
            });
            alert("Đã từ chối hợp tác");

            handleClose();
            // Gọi callback để cha cập nhật UI
            if (onAccepted) onAccepted();

        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            alert("❌ Cập nhật thất bại!");
        } finally {
            setLoading(false);
        }

    };

    return (
        <>
            <Button variant="danger" onClick={handleShow} className="fw-bold m-1">
                Từ chối
            </Button>

            <Modal show={show} onHide={handleClose} animation={false} centered size="lg">
                <Modal.Header closeButton className="bg-header text-light">
                    <Modal.Title>Từ chối hợp tác</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-primary">
                    <div className="row px-3 py-1 border rounded-4 border-black mx-2">
                        <div className="col-5">
                            <Form>
                                <div className="mb-3">
                                    <Form.Check
                                        className="mb-1"
                                        inline
                                        type="radio"
                                        name="cancelReason"
                                        label="CCCD chưa hợp lệ"
                                        value="identification_card"
                                        checked={reason === "identification_card"}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                    <Form.Check
                                        className="mb-1"
                                        inline
                                        type="radio"
                                        name="cancelReason"
                                        label="Giấy phép không được chấp thuận"
                                        value="invalid_license"
                                        checked={reason === "invalid_license"}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                    <Form.Check
                                        className="mb-1"
                                        inline
                                        type="radio"
                                        name="cancelReason"
                                        label="Thông tin không đầy đủ"
                                        value="Incomplete_information"
                                        checked={reason === "Incomplete_information"}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                    <Form.Check
                                        className="mb-1"
                                        inline
                                        type="radio"
                                        name="cancelReason"
                                        label="Khác"
                                        value="other"
                                        checked={reason === "other"}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                </div>
                            </Form>
                        </div>

                        <div className="col-7">
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Nêu rõ lý do hủy hợp tác</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Nhập lý do cụ thể..."
                                    disabled={reason !== "other"}
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="bg-primary border-top-1 border-black">
                    <Button variant="dark" onClick={handleClose} disabled={loading}>
                        Thoát
                    </Button>
                    <Button variant="success" onClick={handleConfirm} disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Đang xử lý...
                            </>
                        ) : (
                            "Xác nhận"
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
