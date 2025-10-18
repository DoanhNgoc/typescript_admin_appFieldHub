// hooks/useManagedAreas.ts
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";

type AnyObject = Record<string, any>;

export type SportBucket = {
  sportId: string;
  sportDoc?: AnyObject | null;
  fields: AnyObject[];
  count: number;
};

export function useManagedAreas(userId: string | null) {
  const [user, setUser] = useState<AnyObject | null>(null);
  const [areas, setAreas] = useState<AnyObject[]>([]);
  const [fields, setFields] = useState<AnyObject[]>([]);
  const [sportsMap, setSportsMap] = useState<Record<string, SportBucket>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      setAreas([]);
      setFields([]);
      setSportsMap({});
      setUser(null);

      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        // 0️⃣ lấy user doc (nếu cần hiển thị thông tin user)
        try {
          const userRef = doc(db, "users", userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) setUser({ id: userSnap.id, ...userSnap.data() });
        } catch (e) {
          // không fatal nếu không có
          console.warn("Không lấy được user doc:", e);
        }

        // Helper để normalize owner id check: Firestore có thể lưu owner_id là string path hoặc DocumentReference
        const ownerPath = `/users/${userId}`;
        const ownerRef = doc(db, "users", userId);

        // 1️⃣ Lấy các areas mà user quản lý.
        // Thử cả 2 query: owner_id == string path, owner_id == DocumentReference
        const areasRef = collection(db, "areas");

        const q1 = query(areasRef, where("owner_id", "==", ownerPath));
        const q2 = query(areasRef, where("owner_id", "==", ownerRef));

        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
        const areaDocs: QueryDocumentSnapshot[] = [
          ...snap1.docs,
          ...snap2.docs.filter((d) => !snap1.docs.some((s) => s.id === d.id)), // tránh duplicate
        ];

        const areaData = areaDocs.map((d) => ({ id: d.id, ...d.data() }));
        if (!mounted) return;
        setAreas(areaData);

        if (areaData.length === 0) {
          setFields([]);
          setSportsMap({});
          setLoading(false);
          return;
        }

        // 2️⃣ Lấy tất cả fields thuộc những area này
        // fields.area_id có thể lưu là string "/areas/{id}" hoặc DocumentReference, do đó
        // ta tạo array path strings và array docRefs để query.
        const areaPaths = areaData.map((a) => `/areas/${a.id}`);
        const areaRefs = areaData.map((a) => doc(db, "areas", a.id));

        // Firestore `in` supports up to 10 values; nếu >10 thì chia chunk
        const chunkArray = <T,>(arr: T[], size = 10) => {
          const chunks: T[][] = [];
          for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
          return chunks;
        };

        const fieldsRef = collection(db, "fields");
        const fieldsResults: AnyObject[] = [];

        // Query by string path chunks
        const pathChunks = chunkArray(areaPaths, 10);
        for (const chunk of pathChunks) {
          const q = query(fieldsRef, where("area_id", "in", chunk));
          const snap = await getDocs(q);
          snap.docs.forEach((d) => fieldsResults.push({ id: d.id, ...d.data() }));
        }

        // Query by docRef chunks (in case area_id stored as reference)
        const refChunks = chunkArray(areaRefs, 10);
        for (const chunk of refChunks) {
          const q = query(fieldsRef, where("area_id", "in", chunk as unknown as any)); // TS: firestore accepts DocumentReference
          const snap = await getDocs(q);
          snap.docs.forEach((d) => {
            // avoid duplicates (same doc returned from previous path query)
            if (!fieldsResults.some((f) => f.id === d.id)) fieldsResults.push({ id: d.id, ...d.data() });
          });
        }

        if (!mounted) return;
        setFields(fieldsResults);

        // 3️⃣ Gom nhóm theo sport (fields có trường `sport` lưu id string như "BongChuyen")
        const sportIdsSet = new Set<string>();
        fieldsResults.forEach((f) => {
          const s = f.sport;
          if (s) sportIdsSet.add(String(s));
        });
        const sportIds = Array.from(sportIdsSet);

        // 4️⃣ Lấy thông tin sports docs (nếu muốn tên hiển thị)
        const sportsMapTemp: Record<string, SportBucket> = {};
        for (const id of sportIds) {
          sportsMapTemp[id] = {
            sportId: id,
            sportDoc: null,
            fields: [],
            count: 0,
          };
        }

        // populate fields into buckets
        fieldsResults.forEach((f) => {
          const s = String(f.sport || "unknown");
          if (!sportsMapTemp[s]) {
            sportsMapTemp[s] = { sportId: s, sportDoc: null, fields: [f], count: 1 };
          } else {
            sportsMapTemp[s].fields.push(f);
            sportsMapTemp[s].count = sportsMapTemp[s].fields.length;
          }
        });

        // fetch sports docs in parallel
        await Promise.all(
          sportIds.map(async (sportId) => {
            try {
              const sportSnap = await getDoc(doc(db, "sports", sportId));
              if (sportSnap.exists()) {
                sportsMapTemp[sportId].sportDoc = { id: sportSnap.id, ...sportSnap.data() };
              } else {
                // không có doc, giữ null
                sportsMapTemp[sportId].sportDoc = null;
              }
            } catch (e) {
              console.warn("Không lấy được sports doc", sportId, e);
              sportsMapTemp[sportId].sportDoc = null;
            }
          })
        );

        if (!mounted) return;
        setSportsMap(sportsMapTemp);
      } catch (err) {
        console.error("useManagedAreas error:", err);
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();

    return () => {
      mounted = false;
    };
  }, [userId]);

  return { user, areas, fields, sportsMap, loading, error };
}
