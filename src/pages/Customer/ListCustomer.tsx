import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Spinner, Table } from "react-bootstrap";
import { database } from "../../hooks/database";

import BookingCount from "../../components/BookingCount";
export default function ListCustomer({ onSelectProfile }: { onSelectProfile: (user: any) => void }) {
    const [users, setUsers] = useState<any[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    //fetch all customer 
    const fetchData = async () => {
        try {
            const usersData = await database("users");
            const rolesData = await database("roles");
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

            // Lọc ra role có name = 'customer'
            const customerRole = rolesData.find((r: any) => r.name?.toLowerCase() === "user");
            const customers = normalizedUsers.filter(u => u.role_id === customerRole?.id.toString());
            console.log("role:", customerRole);
            setUsers(customers);
            setFilteredUsers(customers);
        } catch (err) {
            console.log("error:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    // Khi gõ vào ô search -> lọc realtime
    const handleSearch = (value: string) => {
        setSearchValue(value);
        const filtered = users.filter(user =>
            user.phone?.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };
    return <div>
        <h3 className="fs-3">Danh sách khách hàng</h3>

        <div className="my-shadow border rounded-4 mt-3">
            <div className="  m-2 px-2 mt-3" >
                <div className="row p-0 m-0">
                    <div className="col-1 col-md-5 m-0 p-0">
                        <p className="fs-5 fw-bold d-none d-md-block">Customers</p>
                    </div>
                    <div className="col-11 col-md-7 m-0 p-0 fs-5">
                        <InputGroup >
                            <Form.Control
                                placeholder="Search...."
                                value={searchValue}
                                onChange={(e) => handleSearch(e.target.value)}
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
                            <th>Tên khách hàng</th>
                            <th>Sđt</th>
                            <th>Email</th>
                            <th>Số lượng đơn đặt</th>
                            <th>Hồ sơ</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={6}>
                                    {users.length === 0 ? (
                                        <Spinner animation="border" variant="info" />
                                    ) : (
                                        "Không tìm thấy khách hàng nào"
                                    )}
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((item, key) => (
                                <tr key={key}>
                                    <td className="align-middle">{key + 1}</td>
                                    <td className="align-middle">{item.name || "no name"}</td>
                                    <td className="align-middle">{item.phone || "no phone"}</td>
                                    <td className="align-middle">{item.email || "no mail"}</td>
                                    <td className="align-middle"><BookingCount userId={item.id} /></td>
                                    <td className="align-middle">
                                        <Button
                                            variant="outline-dark"
                                            className="fw-bold"
                                            onClick={() => onSelectProfile(item)}
                                        >
                                            Hồ sơ
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}

                    </tbody>
                </Table>
            </div>
        </div>
    </div>
}