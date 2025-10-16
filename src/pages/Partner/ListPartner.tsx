import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Table } from "react-bootstrap";
import { database } from "../../hooks/database";

export default function ListPartner() {
    const [users, setUsers] = useState<any[]>([]);
    const [fields, setFields] = useState<any[]>([]);
    const fetchData = async () => {
        try {
            const usersData = await database("users");
            const rolesData = await database("roles");
            const fieldsData = await database('fields');
            // Chuẩn hoá role_id để lấy được ID thật (vd: "roles/3" => "3")
            const normalizedUsers = usersData.map((user: any) => {
                let roleId = null;

                // Nếu là DocumentReference thật (Firestore)
                if (user.role_id && typeof user.role_id === "object") {
                    // ưu tiên lấy .id (nếu có)
                    if ("id" in user.role_id) {
                        roleId = user.role_id.id;
                    }
                    // fallback nếu chỉ có .path (vd: "roles/2")
                    else if ("path" in user.role_id) {
                        roleId = user.role_id.path.split("/").pop();
                    }
                    // hoặc referencePath (trường hợp m tự serialize ra)
                    else if ("referencePath" in user.role_id) {
                        roleId = user.role_id.referencePath.split("/").pop();
                    }
                }

                // nếu Firestore trả về string (trường hợp JSON export)
                if (!roleId && typeof user.role_id === "string") {
                    roleId = user.role_id.split("/").pop();
                }

                return { ...user, role_id: roleId };
            });

            // Lọc ra role có name = 'owner'
            const ownerRole = rolesData.find((r: any) => r.name?.toLowerCase() === "owner");
            const owners = normalizedUsers.filter(u => u.role_id === "2");
            console.log("🔥 Owner users:", owners);
            setFields(fieldsData);
            setUsers(owners);
        } catch (err) {
            console.log("error:", err);
        }
    };
    //fetch all users from firebase
    useEffect(() => {
        fetchData();
    }, []);
    return <div>
        <h3 className="fs-3">Đối tác</h3>
        <pre>
            {JSON.stringify(fields, null, 2)}
        </pre>
        <div className="my-shadow border rounded-4">
            <div className="  m-2 px-2 mt-3" >
                <div className="row p-0 m-0">
                    <div className="col-1 col-md-5 m-0 p-0">
                        <p className="fs-5 fw-bold d-none d-md-block">Danh sách đối tác</p>
                    </div>
                    <div className="col-11 col-md-7 m-0 p-0 fs-5">
                        <InputGroup >
                            <Form.Control
                                placeholder="Search...."
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon2"
                            />
                            <Button variant="light" id="button-addon2" className="rounded-end border border-2">
                                <i className="bi bi-search"></i>
                            </Button>
                        </InputGroup>
                    </div>
                </div>

            </div>
            <div className="m-0 p-0">
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

                        <tr>
                            <td rowSpan={2} className="align-middle text-center fw-bold">01</td>
                            <td rowSpan={2} className="align-middle text-center">f88</td>

                            <td>0987654321</td>
                            <td>bóng đá</td>
                            <td>3</td>
                            <td className="text-warning text-center align-middle">
                                <div className="stars">
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                </div>
                            </td>

                            <td rowSpan={2} className="text-warning text-center align-middle">
                                <div className="stars">
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                </div>
                            </td>
                            <td rowSpan={2} className="align-middle text-center">Hồ sơ</td>
                        </tr>

                        <tr>
                            <td>0987654321</td>
                            <td>Cầu lông</td>
                            <td>6</td>
                            <td className="text-warning text-center align-middle">
                                <div className="stars">
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    </div>
}