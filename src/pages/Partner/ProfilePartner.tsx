import { Alert, Button, Table } from "react-bootstrap";
import CancelOfContract from "../../components/CancelOfContract";
import FormatDate from "../../components/FormatDate";
import NotificationPartner from "../../components/NotificationPartner";
import FieldPriceInfo from "../../components/FieldPriceInfo";

export default function ProfilePartner({ user, sportsArray }: { user: any, sportsArray: any }) {
    return <div>
        <div className="d-flex justify-content-between align-items-center">
            <h3 className="fs-3 fw-bold">Hồ sơ: {user[0].nameStore || <span className="text-small text-secondary">Chưa xác định</span>}</h3>
            <Button variant="warning" >Lịch sử đơn hàng</Button>
        </div>
        <div className="my-shadow rounded-4 my-3">
            <div className="m-0 p-0">
                {/* hearder card */}
                <div className="m-0 p-3 py-2 rounded-top-4 bg-header text-light d-flex justify-content-between px-3 align-items-center">
                    <p className="fw-bold fs-4 align-items-center m-0 p-0 d-none d-sm-block">
                        {user[0].name || <span className="text-small text-secondary">Chưa xác định</span>}
                    </p>
                    <div className="text-end">
                        <NotificationPartner user={user} />
                        <CancelOfContract user={user} />
                    </div>
                </div>
                <div className=" m-0 row border border-black rounded-bottom-4 ">
                    {/* hiển thị thông tin doanh nghiệp và cccd */}
                    <div className=" col-12 col-md-6 p-0  ">
                        {/* thông tin của doanh nghiệp */}
                        <div className="profileUser border-bottom border-black px-2 ">
                            <div>
                                <p className=" fw-bold p-0 my-1">Họ và tên: {user[0].name !== "" ? user[0].name : <span className="text-small text-secondary">chưa xác định</span>}</p>
                                <p className=" fw-bold p-0 my-1">Ngày sinh: {user[0].dob !== null ? <FormatDate timestamp={user[0].dob} /> : <span className="text-small text-secondary">.. / .. /....</span>}</p>
                                <p className=" fw-bold p-0 my-1">Giới tính: {user[0].gender !== "" ? user[0].gender : <span className="text-small text-secondary">chưa xác định</span>}</p>
                                <p className=" fw-bold p-0 my-1">Địa chỉ: {user[0].address !== "" ? user[0].address : <span className="text-small text-secondary">chưa xác định</span>}</p>
                                <p className=" fw-bold p-0 my-1">Số điện thoại: {user[0].phone !== "" ? user[0].phone : <span className="text-small text-secondary">chưa xác định</span>}</p>
                            </div>

                        </div>

                        {/*hiển thị thông tin sân dưới dạng small phone*/}
                        <div className="profileFields border-bottom border-black px-2 d-block d-md-none">
                            <div>
                                <p className="fw-bold p-0 my-1">Tên trụ sở: {user[0].nameStore !== "" ? user[0].nameStore : <span className="text-small text-secondary">chưa xác định</span>}</p>
                                <p className="fw-bold p-0 my-1">Mô hình hoạt động: {sportsArray.length !== 0 ? sportsArray.map((item: any, key: number) => (
                                    <span
                                        key={key}
                                    >
                                        {item.sportDoc.name}{key < sportsArray.length - 1 ? ", " : ""}
                                    </span>
                                ))
                                    :
                                    <span className="text-small text-secondary">chưa xác định</span>}
                                </p>
                                <p className="fw-bold p-0 my-1">Thông tin:</p>
                                <div className="row">
                                    {
                                        sportsArray.length !== 0 ? sportsArray.map((item: any, key: number) => <div key={key} className="col-12 col-md-6">
                                            <p className="fw-bold p-0 my-1">Mô hình: {item.sportDoc.name || <span className="text-small text-secondary">chưa xác định</span>}</p>
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
                            {user[0].documentInfo !== null ? <div className="row m-0 p-0">
                                <div className="m-0  p-2 ps-0 col-12 col-md-6">
                                    <p className="m-0 fw-bold">
                                        Mặt trước :
                                    </p>

                                    <img src={user[0].documentInfo.card_front !== "" ? user[0].documentInfo.card_front : "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/C%C4%83n_c%C6%B0%E1%BB%9Bc_c%C3%B4ng_d%C3%A2n_g%E1%BA%AFn_ch%C3%ADp_m%E1%BA%B7t_tr%C6%B0%E1%BB%9Bc.jpg/960px-C%C4%83n_c%C6%B0%E1%BB%9Bc_c%C3%B4ng_d%C3%A2n_g%E1%BA%AFn_ch%C3%ADp_m%E1%BA%B7t_tr%C6%B0%E1%BB%9Bc.jpg"} className="rounded float-start w-100 m-1 ms-0" alt="..."></img>
                                </div>
                                <div className="m-0 p-2 ps-0 col-12 col-md-6">
                                    <p className="m-0 fw-bold">
                                        Mặt sau:
                                    </p>

                                    <img src={user[0].documentInfo.card_back !== "" ? user[0].documentInfo.card_back : "http://media.vov.vn/sites/default/files/styles/large/public/2021-10/Can%20cuoc.jpg"} className="rounded float-start w-100 m-1 ms-0" alt="..."></img>
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
                                <img src={user[0].documentInfo.business_license_image !== "" ? user[0].documentInfo.business_license_image : "https://ketoanlacviet.vn/wp-content/uploads/2024/08/mau-giay-chung-nhan-dang-ky-doanh-nghiep-2024.png"} className="rounded float-start w-75 m-1 ms-0" alt="..."></img>
                            </div>
                        </div>
                        {/* hiển thị giấy phép kinh doanh */}
                        <div className="busniessLicense border-top border-black px-2 d-block d-md-none">
                            <p className="fs-4 fw-bold py-2 m-0">
                                Giấy phép <span className="d-none d-md-inline-block">kinh doanh</span>
                            </p>
                            <div className="m-2 d-flex justify-content-center">
                                <img src={user[0].documentInfo.business_license_image !== "" ? user[0].documentInfo.business_license_image : "https://ketoanlacviet.vn/wp-content/uploads/2024/08/mau-giay-chung-nhan-dang-ky-doanh-nghiep-2024.png"} className="rounded float-start w-100 m-1 ms-0" alt="..."></img>
                            </div>
                        </div>
                    </div>
                    {/* hiện thị thông tin field và giấy phép */}
                    <div className="col-0 col-md-6 p-0 border-start border-black  d-none d-md-block">
                        {/* hiển thị thông tin các sân */}
                        <div className="profileFields border-bottom border-black px-2 ">
                            <div>
                                <p className="fw-bold p-0 my-1">Tên trụ sở: {user[0].nameStore !== "" ? user[0].nameStore : <span className="text-small text-secondary">chưa xác định</span>}</p>
                                <p className="fw-bold p-0 my-1">Mô hình hoạt động: {sportsArray.length !== 0 ? sportsArray.map((item: any, key: number) => (
                                    <span
                                        key={key}
                                    >
                                        {item.sportDoc.name}{key < sportsArray.length - 1 ? ", " : ""}
                                    </span>
                                ))
                                    :
                                    <span className="text-small text-secondary">chưa xác định</span>}
                                </p>
                                <p className="fw-bold p-0 my-1">Thông tin:</p>
                                <div className="row">
                                    {
                                        sportsArray.length !== 0 ? sportsArray.map((item: any, key: number) => <div key={key} className="col-12 col-md-6">
                                            <p className="fw-bold p-0 my-1">Mô hình: {item.sportDoc.name || <span className="text-small text-secondary">chưa xác định</span>}</p>
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
                            <div className="m-2 d-flex justify-content-center">
                                <img src={user[0].documentInfo.business_license_image !== "" ? user[0].documentInfo.business_license_image : "https://ketoanlacviet.vn/wp-content/uploads/2024/08/mau-giay-chung-nhan-dang-ky-doanh-nghiep-2024.png"} className="rounded float-start w-75 m-1 ms-0" alt="..."></img>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <p className="fw-bold fs-4">
            danh sách sân hiện có
        </p>
        <Table striped bordered hover variant="dark">
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
                {sportsArray.flatMap((sportItem: any,) => <>
                    <tr>
                        <td colSpan={7} className=" fs-4 fw-bold align-middle ">{
                            sportItem.sportDoc.name}
                        </td>
                    </tr>
                    {sportItem.fields.map((field: any, fieldIndex: number) => (
                        <tr key={fieldIndex}>
                            <FieldPriceInfo field={field} keyNumber={fieldIndex} />
                        </tr>
                    ))}
                </>

                )}
            </tbody>
        </Table>



    </div>
}