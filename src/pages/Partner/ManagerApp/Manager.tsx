// getData.ts

import ListLockAccounts from "../../../components/ListLockAccounts";
import ManagerSports from "../../../components/MangerSports";

export default function Manager() {

    return <>
        <h3>Quản lý app</h3>
        <ManagerSports />
        <ListLockAccounts />
    </>
}
