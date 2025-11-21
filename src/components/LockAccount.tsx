// Updated LockAccount component
// Includes isCompleted for lockAccount creation and proper user_id reference usage
// NOTE: Adjust according to actual project structure

import { useState, useEffect, useCallback } from "react";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Button, FloatingLabel, Form, Modal, Spinner } from 'react-bootstrap';
import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    query,
    where,
    getDocs,
    updateDoc,
    limit,
    orderBy,
    type DocumentData,
    type DocumentReference,
    Timestamp
} from "firebase/firestore";

import 'dayjs/locale/vi';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';

import { db } from "../firebase/config";

dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.locale("vi");

interface LockAccountDoc extends DocumentData {
    content: string;
    start_time: Timestamp;
    end_time: Timestamp;
    user_id: DocumentReference;
    title: string;
    isCompleted: boolean;
}

interface Props {
    user: any;
}

export default function LockAccount({ user }: Props) {
    const [show, setShow] = useState(false);
    const [reason, setReason] = useState("");
    const [notificationContent, setNotificationContent] = useState("");
    const [startDateTime, setStartDateTime] = useState<Dayjs | null>(null);
    const [endDateTime, setEndDateTime] = useState<Dayjs | null>(null);
    const [currentLock, setCurrentLock] = useState<{ doc: LockAccountDoc, ref: DocumentReference } | null>(null);
    const [loading, setLoading] = useState(true);

    const userIdRef = doc(db, `users/${user.id}`);

    const fetchCurrentLock = useCallback(async () => {
        setLoading(false);

        const locksQuery = query(
            collection(db, "lockAccount"),
            where("user_id", "==", userIdRef),
            where("isCompleted", "==", false),
            orderBy("end_time", "asc"),
            limit(1)
        );

        const snapshot = await getDocs(locksQuery);
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            setCurrentLock({ doc: doc.data() as LockAccountDoc, ref: doc.ref });
        } else {
            setCurrentLock(null);
        }

        setLoading(false);
    }, [user.id]);

    useEffect(() => {
        fetchCurrentLock();
    }, [fetchCurrentLock]);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        if (!currentLock) {
            setStartDateTime(dayjs());
            setEndDateTime(dayjs().add(1, 'hour'));
        }
    };

    const handleSubmit = async () => {
        if (!startDateTime || !endDateTime) return alert("Chưa chọn thời gian!");

        const lockDoc = await addDoc(collection(db, "lockAccount"), {
            content: notificationContent,
            title: reason,
            user_id: userIdRef,
            start_time: Timestamp.fromDate(startDateTime.toDate()),
            end_time: Timestamp.fromDate(endDateTime.toDate()),
            createdAt: serverTimestamp(),
            isCompleted: false
        });

        await updateDoc(userIdRef, {
            status_id: doc(db, "status/8"),
            updatedAt: serverTimestamp()
        });

        alert("Đã đặt lịch khóa thành công!");
        fetchCurrentLock();
        setShow(false);
    };

    const handleUnlockImmediately = async () => {
        if (!currentLock) return;

        await updateDoc(userIdRef, {
            status_id: doc(db, "status/5"),
            updatedAt: serverTimestamp()
        });

        await updateDoc(currentLock.ref, {
            end_time: new Date(),
            updatedAt: serverTimestamp(),
            isCompleted: true,
            title: "Đã Gỡ Khóa Tức Thì"
        });

        alert("Đã gỡ khóa thành công!");
        fetchCurrentLock();
        setShow(false);
    };

    if (loading) {
        return (
            <Button variant="secondary" disabled className="fw-bold m-1">
                <Spinner as="span" animation="border" size="sm" /> Đang tải...
            </Button>
        );
    }

    const isCurrentlyLocked = currentLock && dayjs().isBetween(
        dayjs(currentLock.doc.start_time.toDate()),
        dayjs(currentLock.doc.end_time.toDate())
    );

    const buttonText = isCurrentlyLocked ? "Đang khóa tài khoản" : "Tạm khóa";

    return (
        <>
            <Button variant={isCurrentlyLocked ? "danger" : "secondary"} onClick={handleShow} className="fw-bold m-1">
                {buttonText}
            </Button>

            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton className="bg-header text-light">
                    <Modal.Title>
                        {isCurrentlyLocked ? "Chi tiết khóa & Gỡ khóa" : `Tạm khóa ${user.nameStore}`}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {isCurrentlyLocked ? (
                        <div className="alert alert-warning">
                            <h4>Tài khoản đang bị khóa</h4>
                            <p>{`Kết thúc vào: ${dayjs(currentLock!.doc.end_time.toDate()).format("HH:mm DD/MM/YYYY")}`}</p>
                            <p>Nội dung: {currentLock!.doc.content}</p>
                            <p className="text-danger">Gỡ khóa ngay lập tức?</p>
                        </div>
                    ) : (
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <p className="fw-bold">Bắt đầu</p>
                                    <DatePicker
                                        label="Ngày bắt đầu"
                                        format="DD/MM/YYYY"
                                        value={startDateTime}
                                        onChange={e => e && setStartDateTime(e)}
                                    />
                                    <TimePicker
                                        className="mt-3"
                                        label="Giờ bắt đầu"
                                        ampm={false}
                                        value={startDateTime}
                                        onChange={e => e && setStartDateTime(dayjs(startDateTime).hour(e.hour()).minute(e.minute()))}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <p className="fw-bold">Kết thúc</p>
                                    <DatePicker
                                        label="Ngày kết thúc"
                                        format="DD/MM/YYYY"
                                        value={endDateTime}
                                        onChange={e => e && setEndDateTime(e)}
                                    />
                                    <TimePicker
                                        className="mt-3"
                                        label="Giờ kết thúc"
                                        ampm={false}
                                        value={endDateTime}
                                        onChange={e => e && setEndDateTime(dayjs(endDateTime).hour(e.hour()).minute(e.minute()))}
                                    />
                                </div>
                            </div>

                            <FloatingLabel controlId="reasonInput" label="Lý do khóa / tiêu đề" className="my-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập lý do"
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                />
                            </FloatingLabel>

                            <Form.Group className="mb-3">
                                <Form.Label>Nội dung thông báo</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={notificationContent}
                                    onChange={e => setNotificationContent(e.target.value)}
                                />
                            </Form.Group>
                        </LocalizationProvider>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="dark" onClick={handleClose}>Thoát</Button>

                    {isCurrentlyLocked ? (
                        <Button variant="danger" onClick={handleUnlockImmediately}>Gỡ khóa ngay lập tức</Button>
                    ) : (
                        <Button variant="success" onClick={handleSubmit}>Xác nhận đặt lịch</Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
}