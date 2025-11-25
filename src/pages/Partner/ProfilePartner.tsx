import { Alert, Badge, Button, Image, Table } from "react-bootstrap";
import CancelOfContract from "../../components/CancelOfContract";
import FormatDate from "../../components/FormatDate";
import NotificationPartner from "../../components/NotificationPartner";
import FieldPriceInfo from "../../components/FieldPriceInfo";
import React from "react";
import { useEffect, useState } from "react";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { FloatingLabel, Form, Modal } from 'react-bootstrap';


import 'dayjs/locale/vi';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import { addDoc, collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import FormatTimeDate from "../../components/FormatTimeDate";
dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.locale("vi");
interface ProfilePartnerProps {
    user: any,
    sportsArray: any
    onSelectProfile: (user_id: any, activePage: string, nameStore: string) => void;
}
export default function ProfilePartner({ user, sportsArray, onSelectProfile }: ProfilePartnerProps) {

    const [show, setShow] = useState(false);
    const [reason, setReason] = useState("");
    const [notificationContent, setNotificationContent] = useState("");
    const [startDateTime, setStartDateTime] = useState<Dayjs | null>(null);
    const [endDateTime, setEndDateTime] = useState<Dayjs | null>(null);
    const [statusLock, setStatusLock] = useState<string>("unlock")
    const [error, setError] = useState<boolean>(false)
    const [lock, setLock] = useState<any>([]);
    const [data, setData] = useState<any>([])
    const getLock = () => {
        if (!user.id) return;

        const userRef = doc(db, "users", user.id);
        const q = query(
            collection(db, "lockAccount"),
            where("user_id", "==", userRef),
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
    }
    //tìm ra các loc user đang có
    useEffect(() => {
        getLock()
    }, [user.id]);

    //refect mở khóa tài khoản sau mỗi giây
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();

            lock.forEach(async (item: any) => {
                const start = item.start_time.toDate();
                const end = item.end_time.toDate();

                if (now >= start && now <= end && !item.isComplete) {
                    await updateDoc(item.ref, { isComplete: true });
                    setStatusLock("lock")
                } else if ((now < start || now > end) && item.isComplete) {
                    await updateDoc(item.ref, { isComplete: false });
                    setStatusLock("unlock")


                }
            });

            // 👉 Lọc lại sau khi kiểm tra
            const arr = lock.filter((item: any) => item.isComplete === true);
            setData(arr);

        }, 1000);

        return () => clearInterval(interval);
    }, [lock]);


    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        setReason("")
        setStartDateTime(null)
        setEndDateTime(null)
        setNotificationContent("")
        setError(false)
    };
    //nut khóa tài khoản
    const handleSubmitLockAccount = async () => {
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
                alert(`khóa tài khoản trong khoản thời gian: ${startDateTime?.toDate()}-${endDateTime?.toDate()}`)

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
    //nut mở tài khoản sớm
    const handleSubmitUnlockAccount = async () => {



        try {
            const unlockDoc = doc(db, "lockAccount", data[0].id)
            const notificationCol = collection(db, "notifications")
            const userRef = doc(db, 'users', user.id)
            //thong báo tài khoan da được mở
            const notificationContentInOwener = `tài khoản của bạn đã được mở lại, chú ý thay đến những nội dung hợp động để tránh sự việc đáng tiếc, chúc cơ sở của bạn có phát triển tốt`
            await addDoc(notificationCol, {
                created_at: Date.now(),
                field_name: "fieldhub",
                is_read: false,
                subtitle: notificationContentInOwener,
                title: `tài khoản của ${user?.name}`,
                user_id: userRef
            })
            await updateDoc(unlockDoc, {
                content: notificationContent,
                end_time: dayjs().toDate(),
                isComplete: false,
                start_time: data[0].start_time,
                title: data[0].title,
                update: dayjs().toDate(),
                user_id: userRef

            })
            setReason("")
            setStartDateTime(null)
            setEndDateTime(null)
            setNotificationContent("")
            setError(false)
            setShow(false)
            getLock()
            setStatusLock("unlock")
            console.log("data sau unlock", data)
        } catch (error) {
            console.log('error bug unlock: ', error)
        }
        alert("Đã mở khóa tài khoản")
    }
    useEffect(() => {
        setStatusLock(data.length === 0 ? "unlock" : "lock");
    }, [data]);



    return <div>
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
                    </div> : data.map((item: any, key: number) => (
                        <div key={key}>
                            <p className="fw-bold mb-1">Chủ tài khoản: <span className="fw-normal">{user?.name}</span></p>
                            <p className="fw-bold mb-1">Nội dung: <span className="fw-normal">{item?.content}</span></p>
                            <p className="fw-bold mb-1">Ngày tạo: <span className="fw-normal"><FormatTimeDate timestamp={item?.update} /></span></p>
                            <p className="fw-bold mb-1">Thời gian Khóa: <span className="fw-normal"><FormatTimeDate timestamp={item?.start_time} />-<FormatTimeDate timestamp={item?.end_time} /></span></p>

                        </div>
                    ))
                }

            </Modal.Body>

            <Modal.Footer>
                <Button variant="dark" onClick={handleClose}>Thoát</Button>

                <Button variant={statusLock === "unlock" ? "info" : "success"} onClick={() => {
                    statusLock === "unlock" ? handleSubmitLockAccount() : handleSubmitUnlockAccount()
                }}>{statusLock === "unlock" ? <>khóa tài khoản</> : <>Mở khóa</>}</Button>
            </Modal.Footer>
        </Modal>
        <div className="d-flex justify-content-between align-items-center">
            <h3 className="fs-3 fw-bold">Hồ sơ: {user?.nameStore || <span className="text-small text-secondary">Chưa xác định</span>}<Badge bg={statusLock === "unlock" ? "success" : "danger"}>{statusLock === "unlock" ? <>hoạt động</> : <>tạm khóa</>}</Badge></h3>
            <Button variant="warning" onClick={() => onSelectProfile(sportsArray, "ListBookingPartner", user !== null ? user.nameStore : null)}>Lịch sử đơn hàng</Button>
        </div>

        <div className="my-shadow rounded-4 my-3">
            <div className="m-0 p-0">
                {/* hearder card */}
                <div className="m-0 p-3 py-2 rounded-top-4 bg-header text-light d-flex justify-content-between px-3 align-items-center">
                    <p className="fw-bold fs-4 align-items-center m-0 p-0 d-none d-sm-block">
                        {user.name || <span className="text-small text-secondary">Chưa xác định</span>}
                    </p>
                    <div className="text-end">
                        <NotificationPartner user={user} />
                        <Button variant="secondary" onClick={handleShow} className="fw-bold m-1">
                            {statusLock === "unlock" ? <>Tạm khóa</> : <>Mở khóa</>}
                        </Button>
                        <CancelOfContract user={user} />
                    </div>
                </div>
                <div className=" m-0 row border border-black rounded-bottom-4 ">
                    {/* hiển thị thông tin doanh nghiệp và cccd */}
                    <div className=" col-12 col-md-6 p-0  ">
                        {/* thông tin của doanh nghiệp */}
                        <div className="profileUser border-bottom border-black px-2 ">
                            <div className="row">
                                <div className="col-8">
                                    <p className=" fw-bold p-0 my-1">Họ và tên: {user !== null && user?.name ? user.name : <span className="text-small text-secondary">chưa xác định</span>}</p>
                                    <p className=" fw-bold p-0 my-1">Ngày sinh: {user !== null && user.dob !== null ? <FormatDate timestamp={user.dob} /> : <span className="text-small text-secondary">.. / .. /....</span>}</p>
                                    <p className=" fw-bold p-0 my-1">Giới tính: {user !== null && user.gender !== "" ? user.gender : <span className="text-small text-secondary">chưa xác định</span>}</p>
                                    <p className=" fw-bold p-0 my-1">Địa chỉ: {user !== null && user.address !== "" ? user.address : <span className="text-small text-secondary">chưa xác định</span>}</p>
                                    <p className=" fw-bold p-0 my-1">Số điện thoại: {user !== null && user.phone !== "" ? user.phone : <span className="text-small text-secondary">chưa xác định</span>}</p>
                                </div>
                                <div className="col-4 text-center align-items-center d-flex justify-content-center">
                                    {user !== null && user?.avatar !== "" ? <Image src={user.avatar} alt="" className="w-100" roundedCircle /> : <Image src="https://www.vhv.rs/viewpic/hTowTxo_person-svg-circle-icon-picture-charing-cross-tube/#" alt="" className="w-100" roundedCircle />}
                                </div>
                            </div>

                        </div>

                        {/*hiển thị thông tin sân dưới dạng small phone*/}
                        <div className="profileFields border-bottom border-black px-2 d-block d-md-none">
                            <div>
                                <p className="fw-bold p-0 my-1">Tên trụ sở: {user !== null ? user.nameStore : <span className="text-small text-secondary">chưa xác định</span>}</p>
                                <p className="fw-bold p-0 my-1">Mô hình hoạt động: {sportsArray.length !== 0 ? sportsArray.map((item: any, key: number) => (
                                    <span
                                        key={key}
                                    >
                                        {item?.sportDoc?.name}{key < sportsArray.length - 1 ? ", " : ""}
                                    </span>
                                ))
                                    :
                                    <span className="text-small text-secondary">chưa xác định</span>}
                                </p>
                                <p className="fw-bold p-0 my-1">Thông tin:</p>
                                <div className="row">
                                    {
                                        sportsArray.length !== 0 ? sportsArray.map((item: any, key: number) => <div key={key} className="col-12 col-md-6">
                                            <p className="fw-bold p-0 my-1">Mô hình: {item?.sportDoc?.name || <span className="text-small text-secondary">chưa xác định</span>}</p>
                                            <p className="fw-bold p-0 my-1">Số lượng: {item.count}</p>
                                            <p className="fw-bold p-0 my-1">Địa chỉ: {item.address || <span className="text-small text-secondary">chưa xác định</span>}</p>
                                        </div>)
                                            :
                                            <span className="text-small text-secondary">chưa xác định</span>
                                    }
                                </div>
                            </div>
                        </div>
                        {/* thông tin cccd lí lịch của chủ doanh nghiệp */}
                        <div className="infoCard px-2">
                            <p className="fs-4 fw-bold py-2">
                                <span className="d-none d-md-block">Căn cước công dân</span>
                                <span className="d-block d-md-none">CCCD</span>
                            </p>
                            {user !== null ? <div className="row m-0 p-0">
                                <div className="m-0  p-2 ps-0 col-12 col-md-6">
                                    <p className="m-0 fw-bold">
                                        Mặt trước :
                                    </p>
                                    {user?.documentInfo?.card_front && user.documentInfo.card_front !== "" ?
                                        <img
                                            src={
                                                user.documentInfo.card_front
                                            }
                                            className="w-100"
                                        /> : (
                                            <Alert variant="warning">chưa có hình ảnh cccd</Alert>
                                        )}

                                </div>
                                <div className="m-0 p-2 ps-0 col-12 col-md-6">
                                    <p className="m-0 fw-bold">
                                        Mặt sau:
                                    </p>

                                    {user?.documentInfo?.card_back && user.documentInfo.card_back !== "" ?
                                        <img
                                            src={
                                                user.documentInfo.card_back
                                            }
                                            className="w-100"
                                        /> : (
                                            <Alert variant="warning">chưa có hình ảnh cccd</Alert>
                                        )}
                                    {/*  */}
                                </div>
                            </div> : <Alert variant="danger">
                                không có thông tin
                            </Alert>}


                        </div>
                        {/* hiển thị giấy phép dưới dạng small phone */}
                        <div className="busniessLicense px-2 d-block d-md-none border-top border-black">
                            <p className="fs-4 fw-bold py-2 m-0">
                                Giấy phép <span className="d-none d-md-inline-block">kinh doanh</span>
                            </p>
                            <div className="m-2 d-flex justify-content-center">
                                {user?.documentInfo?.business_license_image && user.documentInfo.business_license_image !== "" ? (
                                    <img
                                        src={
                                            user.documentInfo.business_license_image
                                        }
                                        className="rounded float-start w-75 m-1 ms-0"
                                        alt="..."
                                    />
                                ) : (
                                    <Alert variant="warning">Chưa có giấy phép kinh doanh</Alert>
                                )}
                            </div>
                        </div>
                        {/* hiển thị giấy phép kinh doanh */}
                        <div className="busniessLicense border-top border-black px-2 d-block d-md-none">
                            <p className="fs-4 fw-bold py-2 m-0">
                                Giấy phép <span className="d-none d-md-inline-block">kinh doanh</span>
                            </p>
                            <div className="m-2 d-flex justify-content-center">
                                {user?.documentInfo?.business_license_image && user.documentInfo.business_license_image !== "" ? (
                                    <img
                                        src={
                                            user.documentInfo.business_license_image
                                        }
                                        className="rounded float-start w-75 m-1 ms-0"
                                        alt="..."
                                    />
                                ) : (
                                    <Alert variant="warning">Chưa có giấy phép kinh doanh</Alert>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* hiện thị thông tin field và giấy phép */}
                    <div className="col-0 col-md-6 p-0 border-start border-black  d-none d-md-block">
                        {/* hiển thị thông tin các sân */}
                        <div className="profileFields border-bottom border-black px-2 ">
                            <div>
                                <p className="fw-bold p-0 my-1">Tên trụ sở: {user !== null ? user.nameStore : <span className="text-small text-secondary">chưa xác định</span>}</p>
                                <p className="fw-bold p-0 my-1">Mô hình hoạt động: {sportsArray.length !== 0 ? sportsArray.map((item: any, key: number) => (
                                    <span
                                        key={key}
                                    >
                                        {item?.sportDoc?.name}{key < sportsArray.length - 1 ? ", " : ""}
                                    </span>
                                ))
                                    :
                                    <span className="text-small text-secondary">chưa xác định</span>}
                                </p>
                                <p className="fw-bold p-0 my-1">Thông tin:</p>
                                <div className="row">
                                    {
                                        sportsArray.length !== 0 ? sportsArray.map((item: any, key: number) => <div key={key} className="col-12 col-md-6">
                                            <p className="fw-bold p-0 my-1">Mô hình: {item?.sportDoc?.name || <span className="text-small text-secondary">chưa xác định</span>}</p>
                                            <p className="fw-bold p-0 my-1">Số lượng: {item.count}</p>
                                            <p className="fw-bold p-0 my-1">Địa chỉ: {item.address || <span className="text-small text-secondary">chưa xác định</span>}</p>
                                        </div>)
                                            :
                                            <span className="text-small text-secondary">Chưa có sân</span>
                                    }
                                </div>
                            </div>
                        </div>
                        {/* hiển thị giấy phép kinh doanh */}
                        <div className="busniessLicense px-2 d-none d-md-block">
                            <p className="fs-4 fw-bold py-2 m-0">
                                Giấy phép <span className="d-none d-md-inline-block">kinh doanh</span>
                            </p>
                            <div className="m-2 d-flex justify-content-center ">
                                {user?.documentInfo?.business_license_image && user.documentInfo.business_license_image !== "" ? (
                                    <img
                                        src={
                                            user.documentInfo.business_license_image
                                        }
                                        className="rounded float-start w-75 m-1 ms-0"
                                        alt="..."
                                    />
                                ) : (
                                    <Alert variant="warning">Chưa có giấy phép kinh doanh</Alert>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <p className="fw-bold fs-4">
            danh sách sân hiện có
        </p>
        <Table striped bordered
            variant="dark">
            <thead>
                <tr >
                    <th rowSpan={2} className="align-middle text-center">STT</th>
                    <th rowSpan={2} className="align-middle text-center">Tên Sân</th>
                    <th rowSpan={2} className="align-middle text-center">Địa chỉ</th>
                    <th rowSpan={2} className="align-middle text-center">Giờ mở</th>
                    <th rowSpan={2} className="align-middle text-center">Giờ đóng</th>
                    <th colSpan={2} className="align-middle text-center">Giá</th>
                </tr>
                <tr>
                    <th className="align-middle text-center">Giá góc(hour)</th>
                    <th className="align-middle text-center">Cao điểm(hour)</th>
                </tr>
            </thead>
            <tbody>
                {sportsArray.map((sportItem: any, sportItemNumber: number) => <React.Fragment key={sportItemNumber}>
                    <tr >
                        <td colSpan={7} className=" fs-4 fw-bold align-middle ">{
                            sportItem?.sportDoc?.name}
                        </td>
                    </tr>
                    {sportItem.fields.map((field: any, fieldIndex: number) => (
                        <tr key={fieldIndex}>
                            <FieldPriceInfo field={field} keyNumber={fieldIndex} />
                        </tr>
                    ))}
                </React.Fragment>

                )}
            </tbody>
        </Table>


    </div>
}