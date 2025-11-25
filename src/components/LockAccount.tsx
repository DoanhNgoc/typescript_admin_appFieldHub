// Updated LockAccount component
// Includes isCompleted for lockAccount creation and proper user_id reference usage
// NOTE: Adjust according to actual project structure

import { useEffect, useState } from "react";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Alert, Button, FloatingLabel, Form, Modal } from 'react-bootstrap';


import 'dayjs/locale/vi';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import { addDoc, collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase/config";



dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.locale("vi");



interface Props {
    user: any;

}

export default function LockAccount({ user }: Props) {
    const [show, setShow] = useState(false);
    const [reason, setReason] = useState("");
    const [notificationContent, setNotificationContent] = useState("");
    const [startDateTime, setStartDateTime] = useState<Dayjs | null>(null);
    const [endDateTime, setEndDateTime] = useState<Dayjs | null>(null);
    const [statusLock, setStatusLock] = useState<string>("unlock")
    const [error, setError] = useState<boolean>(false)
    const [lock, setLock] = useState<any>([]);

    useEffect(() => {
        if (!user.id) return;

        const userRef = doc(db, "users", user.id);
        const q = query(
            collection(db, "lockAccount"),
            where("user_id", "==", userRef),
            where("isComplete", "==", true)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ref: doc.ref,
                ...doc.data()
            }));
            setLock(list);
        });

        return () => unsubscribe();
    }, [user.id]);
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();

            lock.forEach(async (item: any) => {
                const start = item.start_time.toDate();
                const end = item.end_time.toDate();

                if (now >= start && now <= end && !item.isComplete) {
                    await updateDoc(item.ref, { isComplete: true });
                } else if ((now < start || now > end) && item.isComplete) {
                    await updateDoc(item.ref, { isComplete: false });
                }
            });
        }, 1000); // check 1 giây

        return () => clearInterval(interval);
    }, [lock]);

    const handleClose = () => setShow(false);

    const handleSubmit = async () => {
        try {
            if (reason === "" || startDateTime === null || endDateTime === null || notificationContent === "")
                setError(true)

            else {
                const lockCol = collection(db, "lockAccount"); //collection lock account 
                const notificationCol = collection(db, "notifications") // collection notification thông báo cho owner biết sắp bị khóa app tạm thời
                const userRef = doc(db, 'users', user.id)
                const now = new Date();

                await addDoc(lockCol, {
                    content: notificationContent,
                    end_time: endDateTime?.toDate(),
                    isComplete: now >= startDateTime.toDate() && now <= endDateTime.toDate() ? true : false,
                    start_time: startDateTime?.toDate(),
                    title: reason,
                    update: dayjs().toDate(),
                    user_id: userRef
                })
                const notificationContentInOwener = `${notificationContent}\n thời gian bắt đầu: ${startDateTime?.toDate()}.\nThời gian kết thúc: ${endDateTime?.toDate()}`
                await addDoc(notificationCol, {
                    created_at: Date.now(),
                    field_name: "fieldhub",
                    is_read: false,
                    subtitle: notificationContentInOwener,
                    title: reason,
                    user_id: userRef
                })
                setReason("")
                setStartDateTime(null)
                setEndDateTime(null)
                setNotificationContent("")
                setError(false)
                setShow(false)
            }
        } catch (error) {
            console.log("error lock bug: ", error)
        }
    }
    useEffect(() => {
        setStatusLock(lock.length === 0 ? "unlock" : "lock");
    }, [lock]);


    return (
        <>


            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton className="bg-header text-light">
                    <Modal.Title>
                        {`Tạm khóa ${user.nameStore}`}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {
                        statusLock === "unlock" ? <div>
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
                                            onChange={e => {


                                                setEndDateTime(e);
                                            }}
                                        />
                                        <TimePicker
                                            className="mt-3"
                                            label="Giờ kết thúc"
                                            ampm={false}
                                            value={endDateTime}
                                            onChange={(e) => {
                                                if (!e) return;

                                                const base = endDateTime ?? startDateTime ?? dayjs();

                                                const newEnd = dayjs(base)
                                                    .hour(e.hour())
                                                    .minute(e.minute());

                                                setEndDateTime(newEnd);
                                            }}

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
                            {error ? <Alert variant="danger">
                                Hiện tại thông tin còn thiếu hãy kiểm tra lại thông tin
                            </Alert> : <></>}
                        </div> : <div>

                        </div>
                    }
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="dark" onClick={handleClose}>Thoát</Button>

                    <Button variant="info" onClick={handleSubmit}>{statusLock === "unlock" ? <>khóa tài khoản</> : <>Mở khóa</>}</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}