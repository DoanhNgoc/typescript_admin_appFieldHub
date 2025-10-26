
import { Spinner } from "react-bootstrap";
import { useManagedAreas } from "../hooks/useManagedAreas";

interface Props {
    user_id: string;
}

export default function SportsOfOwner({ user_id }: Props) {
    const { sportsMap, loading } = useManagedAreas(user_id);


    const sportsArray = Object.values(sportsMap || {});
    return (
        <>
            {loading
                ?
                <Spinner animation="grow" variant="info" />
                :
                (sportsArray.length > 0 ? sportsArray.map((item: any, key: number) => <span key={key}>{item.sportDoc.name}{key < sportsArray.length - 1 ? ',' : ''}</span>)
                    :
                    <p>chưa có sân</p>
                )
            }
        </>
    );
}
