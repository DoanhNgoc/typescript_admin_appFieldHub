import { Button, Form, InputGroup, Spinner, Table } from "react-bootstrap";
import { useOwnersByStatus } from "../../hooks/useOwnersByStatus";
import ItemPartner from "./ItemPartner";

export default function ListPartner({ onSelectProfile }: { onSelectProfile: (user: any) => void }) {
    const { owners: approvedOwners, loading } = useOwnersByStatus(["approved"]);
    console.log(approvedOwners)


    return (
        <div>
            <h3 className="fs-3 fw-bold">Đối tác</h3>

            <div className="my-shadow border rounded-4 mt-4">
                <div className="m-2 px-2 mt-3">
                    <div className="row p-0 m-0">
                        <div className="col-1 col-md-5 m-0 p-0">
                            <p className="fs-5 fw-bold d-none d-md-block">Danh sách đối tác</p>
                        </div>
                        <div className="col-11 col-md-7 m-0 p-0 fs-5">
                            <InputGroup>
                                <Form.Control placeholder="Search...." />
                                <Button variant="light" className="rounded-end border border-2">
                                    <i className="bi bi-search"></i>
                                </Button>
                            </InputGroup>
                        </div>
                    </div>
                </div>

                <div className="m-0 p-0">
                    {loading ? <div className="text-center">
                        <Spinner animation="grow" variant="info" />
                    </div>
                        :
                        <Table bordered variant="secondary" className="m-0 p-0 mb-3">
                            <thead className="text-center">
                                <tr>
                                    <th>STT</th>
                                    <th>Tên doanh nghiệp</th>
                                    <th>Sđt</th>
                                    <th>Mô hình</th>
                                    <th>Số Lượng</th>
                                    <th>Đánh giá</th>
                                    <th>Đánh giá chung</th>
                                    <th>Hồ sơ</th>
                                </tr>
                            </thead>
                            <tbody>

                                {approvedOwners.length === 0 ? (
                                    <tr><td colSpan={8} className="text-center">Không có đối tác được duyệt</td></tr>
                                ) : (
                                    approvedOwners.map((item, key) => (
                                        <ItemPartner
                                            key={key}
                                            keyValue={key}
                                            user_id={item.id}
                                            onSelectProfile={onSelectProfile}
                                        />
                                    ))
                                )}
                            </tbody>
                        </Table>}

                </div>
            </div>
        </div>
    );
}
