import { Button, Form, InputGroup, Spinner, Table } from "react-bootstrap";
import { useOwnersByStatus } from "../../../hooks/useOwnersByStatus";

export default function Refuse() {
    const { owners: approvedOwners, loading } = useOwnersByStatus(["canceled"]);

    console.log("canceled:", approvedOwners)

    return <div>
        <h3 className="fw-bold fs-3">Danh sách từ chối</h3>
        <div className="my-shadow border rounded-4 mt-4">
            <div className=" p-0 mt-3">
                <div className="row px-2 m-2 d-flex align-items-center">
                    <div className="col-1 col-md-5 m-0 p-0">
                        <p className="fs-5 fw-bold d-none d-md-block m-0 p-0">Danh sách</p>
                    </div>
                    <div className="col-11 col-md-7 m-0 p-0 fs-5">
                        <InputGroup className="m-0 p-0">
                            <Form.Control placeholder="Search...." />
                            <Button variant="light" className="rounded-end-4 border border-2">
                                <i className="bi bi-search"></i>
                            </Button>
                        </InputGroup>
                    </div>
                </div>
                <div className="content mt-3 mx-0 p-0">
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
                                    <th>Lý do từ chối</th>
                                    <th>Hồ sơ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {approvedOwners.length === 0 ? <tr >
                                    <td colSpan={8} className="text-center">
                                        chưa có danh sách doanh nghiệp từ chối hợp tác
                                    </td>
                                </tr>
                                    :
                                    <tr>
                                    </tr>}
                            </tbody>
                        </Table>}
                </div>
            </div>


        </div>
    </div>
}