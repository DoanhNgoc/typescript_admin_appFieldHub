import { useState } from "react";
import { Button, Form, InputGroup, Spinner, Table } from "react-bootstrap";
import { useOwnersByStatus } from "../../../hooks/useOwnersByStatus";
import SportsOfOwner from "../../../components/SportsOfOwner";
import ReasonRefusalOfOwner from "../../../components/ReasonRefusalOfOwner";

interface RefuseProps {
    onSelectProfile: (user: any) => void;
}

export default function Refuse({ onSelectProfile }: RefuseProps) {
    const { owners: canceledOwners, loading } = useOwnersByStatus(["canceled"]);
    const [search, setSearch] = useState("");

    // 🔍 Lọc danh sách theo số điện thoại
    const filteredOwners = canceledOwners.filter((item) =>
        item.phone?.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <div>
            <h3 className="fw-bold fs-3">Danh sách từ chối</h3>
            <div className="my-shadow border rounded-4 mt-4">
                <div className="p-0 mt-3">
                    <div className="row px-2 m-2 d-flex align-items-center">
                        <div className="col-12 col-md-5 m-0 p-0">
                            <p className="fs-5 fw-bold d-none d-md-block m-0 p-0">
                                Danh sách
                            </p>
                        </div>
                        <div className="col-12 col-md-7 m-0 p-0 fs-5">
                            <InputGroup className="m-0 p-0">
                                <Form.Control
                                    placeholder="Tìm theo số điện thoại..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <Button
                                    variant="light"
                                    className="rounded-end-4 border border-2"
                                >
                                    <i className="bi bi-search"></i>
                                </Button>
                            </InputGroup>
                        </div>
                    </div>

                    <div className="content mt-3 mx-0 p-0">
                        {loading ? (
                            <div className="text-center">
                                <Spinner animation="grow" variant="info" />
                            </div>
                        ) : (
                            <Table
                                bordered
                                variant="secondary"
                                className="m-0 p-0 mb-3"
                                size="sm"
                            >
                                <thead className="text-center">
                                    <tr>
                                        <th className="align-middle">STT</th>
                                        <th className="align-middle">Tên doanh nghiệp</th>
                                        <th className="align-middle">SĐT</th>
                                        <th className="align-middle">Mô hình</th>
                                        <th className="align-middle">Lý do từ chối</th>
                                        <th className="align-middle">Hồ sơ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOwners.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center">
                                                Không tìm thấy kết quả phù hợp
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOwners.map((item, key) => (
                                            <tr key={key} className="text-center">
                                                <td className="align-middle">{key + 1}</td>
                                                <td className="align-middle">{item.nameStore}</td>
                                                <td className="align-middle">{item.phone}</td>
                                                <td className="align-middle">
                                                    <SportsOfOwner user_id={item.id} />
                                                </td>
                                                <td className="text-start align-middle">
                                                    <ReasonRefusalOfOwner
                                                        owner_documents_id={item.documentInfo.id}
                                                    />
                                                </td>
                                                <td className="align-middle">
                                                    <Button
                                                        variant="outline-dark"
                                                        onClick={() => onSelectProfile(item)}

                                                    >
                                                        <span className="d-block">Hồ sơ</span>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
