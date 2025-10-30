import { Spinner } from "react-bootstrap";
import { useDocData } from "../hooks/useDocData";
interface values {
    sport_id: string
}
export default function SportNameReference({ sport_id }: values) {
    const { data, loading } = useDocData("sports", sport_id)

    return <>
        {loading
            ?
            <td className="align-middle text-center">
                <Spinner animation="grow" variant="info" />
            </td>
            :
            <td className="align-middle text-center">
                {data !== null && data.name !== "" ? data.name : <span className="text-small text-secondary">chưa xác định</span>}
            </td>}
    </>
}