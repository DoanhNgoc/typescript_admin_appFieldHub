interface values {
    timestamp: any
}

export default function TimeHour({ timestamp }: values) {
    if (!timestamp?.seconds) return null;

    const d = new Date(timestamp.seconds * 1000);

    // Hiển thị giờ theo định dạng 24h (HH:mm:ss)
    return d.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // đảm bảo 24h format
    });
}