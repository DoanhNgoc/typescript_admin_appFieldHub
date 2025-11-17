import { Alert, Button, Spinner } from "react-bootstrap";
import { useManagedAreas } from "../../hooks/useManagedAreas";
interface value {
    user_id: string
    keyValue: number
    approvedOwners: any
    onSelectProfile: (user: any, sportsArray: any, activePage: string) => void
}
export default function ItemPartner({ user_id, keyValue, onSelectProfile, approvedOwners }: value) {
    const { user, sportsMap, loading, error } = useManagedAreas(user_id);


    if (loading) return <tr>
        <td colSpan={8} className="text-center">
            <Spinner animation="grow" variant="info" />
        </td>
    </tr>;
    if (error) return <tr>
        <td colSpan={8} className="text-center align-middle">
            <Alert variant={"danger"} className="text-start">
                {String(error)}
            </Alert>

        </td>
    </tr>;

    // 🔹 Lấy danh sách sports từ sportsMap
    const sportsArray = Object.values(sportsMap || {});
    if (sportsArray.length === 0) {
        return (
            <tr>
                <td className="text-center">{keyValue + 1}</td>
                <td className="align-middle text-center">{user?.nameStore || "no name"}</td>
                <td colSpan={5} className="text-center text-muted">
                    Doanh nghiệp chưa có sân nào
                </td>
                <td className="align-middle text-center">
                    <Button
                        variant="outline-dark"
                        className="fw-bold"
                        onClick={() => onSelectProfile(user, [...sportsArray], "ProfilePartner")}
                    >
                        Hồ sơ
                    </Button>
                </td>
            </tr>
        );
    }
    return (<>
        {sportsArray.map((sport: any, index: number) => (
            <tr key={sport.sportId}>
                {index === 0 && (

                    <td rowSpan={sportsArray.length} className="align-middle text-center">
                        {keyValue + 1}
                    </td>
                )}
                {/* 👉 Hiển thị cột doanh nghiệp 1 lần, dùng rowSpan */}
                {index === 0 && (

                    <td rowSpan={sportsArray.length} className="align-middle text-center">
                        {user?.nameStore || "no name"}
                    </td>
                )}

                <td className="align-middle">{sport.fields[0]?.phone || "Chưa có SĐT"}</td>
                <td className="align-middle">{sport.sportDoc?.name || "Không xác định"}</td>
                <td className="align-middle">{sport.count}</td>
                <td className="text-warning text-center align-middle">
                    <div className="stars">
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-fill"></i>
                    </div>
                </td>

                {/* 👉 Cột stars + Hồ sơ chỉ xuất hiện 1 lần nếu có nhiều sports */}
                {index === 0 && (
                    <>
                        <td rowSpan={sportsArray.length} className="text-warning text-center align-middle">
                            <div className="stars">
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                            </div>
                        </td>
                        <td rowSpan={sportsArray.length} className="align-middle text-center">
                            <Button
                                variant="outline-dark"
                                className="fw-bold"
                                onClick={() => onSelectProfile(approvedOwners, sportsArray, "ProfilePartner")}
                            >
                                Hồ sơ
                            </Button>
                        </td>
                    </>
                )}
            </tr>
        ))}
    </>
    );
}
