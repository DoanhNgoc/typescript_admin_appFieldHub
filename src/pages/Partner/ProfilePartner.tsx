import { Alert } from "react-bootstrap";
import CancelOfContract from "../../components/CancelOfContract";
import FormatDate from "../../components/FormatDate";
import NotificationPartner from "../../components/NotificationPartner";

export default function ProfilePartner({ user, sportsArray }: { user: any, sportsArray: any }) {
    return <div>

        <h3 className="fs-3 fw-bold">Hồ sơ: {user.nameStore}</h3>
        <div className="my-shadow rounded-4 pb-2">
            <div className="m-0 p-0">
                <div className="m-0 p-3 py-2 rounded-top-4 bg-header text-light d-flex justify-content-between px-3 align-items-center">
                    <p className="fw-bold fs-4 align-items-center m-0 p-0 d-none d-sm-block">
                        {user.name}
                    </p>
                    <div className="text-end">
                        <NotificationPartner user={user} />
                        <CancelOfContract user={user} />
                    </div>
                </div>
                <div className="mt-3 m-0 p-0 row">
                    {/* hiển thị thông tin doanh nghiệp và cccd */}
                    <div className=" col-12 col-md-6 p-0 border border-black border-start-0">
                        {/* thông tin của doanh nghiệp */}
                        <div className="profileUser border-bottom border-black px-2 ">
                            <div>
                                <p className=" fw-bold p-0 my-1">Họ và tên: {user.name !== "" ? user.name : <span className="text-small text-secondary">chưa xác định</span>}</p>
                                <p className=" fw-bold p-0 my-1">Ngày sinh: {user.dob !== null ? <FormatDate timestamp={user.dob} /> : <span className="text-small text-secondary">.. / .. /....</span>}</p>
                                <p className=" fw-bold p-0 my-1">Giới tính: {user.gender !== "" ? user.gender : <span className="text-small text-secondary">chưa xác định</span>}</p>
                                <p className=" fw-bold p-0 my-1">Địa chỉ: {user.address !== "" ? user.address : <span className="text-small text-secondary">chưa xác định</span>}</p>
                                <p className=" fw-bold p-0 my-1">Số điện thoại: {user.phone !== "" ? user.phone : <span className="text-small text-secondary">chưa xác định</span>}</p>
                            </div>

                        </div>
                        {/* thông tin cccd lí lịch của chủ doanh nghiệp */}
                        <div className="infoCard px-2">
                            <p className="fs-4 fw-bold py-2">
                                <span className="d-none d-md-block">Căn cước công dân</span>
                                <span className="d-block d-md-none">CCCD</span>
                            </p>
                            {user.documentInfo1 !== null ? <div className="row m-0 p-0">
                                <div className="m-0 p-0 py-2 col-12 col-md-6">
                                    <p className="m-0 fw-bold">
                                        Mặt trước
                                    </p>
                                    <img src={"https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/C%C4%83n_c%C6%B0%E1%BB%9Bc_c%C3%B4ng_d%C3%A2n_g%E1%BA%AFn_ch%C3%ADp_m%E1%BA%B7t_tr%C6%B0%E1%BB%9Bc.jpg/960px-C%C4%83n_c%C6%B0%E1%BB%9Bc_c%C3%B4ng_d%C3%A2n_g%E1%BA%AFn_ch%C3%ADp_m%E1%BA%B7t_tr%C6%B0%E1%BB%9Bc.jpg"} className="rounded float-start" alt="..." width={"245px"}></img>

                                </div>
                            </div> : <Alert variant="danger">
                                This is a  alert—check it out!
                            </Alert>}


                        </div>
                        <div className="profileFields border-bottom border-black px-2 d-block d-md-none">
                            <div>
                                <p className="fw-bold p-0 my-1">Tên trụ sở: {user.nameStore !== "" ? user.nameStore : <span className="text-small text-secondary">chưa xác định</span>}</p>
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
                    </div>
                    {/* hiện thị thông tin field và giấy phép */}
                    <div className="col-0 col-md-6 p-0 border border-black border-start-0 d-none d-md-block">
                        <div className="profileFields border-bottom border-black px-2 ">
                            <div>
                                <p className="fw-bold p-0 my-1">Tên trụ sở: {user.nameStore !== "" ? user.nameStore : <span className="text-small text-secondary">chưa xác định</span>}</p>
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
                    </div>
                </div>
            </div>
        </div>
        <h1>user</h1>
        <pre>
            {JSON.stringify(user, null, 2)}
        </pre>
        <h1>sport</h1>
        <pre>
            {JSON.stringify(sportsArray, null, 2)}
        </pre>

    </div>
}