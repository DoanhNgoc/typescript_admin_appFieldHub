import { setGlobalOptions } from "firebase-functions/v2";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions";
import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/v2/scheduler";

admin.initializeApp();
const db = admin.firestore();

// Giảm chi phí
setGlobalOptions({ maxInstances: 10 });

/** 
 * Khi ghi lịch khóa → tạo 2 cron task: 1 để LOCK, 1 để UNLOCK 
 */
export const onLockAccountCreated = onDocumentCreated("lockAccount/{lockId}", async (event) => {
    const data = event.data?.data();

    if (!data) return;

    const userRef = data.user_id; // DocumentReference
    const start = data.start_time.toDate();
    const end = data.end_time.toDate();
    const lockId = event.params.lockId;

    logger.info("📌 New Lock Event:", { user: userRef.path, start, end });

    // Tạo cron name unique
    const lockCron = `lockUser_${lockId}`;
    const unlockCron = `unlockUser_${lockId}`;

    // convert date → cron format: "min hour day month *"
    const toCron = (d: Date) =>
        `${d.getMinutes()} ${d.getHours()} ${d.getDate()} ${d.getMonth() + 1} *`;

    // Tạo schedule LOCK
    await db.collection("_cron").doc(lockCron).set({
        schedule: toCron(start),
        timezone: "Asia/Ho_Chi_Minh",
        action: "lock",
        userRefPath: userRef.path,
    });

    // Tạo schedule UNLOCK
    await db.collection("_cron").doc(unlockCron).set({
        schedule: toCron(end),
        timezone: "Asia/Ho_Chi_Minh",
        action: "unlock",
        userRefPath: userRef.path,
    });

    logger.info("⏳ Schedules created:", { lockCron, unlockCron });
});

/**
 * Scheduler thực thi nhiệm vụ được lưu trong collection _cron
 */
export const runScheduledTasks = onSchedule("every 1 minutes", async (event) => {
    const now = new Date();
    const minute = now.getMinutes();
    const hour = now.getHours();
    const day = now.getDate();
    const month = now.getMonth() + 1;

    const cronFormat = `${minute} ${hour} ${day} ${month} *`;

    const jobsSnap = await db
        .collection("_cron")
        .where("schedule", "==", cronFormat)
        .get();

    for (const docSnap of jobsSnap.docs) {
        const job = docSnap.data();

        const userRef = db.doc(job.userRefPath);

        if (job.action === "lock") {
            await userRef.update({
                status_id: db.doc("status/8"),
            });
            logger.info("🔒 User locked:", job.userRefPath);
        }

        if (job.action === "unlock") {
            await userRef.update({
                status_id: db.doc("status/5"),
            });
            logger.info("✅ User unlocked:", job.userRefPath);
        }

        // xóa job chạy rồi
        await docSnap.ref.delete();
    }
});
