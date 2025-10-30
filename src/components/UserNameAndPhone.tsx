import { Spinner } from "react-bootstrap";
import { useDocData } from "../hooks/useDocData";

interface values {
    user_id: string;
}
export default function UserNameAndPhone({ user_id }: values) {
    const { data, loading } = useDocData("users", user_id)

    return <>
        {loading
            ? <>
                <td className="align-middle text-center"><Spinner animation="grow" variant="info" /></td>
                <td className="align-middle text-center"><Spinner animation="grow" variant="info" /></td>
            </>
            :
            <>
                <td className="align-middle">{data !== null && data.name !== "" ? data.name : <span className="text-small text-secondary">Chưa xác định</span>}</td>
                <td className="align-middle text-center">{data !== null && data.phone !== "" ? data.phone : <span className="text-small text-secondary">Chưa xác định</span>}</td>
            </>}
    </>
}