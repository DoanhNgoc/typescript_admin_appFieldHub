import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  doc,
  getDoc,
  DocumentReference,
} from "firebase/firestore";
import { useCollectionData } from "./useCollectionData";

/**
 * Hook lấy danh sách owner có status nằm trong danh sách allowedStatuses
 * @param allowedStatuses - mảng tên trạng thái cần lọc, ví dụ ["approved", "canceled"]
 */

type StatusData = { name?: string };
type OwnerDoc = { user_id?: any; status_id?: any;[key: string]: any };

export function useOwnersByStatus(allowedStatuses: string[] = []) {
  const { data: users, loading: loadingUsers } = useCollectionData("users", [
    { field: "role_id", op: "==", value: "/roles/2" },
  ]);
  const { data: ownerDocs, loading: loadingDocs } = useCollectionData("owner_documents");
  console.log("doc", ownerDocs)
  const [filteredOwners, setFilteredOwners] = useState<any[]>([]);

  useEffect(() => {
    async function mergeData() {
      if (loadingUsers || loadingDocs) return;
      const statusCache = new Map<string, string>();
      const owners: any[] = [];

      await Promise.all(
        users.map(async (user: any) => {
          // Tìm document tương ứng với user
          const docOwner = ownerDocs.find((doc: OwnerDoc) => {
            const ref = doc.user_id || doc["user_id/"];
            return ref?.id === user.id;
          });
          if (!docOwner?.status_id) return;

          // 🔍 Xử lý status_id (DocumentReference hoặc string)
          let statusPath = "";
          let statusRef: DocumentReference | null = null;

          if (typeof docOwner.status_id === "object" && "path" in docOwner.status_id) {
            statusPath = docOwner.status_id.path;
            statusRef = docOwner.status_id as DocumentReference;
          } else if (typeof docOwner.status_id === "string") {
            statusPath = docOwner.status_id.replace(/^\//, "");
            statusRef = doc(db, statusPath);
          }

          if (!statusRef || !statusPath) return;

          // 🧠 Cache lại status name nếu đã có
          let statusName = statusCache.get(statusPath);
          if (!statusName) {
            const statusSnap = await getDoc(statusRef);
            if (!statusSnap.exists()) return;
            const statusData = statusSnap.data() as StatusData;
            statusName = statusData?.name || "";
            if (statusName) statusCache.set(statusPath, statusName);
          }

          // ✅ Nếu status nằm trong danh sách cho phép
          if (statusName && allowedStatuses.includes(statusName)) {
            owners.push({
              ...user,
              documentInfo: docOwner,
              statusName,
            });
          }
        })
      );

      setFilteredOwners(owners);
    }

    mergeData();
  }, [users, ownerDocs, loadingUsers, loadingDocs, JSON.stringify(allowedStatuses)]);
  console.log("owners: ", filteredOwners)
  return { owners: filteredOwners, loading: loadingUsers || loadingDocs };
}
