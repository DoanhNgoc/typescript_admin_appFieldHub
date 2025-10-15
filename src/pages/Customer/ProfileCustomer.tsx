import dayjs from "dayjs";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
export default function ProfileCustomer({ user }: { user: any }) {
    // //format date time in timestamp firebase
    const formatDate = (timestamp: any) => {
        if (!timestamp?.seconds) return null;
        const d = new Date(timestamp.seconds * 1000);
        return d.toLocaleDateString("vi-VN"); // tự format dd/mm/yyyy
    };
    return <div >
        <div className="my-shadow rounded-4">
            <div className=" p-0 m-0">
                <div className="m-0 p-3 py-2 rounded-top-4 bg-header text-light">
                    <p className="fs-4 fw-bold m-0 p-0">Thông tin khách hàng</p>
                </div>
                <div className=" m-0  fs-5  fw-bold">
                    <div className=" border-bottom border-dark p-3">
                        <div className="d-flex row  align-items-top justify-content-between">
                            <div className="col-6 col-lg-4">
                                <p>Tên: {user.name || "no mail"}</p>
                                <p>Ngày sinh: {formatDate(user.dob) || ".. / .. /...."}</p>
                                <p>Giới tính: {user.gender !== "" ? user.gender : "Nam/Nữ"}</p>
                                <p>Email: {user.email || "no mail"}</p>
                                <p className="d-block d-lg-none">phone: {user.phone}</p>
                                <p className="d-block d-lg-none">Địa chỉ: {user.address}</p>
                            </div>
                            <div className=" d-none d-lg-block col-0 col-lg-5">
                                <p className="">phone: {user.phone || "no phone"}</p>
                                <p className="">Địa chỉ: {user.address}</p>
                            </div>
                            <div className="avatar col-6 col-lg-3  ">
                                <Container >
                                    <Row >
                                        <Col xs={12} md={12} className="d-flex justify-content-end">
                                            <Image width="200px" src={user.avatar !== "" ? user.avatar : "https://static.vecteezy.com/system/resources/previews/007/296/447/non_2x/user-icon-in-flat-style-person-icon-client-symbol-vector.jpg"} roundedCircle />
                                        </Col>
                                    </Row>
                                </Container>

                            </div>
                        </div>
                    </div>
                    <div className="history_order">
                        <p className="fw-bold fs-5">Lịch sữ đặt đơn</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

}