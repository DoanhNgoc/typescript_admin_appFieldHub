import { getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import FormatTimeDate from "./FormatTimeDate";

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




    return (
        <tr>
            <td>{number + 1}</td>
            <td>{user?.name || "..."}</td>
            <td >{user?.phone}</td>

            <td><FormatTimeDate timestamp={itemLock.update} /></td>
            <td>{itemLock.isComplete ? <>Lock</> : <>Unlock</>}</td>
        </tr>
    );
}
