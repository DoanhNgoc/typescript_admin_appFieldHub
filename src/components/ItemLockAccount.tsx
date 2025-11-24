import { getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import FormatTimeDate from "./FormatTimeDate";
import { Button } from "react-bootstrap";

interface Props {
    itemLock: any;
    number: number;
}

export default function ItemLockAccount({ itemLock, number }: Props) {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const getUser = async () => {
            if (!itemLock?.user_id) return;

            const userSnap = await getDoc(itemLock.user_id);

            if (!userSnap.exists()) {
                console.warn("User does not exist:", itemLock.user_id);
                setUser(null);
                return;
            }

            // Lúc này data chắc chắn là object
            setUser({
                id: userSnap.id,
                ...(userSnap.data() as object)
            });
        };

        getUser();
    }, [itemLock]);



    console.log("User:", user);

    return (
        <tr>
            <td>{number + 1}</td>
            <td>{user?.name || "..."}</td>
            <td><FormatTimeDate timestamp={itemLock.update} /></td>
            <td>{itemLock.isComplete ? <>Lock</> : <>Unlock</>}</td>
            <td className="text-center"><Button variant="outline-secondary" className="px-1 p-0 m-0">profile</Button></td>
        </tr>
    );
}
