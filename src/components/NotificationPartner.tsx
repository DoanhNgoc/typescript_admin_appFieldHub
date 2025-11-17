import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { collection, addDoc, serverTimestamp, doc } from "firebase/firestore";
import { db } from "../firebase/config";

interface Props {
    user: any;
}

export default function NotificationPartner({ user }: Props) {
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("user:", user);
        console.log("user.id:", user?.id);
        try {
            const userRef = doc(db, "users", user.id); // 🔥 Reference thật trong Firestore

            if (title === "" || subtitle === "") {
                alert("thông báo không thành công\nHãy nhập đầy đủ thông tin")
            }
            else {
                await addDoc(collection(db, "notifications"), {
                    title: title,
                    subtitle: subtitle,
                    field_name: "fieldhub",
                    created_at: serverTimestamp(),
                    is_read: false,
                    user_id: userRef, // 👈 Reference
                });
                alert("Đã gửi thông báo thành công!");
                handleClose();
                setTitle("");
                setSubtitle("");
            }

        } catch (error) {
            console.error("Lỗi khi thêm thông báo:", error);
            alert("Gửi thông báo thất bại!");
        }
    };
    return (
        <>
            <Button variant="success" onClick={handleShow} className="fw-bold m-1">
                Thông báo
            </Button>

            <Modal show={show} onHide={handleClose} animation={false} centered>
                <Modal.Header closeButton className="bg-header text-light">
                    <Modal.Title>Thông Báo {user.nameStore}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="px-3 py-1 border rounded-4 border-black" onSubmit={handleSubmit}>
                        <div className="my-2">
                            <Form.Label className="fw-bold m-0">Tiêu Đề</Form.Label>
                            <Form.Control
                                className="fw-bold"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold m-0">Nội dung thông báo</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={subtitle}
                                    onChange={(e) => setSubtitle(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </div>

                        <p className="text-secondary fw-bold fs-6 m-0 p-0">
                            Một khi đã xác nhận, bạn sẽ không thể hoàn tác. Vui lòng đảm bảo thông tin là chính xác.
                        </p>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={handleClose}>
                        Thoát
                    </Button>
                    <Button variant="success" type="submit" onClick={handleSubmit}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
