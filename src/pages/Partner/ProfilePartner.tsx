import { Alert, Button, Image, Table } from "react-bootstrap";
import CancelOfContract from "../../components/CancelOfContract";
import FormatDate from "../../components/FormatDate";
import NotificationPartner from "../../components/NotificationPartner";
import FieldPriceInfo from "../../components/FieldPriceInfo";
import React from "react";
import LockAccount from "../../components/LockAccount";
interface ProfilePartnerProps {
    user: any,
    sportsArray: any
    onSelectProfile: (user_id: any, activePage: string, nameStore: string) => void;
}
export default function ProfilePartner({ user, sportsArray, onSelectProfile }: ProfilePartnerProps) {
    return <div>
        <div className="d-flex justify-content-between align-items-center">
            <h3 className="fs-3 fw-bold">Hồ sơ: {user?.nameStore || <span className="text-small text-secondary">Chưa xác định</span>}</h3>
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
                        <LockAccount user={user} />
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

        <pre>
            {JSON.stringify(user, null, 2)}
        </pre>

    </div>
}