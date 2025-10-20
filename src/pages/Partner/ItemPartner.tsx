import { Alert, Button, Spinner } from "react-bootstrap";
import { useManagedAreas } from "../../hooks/useManagedAreas";
interface value {
    user_id: string
    keyValue: number
    onSelectProfile: (user: any) => void
}
export default function ItemPartner({ user_id, keyValue, onSelectProfile }: value) {
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
                        onClick={() => onSelectProfile([...sportsArray])}
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
                                onClick={() => onSelectProfile(sportsArray)}
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
// {
//     "BongDa": {
//         "sportId": "BongDa",
//             "sportDoc": { "id": "BongDa", "name": "Bóng đá" },
//         "fields": [{
//             "id": "kAR0nNbq3gjgf4zpengT",
//             "phone": "0123456789", "description": "khu vực Thủ Đức, Trong khuôn viên trường cao đẳng Công Nghệ Thủ Đức",
//             "area_id": { "type": "firestore/documentReference/1.0", "referencePath": "areas/ccQXsF8oPUXpmSlWmZPh" },
//             "sport": "BongDa",
//             "open_time": { "type": "firestore/timestamp/1.0", "seconds": 1760529293, "nanoseconds": 126000000 },
//             "close_time": { "type": "firestore/timestamp/1.0", "seconds": 1760461200, "nanoseconds": 931000000 }, "name": "tdc"
//         }],
//             "count": 1
//     },
//     "BongChuyen": {
//         "sportId": "BongChuyen",
//             "sportDoc": { "id": "BongChuyen", "name": "Bóng chuyền" },
//         "fields": [{
//             "id": "x9XuBBOD1nRRIbgU9T6e",
//             "close_time": {
//                 "type": "firestore/timestamp/1.0",
//                 "seconds": 1760371200, "nanoseconds": 757000000
//             },
//             "sport": "BongChuyen", "name": "TDC Võ Văn Ngân",
//             "phone": "0112233445", "area_id": { "type": "firestore/documentReference/1.0", "referencePath": "areas/ccQXsF8oPUXpmSlWmZPh" }, "open_time": { "type": "firestore/timestamp/1.0", "seconds": 1760306400, "nanoseconds": 227000000 }, "description": "khu vực Thủ Đức, Trong khuôn viên trường cao đẳng Công Nghệ Thủ Đức"
//         }],
//             "count": 1
//     }
// }