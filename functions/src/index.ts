import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const autoLockAccount = onSchedule("every 1 minutes", async () => {
    const now = new Date();

    // 1️⃣ Lấy doc cần bắt đầu khóa
    const startSnap = await db.collection("lockAccount")
        .where("start_time", "<=", now)
        .where("end_time", ">", now)
        .where("isCompletedStart", "==", false)
        .get();

    for (const doc of startSnap.docs) {
        const data = doc.data();
        const userRef = data.user_id;

        // Lấy owner_documents tương ứng user
        const ownerSnap = await db.collection("owner_documents")
            .where("user_id", "==", userRef)
            .get();

        if (!ownerSnap.empty) {
            const ownerRef = ownerSnap.docs[0].ref;
            await ownerRef.update({
                status_id: db.doc("status/8")
            });
        }

        // Đánh dấu đã chạy
        await doc.ref.update({ isCompletedStart: true });
    }

    // 2️⃣ Lấy doc cần kết thúc khóa
    const endSnap = await db.collection("lockAccount")
        .where("end_time", "<=", now)
        .where("isCompleted", "==", false)
        .get();

    for (const doc of endSnap.docs) {
        const data = doc.data();
        const userRef = data.user_id;

        const ownerSnap = await db.collection("owner_documents")
            .where("user_id", "==", userRef)
            .get();

        if (!ownerSnap.empty) {
            const ownerRef = ownerSnap.docs[0].ref;
            await ownerRef.update({
                status_id: db.doc("status/5")
            });
        }

        await doc.ref.update({ isCompleted: true });
    }
});
