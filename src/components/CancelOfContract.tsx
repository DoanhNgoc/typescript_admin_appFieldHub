import { useState } from "react";
import { doc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/config";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface Props {
    user: any; // object chứa thông tin user và documentInfo
}

export default function CancelOfContract({ user }: Props) {
    const [show, setShow] = useState(false);
    const [reason, setReason] = useState<string>("");
    const [customReason, setCustomReason] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleConfirm = async () => {
        if (!reason) {
            alert("Vui lòng chọn lý do hủy hợp tác!");
            return;
        }
        if (reason === "other" && !customReason.trim()) {
            alert("Vui lòng nhập lý do chi tiết khi chọn 'Khác'!");
            return;
        }

        try {
            setLoading(true);

            // lấy id owner_documents
            const ownerDocId = user?.documentInfo?.id;
            if (!ownerDocId) throw new Error("Không tìm thấy thông tin hồ sơ người dùng!");

            // 1️⃣ Cập nhật status_id trong owner_documents
            const ownerDocRef = doc(db, "owner_documents", ownerDocId);
            const canceledRef = doc(db, "status", "4");

            await updateDoc(ownerDocRef, {
                status_id: canceledRef,
            });

            // 2️⃣ Tạo document mới trong ReasonRefusal
            const reasonContent =
                reason === "other"
                    ? customReason
                    : reason === "rule_violation"
                        ? "Vi phạm quy tắc của hệ thống"
                        : reason === "bad_experience"
                            ? "Chất lượng trải nghiệm không tốt"
                            : "Đánh giá trên hệ thống quá thấp";

            await addDoc(collection(db, "ReasonRefusal"), {
                content: reasonContent,
                owner_documents_id: ownerDocRef,
                created_at: new Date(),
            });

            alert("Đã hủy hợp tác thành công!");
            handleClose();
        } catch (err: any) {
            alert("Lỗi khi hủy hợp tác: " + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button variant="danger" onClick={handleShow} className="fw-bold m-1">
                Hủy hợp đồng
            </Button>

            <Modal show={show} onHide={handleClose} animation={false} centered size="lg">
                <Modal.Header closeButton className="bg-header text-light">
                    <Modal.Title>Hủy hợp tác với {user.nameStore}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="row">
                        <div className="col-5">
                            <Form>
                                <div className="mb-3">
                                    <Form.Check
                                        className="mb-1"
                                        inline
                                        type="radio"
                                        name="cancelReason"
                                        label="Vi phạm quy tắc của hệ thống"
                                        value="rule_violation"
                                        checked={reason === "rule_violation"}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                    <Form.Check
                                        className="mb-1"
                                        inline
                                        type="radio"
                                        name="cancelReason"
                                        label="Chất lượng trải nghiệm không tốt"
                                        value="bad_experience"
                                        checked={reason === "bad_experience"}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                    <Form.Check
                                        className="mb-1"
                                        inline
                                        type="radio"
                                        name="cancelReason"
                                        label="Đánh giá trên hệ thống quá thấp"
                                        value="low_rating"
                                        checked={reason === "low_rating"}
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

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Thoát
                    </Button>
                    <Button
                        variant="success"
                        onClick={handleConfirm}
                        disabled={!reason || loading}
                    >
                        {loading ? "Đang xử lý..." : "Xác nhận"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
