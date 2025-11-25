import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import ItemLockAccount from "./ItemLockAccount";


export default function ListLockAccounts() {
    const [listLock, setListLock] = useState<any>([])
    type LockAccount = {
        id: string;
        isComplete: boolean;
        update?: {
            seconds: number;
            nanoseconds: number;
        };
        [key: string]: any;
    };
    const getLockAccount = async () => {
        try {
            const lockCol = collection(db, "lockAccount");
            const lockSnapshot = await getDocs(lockCol);

            const list: LockAccount[] = lockSnapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as any)
            }));

            list.sort((a, b) => {
                if (a.isComplete !== b.isComplete) {
                    return Number(b.isComplete) - Number(a.isComplete);
                }

                const aTime = a.update?.seconds || 0;
                const bTime = b.update?.seconds || 0;

                return bTime - aTime;
            });

            setListLock(list);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getLockAccount()
    }, [])
    return <>
        <p className="fw-bold mb-1">
            danh sách khóa
        </p>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Create at</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {listLock.length > 0 ? listLock.map((item: any, key: number) => <ItemLockAccount key={key} number={key} itemLock={item} />) : <tr>
                    <td colSpan={5}>chưa có tài khoản</td>
                </tr>}
            </tbody>
        </Table>

    </>
}