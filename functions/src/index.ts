import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

/**
 * Cron Job chạy mỗi 1 phút
 * - Xử lý auto lock / unlock theo collection lockAccount
 */
export const autoProcessLockAccount = onSchedule("every 1 minutes", async () => {
    const now = admin.firestore.Timestamp.now();

    // Lấy các lock chưa hoàn thành
    const lockSnap = await db.collection("lockAccount")
        .where("isCompleted", "==", false)
        .get();

    if (lockSnap.empty) return;

    const batch = db.batch();

    for (const docSnap of lockSnap.docs) {
        const lock = docSnap.data();
        const ref = docSnap.ref;

        const start = lock.start_time;
        const end = lock.end_time;
        const userRef = lock.user_id as admin.firestore.DocumentReference;

        if (!start || !end || !userRef) continue;

        const nowMs = now.toMillis();
        const startMs = start.toMillis();
        const endMs = end.toMillis();

        // --- 1. Chưa tới thời gian khóa ---
        if (nowMs < startMs) {
            continue;
        }

        // --- 2. Trong khoảng thời gian khóa ---
        if (nowMs >= startMs && nowMs < endMs) {
            // Đảm bảo user đang ở trạng thái khóa "status/8"
            batch.update(userRef, {
                status_id: db.doc("status/8"),
                updatedAt: now
            });
            continue;
        }

        // --- 3. Hết thời gian khóa → mở khóa ---
        if (nowMs >= endMs) {
            batch.update(userRef, {
                status_id: db.doc("status/5"),
                updatedAt: now
            });

            // Đánh dấu lockAccount đã xử lý xong
            batch.update(ref, {
                isCompleted: true,
                updatedAt: now
            });
        }
    }

    await batch.commit();
});
