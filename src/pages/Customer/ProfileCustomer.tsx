import dayjs from "dayjs";
import { Col, Container, Image, Row, Spinner, Table } from "react-bootstrap";
import customParseFormat from "dayjs/plugin/customParseFormat";
import useUserBookings from "../../hooks/useUserBookings";

import FormatDate from "../../components/FormatDate";
import FormatTimeDate from "../../components/FormatTimeDate";
import UsevnStatus from "../../components/UsevnStatus";
import FormatVND from "../../components/FormatVND";
dayjs.extend(customParseFormat);
export default function ProfileCustomer({ user }: { user: any }) {
    const { bookings, loading } = useUserBookings(user.id);

    console.log(bookings)
    return <div >
        <div className="my-shadow rounded-4 pb-2">
            <div className=" p-0 m-0">
                <div className="m-0 p-3 py-2 rounded-top-4 bg-header text-light">
                    <p className="fs-4 fw-bold m-0 p-0">Thông tin khách hàng</p>
                </div>
                <div className=" m-0  fs-5  ">
                    <div className=" border-bottom border-dark p-3 fw-bold">
                        <div className="d-flex row  align-items-top justify-content-between">
                            <div className="col-6 col-lg-4">
                                <p>Tên: {user.name || "no mail"}</p>
                                <p>Ngày sinh: {user.dob !== null ? <FormatDate timestamp={user.dob} /> : ".. / .. /...."}</p>
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
                    <div className="history_order mx-3">
                        <p className="fw-bold fs-5">Lịch sữ đặt đơn</p>
                        <div className="text-center">
                            {loading && bookings.length == 0 ?
                                <Spinner animation="border" variant="info" />
                                :
                                <div>
                                    <Table striped bordered hover size="sm ">
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>Tên sân</th>
                                                <th>Mô hình</th>
                                                <th>Ngày đặt</th>
                                                <th>Giờ bắt đầu</th>
                                                <th>Giờ kết thúc</th>
                                                <th>Trạng thái</th>
                                                <th>Giá</th>
                                            </tr>
                                        </thead>
                                        <tbody className="fw-normal">
                                            {bookings.length === 0
                                                ? (
                                                    <tr>
                                                        <td colSpan={8}>Hiện tại chưa có đơn đặt từ khách hàng</td>
                                                    </tr>
                                                )
                                                : bookings.map((item, key) => (
                                                    <tr key={key} className="text-start">
                                                        <td className="align-middle">{key + 1}</td>
                                                        <td className="align-middle">{item.field?.name ?? "no field"}</td>
                                                        <td className="align-middle">{item.sport?.name ?? "no sport"}</td>
                                                        <td className="align-middle">{item.created_at ? <FormatTimeDate timestamp={item.created_at} /> : "no time"}</td>
                                                        <td className="align-middle">{item.start_time ? <FormatTimeDate timestamp={item.start_time} /> : "no time"}</td>
                                                        <td className="align-middle">{item.end_time ? <FormatTimeDate timestamp={item.end_time} /> : "no time"}</td>
                                                        <td className="align-middle">{item.status?.name ? <UsevnStatus status={item.status.name} /> : "no status"}</td>
                                                        <td className="align-middle">{item.price ? <FormatVND amount={item.price} /> : "no price"}</td>
                                                    </tr>
                                                ))
                                            }


                                        </tbody>
                                    </Table>
                                </div>}

                        </div>


                    </div>
                </div>
            </div>
        </div>
    </div>

}