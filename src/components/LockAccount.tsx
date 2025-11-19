import { useState } from "react";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

dayjs.locale("vi");


interface Props {
    user: any;
}
export default function LockAccount({ user }: Props) {
    const [show, setShow] = useState(false);
    // lock account content
    const [reason, setReason] = useState("");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //click on time
    const [startDateTime, setStartDateTime] = useState<Dayjs | null>(null);
    const [endDateTime, setEndDateTime] = useState<Dayjs | null>(null);

    const handleSubmit = async () => {

        if (!startDateTime || !endDateTime) {
            alert("Vui lòng chọn thời gian bắt đầu và kết thúc.");
            return;
        }
        if (endDateTime.isBefore(startDateTime)) {
            alert("Thời gian kết thúc phải sau thời gian bắt đầu.");
            return;
        }

        await addDoc(collection(db, "lockAccount"), {
            user_id: doc(db, `users/${user.id}`),
            title: "Tạm khóa tài khoản",
            content: reason,
            start_time: startDateTime.toDate(),
            end_time: endDateTime.toDate(),
            createAt: serverTimestamp(),
        });

        alert("Đã đặt lịch khóa tài khoản thành công!");
        handleClose();
    };



    return (<>
        <Button variant="secondary" onClick={handleShow} className="fw-bold m-1">
            Tạm khóa
        </Button>
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton className="bg-header text-light">
                <Modal.Title>Tạm khóa {user.nameStore}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <FloatingLabel controlId="floatingInput" label="Lý do khóa app" className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Nhập lý do"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </FloatingLabel>

                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
                    <div className="row">
                        {/* BẮT ĐẦU */}
                        <div className="col-md-6">
                            <p className="fw-bold m-0">Bắt đầu</p>

                            <DatePicker
                                label="Ngày bắt đầu"
                                format="DD/MM/YYYY"
                                value={startDateTime}
                                onChange={(date) => {
                                    if (date) {
                                        const updated = startDateTime
                                            ? date.hour(startDateTime.hour()).minute(startDateTime.minute())
                                            : date;
                                        setStartDateTime(updated);
                                    }
                                }}
                            />

                            <TimePicker
                                className="mt-3"
                                label="Giờ bắt đầu"
                                value={startDateTime}
                                ampm={false}
                                minutesStep={1}
                                onChange={(time) => {
                                    if (time) {
                                        const updated = startDateTime
                                            ? startDateTime.hour(time.hour()).minute(time.minute())
                                            : dayjs().hour(time.hour()).minute(time.minute());
                                        setStartDateTime(updated);
                                    }
                                }}
                            />
                        </div>

                        {/* KẾT THÚC */}
                        <div className="col-md-6">
                            <p className="fw-bold m-0">Kết thúc</p>

                            <DatePicker
                                label="Ngày kết thúc"
                                format="DD/MM/YYYY"
                                value={endDateTime}
                                onChange={(date) => {
                                    if (date) {
                                        const updated = endDateTime
                                            ? date.hour(endDateTime.hour()).minute(endDateTime.minute())
                                            : date;
                                        setEndDateTime(updated);
                                    }
                                }}
                            />

                            <TimePicker
                                className="mt-3"
                                label="Giờ kết thúc"
                                value={endDateTime}
                                ampm={false}
                                minutesStep={1}
                                onChange={(time) => {
                                    if (time) {
                                        const updated = endDateTime
                                            ? endDateTime.hour(time.hour()).minute(time.minute())
                                            : dayjs().hour(time.hour()).minute(time.minute());
                                        setEndDateTime(updated);
                                    }
                                }}
                            />
                        </div>

                    </div>
                </LocalizationProvider>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="dark" onClick={handleClose}>Thoát</Button>
                <Button variant="success" onClick={handleSubmit}>Xác nhận</Button>
            </Modal.Footer>
        </Modal>
    </>)
}