import { useEffect, useState } from "react";
import { getDoc } from "firebase/firestore";
import { useCollectionData } from "./useCollectionData";

/**
 * Hook lấy danh sách owner có status nằm trong danh sách allowedStatuses
 * @param allowedStatuses - mảng tên trạng thái cần lọc, ví dụ ["approved", "canceled"]
 */
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
      const owners: any[] = [];

      await Promise.all(
        users.map(async (user: any) => {
          // ✅ check cả "user_id" và "user_id/"
          const docOwner = ownerDocs.find((doc: any) => {
            const ref = doc.user_id || doc["user_id/"];
            return ref?.id === user.id;
          });
          if (!docOwner?.status_id) return;

          const statusSnap = await getDoc(docOwner.status_id);
          if (!statusSnap.exists()) return;

          const statusData = statusSnap.data() as { name?: string };
          if (!statusData?.name) return;

          if (allowedStatuses.includes(statusData.name)) {
            owners.push({
              ...user,
              documentInfo: docOwner,
              statusName: statusData.name,
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
