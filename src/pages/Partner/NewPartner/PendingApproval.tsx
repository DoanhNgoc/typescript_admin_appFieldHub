import { Spinner } from "react-bootstrap";
import { useOwnersByStatus } from "../../../hooks/useOwnersByStatus";
import ItemPedingApproval from "./ItemPedingApproval";
import { useEffect, useState } from "react";

export default function PendingApproval() {

    const { owners: pendingOwners, loading } = useOwnersByStatus(["pending"]);
    const [owners, setOwners] = useState<any[]>([]);

    useEffect(() => {
        setOwners(pendingOwners);
    }, [pendingOwners]);

    const handleAccepted = (userId: string) => {
        setOwners((prev) => prev.filter((o) => o.id !== userId));
    };

    return <div>
        <h3 className="fs-3 fw-bold">Chờ phê duyệt</h3>
        {loading ? (
            <div className="text-center">
                <Spinner animation="grow" variant="info" />
            </div>
        ) : (
            <>{owners.length === 0
                ?
                <div className="text-center">
                    <p className="fs-4 ">không có doanh nghiệp cần được duyệt</p>
                </div> : <div>
                    {owners.map((item, key) => (
                        <ItemPedingApproval
                            user={item}
                            key={key}
                            onAccepted={() => handleAccepted(item.id)}
                        />
                    ))}
                </div>}</>
        )}
    </div>
}